import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { PROCESS_STEPS } from "../../constants";

import { ElasticHeading } from "../animations/ElasticHeading";

export const ProcessSection: React.FC = () => {
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
    useTransform(scrollYProgress, [0, 1], [prefersReducedMotion ? 0 : 10, prefersReducedMotion ? 0 : -12]),
    parallaxSpring
  );
  const cardsY = useSpring(
    useTransform(scrollYProgress, [0, 1], [prefersReducedMotion ? 0 : 20, prefersReducedMotion ? 0 : -8]),
    parallaxSpring
  );

  return (
    <section ref={sectionRef} id="process" className="py-24 bg-[#f5f3ee] border-t border-[#e4e2dc] relative overflow-hidden">
      <motion.div
        aria-hidden="true"
        style={{ y: titleY, willChange: "transform" }}
        className="pointer-events-none absolute left-[5%] top-16 hidden h-28 w-28 rounded-full bg-[radial-gradient(circle,_rgba(24,24,27,0.08)_0%,_transparent_72%)] blur-3xl md:block"
      />
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <motion.div style={{ y: titleY, willChange: "transform" }} className="lg:col-span-4">
            <ElasticHeading as="h2" className="text-4xl md:text-6xl font-syne font-bold mb-2 text-[#18181b] tracking-tighter leading-tight">
              The Process
            </ElasticHeading>
            <p className="text-sm font-medium text-[#71717a] mb-6">Delivered in 3–5 business days</p>
            <div className="w-16 h-1 bg-[#d97706] mb-8"></div>
          </motion.div>

          <motion.div style={{ y: cardsY, willChange: "transform" }} className="lg:col-span-8 grid gap-4">
            {PROCESS_STEPS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 bg-[#FAFAF8] border border-[#e4e2dc] rounded-xl flex flex-col sm:flex-row items-start gap-6 hover:shadow-md transition-shadow duration-300"
              >
                <span className="text-sm font-syne font-bold text-[#a1a1aa] shrink-0 mt-1">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#18181b] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#52525b] text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
