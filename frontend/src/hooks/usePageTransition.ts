/**
 * usePageTransition.ts
 *
 * Drop-in hook for triggering a cinematic sakura page transition.
 *
 * Usage example (React Router v6):
 * ──────────────────────────────────
 *   import { useNavigate } from 'react-router-dom';
 *   import { usePageTransition } from '@/hooks/usePageTransition';
 *
 *   function NavLink({ to, children }) {
 *     const rrNavigate = useNavigate();
 *     const { navigate } = usePageTransition();
 *
 *     return (
 *       <button onClick={() => navigate(to, () => rrNavigate(to))}>
 *         {children}
 *       </button>
 *     );
 *   }
 */

import { useCallback, useContext } from 'react';
import { TransitionContext } from '../context/TransitionContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UsePageTransitionReturn {
    /**
     * Trigger the full sakura transition sequence.
     *
     * @param _destination  Optional string hint (e.g. "/about") – not used
     *                      internally but useful for debugging / analytics.
     * @param navigateFn    The actual router call. Will be invoked while the
     *                      screen is fully hidden by the petal overlay.
     */
    navigate: (
        _destination: string,
        navigateFn: () => void,
    ) => void;

    /** True while covering or revealing – use to block additional interactions. */
    isTransitioning: boolean;

    // Expose context for low-level usage (e.g. notify functions)
    startTransition: (navigateFn: () => void) => void;
    notifyCovered: () => void;
    notifyRevealed: () => void;
    phase: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSakuraTransition() {
    const ctx = useContext(TransitionContext);
    if (!ctx) throw new Error('useTransition must be used inside <TransitionProvider>');
    return ctx;
}

export function usePageTransition(): UsePageTransitionReturn {
    const { startTransition, isTransitioning, notifyCovered, notifyRevealed, phase } = useSakuraTransition();

    const navigate = useCallback(
        (_destination: string, navigateFn: () => void) => {
            if (isTransitioning) return; // Prevent double-firing
            startTransition(navigateFn);
        },
        [startTransition, isTransitioning],
    );

    return { navigate, isTransitioning, startTransition, notifyCovered, notifyRevealed, phase };
}
