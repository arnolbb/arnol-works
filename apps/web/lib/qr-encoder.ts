// Minimal QR Code generator – byte mode, error correction level M
// Produces a boolean[][] matrix (true = dark module)

const ECC_CODEWORDS_PER_BLOCK: Record<number, [number, number][]> = {
  1: [[1, 16]],   2: [[1, 28]],   3: [[1, 44]],   4: [[2, 32]],
  5: [[2, 43]],   6: [[4, 27]],   7: [[4, 31]],   8: [[2, 38], [2, 39]],
  9: [[3, 36], [2, 37]], 10: [[4, 43], [1, 44]],
};
const DATA_CODEWORDS: Record<number, number> = {
  1: 16, 2: 28, 3: 44, 4: 64, 5: 86, 6: 108, 7: 124, 8: 154, 9: 182, 10: 216,
};
const EC_PER_BLOCK: Record<number, number> = {
  1: 10, 2: 16, 3: 26, 4: 18, 5: 24, 6: 16, 7: 18, 8: 22, 9: 22, 10: 26,
};
const ALIGNMENT_PATTERNS: Record<number, number[]> = {
  2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34],
  7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50],
};
const FORMAT_BITS = [0x5412, 0x5125, 0x5E7C, 0x5B4B, 0x45F9, 0x40CE, 0x4F97, 0x4AA0];

function chooseVersion(dataLen: number): number {
  for (let v = 1; v <= 10; v++) {
    const charCountBits = v <= 9 ? 8 : 16;
    const capacity = DATA_CODEWORDS[v];
    const needed = Math.ceil((4 + charCountBits + dataLen * 8) / 8);
    if (needed <= capacity) return v;
  }
  throw new Error("Data terlalu panjang untuk QR code.");
}

function getSize(version: number) { return 17 + version * 4; }

function makeDataBits(data: Uint8Array, version: number): number[] {
  const bits: number[] = [];
  const push = (val: number, len: number) => { for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1); };
  push(4, 4); // byte mode indicator
  const charCountBits = version <= 9 ? 8 : 16;
  push(data.length, charCountBits);
  for (let i = 0; i < data.length; i++) push(data[i], 8);
  // terminator
  const totalBits = DATA_CODEWORDS[version] * 8;
  const termLen = Math.min(4, totalBits - bits.length);
  push(0, termLen);
  while (bits.length % 8 !== 0) bits.push(0);
  const padBytes = [0xEC, 0x11];
  let padIdx = 0;
  while (bits.length < totalBits) { push(padBytes[padIdx % 2], 8); padIdx++; }
  return bits;
}

function bitsToBytes(bits: number[]): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | (bits[i + j] || 0);
    bytes.push(b);
  }
  return bytes;
}

// GF(256) arithmetic
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(function initGF() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x = (x << 1) ^ (x & 128 ? 0x11D : 0);
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a: number, b: number) {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function polyMul(a: number[], b: number[]) {
  const result = new Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < b.length; j++)
      result[i + j] ^= gfMul(a[i], b[j]);
  return result;
}

function generatorPoly(degree: number) {
  let g = [1];
  for (let i = 0; i < degree; i++) g = polyMul(g, [1, GF_EXP[i]]);
  return g;
}

function computeEC(data: number[], ecCount: number): number[] {
  const gen = generatorPoly(ecCount);
  const msg = [...data, ...new Array(ecCount).fill(0)];
  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef !== 0) for (let j = 0; j < gen.length; j++) msg[i + j] ^= gfMul(gen[j], coef);
  }
  return msg.slice(data.length);
}

function interleave(dataBytes: number[], version: number): number[] {
  const blocks = ECC_CODEWORDS_PER_BLOCK[version];
  const ecCount = EC_PER_BLOCK[version];
  const dataBlocks: number[][] = [];
  const ecBlocks: number[][] = [];
  let offset = 0;
  for (const [count, size] of blocks) {
    for (let i = 0; i < count; i++) {
      const block = dataBytes.slice(offset, offset + size);
      dataBlocks.push(block);
      ecBlocks.push(computeEC(block, ecCount));
      offset += size;
    }
  }
  const result: number[] = [];
  const maxDataLen = Math.max(...dataBlocks.map(b => b.length));
  for (let i = 0; i < maxDataLen; i++)
    for (const block of dataBlocks) if (i < block.length) result.push(block[i]);
  for (let i = 0; i < ecCount; i++)
    for (const block of ecBlocks) if (i < block.length) result.push(block[i]);
  return result;
}

function createMatrix(version: number): (boolean | null)[][] {
  const size = getSize(version);
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () => new Array(size).fill(null));

  // Finder patterns
  function drawFinder(row: number, col: number) {
    for (let r = -1; r <= 7; r++)
      for (let c = -1; c <= 7; c++) {
        const rr = row + r, cc = col + c;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        const inOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const inInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[rr][cc] = (r === -1 || r === 7 || c === -1 || c === 7) ? false : (inOuter || inInner);
      }
  }
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Alignment patterns
  const ap = ALIGNMENT_PATTERNS[version];
  if (ap) {
    for (const r of ap)
      for (const c of ap) {
        if (matrix[r][c] !== null) continue;
        for (let dr = -2; dr <= 2; dr++)
          for (let dc = -2; dc <= 2; dc++)
            matrix[r + dr][c + dc] = Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0);
      }
  }

  // Dark module
  matrix[size - 8][8] = true;

  // Reserve format info
  for (let i = 0; i < 8; i++) {
    if (matrix[8][i] === null) matrix[8][i] = false;
    if (matrix[8][size - 1 - i] === null) matrix[8][size - 1 - i] = false;
    if (matrix[i][8] === null) matrix[i][8] = false;
    if (matrix[size - 1 - i][8] === null) matrix[size - 1 - i][8] = false;
  }
  if (matrix[8][8] === null) matrix[8][8] = false;

  return matrix;
}

function placeData(matrix: (boolean | null)[][], bits: number[]) {
  const size = matrix.length;
  let bitIdx = 0;
  let upward = true;
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5;
    const rows = upward ? Array.from({ length: size }, (_, i) => size - 1 - i) : Array.from({ length: size }, (_, i) => i);
    for (const row of rows) {
      for (const dc of [0, -1]) {
        const c = col + dc;
        if (matrix[row][c] === null) {
          matrix[row][c] = bitIdx < bits.length ? bits[bitIdx] === 1 : false;
          bitIdx++;
        }
      }
    }
    upward = !upward;
  }
}

function applyMask(matrix: boolean[][], mask: number): boolean[][] {
  const size = matrix.length;
  const result = matrix.map(r => [...r]);
  const reserved = createMatrix(Math.round((size - 17) / 4));
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      if (reserved[r][c] !== null) continue;
      let apply = false;
      switch (mask) {
        case 0: apply = (r + c) % 2 === 0; break;
        case 1: apply = r % 2 === 0; break;
        case 2: apply = c % 3 === 0; break;
        case 3: apply = (r + c) % 3 === 0; break;
        case 4: apply = (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0; break;
        case 5: apply = (r * c) % 2 + (r * c) % 3 === 0; break;
        case 6: apply = ((r * c) % 2 + (r * c) % 3) % 2 === 0; break;
        case 7: apply = ((r + c) % 2 + (r * c) % 3) % 2 === 0; break;
      }
      if (apply) result[r][c] = !result[r][c];
    }
  return result;
}

function applyFormatInfo(matrix: boolean[][], maskPattern: number) {
  const bits = FORMAT_BITS[maskPattern];
  const size = matrix.length;
  const positions: [number, number][] = [];
  for (let i = 0; i <= 5; i++) positions.push([8, i]);
  positions.push([8, 7], [8, 8], [7, 8]);
  for (let i = 5; i >= 0; i--) positions.push([i, 8]);
  // second copy
  const positions2: [number, number][] = [];
  for (let i = 0; i < 7; i++) positions2.push([size - 1 - i, 8]);
  for (let i = 0; i < 8; i++) positions2.push([8, size - 8 + i]);

  for (let i = 0; i < 15; i++) {
    const bit = ((bits >> (14 - i)) & 1) === 1;
    if (i < positions.length) matrix[positions[i][0]][positions[i][1]] = bit;
    if (i < positions2.length) matrix[positions2[i][0]][positions2[i][1]] = bit;
  }
}

function scorePenalty(matrix: boolean[][]): number {
  const size = matrix.length;
  let penalty = 0;
  // Rule 1: runs of same color
  for (let r = 0; r < size; r++) {
    let run = 1;
    for (let c = 1; c < size; c++) {
      if (matrix[r][c] === matrix[r][c - 1]) { run++; } else { if (run >= 5) penalty += run - 2; run = 1; }
    }
    if (run >= 5) penalty += run - 2;
  }
  for (let c = 0; c < size; c++) {
    let run = 1;
    for (let r = 1; r < size; r++) {
      if (matrix[r][c] === matrix[r - 1][c]) { run++; } else { if (run >= 5) penalty += run - 2; run = 1; }
    }
    if (run >= 5) penalty += run - 2;
  }
  // Rule 2: 2x2 blocks
  for (let r = 0; r < size - 1; r++)
    for (let c = 0; c < size - 1; c++) {
      const color = matrix[r][c];
      if (color === matrix[r][c + 1] && color === matrix[r + 1][c] && color === matrix[r + 1][c + 1]) penalty += 3;
    }
  return penalty;
}

export function generateQR(text: string): boolean[][] {
  const data = new TextEncoder().encode(text);
  const version = chooseVersion(data.length);
  const dataBits = makeDataBits(data, version);
  const dataBytes = bitsToBytes(dataBits);
  const codewords = interleave(dataBytes, version);
  const bits = codewords.flatMap(b => { const a: number[] = []; for (let i = 7; i >= 0; i--) a.push((b >> i) & 1); return a; });

  const template = createMatrix(version);
  placeData(template, bits);
  const base = template.map(r => r.map(v => v === true));

  let bestMask = 0;
  let bestScore = Infinity;
  for (let m = 0; m < 8; m++) {
    const candidate = applyMask(base, m);
    applyFormatInfo(candidate, m);
    const score = scorePenalty(candidate);
    if (score < bestScore) { bestScore = score; bestMask = m; }
  }

  const result = applyMask(base, bestMask);
  applyFormatInfo(result, bestMask);
  return result;
}

