import React from 'react';
import { useReducedMotion } from 'framer-motion';

interface SplitWordProps {
  word: string;
  className?: string;
}

export const SplitWord: React.FC<SplitWordProps> = ({ word, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={className}>{word}</span>;
  }

  return (
    <span className={`relative overflow-hidden inline-block group cursor-default align-bottom ${className}`}>
      <span 
        className="block transition-transform duration-400 group-hover:-translate-y-full"
        style={{ transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }}
      >
        {word}
      </span>
      <span 
        className="absolute top-0 left-0 block text-[#d97706] transition-transform duration-400 translate-y-full group-hover:translate-y-0"
        style={{ transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }}
      >
        {word}
      </span>
    </span>
  );
};
