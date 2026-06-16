"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/keystrike/Logo";
import { HighScoreCard } from "@/components/keystrike/HighScoreCard";
import { loadHighScore, type HighScore } from "@/lib/keystrike/highscore";
import "./keystrike.css";

const ZapIcon = () => (
  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const TargetIcon = () => (
  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const FlameIcon = () => (
  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CpuIcon = () => (
  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BackIcon = () => (
  <svg className="size-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default function KeyStrikeIndex() {
  const [hs, setHs] = useState<HighScore | null>(null);
  
  useEffect(() => {
    setHs(loadHighScore());
  }, []);

  return (
    <div className="keystrike-theme flex min-h-dvh flex-col items-center justify-center px-4 py-10 pt-24 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-6 md:py-12 relative overflow-hidden">
      {/* Absolute Positioned Back Button */}
      <Link
        href="/projects"
        className="absolute left-4 top-[max(1rem,env(safe-area-inset-top))] md:left-8 md:top-8 flex min-h-11 items-center rounded-md pr-2 text-muted-foreground hover:text-foreground cursor-pointer transition text-xs sm:text-sm font-display tracking-[0.12em] sm:tracking-[0.15em] bg-transparent border-0 uppercase z-20"
      >
        <BackIcon /> Kembali ke Proyek
      </Link>

      <div className="w-full max-w-3xl flex flex-col items-center text-center gap-5 sm:gap-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/60 backdrop-blur text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-[color:var(--neon-green)] animate-pulse" />
          Cyber Arena Online
        </div>

        <Logo className="text-4xl sm:text-6xl md:text-8xl" />

        <p className="font-display text-sm md:text-lg tracking-[0.18em] sm:tracking-[0.3em] uppercase text-muted-foreground">
          Type faster. Strike harder.
        </p>

        <p className="max-w-xl text-foreground/80 leading-7 text-sm md:text-base">
          Masuki arena digital. Selama 60 detik, setiap karakter yang kamu ketik dengan benar adalah
          serangan. Kejar combo tertinggi, raih rank S, dan taklukkan personal best kamu sendiri.
        </p>

        <Link href="/projects/keystrike/play" className="mt-2">
          <span className="font-display inline-flex min-h-12 items-center justify-center tracking-[0.2em] sm:tracking-[0.25em] text-sm sm:text-base px-8 sm:px-10 py-3 bg-[color:var(--neon-cyan)] text-background hover:bg-[color:var(--neon-cyan)]/90 neon-glow transition rounded-md font-bold cursor-pointer">
            START GAME
          </span>
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full pt-6 sm:pt-8">
          <Feature icon={<ZapIcon />} label="Real-time WPM" />
          <Feature icon={<TargetIcon />} label="Accuracy Tracking" />
          <Feature icon={<FlameIcon />} label="Combo System" />
          <Feature icon={<CpuIcon />} label="Cyber Arena" />
        </div>

        {hs && (
          <div className="pt-6 w-full flex justify-center">
            <HighScoreCard data={hs} />
          </div>
        )}
      </div>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="min-h-11 rounded-md border border-border bg-card/40 backdrop-blur px-3 py-3 flex items-center gap-2 justify-center text-xs uppercase tracking-widest text-muted-foreground">
      <span className="neon-text-cyan">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
