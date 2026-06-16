"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand";
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
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-brand-paper/90 shadow-[0_1px_0_rgba(255,255,255,0.55)_inset] backdrop-blur-xl dark:border-white/[0.06] dark:bg-brand-night/80 dark:shadow-none">
      <Container>
        <div className="flex min-h-14 items-center justify-between gap-4">
          <Link href="/" className="rounded-2xl py-2 transition hover:opacity-90" onClick={() => setIsOpen(false)} aria-label="Arnol Works Home">
            <BrandLogo />
          </Link>
          <nav aria-label="Navigasi utama" className="hidden items-center gap-7 text-sm text-slate-700 dark:text-slate-300 lg:flex">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={`border-b-2 py-4 transition ${active ? "border-brand-primary text-brand-primary font-semibold dark:border-indigo-400 dark:text-indigo-300" : "border-transparent font-normal hover:border-slate-300 hover:text-brand-ink dark:hover:border-slate-500 dark:hover:text-white"}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:bg-white/[0.08] dark:hover:text-slate-200"
              aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
            >
              {isDark ? "☀ Light" : "☾ Dark"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08] lg:hidden"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            >
              <span aria-hidden="true" className="relative h-4 w-4">
                <span className={`absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-current transition ${isOpen ? "rotate-45" : "-translate-y-1.5"}`} />
                <span className={`absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-current transition ${isOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-current transition ${isOpen ? "-rotate-45" : "translate-y-1.5"}`} />
              </span>
            </button>
          </div>
        </div>
        {isOpen ? (
          <nav aria-label="Navigasi mobile" className="grid gap-1 border-t border-slate-200 py-3 text-sm text-slate-700 dark:border-white/[0.06] dark:text-slate-300 lg:hidden">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className={`rounded-md px-2 py-2 transition hover:bg-white dark:hover:bg-white/[0.06] ${active ? "font-semibold text-brand-primary dark:text-indigo-300" : "font-normal"}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </Container>
    </header>
  );
}

export const Header = SiteHeader;
