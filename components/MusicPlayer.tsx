import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Music2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { musicTracks } from "../data/tracks";

type MusicPlayerProps = {
  visible: boolean;
  docked: boolean;
  dockTargetRef: React.RefObject<HTMLElement>;
};

const SPOTIFY_ICON_PATH = "/brand/Spotify_icon.svg";

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  visible,
  docked,
  dockTargetRef,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<number>();
  const meterFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const waveBufferRef = useRef<Uint8Array | null>(null);
  const wasPlayingRef = useRef(false);
  const [activeTrack, setActiveTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [status, setStatus] = useState("Radio ready");
  const [progress, setProgress] = useState(0);
  const [spotifyIconMissing, setSpotifyIconMissing] = useState(false);

  const track = musicTracks[activeTrack];

  const emitMusicState = useCallback((playing: boolean, level = 0, frequencies?: Uint8Array) => {
    window.dispatchEvent(
      new CustomEvent("music:state", {
        detail: { playing, level, frequencies },
      }),
    );
  }, []);

  const stopWaveMeter = useCallback(() => {
    if (meterFrameRef.current) {
      window.cancelAnimationFrame(meterFrameRef.current);
      meterFrameRef.current = undefined;
    }

    emitMusicState(false, 0);
  }, [emitMusicState]);

  const ensureWaveMeter = useCallback((audio: HTMLAudioElement) => {
    const AudioContextCtor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextCtor) return null;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextCtor();
    }

    if (!sourceRef.current) {
      sourceRef.current =
        audioContextRef.current.createMediaElementSource(audio);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      waveBufferRef.current = new Uint8Array(
        analyserRef.current.frequencyBinCount,
      );
    }

    return analyserRef.current;
  }, []);

  const startWaveMeter = useCallback(
    (audio: HTMLAudioElement) => {
      const analyser = ensureWaveMeter(audio);

      if (!analyser || !waveBufferRef.current) {
        emitMusicState(true, 0.42);
        return;
      }

      const tick = () => {
        const buffer = waveBufferRef.current;
        const currentAnalyser = analyserRef.current;
        if (!buffer || !currentAnalyser) return;

        currentAnalyser.getByteFrequencyData(buffer);
        const energy =
          buffer.reduce((sum, value) => sum + value, 0) / (buffer.length * 255);
        emitMusicState(
          true,
          Math.max(0.14, Math.min(1, energy * 1.9)),
          new Uint8Array(buffer)
        );
        meterFrameRef.current = window.requestAnimationFrame(tick);
      };

      emitMusicState(true, 0.35);
      meterFrameRef.current = window.requestAnimationFrame(tick);
    },
    [emitMusicState, ensureWaveMeter],
  );

  const updateDockPosition = useCallback(() => {
    const target = dockTargetRef.current;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const playerWidth = Math.min(388, window.innerWidth - 24);
    const left = isMobile
      ? window.innerWidth / 2
      : Math.min(
          window.innerWidth - playerWidth - 24,
          Math.max(24, rect.left + 26),
        );
    const dockTop = rect.top - 34;
    const compact = docked && dockTop < 96;
    const top = Math.max(82, dockTop);

    document.documentElement.style.setProperty(
      "--music-player-left",
      `${left}px`,
    );
    document.documentElement.style.setProperty(
      "--music-player-top",
      `${top}px`,
    );
    setIsCompact(compact);
  }, [dockTargetRef, docked]);

  const fadeAudio = useCallback((targetVolume = 0.42, duration = 2600) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeRef.current) {
      window.cancelAnimationFrame(fadeRef.current);
    }

    const start = performance.now();
    const startVolume = audio.volume || 0;

    const tick = (now: number) => {
      const progressAmount = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progressAmount, 3);
      audio.volume = startVolume + (targetVolume - startVolume) * eased;

      if (progressAmount < 1) {
        fadeRef.current = window.requestAnimationFrame(tick);
      }
    };

    fadeRef.current = window.requestAnimationFrame(tick);
  }, []);

  const playTrack = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (
        audioContextRef.current &&
        audioContextRef.current.state === "suspended"
      ) {
        await audioContextRef.current.resume();
      }

      audio.volume = 0;
      await audio.play();
      setIsPlaying(true);
      setStatus("Now playing");
      fadeAudio();
      startWaveMeter(audio);
    } catch {
      setIsPlaying(false);
      setStatus("Tap to play");
      stopWaveMeter();
    }
  }, [fadeAudio, startWaveMeter, stopWaveMeter]);

  const pauseTrack = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
    setStatus("Paused");
    stopWaveMeter();
  };

  const changeTrack = (direction: number) => {
    setActiveTrack(
      (index) => (index + direction + musicTracks.length) % musicTracks.length,
    );
  };

  // Video/Music Sync Logic
  useEffect(() => {
    const handleVideoStart = () => {
      const audio = audioRef.current;
      if (!audio) return;

      // Save the current playing state
      if (audio.paused === false) {
        wasPlayingRef.current = true;
        pauseTrack();
      }

      // Dispatch event to notify about video playing
      window.dispatchEvent(new CustomEvent("portfolio:video-playing"));
    };

    const handleVideoStop = () => {
      const audio = audioRef.current;
      if (!audio) return;

      // Resume music if it was playing before video
      if (wasPlayingRef.current && audio.paused) {
        void playTrack();
      }
      wasPlayingRef.current = false;

      // Dispatch event to notify about video stopped
      window.dispatchEvent(new CustomEvent("portfolio:video-stopped"));
    };

    window.addEventListener("portfolio:video-start", handleVideoStart);
    window.addEventListener("portfolio:video-end", handleVideoStop);

    return () => {
      window.removeEventListener("portfolio:video-start", handleVideoStart);
      window.removeEventListener("portfolio:video-end", handleVideoStop);
    };
  }, [playTrack]);

  useEffect(() => {
    updateDockPosition();

    if (!docked) return;

    window.addEventListener("resize", updateDockPosition);
    window.addEventListener("scroll", updateDockPosition, { passive: true });

    return () => {
      window.removeEventListener("resize", updateDockPosition);
      window.removeEventListener("scroll", updateDockPosition);
    };
  }, [docked, updateDockPosition]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = track.src;
    audio.load();
    setProgress(0);
    setStatus(isPlaying ? "Now playing" : track.artist);

    if (isPlaying) {
      void playTrack();
    } else {
      stopWaveMeter();
    }
  }, [
    activeTrack,
    isPlaying,
    playTrack,
    stopWaveMeter,
    track.artist,
    track.src,
  ]);

  useEffect(() => {
    return () => {
      if (fadeRef.current) window.cancelAnimationFrame(fadeRef.current);
      if (meterFrameRef.current)
        window.cancelAnimationFrame(meterFrameRef.current);
      void audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const handlePauseRequest = () => pauseTrack();
    const handlePlayRequest = () => void playTrack();

    window.addEventListener("portfolio:pause-music", handlePauseRequest);
    window.addEventListener("portfolio:start-music", handlePlayRequest);
    return () => {
      window.removeEventListener("portfolio:pause-music", handlePauseRequest);
      window.removeEventListener("portfolio:start-music", handlePlayRequest);
    };
  }, [playTrack]);

  const playerClassName = [
    "music-player",
    visible ? "music-player--visible" : "",
    docked ? "music-player--docked" : "music-player--intro",
    isCompact ? "music-player--compact" : "",
    isPlaying ? "is-playing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={playerClassName} aria-label="Parmbeer Radio music player">
      <div className="music-player__brandmark" aria-hidden="true">
        {!spotifyIconMissing && (
          <img
            src={SPOTIFY_ICON_PATH}
            alt=""
            onError={() => setSpotifyIconMissing(true)}
          />
        )}
        {spotifyIconMissing && <Music2 size={16} strokeWidth={2.4} />}
      </div>

      <div className="music-player__cover" aria-hidden="true">
        <span className="music-player__cover-glow" />
        <span className="music-player__cover-dot" />
      </div>

      <div className="music-player__meta">
        <span>{status}</span>
        <strong>{track.title}</strong>
        <small>{track.mood}</small>
        <div className="music-player__progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="music-player__controls">
        <button
          type="button"
          onClick={() => changeTrack(-1)}
          aria-label="Previous track"
        >
          <SkipBack size={14} />
        </button>
        <button
          type="button"
          className="music-player__play"
          onClick={isPlaying ? pauseTrack : playTrack}
          aria-label={
            isPlaying ? "Pause Parmbeer Radio" : "Play Parmbeer Radio"
          }
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
        </button>
        <button
          type="button"
          onClick={() => changeTrack(1)}
          aria-label="Next track"
        >
          <SkipForward size={14} />
        </button>
      </div>

      <button
        type="button"
        className="music-player__mute"
        onClick={() => {
          const audio = audioRef.current;
          if (!audio) return;
          audio.muted = !audio.muted;
          setIsMuted(audio.muted);
        }}
        aria-label={isMuted ? "Unmute Parmbeer Radio" : "Mute Parmbeer Radio"}
      >
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>

      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => changeTrack(1)}
        onError={() => {
          setStatus("Add track file");
          stopWaveMeter();
        }}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
          setProgress((audio.currentTime / audio.duration) * 100);
        }}
        onLoadedMetadata={(event) => {
          const audio = event.currentTarget;
          if (audio.duration > 0) setProgress(0);
        }}
      />
    </aside>
  );
};
