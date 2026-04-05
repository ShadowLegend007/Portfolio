import { useEffect, useRef, useCallback } from 'react';

// ─── Tunables ─────────────────────────────────────────────────────────────────

const AMBIENT_SPAWN_MS = 60;

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

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
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
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const randInt = (a: number, b: number) => Math.floor(rand(a, b + 1));

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

function buildStamps(): Stamp[][] {
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

      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

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

// ─── Ambient petal factory ────────────────────────────────────────────────────

function spawnAmbientPetal(W: number, H: number, now: number): Petal {
  const size = rand(8, 20);
  const speed = rand(W * 0.01, W * 0.03);

  const isTop = Math.random() < 0.8;
  const x = isTop ? rand(-0.1 * W, W * 1.1) : rand(-0.1 * W, -0.02 * W);
  const y = isTop ? rand(-0.1 * H, -0.02 * H) : rand(-0.1 * H, H * 0.8);

  return {
    x,
    y,
    vx: speed,
    vy: rand(H * 0.005, H * 0.015),
    size,
    rotation: rand(0, Math.PI * 2),
    rotSpeed: rand(-0.6, 0.6),
    opacity: 0,
    maxOpacity: rand(0.65, 0.90),
    swayPhase: rand(0, Math.PI * 2),
    swaySpeed: rand(0.2, 0.5),
    swayAmplitude: rand(18, 50),
    gravity: rand(0.2, 1.0),
    stampIndex: randInt(0, 3),
    colorIndex: randInt(0, PETAL_COLORS.length - 1),
    born: now,
    lifespan: rand(18000, 36000),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

const SakuraAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stateRef = useRef({
    ambientPetals: [] as Petal[],
    lastAmbientSpawn: 0,
    lastFrame: 0,
    stamps: null as Stamp[][] | null,
    rafId: 0,
  });

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

    // ── Ambient spawning ──────────────────────────────────────────────────────

    const spawnInterval = rand(AMBIENT_SPAWN_MS * 0.5, AMBIENT_SPAWN_MS * 1.5);
    if (now - s.lastAmbientSpawn > spawnInterval) {
      s.ambientPetals.push(spawnAmbientPetal(W, H, now));
      s.lastAmbientSpawn = now;
    }

    // ── Update ambient ────────────────────────────────────────────────────────

    const alive: Petal[] = [];
    for (const p of s.ambientPetals) {
      if (updateAmbient(p, now, dt, W, H)) alive.push(p);
    }
    s.ambientPetals = alive;

    // ── Render ────────────────────────────────────────────────────────────────

    for (const p of s.ambientPetals) {
      drawPetal(ctx, p, s.stamps!);
    }

    s.rafId = requestAnimationFrame(tick);
  }, []);

  // ── Mount ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    stateRef.current.stamps = buildStamps();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const now = performance.now();

    // Pre-populate so it's flowing immediately
    for(let i=0; i < 70; i++) {
        const p = spawnAmbientPetal(W, H, now);
        p.x = rand(-0.1 * W, W * 1.1);
        p.y = rand(-0.1 * H, H * 1.1);
        // Randomize born time so they don't fade out all at once
        p.born = now - rand(0, p.lifespan * 0.8);
        stateRef.current.ambientPetals.push(p);
    }

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
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 9997, // Lower than PageTransitionOverlay (9998) but on top of page content
      }}
    />
  );
};

// ─── Petal update function ───────────────────────────────────────────────────

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
