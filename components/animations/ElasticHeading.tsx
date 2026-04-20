import React, { ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

interface ElasticHeadingProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

export const ElasticHeading: React.FC<ElasticHeadingProps> = ({ 
  children, 
  as: Component = 'h2', 
  className = '' 
}) => {
  const shouldReduceMotion = useReducedMotion();

  const baseClasses = `relative inline-block ${className}`;
  const underlineClasses = shouldReduceMotion 
    ? 'after:absolute after:bottom-[0px] after:left-0 after:w-full after:h-[3px] after:bg-[#D97706]'
    : 'elastic-underline-hover cursor-default';

  return (
    <Component className={`${baseClasses} ${underlineClasses}`}>
      {children}
    </Component>
  );
};
