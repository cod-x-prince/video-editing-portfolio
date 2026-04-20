import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Navigation: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '#reels', label: 'WORK' },
    { href: '#process', label: 'PROCESS' },
    { href: '#fit', label: 'FIT' },
    { href: '#contact', label: "LET'S TALK" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#e4e2dc]">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-[#18181b] font-syne font-bold text-xl tracking-tighter">
          Prince
          <span className="text-[#d97706] text-2xl leading-none">.</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-[12px] font-medium font-inter text-[#52525b]">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-[#18181b] transition-colors">
              {link.label}
            </a>
          ))}
          {/* [FIX #8] Availability Pill as link to contact */}
          <a href="#contact" className="flex items-center gap-2 ml-4 px-3 py-1.5 rounded-full bg-[#f1efe8] border border-[#e4e2dc] text-[10px] uppercase tracking-wider text-[#444441] hover:bg-[#e4e2dc] transition-colors cursor-pointer">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            2 spots open this month
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[#18181b] p-1"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 pt-2 bg-[#FAFAF8]/95 backdrop-blur-md border-t border-[#e4e2dc] flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-[#52525b] hover:text-[#18181b] transition-colors py-2"
            >
              {link.label}
            </a>
          ))}
          {/* [FIX #8] Availability Pill as link */}
          <a href="#contact" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f1efe8] border border-[#e4e2dc] text-[10px] uppercase tracking-wider text-[#444441] w-fit hover:bg-[#e4e2dc] transition-colors cursor-pointer">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            2 spots open this month
          </a>
        </div>
      )}
    </nav>
  );
};
