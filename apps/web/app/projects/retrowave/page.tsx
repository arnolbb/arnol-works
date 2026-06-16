"use client";
import React, { useState, useEffect } from "react";
import SpaceInvaders from "@/components/retrowave/SpaceInvaders";
import AudioPlayer from "@/components/retrowave/AudioPlayer";
import Link from "next/link";
import "./retrowave.css";

const IconRadio = () => (
  <svg className="h-5 w-5 text-neon-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
  </svg>
);
const IconTerminal = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
  </svg>
);
const IconCpu = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/>
  </svg>
);
const IconActivity = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconBack = () => (
  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
  </svg>
);

export default function RetroWavePage() {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("neon-invaders-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const [metrics, setMetrics] = useState({
    cpu: "18%", ram: "42KB", temp: "44°C", signal: "STABLE",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: `${Math.floor(12 + Math.random() * 15)}%`,
        ram: `${Math.floor(38 + Math.random() * 8)}KB`,
        temp: `${Math.floor(40 + Math.random() * 6)}°C`,
        signal: Math.random() > 0.95 ? "SIGNAL NOISE" : "STABLE",
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleScoreUpdate = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("neon-invaders-highscore", score.toString());
    }
  };

  return (
    <div className="retrowave-theme h-screen relative overflow-hidden flex flex-col">
      {/* Background layers */}
      <div className="fixed inset-0 z-0 bg-[#09030f]" />
      <div className="fixed inset-0 z-0 pointer-events-none rw-crt-vignette" />
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-[45vh] md:h-[60vh] rw-vaporwave-grid">
          <div className="h-full w-full rw-vaporwave-grid-inner" />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-20 h-20 shrink-0 flex items-center justify-between px-5 md:px-8 lg:px-12 border-b border-white/10 bg-[#0d0713]/92">
        <div className="flex items-center gap-3.5">
          <div className="relative grid h-11 w-11 place-items-center rounded-lg border border-neon-pink/60 bg-[#18091f]">
            <IconRadio />
            <span className="absolute -bottom-1 h-px w-7 bg-neon-blue/70" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold italic text-white uppercase leading-none tracking-normal">
              RETRO<span className="text-neon-pink">WAVE</span>
            </h1>
            <p className="text-[8px] md:text-[9px] uppercase tracking-[0.28em] text-white/55 font-mono mt-1">Neon Arcade Core v4.5.1</p>
          </div>
        </div>
        <Link
          href="/projects"
          className="flex items-center text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white/90 transition-colors"
        >
          <IconBack /> Kembali
        </Link>
      </header>

      {/* Main layout */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center gap-4 p-3 md:p-4 lg:flex-row lg:items-start lg:justify-center lg:px-8 xl:px-10 max-w-[1536px] mx-auto w-full overflow-y-auto">
        {/* Left: Mission log & arcade status */}
        <div className="hidden xl:flex flex-col gap-4 w-64 xl:w-72 shrink-0 rw-slide-in-left">
          <div className="rw-arcade-panel p-4">
            <div className="flex items-center gap-2 mb-2 text-neon-pink">
              <IconTerminal />
              <h4 className="text-xs uppercase tracking-[0.16em] font-bold font-mono">MISSION LOG</h4>
            </div>
            <p className="text-[11px] text-white/70 leading-relaxed font-mono">
              Incoming wave. Move with A/D or arrows, fire with Space, and clear the formation before it reaches the grid.
            </p>
          </div>
          <div className="rw-arcade-panel p-4">
            <div className="flex items-center gap-2 mb-2 text-neon-blue">
              <IconCpu />
              <h4 className="text-xs uppercase tracking-[0.16em] font-bold font-mono">ARCADE STATUS</h4>
            </div>
            <div className="text-[10px] space-y-2 font-mono text-white/55">
              <p>CPU: GENESIS-9000-X</p>
              <p>RAM: 64KB DUAL-NEON</p>
              <p>GFX: SCANLINE-EMU-RT</p>
              <p>SND: FM-SYNTH-AUDIO</p>
            </div>
          </div>
        </div>

        {/* Center: Game */}
        <div className="flex min-h-0 flex-col items-center w-full flex-1 max-w-[700px] 2xl:max-w-[760px] overflow-hidden rw-fade-in">
          <div className="relative w-full flex justify-center">
            <div className="w-full">
              <SpaceInvaders onScoreUpdate={handleScoreUpdate} highScore={highScore} />
            </div>
          </div>
        </div>

        {/* Right: Audio + cabinet status */}
        <div className="w-full lg:w-80 xl:w-[340px] shrink-0 flex min-h-0 flex-col gap-4">
          <AudioPlayer />
          <div className="rw-arcade-panel p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neon-blue">
                <IconActivity />
                <h3 className="text-xs uppercase tracking-[0.16em] font-bold font-mono">CABINET STATUS</h3>
              </div>
              <span className="text-[8px] bg-neon-blue/15 text-neon-blue px-2 py-0.5 rounded font-mono font-bold border border-neon-blue/20">LIVE</span>
            </div>
            <div className="divide-y divide-white/10 border-t border-white/10">
              {[
                { label: "CPU LOAD",    value: metrics.cpu,    color: "text-neon-pink" },
                { label: "MEMORY FREE", value: metrics.ram,    color: "text-neon-green" },
                { label: "CORE TEMP",   value: metrics.temp,   color: "text-neon-yellow" },
                { label: "GRID SIGNAL", value: metrics.signal, color: "text-neon-blue" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 py-2.5">
                  <p className="text-[9px] uppercase tracking-[0.08em] text-white/55 font-mono">{item.label}</p>
                  <p className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden mix-blend-overlay opacity-15">
        <div className="absolute inset-0 rw-scanline" />
        <div className="rw-scanline-beam" />
      </div>
    </div>
  );
}

