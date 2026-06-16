import { StatTile } from "./StatTile";
import type { Rank } from "@/lib/keystrike/stats";

export function ResultModal({
  open,
  wpm,
  accuracy,
  mistakes,
  maxCombo,
  score,
  rank,
  isNewHighScore,
  onRetry,
  onHome,
}: {
  open: boolean;
  wpm: number;
  accuracy: number;
  mistakes: number;
  maxCombo: number;
  score: number;
  rank: Rank;
  isNewHighScore: boolean;
  onRetry: () => void;
  onHome: () => void;
}) {
  if (!open) return null;

  const rankColor: Record<Rank, string> = {
    S: "neon-text-magenta",
    A: "neon-text-cyan",
    B: "neon-text-green",
    C: "text-[color:var(--neon-yellow)]",
    D: "text-muted-foreground",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4 bg-black/85 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[calc(100dvh-1.5rem)] overflow-y-auto border neon-border bg-card p-4 sm:p-6 rounded-xl shadow-2xl relative">
        <div className="flex flex-col space-y-1.5 text-center mb-4">
          <h2 className="font-display text-center text-2xl neon-text-cyan tracking-widest">
            MISSION COMPLETE
          </h2>
        </div>

        <div className="flex flex-col items-center gap-4 py-2">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Rank</div>
            <div className={`font-display text-7xl font-black ${rankColor[rank]}`}>{rank}</div>
          </div>

          {isNewHighScore && (
            <div className="rounded-md border border-[color:var(--neon-magenta)]/60 bg-[color:var(--neon-magenta)]/10 px-3 py-1 text-xs uppercase tracking-widest neon-text-magenta">
              ★ New High Score
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 w-full">
            <StatTile label="WPM" value={wpm} variant="cyan" />
            <StatTile label="Accuracy" value={`${accuracy}%`} variant="green" />
            <StatTile label="Mistakes" value={mistakes} variant="red" />
            <StatTile label="Max Combo" value={maxCombo} variant="yellow" />
            <div className="col-span-2">
              <StatTile label="Final Score" value={score.toLocaleString()} variant="magenta" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-4">
            <button
              onClick={onHome}
              className="min-h-11 px-4 py-2 text-sm font-semibold rounded-md border border-slate-600 text-slate-300 hover:bg-slate-800 transition cursor-pointer"
            >
              Back to Home
            </button>
            <button
              onClick={onRetry}
              className="min-h-11 px-4 py-2 text-sm font-semibold rounded-md bg-[color:var(--neon-cyan)] text-background hover:bg-[color:var(--neon-cyan)]/90 neon-glow transition cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
