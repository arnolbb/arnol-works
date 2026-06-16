import React from "react";

export function ToolIcon({ icon, slug, className = "size-6" }: { icon: string; slug?: string; className?: string }) {
  // Define custom semantic SVG icons based on the specific tool slug
  switch (slug) {
    case "pdf-color-bw-splitter":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <defs>
            <linearGradient id="split-red" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
            <linearGradient id="split-gray" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          {/* Left Page (Color) */}
          <path d="M4 19V5a1.5 1.5 0 011.5-1.5H11M4 19a1.5 1.5 0 001.5 1.5H11" strokeWidth="1.5" />
          <rect x="5.5" y="6" width="4" height="11" rx="0.5" fill="url(#split-red)" className="stroke-none" />
          
          {/* Right Page (B&W) */}
          <path d="M20 19V5a1.5 1.5 0 00-1.5-1.5H13M20 19a1.5 1.5 0 01-1.5 1.5H13" strokeWidth="1.5" />
          <rect x="14.5" y="6" width="4" height="11" rx="0.5" fill="url(#split-gray)" className="stroke-none" />
          
          {/* Center splitting line/scissors */}
          <line x1="12" y1="3" x2="12" y2="21" strokeDasharray="2 2" strokeWidth="1.5" className="opacity-80" />
        </svg>
      );

    case "compress-pdf":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          {/* Main Document */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          
          {/* Compress Arrows */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v6m0 0l-2-2m2 2l2-2" className="text-red-500" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 14h8" strokeWidth="1.2" strokeDasharray="1 1.5" className="opacity-50" />
        </svg>
      );

    case "merge-pdf":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          {/* Two overlapping docs merging */}
          <rect x="4" y="6" width="10" height="14" rx="1.5" strokeWidth="1.5" />
          <rect x="10" y="4" width="10" height="14" rx="1.5" strokeWidth="1.5" className="fill-white dark:fill-slate-900" />
          
          {/* Merge Icon */}
          <circle cx="15" cy="11" r="2.5" className="fill-indigo-500/10 stroke-indigo-500" strokeWidth="1.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 9.5v3M13.5 11h3" className="text-indigo-500" strokeWidth="1.2" />
        </svg>
      );

    case "pdf-to-word":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          {/* Document Left (PDF) */}
          <rect x="3" y="5" width="8" height="11" rx="1" strokeWidth="1.5" />
          <rect x="4.5" y="12" width="5" height="2.5" rx="0.5" fill="#EF4444" className="stroke-none" />
          
          {/* Transition Arrow */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 13h1M11 10.5l1.5 1.5-1.5 1.5" strokeWidth="1.5" className="text-brand-primary" />
          
          {/* Document Right (DOC) */}
          <rect x="13" y="8" width="8" height="11" rx="1" strokeWidth="1.5" />
          <rect x="14.5" y="15" width="5" height="2.5" rx="0.5" fill="#3B82F6" className="stroke-none" />
        </svg>
      );

    case "jpg-to-pdf":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          {/* Image Thumbnail behind */}
          <rect x="4" y="4" width="10" height="10" rx="1.5" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
          
          {/* PDF Page on top */}
          <rect x="10" y="8" width="10" height="12" rx="1.5" className="fill-white dark:fill-slate-900" strokeWidth="1.5" />
          
          {/* Conversion arrow */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13l2 2-2 2" className="text-emerald-500" strokeWidth="1.5" />
        </svg>
      );

    case "pdf-to-jpg":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          {/* PDF Page behind */}
          <rect x="4" y="8" width="10" height="12" rx="1.5" strokeWidth="1.5" />
          
          {/* Image Thumbnail on top */}
          <rect x="10" y="4" width="10" height="10" rx="1.5" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
          
          {/* Conversion arrow */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 13l2-2-2-2" className="text-emerald-500" strokeWidth="1.5" />
        </svg>
      );

    case "compress-image":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <defs>
            <linearGradient id="comp-img-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          
          {/* Inner crop area showing compression arrows */}
          <rect x="6" y="6" width="12" height="12" rx="1" strokeDasharray="2 2" className="opacity-60" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-3-3l3 3 3-3" stroke="url(#comp-img-grad)" strokeWidth="2" />
        </svg>
      );

    case "resize-image":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          {/* Dynamic scaling paths */}
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h8v8" strokeWidth="1.5" strokeDasharray="1.5 1.5" className="opacity-60" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l-5 5m5-5v3.5M16 8h-3.5" className="text-emerald-500" strokeWidth="1.5" />
        </svg>
      );

    case "remove-bg":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          {/* Grid bg */}
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1" />
          
          {/* Subject outline selection */}
          <path d="M12 6a4 4 0 00-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 00-4-4z" className="fill-indigo-500/10 stroke-indigo-500" strokeWidth="1.5" />
        </svg>
      );

    case "passport-photo":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          {/* Multiple Photo Frame layout */}
          <rect x="3" y="3" width="7" height="9" rx="1" fill="#EF4444" className="stroke-none" />
          <rect x="3" y="3" width="7" height="9" rx="1" strokeWidth="1" />
          <circle cx="6.5" cy="6" r="1.5" fill="white" className="stroke-none" />
          
          <rect x="12" y="3" width="9" height="12" rx="1" fill="#3B82F6" className="stroke-none" />
          <rect x="12" y="3" width="9" height="12" rx="1" strokeWidth="1" />
          <circle cx="16.5" cy="7" r="2" fill="white" className="stroke-none" />
          
          <rect x="3" y="14" width="7" height="7" rx="1" strokeDasharray="1.5 1.5" />
        </svg>
      );

    case "word-counter":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          {/* Page */}
          <rect x="4" y="3" width="16" height="18" rx="2" />
          {/* Text lines */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h8M8 12h8M8 16h5" />
          
          {/* Counter Badge */}
          <circle cx="16" cy="16" r="4.5" className="fill-indigo-500 stroke-none" />
          <text x="16" y="18" fill="white" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">12</text>
        </svg>
      );

    case "qr-code-generator":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <defs>
            <linearGradient id="qr-core-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <rect x="3" y="3" width="6" height="6" rx="1" stroke="url(#qr-core-grad)" strokeWidth="2" />
          <rect x="15" y="3" width="6" height="6" rx="1" stroke="url(#qr-core-grad)" strokeWidth="2" />
          <rect x="3" y="15" width="6" height="6" rx="1" stroke="url(#qr-core-grad)" strokeWidth="2" />
          <path d="M15 15h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z" className="fill-currentColor stroke-none" />
        </svg>
      );

    default:
      // Fallback to general file layout with generic icon badges
      switch (icon) {
        case "PDF":
          return (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              <rect x="8" y="11" width="8" height="4" rx="1" className="fill-red-500/10 stroke-red-500" strokeWidth="1" />
              <text x="12" y="14" fill="currentColor" fontSize="3" fontWeight="bold" textAnchor="middle" fontFamily="var(--font-mono)">PDF</text>
            </svg>
          );
        case "DOC":
          return (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              <rect x="8" y="11" width="8" height="4" rx="1" className="fill-blue-500/10 stroke-blue-500" strokeWidth="1" />
              <text x="12" y="14" fill="currentColor" fontSize="3" fontWeight="bold" textAnchor="middle" fontFamily="var(--font-mono)">DOC</text>
            </svg>
          );
        case "IMG":
        case "JPG":
          return (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" className="fill-emerald-500 stroke-none" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
            </svg>
          );
        case "TXT":
          return (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 8h8M8 12h8M8 16h5" />
            </svg>
          );
        case "QR":
          return (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <rect x="3" y="3" width="6" height="6" rx="1.5" />
              <rect x="15" y="3" width="6" height="6" rx="1.5" />
              <rect x="3" y="15" width="6" height="6" rx="1.5" />
              <rect x="15" y="15" width="6" height="6" rx="1.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h2v2H9zM13 9h2v2h-2zM9 13h2v2H9zM13 13h2v2h-2z" />
            </svg>
          );
        default:
          return (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 6H16" />
            </svg>
          );
      }
  }
}
