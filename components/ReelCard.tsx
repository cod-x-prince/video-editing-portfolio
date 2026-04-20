import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Reel } from '../types';

interface ReelCardProps {
  reel: Reel;
  index: number;
}

export const ReelCard: React.FC<ReelCardProps> = ({ reel, index }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleInteraction = async () => {
    if (videoRef.current) {
      try {
        videoRef.current.muted = false; // play with sound as requested
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        // Browser prevented unmuted autoplay, fallback to muted autoplay
        console.warn("Unmuted autoplay prevented. Falling back to muted.");
        if (videoRef.current) {
          try {
            videoRef.current.muted = true;
            await videoRef.current.play();
            setIsPlaying(true);
          } catch (fallbackErr) {
            console.error("Autoplay completely prevented.");
          }
        }
      }
    }
  };

  const stopInteraction = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      videoRef.current.currentTime = 0; 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative aspect-9/16 rounded-xl overflow-hidden bg-[#e4e2dc] border border-[#e4e2dc] cursor-pointer`}
      onMouseEnter={handleInteraction}
      onMouseLeave={stopInteraction}
      onClick={handleInteraction} /* mobile support */
      data-cursor="video"
    >
      <video
        ref={videoRef}
        src={`${reel.videoUrl}#t=0.001`}
        poster={reel.posterUrl}
        preload="metadata"
        className={`w-full h-full object-cover transition-all duration-700 ease-out transform group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loop
        playsInline
        onLoadedData={() => setIsLoaded(true)}
      />

      {/* Loading pulse before video loads */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#e4e2dc] animate-pulse" />
      )}

      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/60 opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
      
      {/* Persistent Niche Badge */}
      {reel.niche && (
        <div className="absolute bottom-4 left-4 z-10">
          <span className="bg-[#d97706] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            {reel.niche}
          </span>
        </div>
      )}

      {/* [FIX #6] Description overlay on hover */}
      {reel.description && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none pb-12">
          <p className="text-white text-sm mt-1 leading-relaxed">
            {reel.description}
          </p>
        </div>
      )}

      {!isPlaying && isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5v14l11-7L8 5z"/>
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
};