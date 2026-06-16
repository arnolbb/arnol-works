"use client";
import React, { useState, useRef, useEffect } from "react";

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

const DUMMY_TRACKS: Track[] = [
  { id: 1, title: "Midnight City Dreams", artist: "VaporPulse", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Cyberpunk Horizon", artist: "RetroFuture", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "Neon Nights", artist: "SynthWaveX", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

const EQUALIZER_BARS = [0.55, 0.8, 0.45, 0.95, 0.62, 0.75, 0.5, 0.88];

const IconPlay = () => (
  <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
);
const IconPause = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
);
const IconSkipBack = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
);
const IconSkipForward = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8zm7.5-6v12h2V6z"/></svg>
);
const IconVolume = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
);

export default function AudioPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().then(() => setAudioError(false)).catch(() => {
          setIsPlaying(false);
          setAudioError(true);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setAudioError(false);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setAudioError(false);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="rw-arcade-panel p-4 w-full relative overflow-hidden rw-fade-in">
      <div className="flex flex-col gap-4 relative z-10">
        {/* Cassette */}
        <div className="relative w-full h-20 bg-[#040306] border border-white/10 rounded-lg overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90 pointer-events-none" />
          <div className="absolute left-10 w-10 h-10 border-4 border-zinc-700/60 rounded-full flex items-center justify-center bg-zinc-900">
            <div
              className="w-6 h-6 border-2 border-neon-pink/40 border-dashed rounded-full"
              style={{ animation: isPlaying ? "rw-spin 4s linear infinite" : "none" }}
            />
          </div>
          <div className="w-2/5 h-14 bg-[#111827] border border-white/10 rounded flex flex-col items-center justify-center p-2 z-10">
            <span className="text-[9px] font-mono uppercase tracking-widest text-neon-blue rw-neon-text-blue font-bold">TYPE II</span>
            <div className="w-full h-1 bg-neon-blue mt-2 rounded" />
            <span className="text-[7px] font-mono text-white/50 mt-1 uppercase">Dolby B-C NR</span>
          </div>
          <div className="absolute right-10 w-10 h-10 border-4 border-zinc-700/60 rounded-full flex items-center justify-center bg-zinc-900">
            <div
              className="w-6 h-6 border-2 border-neon-pink/40 border-dashed rounded-full"
              style={{ animation: isPlaying ? "rw-spin 4s linear infinite" : "none" }}
            />
          </div>
        </div>

        {/* Track info + equalizer */}
        <div className="flex justify-between items-center gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-neon-blue rw-neon-text-blue truncate">{currentTrack.title}</h3>
            <p className="text-xs text-neon-purple opacity-90 uppercase tracking-widest font-mono font-semibold">{currentTrack.artist}</p>
          </div>
          <div className="flex items-end gap-0.5 h-7 w-14 bg-black/45 p-1 px-1.5 rounded-md border border-white/10">
            {EQUALIZER_BARS.map((height, i) => (
              <div
                key={i}
                className="w-1 bg-neon-pink rounded-t"
                style={{
                  height: isPlaying ? `${height * 100}%` : "15%",
                  animation: isPlaying ? `rw-equalizer ${0.42 + i * 0.045}s ease-out infinite alternate` : "none",
                  animationDelay: `${i * 0.08}s`,
                  boxShadow: isPlaying ? "0 0 4px var(--rw-neon-pink)" : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5">
          <button onClick={handlePrev} className="rw-interactive-icon text-neon-purple hover:text-neon-pink" aria-label="Previous track">
            <IconSkipBack />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-neon-pink hover:bg-[#ff8ed8] rounded-full flex items-center justify-center active:scale-95 transition-transform border border-white/20"
            aria-label={isPlaying ? "Pause track" : "Play track"}
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>
          <button onClick={handleNext} className="rw-interactive-icon text-neon-purple hover:text-neon-pink" aria-label="Next track">
            <IconSkipForward />
          </button>
        </div>

        {audioError && (
          <p className="text-[10px] font-mono text-neon-yellow/85 text-center">
            Track stream unavailable. Try the next channel.
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-4 flex flex-col gap-1.5">
        <div className="h-1 bg-white/10 rounded-full w-full overflow-hidden">
          <div className="h-full bg-neon-pink transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[9px] font-mono text-neon-blue/50">
          <span>0:00</span>
          <span>SYNTH CHANNEL</span>
        </div>
      </div>

      {/* Volume */}
      <div className="mt-3 flex items-center gap-3 text-neon-blue bg-black/20 p-2 px-3 rounded-lg border border-white/10">
        <IconVolume />
        <input
          type="range" min="0" max="1" step="0.01" value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-neon-pink"
          aria-label="Music volume"
        />
        <span className="text-xs font-mono w-10 text-right text-neon-blue font-bold">{Math.round(volume * 100)}%</span>
      </div>

      <audio ref={audioRef} src={currentTrack.url} onTimeUpdate={handleTimeUpdate} onEnded={handleNext} />
    </div>
  );
}
