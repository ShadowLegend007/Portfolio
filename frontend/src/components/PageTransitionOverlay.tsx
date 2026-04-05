import { useEffect, useState } from 'react';
import { usePageTransition } from '../hooks/usePageTransition';

const PageTransitionOverlay = () => {
    const { phase, notifyCovered, notifyRevealed } = usePageTransition();
    const [animationStyle, setAnimationStyle] = useState({});

    useEffect(() => {
        if (phase === 'covering') {
            setAnimationStyle({
                transform: 'translateY(0)',
                transition: 'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)'
            });
            const t = setTimeout(() => notifyCovered(), 500);
            return () => clearTimeout(t);
        } else if (phase === 'revealing') {
            setAnimationStyle({
                transform: 'translateY(-100%)',
                transition: 'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)'
            });
            const t = setTimeout(() => notifyRevealed(), 500);
            return () => clearTimeout(t);
        } else if (phase === 'idle') {
            // Jump to the bottom instantly so it's ready for the next cover
            setAnimationStyle({
                transform: 'translateY(100%)',
                transition: 'none'
            });
        }
    }, [phase, notifyCovered, notifyRevealed]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#ffffff',
            zIndex: 9998,
            pointerEvents: phase === 'idle' ? 'none' : 'auto',
            ...animationStyle
        }} />
    );
};

export default PageTransitionOverlay;
