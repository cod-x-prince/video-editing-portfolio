import React, { useState } from "react";
import { Menu, X } from "lucide-react";

type NavigationProps = {
  onOpenContact: () => void;
};

export const Navigation: React.FC<NavigationProps> = ({ onOpenContact }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "#reels", label: "WORK" },
    { href: "#process", label: "PROCESS" },
    { href: "#fit", label: "FIT" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#FAFAF8]/92 backdrop-blur-lg border-b border-[#e5dfd5]">
      <div className="px-6 py-3.5 flex justify-between items-center">
        {/* Logo */}
        <div className="text-[#18181b] font-syne font-bold text-lg tracking-[-0.02em]">
          Parmbeer
          <span className="text-[#c4871f] text-xl leading-none">.</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5 text-[11px] font-semibold tracking-[0.08em] text-[#71717a]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#18181b] transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onOpenContact}
            className="hover:text-[#18181b] transition-colors"
          >
            LET'S TALK
          </button>
          {/* [FIX #8] Availability Pill as link to contact */}
          <button
            type="button"
            onClick={onOpenContact}
            className="ml-3 flex items-center gap-1.5 rounded-full border border-[#e5dfd5] bg-[#f5f3ee] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#5a5650] transition-colors hover:bg-[#ebe8e0] hover:border-[#c4871f]/25"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c4871f] animate-pulse"></span>
            2 spots open this month
          </button>
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
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenContact();
            }}
            className="py-2 text-left text-sm font-medium text-[#52525b] transition-colors hover:text-[#18181b]"
          >
            LET'S TALK
          </button>
          {/* [FIX #8] Availability Pill as link */}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenContact();
            }}
            className="flex w-fit items-center gap-2 rounded-full border border-[#e4e2dc] bg-[#f1efe8] px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#444441] transition-colors hover:bg-[#e4e2dc]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c4871f] animate-pulse"></span>
            2 spots open this month
          </button>
        </div>
      )}
    </nav>
  );
};
