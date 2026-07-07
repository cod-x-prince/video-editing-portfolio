import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

const BAR_COUNT = 32;

type MusicStateEvent = CustomEvent<{
  playing: boolean;
  level: number;
}>;

export const MusicWaveBackground: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(0);

  const bars = useMemo(
    () => Array.from({ length: BAR_COUNT }, (_, index) => index),
    [],
  );

  useEffect(() => {
    const handleState = (event: Event) => {
      const customEvent = event as MusicStateEvent;
      setIsPlaying(customEvent.detail.playing);
      setLevel(customEvent.detail.level);
    };

    window.addEventListener("music:state", handleState);
    return () => window.removeEventListener("music:state", handleState);
  }, []);

  if (prefersReducedMotion) {
    return (
      <div
        className="sound-wave-bg sound-wave-bg--reduced"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`sound-wave-bg ${isPlaying ? "is-active" : "sound-wave-bg--idle"}`}
    >
      <div className="sound-wave-bg__mist" />
      <div className="sound-wave-bg__grid">
        {bars.map((bar) => {
          const wave = Math.max(
            0.12,
            Math.min(1, (0.24 + level * 0.95) * (0.55 + (bar % 7) * 0.06)),
          );
          const offset = bar % 2 === 0 ? 0.45 : 0.36;

          return (
            <span
              key={bar}
              className="sound-wave-bg__bar"
              style={{
                height: `${18 + (bar % 5) * 7}vh`,
                opacity: isPlaying ? 1 : 0,
                transform: `scaleY(${isPlaying ? wave : offset})`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
