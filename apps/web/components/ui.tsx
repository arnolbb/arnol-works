import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type PanelProps = Readonly<{
  children: ReactNode;
  className?: string;
  as?: "section" | "article" | "aside" | "div";
}>;

export function Panel({ children, className = "", as: Component = "div" }: PanelProps) {
  return (
    <Component 
      className={`rounded-[24px] border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-[0_18px_50px_rgba(15,23,42,0.04)] transition-all duration-300 dark:border-brand-line/50 dark:bg-slate-900/60 dark:shadow-[0_20px_60px_rgba(0,0,0,0.18)] ${className}`}
    >
      {children}
    </Component>
  );
}

export function Eyebrow({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  return <p className={`font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400 ${className}`}>{children}</p>;
}

export function StatusBadge({ tone = "indigo", children }: Readonly<{ tone?: "indigo" | "emerald" | "amber" | "slate"; children: ReactNode }>) {
  const tones = {
    indigo: "border-brand-border bg-brand-soft text-brand-primary dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-300",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300",
    amber: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-emerald-300", // Fix to prevent clash
    slate: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };

  return <span className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wide ${tones[tone]}`}>{children}</span>;
}

export function ButtonLink({ href, children, variant = "primary", className = "", ...props }: Readonly<{ href: string; children: ReactNode; variant?: "primary" | "secondary" } & AnchorHTMLAttributes<HTMLAnchorElement>>) {
  const variants = {
    primary: "bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-brand-night dark:hover:bg-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] dark:shadow-none",
    secondary: "border border-slate-300 bg-white/85 text-brand-ink hover:border-slate-400 dark:border-brand-line dark:bg-brand-panel/60 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]",
  };

  return <Link href={href} className={`inline-flex justify-center rounded-md px-5 py-3 text-sm font-semibold transition-all duration-200 ${variants[variant]} ${className}`} {...props}>{children}</Link>;
}
