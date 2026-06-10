export function BrandMark({ className = "" }: Readonly<{ className?: string }>) {
  return (
    <span className={`relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/50 bg-slate-950 text-white shadow-[0_12px_35px_rgba(79,70,229,0.28)] dark:border-indigo-300/20 ${className}`} aria-hidden="true">
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(255,255,255,0.42),transparent_24%),linear-gradient(135deg,#4f46e5_0%,#7c3aed_46%,#10b981_100%)]" />
      <svg viewBox="0 0 40 40" className="relative h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 28L16.8 12H22.4L29.8 28" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.3 22.4H25.6" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M28.5 12.2L31.5 12.2L31.5 15.2" stroke="#A7F3D0" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function BrandLogo({ compact = false }: Readonly<{ compact?: boolean }>) {
  return (
    <span className="flex items-center gap-3">
      <BrandMark />
      <span className="grid leading-none">
        <span className="text-base font-semibold tracking-[-0.03em] text-brand-ink dark:text-white sm:text-lg">Arnol Works</span>
        {!compact ? <span className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400 sm:block">Tools Lab</span> : null}
      </span>
    </span>
  );
}
