export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-baseline gap-1 font-display ${className}`}>
      <span className="neon-text-cyan font-black tracking-widest">KEY</span>
      <span className="neon-text-magenta font-black tracking-widest">STRIKE</span>
    </div>
  );
}
