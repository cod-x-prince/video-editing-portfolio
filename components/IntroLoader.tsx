import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type IntroLoaderProps = {
  phase: "hello" | "player";
  onSkip: () => void;
};

const FPS = 24;
const TICK_COUNT = 48;
const TOTAL_FRAMES = FPS * 12 * 60 + FPS * 34;

const formatTimecode = (totalFrames: number) => {
  const frame = Math.floor(totalFrames % FPS);
  const seconds = Math.floor(totalFrames / FPS) % 60;
  const minutes = Math.floor(totalFrames / (FPS * 60)) % 60;
  const hours = Math.floor(totalFrames / (FPS * 3600));
  const pad = (value: number) => String(value).padStart(2, "0");

  return {
    main: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    frames: pad(frame),
  };
};

export const IntroLoader: React.FC<IntroLoaderProps> = ({ phase, onSkip }) => {
  const [progress, setProgress] = useState(0);
  const isLeaving = phase === "player";
  const tickIndexes = useMemo(
    () => Array.from({ length: TICK_COUNT }, (_, index) => index),
    [],
  );
  const litTicks = Math.floor((progress / 100) * TICK_COUNT);
  const timecode = formatTimecode((progress / 100) * TOTAL_FRAMES);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced || isLeaving) {
      setProgress(100);
      return;
    }

    let frameId = 0;
    const duration = 2350; // Increased from 850ms by 1.5 seconds
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress =
        rawProgress < 1 ? 1 - Math.pow(1 - rawProgress, 2) : 1;
      setProgress(Math.floor(easedProgress * 100));

      if (rawProgress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [isLeaving]);

  return (
    <motion.div
      className="intro-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.34, ease: "easeInOut" } }}
    >
      <div className="intro-loader__texture" aria-hidden="true" />
      <button type="button" className="intro-loader__skip" onClick={onSkip}>
        Skip
      </button>
      <div className="intro-loader__brandmark">PARMBEER.</div>

      <motion.div
        className="intro-loader__stage"
        animate={isLeaving ? { y: -18, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="intro-loader__context">
          <span>Loading</span>
        </div>

        <div
          className="intro-loader__timecode"
          aria-label={`${timecode.main}:${timecode.frames}`}
        >
          {timecode.main}
          <span>:{timecode.frames}</span>
        </div>

        <div className="intro-loader__status">
          <span>Cutting attention</span>
          <strong>{progress}%</strong>
        </div>

        <div className="intro-loader__timeline" aria-hidden="true">
          <div className="intro-loader__timeline-track" />
          <div className="intro-loader__ticks">
            {tickIndexes.map((index) => (
              <span key={index} className={index < litTicks ? "is-lit" : ""} />
            ))}
          </div>
          <div
            className="intro-loader__playhead"
            style={{ left: `${progress}%` }}
          />
        </div>


      </motion.div>
    </motion.div>
  );
};
