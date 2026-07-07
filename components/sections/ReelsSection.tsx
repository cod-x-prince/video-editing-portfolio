import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ReelCard } from "../ReelCard";
import { reels } from "../../data/reels";
import { Reel } from "../../types";
import { ReelViewer } from "../ReelViewer";

import { ElasticHeading } from "../animations/ElasticHeading";

type ReelsSectionProps = {
  onOpenContact: () => void;
};

export const ReelsSection: React.FC<ReelsSectionProps> = ({
  onOpenContact,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeReel, setActiveReel] = useState<Reel | null>(null);
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
  const headerY = useSpring(
    useTransform(
      scrollYProgress,
      [0, 1],
      [prefersReducedMotion ? 0 : 14, prefersReducedMotion ? 0 : -14],
    ),
    parallaxSpring,
  );
  const gridY = useSpring(
    useTransform(
      scrollYProgress,
      [0, 1],
      [prefersReducedMotion ? 0 : 24, prefersReducedMotion ? 0 : -8],
    ),
    parallaxSpring,
  );

  const openReel = (reel: Reel) => {
    setActiveReel(reel);
  };
  const glowY = useSpring(
    useTransform(
      scrollYProgress,
      [0, 1],
      [prefersReducedMotion ? 0 : 20, prefersReducedMotion ? 0 : -20],
    ),
    parallaxSpring,
  );

  return (
    <section
      ref={sectionRef}
      id="reels"
      className="py-24 bg-transparent relative z-20 border-t border-[#e4e2dc]"
    >
      <motion.div
        aria-hidden="true"
        style={{ y: glowY, willChange: "transform" }}
        className="pointer-events-none absolute right-[6%] top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(217,119,6,0.12)_0%,_transparent_72%)] blur-3xl"
      />
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ y: headerY, willChange: "transform" }}
          className="mb-12 flex flex-col md:flex-row justify-between items-end border-b border-[#e4e2dc] pb-4"
        >
          <div>
            <ElasticHeading
              as="h2"
              className="font-display text-4xl md:text-6xl font-bold text-[#18181b] mb-2 tracking-tighter"
            >
              The Work
            </ElasticHeading>
            <p className="text-sm uppercase tracking-[0.2em] text-[#71717a]">
              {reels.length} selected cuts across niches, offers, and pacing
              styles
            </p>
          </div>
        </motion.div>

        <motion.div
          style={{ y: gridY, willChange: "transform" }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {reels.map((reel, index) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              index={index}
              onOpen={openReel}
            />
          ))}
        </motion.div>
        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={onOpenContact}
            className="inline-flex items-center border-b border-transparent text-sm font-medium text-[#c4871f] transition-colors hover:border-[#9a5808] hover:text-[#9a5808] md:text-base"
          >
            Working on something like this? <span className="ml-2">→</span>
          </button>
        </div>
      </div>
      <ReelViewer
        reel={activeReel}
        onClose={() => setActiveReel(null)}
        onStartProject={onOpenContact}
      />
    </section>
  );
};
