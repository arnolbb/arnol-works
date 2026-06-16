import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { randomSentence } from "./sentences";
import { calcAccuracy, calcFinalScore, calcRank, calcWpm, type Rank } from "./stats";

export type GameStatus = "idle" | "running" | "finished";

export type CharState = "pending" | "correct" | "wrong" | "current";

export type GameState = {
  status: GameStatus;
  sentence: string;
  typedIndex: number; // position of next char to type
  charStates: CharState[]; // per-char state for current sentence
  correctChars: number;
  totalTyped: number;
  mistakes: number;
  combo: number;
  maxCombo: number;
  score: number;
  timeLeft: number;
  wpm: number;
  accuracy: number;
  rank: Rank;
};

type EngineState = Omit<GameState, "wpm" | "accuracy" | "rank">;

type EngineAction =
  | { type: "START" }
  | { type: "TICK"; timeLeft: number }
  | { type: "FINISH" }
  | { type: "RESET" }
  | { type: "TYPE_CHAR"; char: string }
  | { type: "BACKSPACE" }
  | { type: "RESTORE_CURRENT"; index: number };

const DURATION = 60;

function makeSentenceState(sentence: string): CharState[] {
  return Array.from({ length: sentence.length }, (_, index) =>
    index === 0 ? "current" : "pending",
  );
}

function makeInitialState(previousSentence?: string): EngineState {
  const sentence = randomSentence(previousSentence);
  return {
    status: "idle",
    sentence,
    typedIndex: 0,
    charStates: makeSentenceState(sentence),
    correctChars: 0,
    totalTyped: 0,
    mistakes: 0,
    combo: 0,
    maxCombo: 0,
    score: 0,
    timeLeft: DURATION,
  };
}

function engineReducer(state: EngineState, action: EngineAction): EngineState {
  switch (action.type) {
    case "START":
      if (state.status !== "idle") return state;
      return { ...state, status: "running", timeLeft: DURATION };

    case "TICK":
      if (state.timeLeft === action.timeLeft) return state;
      return { ...state, timeLeft: action.timeLeft };

    case "FINISH":
      if (state.status === "finished" && state.timeLeft === 0) return state;
      return {
        ...state,
        status: "finished",
        timeLeft: 0,
        score: calcFinalScore(state.correctChars, state.maxCombo, state.mistakes),
      };

    case "RESET":
      return makeInitialState(state.sentence);

    case "TYPE_CHAR": {
      if (state.status === "finished") return state;

      const expected = state.sentence[state.typedIndex];
      if (expected === undefined) return state;

      if (action.char !== expected) {
        const charStates = state.charStates.slice();
        charStates[state.typedIndex] = "wrong";

        return {
          ...state,
          status: state.status === "idle" ? "running" : state.status,
          charStates,
          totalTyped: state.totalTyped + 1,
          mistakes: state.mistakes + 1,
          combo: 0,
          score: Math.max(0, state.score - 3),
        };
      }

      const nextIndex = state.typedIndex + 1;
      const nextCombo = state.combo + 1;

      if (nextIndex >= state.sentence.length) {
        const nextSentence = randomSentence(state.sentence);
        return {
          ...state,
          status: state.status === "idle" ? "running" : state.status,
          sentence: nextSentence,
          typedIndex: 0,
          charStates: makeSentenceState(nextSentence),
          correctChars: state.correctChars + 1,
          totalTyped: state.totalTyped + 1,
          combo: nextCombo,
          maxCombo: Math.max(state.maxCombo, nextCombo),
          score: state.score + 10,
        };
      }

      const charStates = state.charStates.slice();
      charStates[state.typedIndex] = "correct";
      charStates[nextIndex] = "current";

      return {
        ...state,
        status: state.status === "idle" ? "running" : state.status,
        typedIndex: nextIndex,
        charStates,
        correctChars: state.correctChars + 1,
        totalTyped: state.totalTyped + 1,
        combo: nextCombo,
        maxCombo: Math.max(state.maxCombo, nextCombo),
        score: state.score + 10,
      };
    }

    case "BACKSPACE": {
      if (state.status !== "running" || state.typedIndex === 0) return state;

      const previousIndex = state.typedIndex - 1;
      const charStates = state.charStates.slice();
      charStates[state.typedIndex] = "pending";
      charStates[previousIndex] = "current";

      return { ...state, typedIndex: previousIndex, charStates };
    }

    case "RESTORE_CURRENT": {
      if (state.status !== "running" || state.typedIndex !== action.index) return state;
      const charStates = state.charStates.slice();
      charStates[state.typedIndex] = "current";
      return { ...state, charStates };
    }

    default:
      return state;
  }
}

export function useGameEngine() {
  const [engine, dispatch] = useReducer(engineReducer, undefined, () => makeInitialState());
  const startedAtRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wrongFlashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearWrongFlash = useCallback(() => {
    if (wrongFlashTimeoutRef.current) {
      clearTimeout(wrongFlashTimeoutRef.current);
      wrongFlashTimeoutRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    clearWrongFlash();
    dispatch({ type: "FINISH" });
  }, [clearTimer, clearWrongFlash]);

  const startClock = useCallback(() => {
    startedAtRef.current = Date.now();
    clearTimer();
    intervalRef.current = setInterval(() => {
      if (!startedAtRef.current) return;
      const elapsedSeconds = Math.floor((Date.now() - startedAtRef.current) / 1000);
      const timeLeft = Math.max(0, DURATION - elapsedSeconds);
      dispatch({ type: "TICK", timeLeft });
      if (timeLeft <= 0) {
        clearTimer();
        clearWrongFlash();
        dispatch({ type: "FINISH" });
      }
    }, 250);
  }, [clearTimer, clearWrongFlash]);

  const start = useCallback(() => {
    if (engine.status !== "idle") return;
    dispatch({ type: "START" });
    startClock();
  }, [engine.status, startClock]);

  const reset = useCallback(() => {
    clearTimer();
    clearWrongFlash();
    startedAtRef.current = null;
    dispatch({ type: "RESET" });
  }, [clearTimer, clearWrongFlash]);

  useEffect(() => {
    return () => {
      clearTimer();
      clearWrongFlash();
    };
  }, [clearTimer, clearWrongFlash]);

  const handleChar = useCallback(
    (char: string) => {
      if (engine.status === "finished") return;
      if (engine.status === "idle") startClock();

      const indexToRestore = engine.typedIndex;
      clearWrongFlash();
      dispatch({ type: "TYPE_CHAR", char });

      if (char !== engine.sentence[indexToRestore]) {
        wrongFlashTimeoutRef.current = setTimeout(() => {
          dispatch({ type: "RESTORE_CURRENT", index: indexToRestore });
          wrongFlashTimeoutRef.current = null;
        }, 120);
      }
    },
    [clearWrongFlash, engine.sentence, engine.status, engine.typedIndex, startClock],
  );

  const handleBackspace = useCallback(() => {
    dispatch({ type: "BACKSPACE" });
  }, []);

  const state = useMemo<GameState>(() => {
    const elapsed = startedAtRef.current
      ? Math.min(DURATION, (Date.now() - startedAtRef.current) / 1000)
      : 0;
    const wpm = calcWpm(engine.correctChars, elapsed);

    return {
      ...engine,
      wpm,
      accuracy: calcAccuracy(engine.correctChars, engine.totalTyped),
      rank: calcRank(wpm),
    };
  }, [engine]);

  return { state, handleChar, handleBackspace, reset, start, stop };
}
