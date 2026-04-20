import { Instagram, Linkedin, Youtube, Twitter, Mail } from 'lucide-react';
import { SOCIAL_LINKS } from "../../data/socials";

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-[#FAFAF8] border-t border-[#e4e2dc]">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-[#71717a] uppercase tracking-widest">
        <p>&copy; {new Date().getFullYear()} Prince.</p>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <a
            href="mailto:parmbeeredits@gmail.com"
            className="hover:text-[#d97706] transition-colors cursor-pointer"
            aria-label="Email Prince"
          >
            <Mail size={20} strokeWidth={1.5} />
          </a>
          {SOCIAL_LINKS.filter((link) => link.isValid).map((link) => {
            const Icon = link.platform === "Instagram" ? Instagram :
                         link.platform === "LinkedIn" ? Linkedin :
                         link.platform === "YouTube" ? Youtube :
                         link.platform === "Twitter" ? Twitter : null;
            
            if (!Icon) return null;
                         
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#d97706] transition-colors cursor-pointer"
                aria-label={`Prince on ${link.platform}`}
              >
                <Icon size={20} strokeWidth={1.5} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};
