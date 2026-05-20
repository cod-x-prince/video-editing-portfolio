import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Clock3, Eye, Play, UserRound } from "lucide-react";
import { reels } from "../../data/reels";

const SCROLL_PER_REEL = 300;

function formatMetric(index: number) {
  const metrics = ["Retention", "Replay", "Hook", "Pacing", "Scroll-stop", "Rhythm", "Intent"];
  return metrics[index % metrics.length];
}

export const ExperimentalReelCarouselSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const visibleReels = useMemo(() => reels.slice(0, 7), []);
  const currentReel = visibleReels[currentIndex];
  const nextReel = visibleReels[(currentIndex + 1) % visibleReels.length];

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const offsetTop = window.scrollY + rect.top;
      const distance = Math.max(0, window.scrollY - offsetTop);
      const nextIndex = Math.min(
        Math.floor(distance / SCROLL_PER_REEL),
        visibleReels.length - 1,
      );

      setCurrentIndex((previous) => {
        if (nextIndex !== previous) {
          setDirection(nextIndex > previous ? 1 : -1);
        }
        return nextIndex;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [visibleReels.length]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[270vh] bg-[#FAFAF8] border-t border-[#e4e2dc]"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <svg
          className="pointer-events-none absolute bottom-0 left-0 h-full w-full"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            d="M -200 900 Q 800 300, 1800 900"
            stroke="#d97706"
            strokeWidth="2.5"
            strokeOpacity="0.85"
            fill="none"
          />
        </svg>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(217,119,6,0.08),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(24,24,27,0.05),_transparent_28%)]" />

        <div className="absolute left-6 top-6 rounded-full border border-[#d97706]/20 bg-[#faeeda] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#9a5808] md:left-12 md:top-10">
          Experimental Feature
        </div>

        <div className="absolute top-8 left-1/2 hidden -translate-x-1/2 rounded-full border border-[#d97706]/30 bg-white px-6 py-3 shadow-sm md:block">
          <span className="text-sm font-semibold tracking-wide text-[#d97706]">
            {String(currentIndex + 1).padStart(2, "0")} / {visibleReels.length}
          </span>
        </div>

        <div className="absolute left-6 top-24 right-6 flex flex-col items-center text-center md:hidden">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#9a5808]">
            The Work
          </span>
          <h2 className="mt-3 text-3xl font-syne font-bold tracking-tight text-[#18181b]">
            Circular Reel Study
          </h2>
        </div>

        <div className="absolute left-8 top-1/2 hidden max-w-[24rem] -translate-y-1/2 space-y-5 xl:block">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${currentReel.id}-title`}
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
              className="inline-flex rounded-full bg-[#e7e4df] px-7 py-4 shadow-sm"
            >
              <h2 className="text-2xl font-bold tracking-tight text-[#18181b]">
                {currentReel.title}
              </h2>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${currentReel.id}-client`}
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35, delay: 0.05 }}
              className="inline-flex items-center gap-3 rounded-full bg-[#efede8] px-7 py-3.5 shadow-sm"
            >
              <UserRound className="h-5 w-5 text-[#d97706]" />
              <span className="text-base text-[#3f3f46]">{currentReel.client}</span>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${currentReel.id}-stats`}
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35, delay: 0.1 }}
              className="inline-flex items-center gap-6 rounded-full bg-[#efede8] px-7 py-3.5 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-[#d97706]" />
                <span className="text-[#3f3f46]">{currentReel.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-[#d97706]" />
                <span className="text-[#3f3f46]">{formatMetric(currentIndex)}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 flex items-center justify-center px-6 md:px-12">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentReel.id}
              custom={direction}
              initial={{
                x: prefersReducedMotion ? 0 : direction > 0 ? 260 : -260,
                opacity: 0,
                scale: 0.86,
                rotate: prefersReducedMotion ? 0 : direction > 0 ? 4 : -4,
              }}
              animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
              exit={{
                x: prefersReducedMotion ? 0 : direction > 0 ? -260 : 260,
                opacity: 0,
                scale: 0.86,
                rotate: prefersReducedMotion ? 0 : direction > 0 ? -4 : 4,
              }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 20,
                mass: 0.75,
              }}
              className="relative overflow-hidden rounded-[2rem] bg-[#d7d5d1] shadow-[0_28px_90px_rgba(24,24,27,0.18)]"
              style={{ width: 380, height: 560, maxWidth: "92vw" }}
            >
              {currentReel.cloudPosterUrl ? (
                <img
                  src={currentReel.cloudPosterUrl}
                  alt={currentReel.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[linear-gradient(135deg,#d6d3d1,#bcb8b4)]" />
              )}

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,24,27,0.04),rgba(24,24,27,0.15)_55%,rgba(24,24,27,0.88)_100%)]" />

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.18, type: "spring", stiffness: 160 }}
                className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#d97706] shadow-[0_10px_30px_rgba(217,119,6,0.28)]"
              >
                <Play className="ml-1 h-10 w-10 fill-white text-white" />
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.2, type: "spring" }}
                className="absolute left-5 top-5 rounded-full bg-[#d97706] px-4 py-2"
              >
                <span className="text-sm font-bold text-white">{currentReel.niche}</span>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.25, type: "spring" }}
                className="absolute bottom-5 right-5 rounded-full bg-white px-5 py-3 shadow-lg"
              >
                <span className="text-sm font-bold text-[#18181b]">{currentReel.duration}</span>
              </motion.div>

              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">
                  {currentReel.client}
                </p>
                <h3 className="mt-3 text-3xl font-syne font-bold leading-none tracking-tight">
                  {currentReel.title}
                </h3>
                <p className="mt-3 max-w-[92%] text-sm leading-relaxed text-white/75">
                  {currentReel.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 xl:block">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${currentReel.id}-next`}
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
              className="rounded-[1.75rem] bg-[#e7e4df] px-12 py-8 shadow-sm"
            >
              <p className="text-sm text-[#71717a]">Next Up</p>
              <h3 className="mt-2 text-xl font-bold text-[#18181b]">
                {nextReel.title}
              </h3>
              <p className="mt-2 text-sm text-[#52525b]">{nextReel.client}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.6 }}
        >
          <p className="text-sm font-semibold text-[#d97706]">Scroll to explore</p>
          <motion.div
            className="mt-2 text-2xl text-[#71717a]"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
