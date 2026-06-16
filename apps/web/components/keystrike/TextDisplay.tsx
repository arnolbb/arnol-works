import { memo } from "react";
import type { CharState } from "@/lib/keystrike/useGameEngine";

const stateClasses: Record<CharState, string> = {
  correct: "text-[color:var(--neon-green)]",
  wrong: "text-[color:var(--neon-red)] bg-[color:var(--neon-red)]/15 rounded-sm",
  current: "text-[color:var(--neon-cyan)] border-b-2 border-[color:var(--neon-cyan)] caret-blink",
  pending: "text-muted-foreground/60",
};

export const TextDisplay = memo(function TextDisplay({
  sentence,
  charStates,
}: {
  sentence: string;
  charStates: CharState[];
}) {
  return (
    <div className="font-mono text-2xl md:text-3xl leading-relaxed tracking-wide select-none text-pretty">
      {Array.from(sentence, (ch, index) => {
        const state = charStates[index] ?? "pending";
        const renderedChar = ch === " " && state === "wrong" ? "·" : ch;

        return (
          <span key={`${ch}-${index}`} className={`transition-colors ${stateClasses[state]}`}>
            {renderedChar}
          </span>
        );
      })}
    </div>
  );
});
