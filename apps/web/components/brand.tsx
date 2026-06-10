import Image from "next/image";

export function BrandMark({ className = "" }: Readonly<{ className?: string }>) {
  return (
    <span className={`relative flex h-10 w-[64px] shrink-0 items-center justify-center ${className}`} aria-hidden="true">
      <Image src="/brand/logo-only-light-transparent.png" alt="" width={128} height={80} sizes="64px" className="h-full w-full object-contain drop-shadow-[0_10px_24px_rgba(37,99,235,0.25)]" priority />
    </span>
  );
}

export function BrandLogo({ compact = false }: Readonly<{ compact?: boolean }>) {
  return (
    <span className="flex items-center gap-3">
      <BrandMark />
      <span className="grid leading-none">
        <span className="text-base font-semibold tracking-[-0.03em] text-brand-ink dark:text-white sm:text-lg">Arnol Works</span>
        {!compact ? <span className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.34em] text-slate-500 dark:text-slate-400 sm:block">Tools Lab</span> : null}
      </span>
    </span>
  );
}
