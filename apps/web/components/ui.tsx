import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type PanelProps = Readonly<{
  children: ReactNode;
  className?: string;
  as?: "section" | "article" | "aside" | "div";
}>;

export function Panel({ children, className = "", as: Component = "div" }: PanelProps) {
  return <Component className={`rounded-[24px] border border-slate-200 bg-white/95 shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-brand-line dark:bg-slate-900/72 dark:shadow-[0_18px_70px_rgba(0,0,0,0.22)] ${className}`}>{children}</Component>;
}

export function Eyebrow({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  return <p className={`font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400 ${className}`}>{children}</p>;
}

export function StatusBadge({ tone = "indigo", children }: Readonly<{ tone?: "indigo" | "emerald" | "amber" | "slate"; children: ReactNode }>) {
  const tones = {
    indigo: "border-brand-border bg-brand-soft text-brand-primary dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-300",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300",
    amber: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300",
    slate: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };

  return <span className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wide ${tones[tone]}`}>{children}</span>;
}

export function ButtonLink({ href, children, variant = "primary", className = "", ...props }: Readonly<{ href: string; children: ReactNode; variant?: "primary" | "secondary" } & AnchorHTMLAttributes<HTMLAnchorElement>>) {
  const variants = {
    primary: "bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200",
    secondary: "border border-slate-300 bg-white text-brand-ink hover:border-slate-500 dark:border-brand-line dark:bg-brand-panel/80 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800",
  };

  return <Link href={href} className={`inline-flex justify-center rounded-md px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`} {...props}>{children}</Link>;
}
