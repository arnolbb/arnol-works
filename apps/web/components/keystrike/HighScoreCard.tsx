import type { HighScore } from "@/lib/keystrike/highscore";

export function HighScoreCard({ data }: { data: HighScore }) {
  return (
    <div className="rounded-lg neon-border-magenta bg-card/60 backdrop-blur p-5 w-full max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-sm uppercase tracking-[0.25em] neon-text-magenta">
          Personal Best
        </h3>
        <span className="font-display text-2xl font-black neon-text-magenta">{data.bestRank}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            High Score
          </div>
          <div className="font-display text-xl font-bold neon-text-cyan tabular-nums">
            {data.highScore.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Best WPM
          </div>
          <div className="font-display text-xl font-bold tabular-nums">{data.bestWpm}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Accuracy
          </div>
          <div className="font-display text-xl font-bold tabular-nums">{data.bestAccuracy}%</div>
        </div>
      </div>
    </div>
  );
}
