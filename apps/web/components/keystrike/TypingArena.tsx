import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { StatTile } from "./StatTile";
import { TextDisplay } from "./TextDisplay";
import { ResultModal } from "./ResultModal";
import { useGameEngine } from "@/lib/keystrike/useGameEngine";
import { saveHighScore } from "@/lib/keystrike/highscore";

const ClockIcon = () => (
  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
  </svg>
);

const ZapIcon = () => (
  <svg className="size-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const TargetIcon = () => (
  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const FlameIcon = () => (
  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TrophyIcon = () => (
  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v5m-3 0h6M4 7h16M4 7a3 3 0 003 3h10a3 3 0 003-3M4 7c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4m0 0a3 3 0 01-3 3h-2.03M4 7a3 3 0 003 3h2.03" />
  </svg>
);

const XIcon = () => (
  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export function TypingArena() {
  const router = useRouter();
  const { state, handleChar, handleBackspace, reset } = useGameEngine();
  const inputRef = useRef<HTMLInputElement>(null);
  const [savedResult, setSavedResult] = useState<{ isNew: boolean } | null>(null);

  // Keep hidden input focused while playing
  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    focus();
    const onClick = () => focus();
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // Save high score once when finished
  useEffect(() => {
    if (state.status === "finished" && !savedResult) {
      const r = saveHighScore({
        score: state.score,
        wpm: state.wpm,
        accuracy: state.accuracy,
        rank: state.rank,
      });
      setSavedResult({ isNew: r.isNew });
    }
  }, [state.status, state.score, state.wpm, state.accuracy, state.rank, savedResult]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (state.status === "finished") return;
    if (e.key === "Backspace") {
      e.preventDefault();
      handleBackspace();
      return;
    }
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      handleChar(e.key);
    }
  };

  // Mobile / IME fallback via onChange
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!v) return;
    const ch = v[v.length - 1];
    if (ch) handleChar(ch);
    e.target.value = "";
  };

  const handleRetry = () => {
    setSavedResult(null);
    reset();
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="flex flex-col flex-grow w-full max-w-5xl mx-auto p-4 md:p-8">
      {/* Header */}
      <header className="flex items-center justify-between py-4 border-b border-border/30">
        <div className="font-display text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Arena // Time Attack
        </div>
        <button
          onClick={() => router.push("/projects/keystrike")}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition text-sm bg-transparent border-0"
        >
          <XIcon /> Quit
        </button>
      </header>

      {/* Live stats */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 py-6">
        <StatTile
          label="Timer"
          value={`${state.timeLeft}s`}
          variant={state.timeLeft <= 10 ? "red" : "cyan"}
          icon={<ClockIcon />}
        />
        <StatTile label="WPM" value={state.wpm} variant="cyan" icon={<ZapIcon />} />
        <StatTile
          label="Accuracy"
          value={`${state.accuracy}%`}
          variant="green"
          icon={<TargetIcon />}
        />
        <StatTile
          label="Combo"
          value={`x${state.combo}`}
          variant="yellow"
          icon={<FlameIcon />}
        />
        <StatTile
          label="Score"
          value={state.score.toLocaleString()}
          variant="magenta"
          icon={<TrophyIcon />}
        />
        <StatTile label="Mistakes" value={state.mistakes} variant="red" />
      </div>

      {/* Text arena */}
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full">
          <div className="rounded-xl neon-border bg-card/40 backdrop-blur p-6 md:p-10">
            {state.status === "idle" && (
              <div className="mb-4 text-center text-xs uppercase tracking-[0.3em] neon-text-cyan caret-blink">
                Start typing to engage…
              </div>
            )}
            <TextDisplay sentence={state.sentence} charStates={state.charStates} />
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Tip: Tekan{" "}
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-card text-foreground font-mono">
              Backspace
            </kbd>{" "}
            untuk memperbaiki kesalahan.
          </p>
        </div>
      </main>

      {/* Hidden capture input */}
      <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onKeyDown={onKeyDown}
        onChange={onChange}
        aria-label="Typing input"
        className="fixed -top-10 left-0 size-1 opacity-0"
      />

      <ResultModal
        open={state.status === "finished"}
        wpm={state.wpm}
        accuracy={state.accuracy}
        mistakes={state.mistakes}
        maxCombo={state.maxCombo}
        score={state.score}
        rank={state.rank}
        isNewHighScore={savedResult?.isNew ?? false}
        onRetry={handleRetry}
        onHome={() => router.push("/projects/keystrike")}
      />
    </div>
  );
}
