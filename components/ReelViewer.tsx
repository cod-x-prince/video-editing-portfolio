import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { Reel } from "../types";

type ReelViewerProps = {
  reel: Reel | null;
  onClose: () => void;
  onStartProject: () => void;
};

export const ReelViewer: React.FC<ReelViewerProps> = ({
  reel,
  onClose,
  onStartProject,
}) => {
  useEffect(() => {
    if (!reel) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    // Emit event when video modal opens (video ready to play)
    window.dispatchEvent(new CustomEvent("portfolio:video-start"));

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      // Emit event when video modal closes
      window.dispatchEvent(new CustomEvent("portfolio:video-end"));
    };
  }, [onClose, reel]);

  return (
    <AnimatePresence>
      {reel && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4 md:p-8">
          <motion.button
            type="button"
            aria-label="Close reel viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#18181b]/80 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reel-viewer-title"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid max-h-[92vh] w-full max-w-6xl grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-[#101014] shadow-2xl md:grid-cols-[minmax(18rem,0.72fr)_minmax(20rem,0.58fr)]"
          >
            <div className="relative flex min-h-[62vh] items-center justify-center bg-black md:min-h-[80vh]">
              <video
                key={reel.id}
                src={reel.cloudVideoUrl}
                poster={reel.cloudPosterUrl}
                controls
                autoPlay
                playsInline
                className="h-full max-h-[80vh] w-full object-contain"
                onPlay={() => window.dispatchEvent(new CustomEvent("portfolio:video-start"))}
                onEnded={() => window.dispatchEvent(new CustomEvent("portfolio:video-end"))}
              />
            </div>

            <aside className="flex flex-col justify-between gap-8 bg-[#FAFAF8] p-6 text-[#18181b] md:p-8">
              <div>
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#d97706]">
                      {reel.niche || "Selected edit"}
                    </p>
                    <h2
                      id="reel-viewer-title"
                      className="mt-2 font-syne text-3xl font-bold leading-tight tracking-tight md:text-5xl"
                    >
                      {reel.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close reel viewer"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#e4e2dc] text-[#52525b] transition-colors hover:bg-[#f5f3ee] hover:text-[#18181b]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#71717a]">
                  {reel.client} / {reel.duration}
                </p>
                {reel.description && (
                  <p className="mt-5 text-base leading-relaxed text-[#52525b]">
                    {reel.description}
                  </p>
                )}

                <div className="mt-8 grid grid-cols-3 gap-2 border-y border-[#e4e2dc] py-5 text-center">
                  <div>
                    <strong className="block font-syne text-xl">Hook</strong>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#71717a]">first</span>
                  </div>
                  <div>
                    <strong className="block font-syne text-xl">Pace</strong>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#71717a]">tight</span>
                  </div>
                  <div>
                    <strong className="block font-syne text-xl">Sell</strong>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#71717a]">soft</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e4e2dc] bg-[#f5f3ee] p-5">
                <p className="text-sm leading-relaxed text-[#52525b]">
                  If you want this kind of pacing for your own brand, send the raw idea and the audience you want to move.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartProject();
                  }}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#18181b] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3f3f46]"
                >
                  Start a Project <ArrowRight size={15} />
                </button>
              </div>
            </aside>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
