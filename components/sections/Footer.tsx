import {
  ArrowUpRight,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  Mail,
} from "lucide-react";
import { SOCIAL_LINKS } from "../../data/socials";

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-20 border-t border-[#e5dfd5] bg-transparent py-12">
      <div className="container mx-auto grid gap-8 px-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="space-y-2">
          <div className="font-brand text-xl font-bold tracking-[-0.02em] text-[#18181b]">
            Parmbeer<span className="text-[#c4871f]">.</span>
          </div>
          <p className="max-w-sm text-[0.82rem] leading-[1.65] text-[#8a8072]">
            &copy; {new Date().getFullYear()} Retention-led editing for founders
            who need response, not noise.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#52525b]">
          <a
            href="mailto:parmbeeredits@gmail.com"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e5dfd5] bg-[#f5f3ee] px-3 py-1.5 transition-colors hover:border-[#c4871f]/30 hover:text-[#18181b]"
            aria-label="Email Parmbeer"
          >
            <Mail size={13} />
            parmbeeredits@gmail.com
          </a>
          {SOCIAL_LINKS.filter((link) => link.isValid).map((link) => {
            const Icon =
              link.platform === "Instagram"
                ? Instagram
                : link.platform === "LinkedIn"
                  ? Linkedin
                  : link.platform === "YouTube"
                    ? Youtube
                    : link.platform === "Twitter"
                      ? Twitter
                      : null;

            if (!Icon) return null;

            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#e5dfd5] px-3 py-1.5 transition-colors hover:border-[#c4871f]/30 hover:text-[#18181b]"
                aria-label={`Parmbeer on ${link.platform}`}
              >
                <Icon size={13} />
                {link.platform}
              </a>
            );
          })}
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#faeeda] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7a4d0a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c4871f]" />2 spots
            open
          </span>
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#18181b] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FAFAF8] transition-all hover:bg-[#27272a] shadow-sm"
          >
            Book a call
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
};
