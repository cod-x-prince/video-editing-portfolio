import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useReducedMotion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth the mouse values with lower stiffness and slightly higher damping to eliminate jitter
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.1 });

  const [cursorState, setCursorState] = useState<'default' | 'hover_link' | 'hover_video'>('default');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    document.body.classList.add('hide-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      // Offset by half size (24px) to center the 48px cursor
      mouseX.set(e.clientX - 24);
      mouseY.set(e.clientY - 24);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) {
        setCursorState('hover_link');
      } else if (target.closest('[data-cursor="video"]')) {
        setCursorState('hover_video');
      } else {
        setCursorState('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.classList.remove('hide-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [prefersReducedMotion, mouseX, mouseY, isVisible]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        width: 48,
        height: 48,
      }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: cursorState === 'hover_link' ? 1.8 : cursorState === 'hover_video' ? 2.2 : 1,
      }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className="pointer-events-none fixed top-0 left-0 z-9999 flex items-center justify-center rounded-full bg-[#d97706] mix-blend-multiply will-change-transform"
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
