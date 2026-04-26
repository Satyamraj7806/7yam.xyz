import React, { useEffect, useRef } from 'react';

const Background = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. Initialize the stars
    if (window.Starfield && containerRef.current) {
      window.Starfield.setup({ container: containerRef.current });
    }

    // 2. Scroll Listener
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = Math.min(scrollY / 500, 1); // Transition finishes after 500px of scroll
      
      if (window.Starfield.updateScroll) {
        window.Starfield.updateScroll(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="starfield-bg" style={{ 
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 
    }} />
  );
};

export default Background;