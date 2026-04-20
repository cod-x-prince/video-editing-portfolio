import { motion } from "framer-motion";
import { ReelCard } from "../ReelCard";
import { reels } from "../../data/reels";

import { ElasticHeading } from "../animations/ElasticHeading";

export const ReelsSection: React.FC = () => {
  return (
    <section
      id="reels"
      className="py-24 bg-[#FAFAF8] relative z-20 border-t border-[#e4e2dc]"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col md:flex-row justify-between items-end border-b border-[#e4e2dc] pb-4"
        >
          <div>
            <ElasticHeading as="h2" className="text-4xl md:text-6xl font-syne font-bold text-[#18181b] mb-2 tracking-tighter">
              The Work
            </ElasticHeading>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reels.map((reel, index) => (
            <ReelCard key={reel.id} reel={reel} index={index} />
          ))}
        </div>
        <div className="mt-16 text-center">
          <a href="#contact" className="inline-flex items-center text-[#d97706] font-inter font-medium text-sm md:text-base hover:text-[#b45f06] transition-colors border-b border-transparent hover:border-[#b45f06]">
            Working on something like this? <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
