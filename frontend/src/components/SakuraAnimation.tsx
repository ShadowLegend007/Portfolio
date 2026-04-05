/**
 * SakuraAnimation.tsx  –  Soft, natural cherry-blossom transition
 *
 * Design goals
 * ────────────
 * • Slow, graceful petal movement — no fast flying or neon glow
 * • Natural soft-pink colour palette (like real sakura petals)
 * • Storms arrive from ONE randomly-chosen edge each transition
 * • Petals settle on screen to create coverage, then gently drift away
 *
 * Phase choreography
 * ──────────────────
 *  IDLE      – a few ambient petals drift lazily across the screen
 *  COVERING  – a wave from one random edge fills the screen; overlay fades
 *              to a soft blush; notifyCovered() fires at full coverage
 *  REVEALING – petals flow away (same or opposite direction) uncovering
 *              the new page; notifyRevealed() fires when clear
 */

import { useEffect, useRef, useCallback } from 'react';
import { useSakuraTransition } from '@/hooks/usePageTransition';
import { TransitionPhase } from '../context/TransitionContext';

// ─── Tunables ─────────────────────────────────────────────────────────────────

const COVER_PETAL_COUNT = 5000;
const REVEAL_PETAL_COUNT = 3200;

/** Total duration for the covering sweep to reach full opacity. */
const COVER_FADE_MS = 1800;
/** Total duration for the reveal sweep to clear. */
const REVEAL_FADE_MS = 2000;

/**
 * The overlay (pink background) only starts fading in after this fraction of
 * COVER_FADE_MS has elapsed.  Petals arrive first, background follows.
 */
const OVERLAY_DELAY_RATIO = 0.45;

const AMBIENT_SPAWN_MS = 200;

// ─── Soft-pink palette (no vivid / neon tones) ───────────────────────────────

const PETAL_COLORS = [
  '#f9d4df', // blush white-pink
  '#f2b8c6', // soft rose
  '#fce8ee', // almost white pink
  '#e8a0b4', // muted mauve-pink
  '#fad6e0', // pale petal
  '#f5c5d5', // warm dusty rose
  '#f8dde6', // lightest blush
  '#dda0b4', // muted deeper pink
];

// ─── Types ────────────────────────────────────────────────────────────────────

type EdgeDir = 'top' | 'right' | 'bottom' | 'left';

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Resting target for cover petals */
  tx: number;
  ty: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  maxOpacity: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmplitude: number;
  gravity: number;
  stampIndex: number;
  colorIndex: number;
  born: number;
  lifespan: number;
  isStorm: boolean;
  settled: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const randInt = (a: number, b: number) => Math.floor(rand(a, b + 1));

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function pickRandomEdge(): EdgeDir {
  const edges: EdgeDir[] = ['top', 'right', 'bottom', 'left'];
  return edges[Math.floor(Math.random() * 4)];
}

// ─── Stamp constants ──────────────────────────────────────────────────────────

const STAMP_SIZE = 72;
type Stamp = HTMLCanvasElement | OffscreenCanvas;

function makeCanvas(w: number, h: number): Stamp {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

// ─── Build petal stamps ────────────────────────────────────────────────────────

/**
 * Natural petal: soft gradient from a slightly lighter centre out to a
 * translucent edge — no white highlight, no additive glow.
 */
function buildStamps(): Stamp[][] {
  // [widthRatio, topBias] shape variants
  const variants: [number, number][] = [
    [0.52, 0.18],
    [0.68, 0.10],
    [0.42, 0.28],
    [0.58, 0.08],
  ];

  return variants.map(([wr, tb]) =>
    PETAL_COLORS.map((color) => {
      const canvas = makeCanvas(STAMP_SIZE, STAMP_SIZE);
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const cx = STAMP_SIZE / 2, cy = STAMP_SIZE / 2;
      const halfH = STAMP_SIZE * 0.40;
      const halfW = halfH * wr;

      ctx.clearRect(0, 0, STAMP_SIZE, STAMP_SIZE);

      // Draw petal outline path
      const drawPath = () => {
        ctx.beginPath();
        ctx.moveTo(cx, cy + halfH);
        ctx.bezierCurveTo(
          cx + halfW, cy + halfH * tb,
          cx + halfW, cy - halfH * (0.6 + tb),
          cx, cy - halfH,
        );
        ctx.bezierCurveTo(
          cx - halfW, cy - halfH * (0.6 + tb),
          cx - halfW, cy + halfH * tb,
          cx, cy + halfH,
        );
        ctx.closePath();
      };

      // Soft radial gradient: lighter centre, softer edge (no white)
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      // Centre colour — slightly lighter than petal body
      const lr = Math.min(255, r + 28);
      const lg = Math.min(255, g + 20);
      const lb = Math.min(255, b + 24);

      drawPath();
      const fill = ctx.createRadialGradient(
        cx, cy - halfH * 0.12, halfH * 0.05,
        cx, cy + halfH * 0.05, halfH,
      );
      fill.addColorStop(0, `rgb(${lr},${lg},${lb})`);
      fill.addColorStop(0.55, color);
      fill.addColorStop(1, `rgba(${r},${g},${b},0.30)`);
      ctx.fillStyle = fill;
      ctx.fill();

      // Very subtle inner vein line — just a thin centre stroke, no glow
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = `rgba(${lr},${lg},${lb},1)`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(cx, cy + halfH * 0.85);
      ctx.lineTo(cx, cy - halfH * 0.88);
      ctx.stroke();
      ctx.restore();

      return canvas;
    }),
  );
}

// ─── Storm petal factories ────────────────────────────────────────────────────

/**
 * Spawn all cover petals from ONE chosen edge, aiming at rest positions
 * tiled across the entire screen.
 */
function spawnCoverPetals(
  count: number,
  W: number,
  H: number,
  now: number,
  edge: EdgeDir,
): Petal[] {
  const petals: Petal[] = [];

  for (let i = 0; i < count; i++) {
    // Spawn position along the chosen edge (with margin so nothing pops in mid-screen)
    let sx: number, sy: number;
    switch (edge) {
      case 'top':
        sx = rand(-0.15 * W, W * 1.15);
        sy = rand(-H * 0.40, -H * 0.04);
        break;
      case 'right':
        sx = rand(W * 1.04, W * 1.45);
        sy = rand(-0.15 * H, H * 1.15);
        break;
      case 'bottom':
        sx = rand(-0.15 * W, W * 1.15);
        sy = rand(H * 1.04, H * 1.45);
        break;
      default: // left
        sx = rand(-W * 0.45, -W * 0.04);
        sy = rand(-0.15 * H, H * 1.15);
        break;
    }

    // Random resting position tiled across entire screen
    const tx = rand(0.02 * W, 0.98 * W);
    const ty = rand(0.02 * H, 0.98 * H);

    const dx = tx - sx;
    const dy = ty - sy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    // Storm: arrive in 0.35–0.65 s — fast, chaotic burst
    const travel = rand(0.35, 0.65);
    const spd = dist / travel;

    const size = rand(6, 22);

    petals.push({
      x: sx, y: sy,
      vx: (dx / dist) * spd,
      vy: (dy / dist) * spd,
      tx, ty,
      size,
      rotation: rand(0, Math.PI * 2),
      rotSpeed: rand(-5.5, 5.5),   // wild storm tumbling
      opacity: 0,
      maxOpacity: rand(0.72, 0.96),
      swayPhase: rand(0, Math.PI * 2),
      swaySpeed: rand(2.5, 6.0),
      swayAmplitude: rand(25, 60),   // strong sideways buffeting
      gravity: 0,
      stampIndex: randInt(0, 3),
      colorIndex: randInt(0, PETAL_COLORS.length - 1),
      // Tight 300 ms stagger — they all erupt almost together
      born: now + i * (300 / count),
      lifespan: Infinity,
      isStorm: true,
      settled: false,
    });
  }

  return petals;
}

/**
 * Reveal petals start scattered across the screen and drift away in a single
 * direction (opposite of the incoming edge, with some variance).
 */
function spawnRevealPetals(
  count: number,
  W: number,
  H: number,
  now: number,
  coverEdge: EdgeDir,
): Petal[] {
  const petals: Petal[] = [];

  // Choose exit direction — roughly opposite to how they came in
  const baseAngleMap: Record<EdgeDir, number> = {
    top: Math.PI * 0.5,      // came from top → exit downward
    right: -Math.PI,            // came from right → exit left
    bottom: -Math.PI * 0.5,     // came from bottom → exit upward
    left: 0,                  // came from left → exit right
  };
  const baseAngle = baseAngleMap[coverEdge];

  for (let i = 0; i < count; i++) {
    // Start anywhere on (or just off) screen
    const sx = rand(-0.05 * W, W * 1.05);
    const sy = rand(-0.05 * H, H * 1.05);

    // Slow exit speed
    const angle = baseAngle + rand(-0.22, 0.22);
    const spd = rand(W * 0.28, W * 0.55);

    const size = rand(8, 24);

    petals.push({
      x: sx, y: sy,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      tx: 0, ty: 0,
      size,
      rotation: rand(0, Math.PI * 2),
      rotSpeed: rand(-1.4, 1.4),
      opacity: rand(0.6, 0.95),
      maxOpacity: 1,
      swayPhase: rand(0, Math.PI * 2),
      swaySpeed: rand(0.4, 1.2),
      swayAmplitude: 18,
      gravity: 0,
      stampIndex: randInt(0, 3),
      colorIndex: randInt(0, PETAL_COLORS.length - 1),
      born: now + i * (700 / count),
      lifespan: Infinity,
      isStorm: true,
      settled: false,
    });
  }

  return petals;
}

// ─── Ambient petal factory ────────────────────────────────────────────────────

function spawnAmbientPetal(W: number, H: number, now: number): Petal {
  const size = rand(8, 20);
  const speed = rand(W * 0.025, W * 0.060);

  return {
    x: rand(-0.08 * W, -0.02 * W),
    y: rand(-0.05 * H, H * 1.0),
    vx: speed,
    vy: rand(-10, 10),
    tx: 0, ty: 0,
    size,
    rotation: rand(0, Math.PI * 2),
    rotSpeed: rand(-0.8, 0.8),
    opacity: 0,
    maxOpacity: rand(0.65, 0.90),
    swayPhase: rand(0, Math.PI * 2),
    swaySpeed: rand(0.25, 0.75),
    swayAmplitude: rand(18, 50),
    gravity: rand(2, 7),
    stampIndex: randInt(0, 3),
    colorIndex: randInt(0, PETAL_COLORS.length - 1),
    born: now,
    lifespan: rand(12000, 24000),
    isStorm: false,
    settled: false,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

const SakuraAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { phase, notifyCovered, notifyRevealed } = useSakuraTransition();

  const stateRef = useRef({
    phase: 'idle' as TransitionPhase,
    ambientPetals: [] as Petal[],
    stormPetals: [] as Petal[],
    lastAmbientSpawn: 0,
    lastFrame: 0,

    coverProgress: 0,
    coverStartTime: 0,
    revealStartTime: 0,
    coveredFired: false,
    revealedFired: false,
    stormSpawned: false,
    revealStormSpawned: false,

    /** The edge chosen for this storm cycle. */
    stormEdge: 'left' as EdgeDir,

    stamps: null as Stamp[][] | null,
    rafId: 0,
  });

  const notifyCoveredRef = useRef(notifyCovered);
  const notifyRevealedRef = useRef(notifyRevealed);
  notifyCoveredRef.current = notifyCovered;
  notifyRevealedRef.current = notifyRevealed;

  useEffect(() => {
    const s = stateRef.current;
    const prev = s.phase;
    s.phase = phase;

    if (phase === 'covering' && prev === 'idle') {
      s.stormSpawned = false;
      s.coveredFired = false;
      s.coverProgress = 0;
      s.coverStartTime = performance.now();
      s.stormEdge = pickRandomEdge();
      // Snap DOM overlay to fully opaque immediately so page never shows through
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '1';
        overlayRef.current.style.pointerEvents = 'auto';
      }
    }

    if (phase === 'revealing') {
      s.revealStormSpawned = false;
      s.revealedFired = false;
      s.revealStartTime = performance.now();
    }

    if (phase === 'idle') {
      s.stormPetals = [];
      s.coverProgress = 0;
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '0';
        overlayRef.current.style.pointerEvents = 'none';
      }
    }
  }, [phase]);

  // ── RAf loop ────────────────────────────────────────────────────────────────

  const tick = useCallback((now: number) => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !s.stamps) {
      s.rafId = requestAnimationFrame(tick);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) { s.rafId = requestAnimationFrame(tick); return; }

    const dt = Math.min((now - s.lastFrame) / 1000, 0.05);
    s.lastFrame = now;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // ── Phase logic ───────────────────────────────────────────────────────────

    if (s.phase === 'covering') {
      if (!s.stormSpawned) {
        s.stormSpawned = true;
        s.stormPetals = spawnCoverPetals(COVER_PETAL_COUNT, W, H, now, s.stormEdge);
      }

      const elapsed = now - s.coverStartTime;
      const t = Math.min(elapsed / COVER_FADE_MS, 1);
      s.coverProgress = easeInOut(t);

      // DOM overlay is already opaque — no canvas backdrop needed during cover

      if (t >= 1 && !s.coveredFired) {
        s.coveredFired = true;
        notifyCoveredRef.current();
      }
    }

    if (s.phase === 'revealing') {
      if (!s.revealStormSpawned) {
        s.revealStormSpawned = true;
        s.stormPetals = spawnRevealPetals(REVEAL_PETAL_COUNT, W, H, now, s.stormEdge);
        s.coverProgress = 1;
      }

      const elapsed = now - s.revealStartTime;
      const t = Math.min(elapsed / REVEAL_FADE_MS, 1);
      s.coverProgress = 1 - easeOut(t);

      // Fade out the opaque backdrop as petals fly away
      const bgAlpha = Math.min(s.coverProgress * 1.6, 1);
      ctx.save();
      ctx.globalAlpha = bgAlpha;
      ctx.fillStyle = '#fff8f9';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      if (t >= 1 && !s.revealedFired) {
        s.revealedFired = true;
        notifyRevealedRef.current();
      }
    }

    // ── Ambient spawning ──────────────────────────────────────────────────────

    if (s.phase === 'idle') {
      if (now - s.lastAmbientSpawn > rand(500, AMBIENT_SPAWN_MS)) {
        s.ambientPetals.push(spawnAmbientPetal(W, H, now));
        s.lastAmbientSpawn = now;
      }
    }

    // ── Update ambient ────────────────────────────────────────────────────────

    const alive: Petal[] = [];
    for (const p of s.ambientPetals) {
      if (updateAmbient(p, now, dt, W, H)) alive.push(p);
    }
    s.ambientPetals = alive;

    // ── Update storm ──────────────────────────────────────────────────────────

    if (s.phase === 'covering' || s.phase === 'revealing') {
      const aliveStorm: Petal[] = [];
      for (const p of s.stormPetals) {
        const keep = s.phase === 'covering'
          ? updateCoverPetal(p, now, dt)
          : updateRevealPetal(p, now, dt, W, H);
        if (keep) aliveStorm.push(p);
      }
      s.stormPetals = aliveStorm;
    }

    // ── Render ────────────────────────────────────────────────────────────────

    const all = [
      ...s.ambientPetals,
      ...(s.phase === 'covering' || s.phase === 'revealing' ? s.stormPetals : []),
    ];

    for (const p of all) {
      drawPetal(ctx, p, s.stamps!);
    }

    s.rafId = requestAnimationFrame(tick);
  }, []);

  // ── Mount ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    stateRef.current.stamps = buildStamps();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    stateRef.current.lastFrame = performance.now();
    stateRef.current.rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(stateRef.current.rafId);
      window.removeEventListener('resize', resize);
    };
  }, [tick]);

  return (
    <>
      {/* Thin overlay – blocks pointer events during transition */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: '#fff8f9',
          opacity: 0,
          pointerEvents: 'none',
          willChange: 'opacity',
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  );
};

// ─── Canvas overlay ───────────────────────────────────────────────────────────

/**
 * Soft blush-white overlay that grows as petals cover the screen.
 * No dark/neon tones — just a warm pale-pink washout.
 */
function drawSoftOverlay(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  progress: number,
) {
  if (progress <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = Math.min(progress, 1);

  // Warm blush white-pink base
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#fbeaee');
  bg.addColorStop(0.4, '#f9dce4');
  bg.addColorStop(0.7, '#f5d0dc');
  bg.addColorStop(1, '#f2c8d6');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.restore();
}

// ─── Petal update functions ───────────────────────────────────────────────────

function updateAmbient(p: Petal, now: number, dt: number, W: number, H: number): boolean {
  const age = now - p.born;
  const lifeRatio = age / p.lifespan;
  if (lifeRatio >= 1) return false;

  if (lifeRatio < 0.08) p.opacity = p.maxOpacity * (lifeRatio / 0.08);
  else if (lifeRatio > 0.88) p.opacity = p.maxOpacity * ((1 - lifeRatio) / 0.12);
  else p.opacity = p.maxOpacity;

  p.swayPhase += p.swaySpeed * dt;
  p.vy += p.gravity * dt + Math.sin(p.swayPhase) * p.swayAmplitude * dt;
  p.vx += rand(-3, 3) * dt;
  p.vx = Math.max(0, p.vx);
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.rotation += p.rotSpeed * dt;

  return !(p.x > W + 80 || p.y > H + 80 || p.y < -80);
}

function updateCoverPetal(p: Petal, now: number, dt: number): boolean {
  const age = now - p.born;
  if (age < 0) return true;

  const dx = p.tx - p.x;
  const dy = p.ty - p.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 6) {
    // Fully settled — completely frozen, no drift (drift causes glitter)
    p.settled = true;
    p.opacity = Math.min(p.opacity + 2.5 * dt, p.maxOpacity);
  } else {
    // Flying toward target — maintain heading
    const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    p.vx = (dx / dist) * spd;
    p.vy = (dy / dist) * spd;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rotation += p.rotSpeed * dt;

    // Fade in as it gets close
    const arrival = 1 - Math.min(dist / 250, 1);
    p.opacity = p.maxOpacity * easeOut(arrival);
  }

  return true;
}

function updateRevealPetal(
  p: Petal, now: number, dt: number, W: number, H: number,
): boolean {
  const age = now - p.born;
  if (age < 0) return true;

  p.swayPhase += p.swaySpeed * dt;
  p.x += p.vx * dt + Math.sin(p.swayPhase) * 20 * dt;
  p.y += p.vy * dt;
  p.rotation += p.rotSpeed * dt;

  // Gentle fade out as petal accelerates away
  const ageFrac = Math.min(age / 400, 1);
  p.opacity = p.maxOpacity * (1 - ageFrac * 0.25); // stays mostly opaque then fades

  // Cull when truly off screen
  const margin = 180;
  return !(
    p.x > W + margin || p.x < -margin ||
    p.y > H + margin || p.y < -margin
  );
}

// ─── Canvas drawing ───────────────────────────────────────────────────────────

function drawPetal(
  ctx: CanvasRenderingContext2D,
  p: Petal,
  stamps: Stamp[][],
): void {
  if (p.opacity <= 0.01) return;

  const stamp = stamps[p.stampIndex]?.[p.colorIndex % PETAL_COLORS.length];
  if (!stamp) return;

  const scale = (p.size * 2) / STAMP_SIZE;

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.opacity;
  ctx.drawImage(
    stamp,
    (-STAMP_SIZE / 2) * scale, (-STAMP_SIZE / 2) * scale,
    STAMP_SIZE * scale, STAMP_SIZE * scale,
  );
  ctx.restore();
}

export default SakuraAnimation;
