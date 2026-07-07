import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { FIT_MISSES, FIT_POINTS } from "../../constants";

type WhoIWorkWithSectionProps = {
  onOpenContact: () => void;
};

export const WhoIWorkWithSection: React.FC<WhoIWorkWithSectionProps> = ({
  onOpenContact,
}) => {
  return (
    <section
      id="fit"
      className="relative z-20 border-t border-[#e5dfd5] bg-transparent py-20"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display mb-3 text-[1.75rem] font-bold tracking-[-0.02em] text-[#18181b] md:text-[2.75rem]">
            Who I work with
          </h2>
          <p className="mx-auto max-w-xl text-base font-normal text-[#52525b]">
            A quiet filter for founders building something with revenue
            attached.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-[#e5dfd5] bg-[#f5f3ee] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_12px_36px_rgba(24,24,27,0.03)]"
          >
            <div className="mb-6 border-b border-[#e5dfd5] pb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#18181b]">
              We're a fit if...
            </div>
            <ul className="space-y-4">
              {FIT_POINTS.map((item) => (
                <li
                  key={item}
                  className="flex items-start text-[0.82rem] text-[#3f3f46]"
                >
                  <Check className="mt-0.5 mr-3 h-3.5 w-3.5 shrink-0 text-[#18181b]" />
                  <span className="leading-[1.6]">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-[#18181b] p-8 text-white shadow-[0_1px_3px_rgba(0,0,0,0.12),0_16px_40px_rgba(0,0,0,0.12)]"
          >
            <div className="mb-6 border-b border-white/8 pb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#FAFAF8]">
              We're not a fit if...
            </div>
            <ul className="space-y-4">
              {FIT_MISSES.map((item) => (
                <li
                  key={item}
                  className="flex items-start text-[0.82rem] text-[#a1a1aa]"
                >
                  <X className="mt-0.5 mr-3 h-3.5 w-3.5 shrink-0 text-[#FAFAF8]" />
                  <span className="leading-[1.6]">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center">
          <button
            type="button"
            onClick={onOpenContact}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#18181b] px-5 py-2.5 text-[0.82rem] font-semibold text-white transition-all hover:bg-[#27272a] shadow-sm hover:shadow-md"
          >
            I think we're a fit <ArrowRight size={14} />
          </button>
          <p className="max-w-xl text-[0.82rem] text-[#8a8072]">
            If you want to sanity-check the fit first, open the contact form and
            tell me what you're building.
          </p>
        </div>
      </div>
    </section>
  );
};
