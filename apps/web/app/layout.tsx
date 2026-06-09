import type { Metadata } from "next";
import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arnol Works",
  description: "Useful web tools and product experiments built by Arnol.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
