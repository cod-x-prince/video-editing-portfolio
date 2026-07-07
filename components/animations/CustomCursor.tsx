import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useReducedMotion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Optimized spring parameters for snappy, zero-lag cursor response
  const springX = useSpring(mouseX, { stiffness: 280, damping: 24, mass: 0.08 });
  const springY = useSpring(mouseY, { stiffness: 280, damping: 24, mass: 0.08 });

  const [cursorState, setCursorState] = useState<'default' | 'hover_link' | 'hover_video'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    if (prefersReducedMotion || isTouch) return;

    document.body.classList.add('hide-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      // Offset by half size (24px) to center the 48px cursor
      mouseX.set(e.clientX - 24);
      mouseY.set(e.clientY - 24);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      let newState: 'default' | 'hover_link' | 'hover_video' = 'default';
      
      if (target.closest('a') || target.closest('button')) {
        newState = 'hover_link';
      } else if (target.closest('[data-cursor="video"]')) {
        newState = 'hover_video';
      }
      
      setCursorState((prev) => (prev !== newState ? newState : prev));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    // Initial check for visibility on load
    setIsVisible(true);

    return () => {
      document.body.classList.remove('hide-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [prefersReducedMotion, mouseX, mouseY]);

  if (prefersReducedMotion || isTouchDevice) return null;

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        width: 48,
        height: 48,
        zIndex: 100000, // Explicitly float on the absolute top of everything
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden"
      }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: cursorState === 'hover_link' ? 1.8 : cursorState === 'hover_video' ? 2.2 : 1,
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 24, mass: 0.08 }}
      className="custom-cursor pointer-events-none fixed top-0 left-0 flex items-center justify-center rounded-full bg-[#c4871f] mix-blend-multiply transform-gpu will-change-transform"
    >
      {cursorState === 'hover_video' && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-[8px] font-bold tracking-widest pointer-events-none"
        >
          PLAY
        </motion.span>
      )}
    </motion.div>
  );
};
