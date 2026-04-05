/**
 * TransitionContext.tsx
 *
 * Manages the cinematic page-transition state machine.
 *
 * Phase flow:
 *   idle ──► covering ──► revealing ──► idle
 *                 │
 *                 └── (navigation fires here, hidden behind the overlay)
 *
 * External callers:
 *   - `startTransition(navigateFn)` kicks off the full sequence.
 *   - The SakuraCanvas component calls `notifyCovered()` when the overlay
 *     is fully opaque (safe to swap pages) and `notifyRevealed()` when
 *     it has completely cleared.
 */

import {
    createContext,
    useState,
    useRef,
    useCallback,
    ReactNode,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TransitionPhase = 'idle' | 'covering' | 'revealing';

interface TransitionContextValue {
    /** Current animation phase. */
    phase: TransitionPhase;

    /**
     * Trigger the full cover → navigate → reveal sequence.
     * `navigateFn` is the router call (e.g. `() => router.push('/next')`).
     * It will be invoked while the screen is fully hidden.
     */
    startTransition: (navigateFn: () => void) => void;

    /**
     * Called by SakuraCanvas when the overlay has reached 100 % opacity.
     * This fires the stored navigateFn and advances to the revealing phase.
     */
    notifyCovered: () => void;

    /**
     * Called by SakuraCanvas when the overlay has fully cleared.
     * Resets state to idle so the next transition can be triggered.
     */
    notifyRevealed: () => void;

    // Legacy boolean kept for backward compatibility with any
    // existing consumers that used `isTransitioning`.
    isTransitioning: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const TransitionContext = createContext<TransitionContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function TransitionProvider({ children }: { children: ReactNode }) {
    const [phase, setPhase] = useState<TransitionPhase>('idle');
    const navigateRef = useRef<(() => void) | null>(null);

    // Guard against double-firing
    const coveredCalledRef = useRef(false);
    const revealedCalledRef = useRef(false);

    const startTransition = useCallback(
        (navigateFn: () => void) => {
            setPhase(prev => {
                if (prev !== 'idle') return prev;
                coveredCalledRef.current = false;
                revealedCalledRef.current = false;
                navigateRef.current = navigateFn;
                return 'covering';
            });
        },
        [],
    );

    const notifyCovered = useCallback(() => {
        if (coveredCalledRef.current) return;
        coveredCalledRef.current = true;

        // Execute the route change while fully hidden
        navigateRef.current?.();
        navigateRef.current = null;

        // Give the framework one frame to commit the new page before revealing
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setPhase('revealing');
            });
        });
    }, []);

    const notifyRevealed = useCallback(() => {
        if (revealedCalledRef.current) return;
        revealedCalledRef.current = true;
        setPhase('idle');
    }, []);

    return (
        <TransitionContext.Provider
            value={{
                phase,
                startTransition,
                notifyCovered,
                notifyRevealed,
                isTransitioning: phase !== 'idle',
            }}
        >
            {children}
        </TransitionContext.Provider>
    );
}
