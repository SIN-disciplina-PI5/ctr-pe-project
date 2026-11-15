import { useMemo } from "react";
import Svg, { Rect } from "react-native-svg";

interface QrCodeSvgProps {
  value: string;
  size?: number;
}

const GRID_SIZE = 25;

function buildQrMatrix(payload: string): number[][] {
  const matrix: number[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => 0),
  );
  const reserved: boolean[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => false),
  );

  const placeFinder = (rowOffset: number, colOffset: number) => {
    for (let r = -1; r <= 7; r += 1) {
      for (let c = -1; c <= 7; c += 1) {
        const rr = rowOffset + r;
        const cc = colOffset + c;
        if (rr < 0 || rr >= GRID_SIZE || cc < 0 || cc >= GRID_SIZE) continue;
        reserved[rr]![cc] = true;
        const isBorder = r === -1 || r === 7 || c === -1 || c === 7;
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[rr]![cc] = !isBorder && (isOuter || isInner) ? 1 : 0;
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, GRID_SIZE - 7);
  placeFinder(GRID_SIZE - 7, 0);

  for (let i = 8; i < GRID_SIZE - 8; i += 1) {
    reserved[6]![i] = true;
    reserved[i]![6] = true;
    matrix[6]![i] = i % 2 === 0 ? 1 : 0;
    matrix[i]![6] = i % 2 === 0 ? 1 : 0;
  }

  let hash = 2166136261;
  const bytes: number[] = [];
  for (let i = 0; i < payload.length; i += 1) {
    const code = payload.charCodeAt(i);
    bytes.push(code & 0xff);
    hash ^= code;
    hash = Math.imul(hash, 16777619);
  }
  if (bytes.length === 0) bytes.push(0);

  let bitIndex = 0;
  for (let r = 0; r < GRID_SIZE; r += 1) {
    for (let c = 0; c < GRID_SIZE; c += 1) {
      if (reserved[r]![c]) continue;
      const byte = bytes[bitIndex % bytes.length] ?? 0;
      const shift = bitIndex % 8;
      const mixed = ((byte >> shift) ^ ((hash >> (bitIndex % 24)) & 1) ^ ((r + c) & 1)) & 1;
      matrix[r]![c] = mixed;
      bitIndex += 1;
    }
  }

  return matrix;
}

export function QrCodeSvg({ value, size = 160 }: QrCodeSvgProps) {
  const matrix = useMemo(() => buildQrMatrix(value), [value]);
  const cellSize = size / (GRID_SIZE + 2);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect x={0} y={0} width={size} height={size} fill="#FFFFFF" rx={8} />
      {matrix.map((row, rIdx) =>
        row.map((cell, cIdx) =>
          cell === 1 ? (
            <Rect
              key={`${rIdx}-${cIdx}`}
              x={(cIdx + 1) * cellSize}
              y={(rIdx + 1) * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#0F172A"
            />
          ) : null,
        ),
      )}
    </Svg>
  );
}
