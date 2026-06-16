import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arnol Works",
  description: "Useful web tools and product experiments built by Arnol.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen text-slate-950 antialiased dark:text-slate-100">
        <script dangerouslySetInnerHTML={{ __html: `try{const theme=localStorage.getItem("theme");const prefersDark=window.matchMedia("(prefers-color-scheme: dark)").matches;if(theme==="dark"||(!theme&&prefersDark)){document.documentElement.classList.add("dark")}}catch(e){}` }} />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
