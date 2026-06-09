import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#4A3EE6",
          hover: "#372BD1",
          soft: "#F1F0FF",
          border: "#DCD9FF",
          ink: "#0D1C2E",
          muted: "#475569",
          paper: "#FBFAF8",
        },
      },
      boxShadow: {
        hairline: "0 1px 0 rgba(15, 23, 42, 0.04)",
      },
      borderRadius: {
        stitch: "18px",
      },
      fontFamily: {
        sans: ["var(--font-body)", "Inter", "Arial", "sans-serif"],
        heading: ["var(--font-heading)", "Inter", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
