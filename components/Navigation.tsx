import React from 'react';

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
      <div className="text-white font-syne font-bold text-xl tracking-tighter">
        ADDICTIVE
        <span className="text-orange-500 text-2xl leading-none">.</span>
      </div>
      <div className="flex gap-8 text-sm font-medium font-inter text-neutral-300">
        <a href="#reels" className="hover:text-white transition-colors">WORK</a>
        <a href="#pricing" className="hover:text-white transition-colors">PRICING</a>
        <a href="#process" className="hover:text-white transition-colors">PROCESS</a>
        <a href="#contact" className="hover:text-white transition-colors">CONTACT</a>
      </div>
    </nav>
  );
};