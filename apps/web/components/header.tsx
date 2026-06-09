"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/page-shell";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/projects", label: "Projects" },
  { href: "/case-studies", label: "Notes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    setIsDark(nextIsDark);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-brand-paper/90 backdrop-blur dark:border-brand-line dark:bg-brand-night/85">
      <Container>
        <div className="flex min-h-14 items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold tracking-[-0.02em] text-brand-ink dark:text-slate-100 dark:text-white" onClick={() => setIsOpen(false)}>
            Arnol Works
          </Link>
          <nav aria-label="Navigasi utama" className="hidden items-center gap-7 text-sm text-slate-700 dark:text-slate-300 dark:text-slate-300 lg:flex">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={`border-b-2 py-4 transition ${active ? "border-brand-primary text-brand-primary" : "border-transparent hover:border-slate-300 dark:border-slate-600 hover:text-brand-ink dark:text-slate-100 dark:hover:border-slate-600 dark:hover:text-white"}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleTheme} className="rounded-md border border-slate-200 dark:border-brand-line bg-white dark:bg-brand-panel px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-brand-paper dark:hover:bg-slate-800 dark:bg-brand-night dark:border-brand-line dark:bg-brand-panel dark:text-slate-200 dark:hover:bg-slate-800" aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}>
              {isDark ? "Light" : "Dark"}
            </button>
            <button type="button" onClick={() => setIsOpen((value) => !value)} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 dark:border-brand-line bg-white dark:bg-brand-panel text-slate-700 dark:text-slate-300 dark:border-brand-line dark:bg-brand-panel dark:text-slate-200 lg:hidden" aria-expanded={isOpen} aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}>
              <span aria-hidden="true" className="relative h-4 w-4">
                <span className={`absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-current transition ${isOpen ? "rotate-45" : "-translate-y-1.5"}`} />
                <span className={`absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-current transition ${isOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-current transition ${isOpen ? "-rotate-45" : "translate-y-1.5"}`} />
              </span>
            </button>
          </div>
        </div>
        {isOpen ? (
          <nav aria-label="Navigasi mobile" className="grid gap-1 border-t border-slate-200 dark:border-brand-line py-3 text-sm text-slate-700 dark:text-slate-300 dark:border-brand-line dark:text-slate-300 lg:hidden">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="rounded-md px-2 py-2 transition hover:bg-white dark:hover:bg-brand-panel dark:bg-brand-panel dark:hover:bg-brand-panel">
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </Container>
    </header>
  );
}

export const Header = SiteHeader;