import { motion } from "framer-motion";
import { PROCESS_STEPS } from "../../constants";

import { ElasticHeading } from "../animations/ElasticHeading";

export const ProcessSection: React.FC = () => {
  return (
    <section id="process" className="py-24 bg-[#f5f3ee] border-t border-[#e4e2dc]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <ElasticHeading as="h2" className="text-4xl md:text-6xl font-syne font-bold mb-2 text-[#18181b] tracking-tighter leading-tight">
              The Process
            </ElasticHeading>
            <p className="text-sm font-medium text-[#71717a] mb-6">Delivered in 3–5 business days</p>
            <div className="w-16 h-1 bg-[#d97706] mb-8"></div>
          </div>

          <div className="lg:col-span-8 grid gap-4">
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
          </div>
        </div>
      </div>
    </section>
  );
};
