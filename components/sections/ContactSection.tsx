import { ArrowRight, Mail } from "lucide-react";

type ContactSectionProps = {
  onOpenContact: () => void;
};

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenContact,
}) => {
  return (
    <section
      id="contact"
      className="relative z-20 overflow-hidden border-t border-[#e5dfd5] bg-[#18181b] py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(196,135,31,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(250,250,248,0.08),transparent_28%)] opacity-80" />
      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl leading-tight tracking-[-0.02em] text-[#FAFAF8] md:text-6xl">
              Ready to work together?
            </h2>
            <p className="mt-4 max-w-xl text-base text-[#d4d4d8] md:text-lg">
              Tell me what you're building - I'll tell you if I'm the right fit.
            </p>
            <p className="mt-3 max-w-xl text-[0.82rem] leading-[1.65] text-[#a1a1aa]">
              Open the contact form for a quick fit check, a project estimate,
              or a direct handoff to the booking flow.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FAFAF8] px-5 py-3 text-[0.82rem] font-semibold text-[#18181b] transition-all hover:scale-[1.01] active:scale-[0.98] shadow-sm"
              >
                Start the conversation <ArrowRight size={14} />
              </button>
              <a
                href="mailto:parmbeeredits@gmail.com?subject=Project%20Inquiry%20-%20Parmbeer%20Portfolio"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/8 px-5 py-3 text-[0.82rem] font-semibold text-[#FAFAF8] transition-colors hover:border-[#c4871f]/40 hover:text-[#FAFAF8]"
              >
                <Mail size={14} />
                Email directly
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-white/8 bg-white/4 p-5 text-[#FAFAF8] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_12px_32px_rgba(0,0,0,0.2)] backdrop-blur-md md:p-7">
            <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#a1a1aa]">
              What to send
            </div>
            <div className="mt-4 space-y-3 text-[0.82rem] text-[#d4d4d8]">
              <div className="rounded-lg border border-white/8 bg-black/16 p-3.5">
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#c4871f] font-semibold">
                  1. Name
                </div>
                <p className="mt-1.5 text-[#FAFAF8]">Who I should reply to.</p>
              </div>
              <div className="rounded-lg border border-white/8 bg-black/16 p-3.5">
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#c4871f] font-semibold">
                  2. What you do
                </div>
                <p className="mt-1.5 text-[#FAFAF8]">
                  Course, coaching, consulting, SaaS, property, or something
                  else.
                </p>
              </div>
              <div className="rounded-lg border border-white/8 bg-black/16 p-3.5">
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#c4871f] font-semibold">
                  3. A link
                </div>
                <p className="mt-1.5 text-[#FAFAF8]">
                  Send a reel, channel, site, or anything that shows the current
                  content style.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-lg border border-white/8 bg-[#c4871f]/8 px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#faeeda]">
              <span>2 spots open</span>
              <span>Response within 24h</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
