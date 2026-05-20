import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Reel } from "../types";

interface ReelCardProps {
  reel: Reel;
  index: number;
}

export const ReelCard: React.FC<ReelCardProps> = ({ reel, index }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPosterLoaded, setIsPosterLoaded] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [pendingPlay, setPendingPlay] = useState(false);
  const reelIndex = String(index + 1).padStart(2, "0");

  const playLoadedVideo = async () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    try {
      video.muted = false;
      await video.play();
      setIsPlaying(true);
    } catch (err) {
      console.warn("Unmuted autoplay prevented. Falling back to muted.");
      try {
        video.muted = true;
        await video.play();
        setIsPlaying(true);
      } catch (fallbackErr) {
        console.error("Autoplay completely prevented.");
      }
    }

    setPendingPlay(false);
  };

  const primeVideo = () => {
    setShouldLoadVideo(true);
  };

  const requestPlayback = () => {
    setShouldLoadVideo(true);

    if (isVideoReady) {
      void playLoadedVideo();
      return;
    }

    setPendingPlay(true);
  };

  const stopInteraction = () => {
    setPendingPlay(false);

    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!shouldLoadVideo || !isVideoReady || !pendingPlay) {
      return;
    }

    void playLoadedVideo();
  }, [isVideoReady, pendingPlay, shouldLoadVideo]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative aspect-9/16 rounded-xl overflow-hidden bg-[#e4e2dc] border border-[#e4e2dc] cursor-pointer`}
      onMouseEnter={requestPlayback}
      onMouseLeave={stopInteraction}
      onFocus={primeVideo}
      onClick={requestPlayback} /* mobile support */
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (isPlaying) stopInteraction();
          else requestPlayback();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Play video reel: ${reel.title}`}
      data-cursor="video"
    >
      <img
        src={reel.cloudPosterUrl}
        alt={`${reel.title} poster`}
        loading={index < 2 ? "eager" : "lazy"}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out ${
          isPosterLoaded ? "opacity-100" : "opacity-0"
        } ${!isPlaying ? "group-hover:scale-105" : ""}`}
        onLoad={() => setIsPosterLoaded(true)}
      />

      {shouldLoadVideo && (
        <video
          ref={videoRef}
          src={reel.cloudVideoUrl}
          preload="metadata"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out transform group-hover:scale-105 ${
            isVideoReady ? "opacity-100" : "opacity-0"
          }`}
          loop
          playsInline
          onLoadedData={() => setIsVideoReady(true)}
        />
      )}

      {!isPosterLoaded && (
        <div className="absolute inset-0 bg-[#e4e2dc] animate-pulse" />
      )}

      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/60 opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 text-white">
        <div className="rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] backdrop-blur-md">
          {reelIndex}
        </div>
        <div className="rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md">
          {isPlaying ? "Playing" : reel.duration}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-4 pt-20 text-white transition-opacity duration-300 group-hover:opacity-0">
        <div className="flex flex-col items-start gap-2">
          {reel.niche && (
            <span className="bg-[#d97706] text-[#18181b] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
              {reel.niche}
            </span>
          )}
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">
            {reel.client}
          </p>
          <h3 className="max-w-[92%] text-base md:text-lg font-syne font-bold tracking-tight leading-tight">
          {reel.title}
          </h3>
        </div>
      </div>

      {/* [FIX #6] Description overlay on hover */}
      {reel.description && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
          <div className="max-w-[88%] rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/65">
              {reel.client}
            </p>
            <h3 className="mt-2 text-lg font-syne font-bold tracking-tight text-white">
              {reel.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/90">
            {reel.description}
            </p>
          </div>
        </div>
      )}

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
};
