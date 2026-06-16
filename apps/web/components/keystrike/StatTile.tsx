import { memo, type ReactNode } from "react";

type Variant = "cyan" | "magenta" | "green" | "red" | "yellow";

const variantClasses: Record<Variant, string> = {
  cyan: "neon-text-cyan border-[color:var(--neon-cyan)]/40",
  magenta: "neon-text-magenta border-[color:var(--neon-magenta)]/40",
  green: "neon-text-green border-[color:var(--neon-green)]/40",
  red: "neon-text-red border-[color:var(--neon-red)]/40",
  yellow: "text-[color:var(--neon-yellow)] border-[color:var(--neon-yellow)]/40",
};

export const StatTile = memo(function StatTile({
  label,
  value,
  variant = "cyan",
  icon,
}: {
  label: string;
  value: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
}) {
  return (
    <div
      className={`keystrike-stat-tile contain-paint min-h-[52px] overflow-hidden rounded-md border bg-card/60 backdrop-blur px-2.5 py-2 sm:min-h-[66px] sm:px-4 sm:py-3 ${variantClasses[variant]}`}
    >
      <div className="keystrike-stat-label flex min-w-0 items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] sm:gap-1.5 sm:text-[10px] sm:tracking-[0.2em] text-muted-foreground">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="keystrike-stat-value mt-0.5 font-display text-base sm:text-2xl font-bold leading-tight tabular-nums break-words">
        {value}
      </div>
    </div>
  );
});
