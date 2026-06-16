"use client";

import { TypingArena } from "@/components/keystrike/TypingArena";
import "../keystrike.css";

export default function KeyStrikePlayPage() {
  return (
    <div className="keystrike-theme min-h-screen flex flex-col">
      <TypingArena />
    </div>
  );
}
