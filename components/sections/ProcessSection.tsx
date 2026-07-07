import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { PROCESS_STEPS } from "../../constants";

import { ElasticHeading } from "../animations/ElasticHeading";

type ProcessSectionProps = {
  onOpenContact: () => void;
};

export const ProcessSection: React.FC<ProcessSectionProps> = ({
  onOpenContact,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const parallaxSpring = {
    stiffness: 68,
    damping: 26,
    mass: 1.05,
    restDelta: 0.001,
    restSpeed: 0.001,
  };
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const titleY = useSpring(
    useTransform(
      scrollYProgress,
      [0, 1],
      [prefersReducedMotion ? 0 : 10, prefersReducedMotion ? 0 : -12],
    ),
    parallaxSpring,
  );
  const cardsY = useSpring(
    useTransform(
      scrollYProgress,
      [0, 1],
      [prefersReducedMotion ? 0 : 20, prefersReducedMotion ? 0 : -8],
    ),
    parallaxSpring,
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      className="py-20 bg-[#f5f3ee]/50 backdrop-blur-xs border-t border-[#e5dfd5] relative overflow-hidden"
    >
      <motion.div
        aria-hidden="true"
        style={{ y: titleY, willChange: "transform" }}
        className="pointer-events-none absolute left-[5%] top-16 hidden h-28 w-28 rounded-full bg-[radial-gradient(circle,_rgba(24,24,27,0.08)_0%,_transparent_72%)] blur-3xl md:block"
      />
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <motion.div
            style={{ y: titleY, willChange: "transform" }}
            className="lg:col-span-4"
          >
            <ElasticHeading
              as="h2"
              className="font-display text-3xl md:text-5xl font-bold mb-2 text-[#18181b] tracking-[-0.03em] leading-tight"
            >
              The Process
            </ElasticHeading>
            <p className="text-[0.82rem] font-medium text-[#8a8072] mb-5">
              Delivered in 3–5 business days
            </p>
            <div className="w-12 h-[3px] bg-[#c4871f] mb-7 rounded-full"></div>
            <button
              type="button"
              onClick={onOpenContact}
              className="hidden rounded-lg bg-[#18181b] px-4.5 py-2.5 text-[0.8rem] font-semibold text-white transition-all hover:bg-[#27272a] shadow-sm hover:shadow-md lg:inline-flex"
            >
              Start with your raw idea
            </button>
          </motion.div>

          <motion.div
            style={{ y: cardsY, willChange: "transform" }}
            className="lg:col-span-8 grid gap-4 relative"
          >
            <motion.div
              aria-hidden="true"
              style={{ scaleX: scrollYProgress, willChange: "transform" }}
              className="absolute left-0 right-0 top-2 h-px origin-left bg-[#c4871f]/60"
            />
            {PROCESS_STEPS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: i * 0.15,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative overflow-hidden p-6 bg-[#FAFAF8] border border-[#e5dfd5] rounded-lg flex flex-col sm:flex-row items-start gap-5 hover:shadow-sm transition-shadow duration-300"
              >
                <span className="pointer-events-none absolute right-3 top-0 text-[4rem] font-display font-light leading-none text-[#c4871f]/8 select-none">
                  {item.step}
                </span>
                <span className="relative z-10 text-[0.82rem] font-syne font-semibold text-[#a1a1aa] shrink-0 mt-0.5">
                  {item.step}
                </span>
                <div className="relative z-10">
                  <h3 className="text-[1.05rem] font-bold text-[#18181b] mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-[#52525b] text-[0.82rem] leading-[1.65]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="mt-12 flex justify-center lg:hidden">
          <button
            type="button"
            onClick={onOpenContact}
            className="rounded-lg bg-[#18181b] px-4.5 py-2.5 text-[0.8rem] font-semibold text-white transition-all hover:bg-[#27272a] shadow-sm"
          >
            Start with your raw idea
          </button>
        </div>
      </div>
    </section>
  );
};
