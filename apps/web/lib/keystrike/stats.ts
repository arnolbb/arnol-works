export type Rank = "D" | "C" | "B" | "A" | "S";

export function calcWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const wpm = correctChars / 5 / minutes;
  if (!isFinite(wpm) || isNaN(wpm)) return 0;
  return Math.max(0, Math.round(wpm));
}

export function calcAccuracy(correctChars: number, totalTyped: number): number {
  if (totalTyped <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((correctChars / totalTyped) * 100)));
}

export function calcRank(wpm: number): Rank {
  if (wpm >= 81) return "S";
  if (wpm >= 61) return "A";
  if (wpm >= 41) return "B";
  if (wpm >= 21) return "C";
  return "D";
}

export function calcFinalScore(correctChars: number, maxCombo: number, mistakes: number): number {
  const base = correctChars * 10;
  const bonus = maxCombo * 5;
  const penalty = mistakes * 3;
  return Math.max(0, base + bonus - penalty);
}
