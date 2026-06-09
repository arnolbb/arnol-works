"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-brand-paper/95 backdrop-blur">
      <Container>
        <div className="flex min-h-14 items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold tracking-[-0.02em] text-brand-ink" onClick={() => setIsOpen(false)}>
            Arnol Works
          </Link>
          <nav aria-label="Navigasi utama" className="hidden items-center gap-7 text-sm text-slate-700 lg:flex">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={`border-b-2 py-4 transition ${active ? "border-brand-primary text-brand-primary" : "border-transparent hover:border-slate-300 hover:text-brand-ink"}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button type="button" onClick={() => setIsOpen((value) => !value)} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 lg:hidden" aria-expanded={isOpen} aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}>
            <span aria-hidden="true" className="relative h-4 w-4">
              <span className={`absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-current transition ${isOpen ? "rotate-45" : "-translate-y-1.5"}`} />
              <span className={`absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-current transition ${isOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-current transition ${isOpen ? "-rotate-45" : "translate-y-1.5"}`} />
            </span>
          </button>
        </div>
        {isOpen ? (
          <nav aria-label="Navigasi mobile" className="grid gap-1 border-t border-slate-200 py-3 text-sm text-slate-700 lg:hidden">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="rounded-md px-2 py-2 transition hover:bg-white">
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
