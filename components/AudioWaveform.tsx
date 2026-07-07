import React, { useEffect, useRef, useState, useMemo } from "react";
import { useReducedMotion } from "framer-motion";

const WAVEFORM_BARS = 64;

type AudioWaveformState = {
  isPlaying: boolean;
  frequencies: Uint8Array | null;
};

export const AudioWaveform: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [state, setState] = useState<AudioWaveformState>({
    isPlaying: false,
    frequencies: null,
  });
  const animationFrameRef = useRef<number>();
  const phaseRef = useRef<number>(0);
  const playFactorRef = useRef<number>(0);

  const bars = useMemo(
    () => Array.from({ length: WAVEFORM_BARS }, (_, i) => i),
    []
  );

  useEffect(() => {
    const handleState = (event: Event) => {
      const customEvent = event as CustomEvent<{
        playing: boolean;
        level: number;
        frequencies?: Uint8Array;
      }>;
      setState({
        isPlaying: customEvent.detail.playing,
        frequencies: customEvent.detail.frequencies || null,
      });
    };

    window.addEventListener("music:state", handleState);
    return () => window.removeEventListener("music:state", handleState);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const centerY = canvas.height / 2;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth transition of play factor (decay when stopped)
      const targetFactor = state.isPlaying ? 1.0 : 0.0;
      playFactorRef.current += (targetFactor - playFactorRef.current) * 0.08;

      if (playFactorRef.current > 0.005) {
        phaseRef.current += 0.035; // speed of the wave movement

        const wavesCount = 3;
        const amplitudes = [0.38, 0.24, 0.16];
        const opacities = [0.55, 0.32, 0.18];
        const frequenciesMultipliers = [1, 1.6, 2.2];
        const phaseOffsets = [0, Math.PI / 3, (2 * Math.PI) / 3];

        for (let w = 0; w < wavesCount; w++) {
          ctx.beginPath();
          // Fade opacity based on visual decay factor
          ctx.strokeStyle = `rgba(196, 135, 31, ${opacities[w] * playFactorRef.current})`;
          ctx.lineWidth = w === 0 ? 3.5 : 1.8; // thicker main line
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          const currentPhase = phaseRef.current * 0.8 + phaseOffsets[w];

          // Draw the continuous smooth line across the screen
          for (let i = 0; i <= WAVEFORM_BARS; i++) {
            const x = (i / WAVEFORM_BARS) * canvas.width;

            // Fetch real music frequency data if available
            let freqValue = 0;
            if (state.isPlaying && state.frequencies && state.frequencies.length > 0) {
              const freqIndex = Math.min(
                Math.floor((i / WAVEFORM_BARS) * state.frequencies.length),
                state.frequencies.length - 1
              );
              freqValue = state.frequencies[freqIndex];
              freqValue = freqValue * 0.95 + (Math.random() * 8);
            } else {
              // Fallback/settling frequency
              freqValue = 60 + Math.sin(i * 0.15) * 20;
            }

            // Bell curve envelope so the wave tapers to 0 at screen boundaries
            const envelope = Math.sin((i / WAVEFORM_BARS) * Math.PI);

            // Calculate current wave oscillation height
            const waveOsc = Math.sin(currentPhase + i * 0.22 * frequenciesMultipliers[w]);
            const maxAmp = canvas.height * amplitudes[w];
            // Decay amplitude smoothly when stopping
            const currentAmp = (freqValue / 255) * maxAmp * playFactorRef.current;
            
            // Draw only the lower half (centerY + positive amplitude)
            const y = centerY + Math.abs(waveOsc) * currentAmp * envelope;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              // Draw bezier curve to the next point for maximum smoothness
              const prevX = ((i - 1) / WAVEFORM_BARS) * canvas.width;
              ctx.quadraticCurveTo((prevX + x) / 2, y, x, y);
            }
          }
          ctx.stroke();
        }
      }

      // Continue animating until completely settled/flat
      if (state.isPlaying || playFactorRef.current > 0.005) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (state.isPlaying || playFactorRef.current > 0.005) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animate();
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isPlaying, bars]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`audio-waveform ${state.isPlaying ? "is-active" : ""}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="audio-waveform__canvas"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};
