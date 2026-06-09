export function parsePageRange(input: string, totalPages: number): number[] {
  const trimmed = input.trim();
  if (!trimmed) {
    return [];
  }

  const pages = new Set<number>();
  for (const part of trimmed.split(",")) {
    const token = part.trim();
    if (!token) {
      throw new Error("Format halaman tidak valid.");
    }

    if (token.includes("-")) {
      const pieces = token.split("-").map((piece) => piece.trim());
      if (pieces.length !== 2 || !pieces[0] || !pieces[1]) {
        throw new Error("Format rentang halaman tidak valid.");
      }
      const start = Number(pieces[0]);
      const end = Number(pieces[1]);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) {
        throw new Error("Format rentang halaman tidak valid.");
      }
      for (let page = start; page <= end; page += 1) {
        pages.add(page);
      }
    } else {
      const page = Number(token);
      if (!Number.isInteger(page)) {
        throw new Error("Nomor halaman tidak valid.");
      }
      pages.add(page);
    }
  }

  const normalized = Array.from(pages).sort((a, b) => a - b);
  if (normalized.some((page) => page < 1 || page > totalPages)) {
    throw new Error(`Nomor halaman harus antara 1 dan ${totalPages}.`);
  }
  return normalized;
}
