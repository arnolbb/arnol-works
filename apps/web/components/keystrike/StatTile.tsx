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
      className={`contain-paint rounded-md border bg-card/60 backdrop-blur px-4 py-3 min-w-[88px] ${variantClasses[variant]}`}
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-display text-2xl font-bold leading-tight tabular-nums">{value}</div>
    </div>
  );
});
