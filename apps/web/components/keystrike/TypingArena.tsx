import { useCallback, useEffect, useRef, useState } from "react";
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
  const [isFocused, setIsFocused] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const activateKeyboard = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Keep hidden input focused while playing
  useEffect(() => {
    const focus = () => activateKeyboard();
    focus();
    const onClick = () => focus();
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [activateKeyboard]);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateKeyboardState = () => {
      setIsKeyboardOpen(window.innerHeight - viewport.height > 120);
    };

    updateKeyboardState();
    viewport.addEventListener("resize", updateKeyboardState);
    viewport.addEventListener("scroll", updateKeyboardState);

    return () => {
      viewport.removeEventListener("resize", updateKeyboardState);
      viewport.removeEventListener("scroll", updateKeyboardState);
    };
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
    for (const ch of Array.from(v)) {
      handleChar(ch);
    }
    e.target.value = "";
  };

  const handleRetry = () => {
    setSavedResult(null);
    reset();
    setTimeout(() => activateKeyboard(), 0);
  };

  return (
    <div
      className={`keystrike-arena ${isKeyboardOpen ? "keystrike-keyboard-open" : ""} flex min-h-dvh w-full max-w-5xl flex-grow flex-col mx-auto px-3 py-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-4 md:p-8`}
    >
      {/* Header */}
      <header className="keystrike-arena-header flex items-center justify-between gap-3 py-2 md:py-4 border-b border-border/30">
        <div className="font-display text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground">
          Arena // Time Attack
        </div>
        <button
          onClick={() => router.push("/projects/keystrike")}
          className="flex min-h-11 items-center gap-1.5 rounded-md px-3 text-muted-foreground hover:text-foreground cursor-pointer transition text-sm bg-transparent border-0"
        >
          <XIcon /> Quit
        </button>
      </header>

      {/* Live stats */}
      <div className="keystrike-stats grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2 md:gap-3 py-4 md:py-6 max-w-xl md:max-w-none w-full mx-auto">
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
      <main className="keystrike-main flex min-h-0 flex-1 items-start justify-center py-3 sm:py-6 md:items-center md:py-10">
        <div className="w-full">
          <div
            className="keystrike-text-panel relative overflow-hidden rounded-xl neon-border bg-card/40 backdrop-blur p-4 sm:p-6 md:p-10"
            onPointerDown={activateKeyboard}
          >
            {state.status === "idle" && (
              <div className="mb-4 text-center text-xs sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] neon-text-cyan caret-blink">
                Ketuk lalu mulai mengetik
              </div>
            )}
            <TextDisplay sentence={state.sentence} charStates={state.charStates} />
            
            {/* Mobile Keyboard Re-focus Prompt Overlay */}
            {!isFocused && state.status !== "finished" && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4 text-center z-10">
                <p className="text-xs sm:text-sm font-semibold text-slate-200 tracking-wide">Keyboard Tidak Aktif</p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-1 mb-3">Ketuk di mana saja untuk mengaktifkan keyboard</p>
                <button 
                  onPointerDown={(event) => {
                    event.preventDefault();
                    activateKeyboard();
                  }}
                  onClick={activateKeyboard}
                  className="min-h-11 px-4 text-xs font-semibold rounded bg-[color:var(--neon-cyan)] text-background hover:bg-[color:var(--neon-cyan)]/90 neon-glow transition cursor-pointer"
                >
                  Buka Keyboard
                </button>
              </div>
            )}
          </div>

          <p className="keystrike-tip mt-3 sm:mt-4 text-center text-[11px] sm:text-xs text-muted-foreground hidden sm:block">
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label="Typing input"
        className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 h-11 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 opacity-0 text-base"
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
