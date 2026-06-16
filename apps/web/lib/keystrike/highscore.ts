import type { Rank } from "./stats";

const KEY = "keystrike:highscore";

export type HighScore = {
  highScore: number;
  bestWpm: number;
  bestAccuracy: number;
  bestRank: Rank;
};

export function loadHighScore(): HighScore | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HighScore;
  } catch {
    return null;
  }
}

export type GameResult = {
  score: number;
  wpm: number;
  accuracy: number;
  rank: Rank;
};

export function saveHighScore(result: GameResult): { isNew: boolean; data: HighScore } {
  const prev = loadHighScore();
  const isNew = !prev || result.score > prev.highScore;
  const data: HighScore = {
    highScore: Math.max(prev?.highScore ?? 0, result.score),
    bestWpm: Math.max(prev?.bestWpm ?? 0, result.wpm),
    bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, result.accuracy),
    bestRank: pickBetterRank(prev?.bestRank, result.rank),
  };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }
  return { isNew, data };
}

const ORDER: Rank[] = ["D", "C", "B", "A", "S"];
function pickBetterRank(a: Rank | undefined, b: Rank): Rank {
  if (!a) return b;
  return ORDER.indexOf(b) > ORDER.indexOf(a) ? b : a;
}
