import { useState, useEffect } from 'react';

export function useIsMobile(maxWidth = 649) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set initial value inside useEffect to avoid SSR hydration mismatch if applicable,
    // though here it's SPA, it's safer.
    setIsMobile(window.innerWidth <= maxWidth);
    
    const handleResize = () => setIsMobile(window.innerWidth <= maxWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [maxWidth]);

  return isMobile;
}
