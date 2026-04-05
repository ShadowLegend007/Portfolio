import { useEffect, useState } from 'react';
import { logoWhite as logoW } from '../assets/assets';

const SiteLoader = () => {
    const [loading, setLoading] = useState(true);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFading(true);
            setTimeout(() => setLoading(false), 800); // Wait for fadeout animation
        }, 1500); // Minimum 1.5 seconds loading view

        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.8s ease-in-out',
            pointerEvents: fading ? 'none' : 'auto'
        }}>
            <div className="loader-icon-container">
                <img src={logoW} alt="Loading..." style={{ height: '64px', width: 'auto' }} />
            </div>
            <style>{`
                .loader-icon-container {
                    animation: pulse-grow 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                @keyframes pulse-grow {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.8;
                    }
                    50% {
                        transform: scale(1.15);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default SiteLoader;
