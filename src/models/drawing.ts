export type PixelColor = string | null;
export type DrawingSize = number;
export type DrawingTool = 'pencil' | 'eraser' | 'fill' | 'picker' | 'pan';
export interface PixelPoint {
  x: number;
  y: number;
}
export interface DrawingDocument {
  size: DrawingSize;
  pixels: PixelColor[];
}
export interface DrawingHistory {
  document: DrawingDocument;
  past: DrawingDocument[];
  future: DrawingDocument[];
  stroke: DrawingDocument | null;
}
export const drawingStorageKey = 'ketze-pixel-drawing';
export const drawingPalette = [
  '#dc2626',
  '#f59e0b',
  '#facc15',
  '#34b584',
  '#388697',
  '#6667c4',
  '#d976b2',
  '#353531',
  '#ffffff',
  '#9ca3af',
];

export function blankDrawing(size: DrawingSize = 16): DrawingDocument {
  return { size, pixels: Array<PixelColor>(size * size).fill(null) };
}

export function validDrawingSize(size: number): boolean {
  return Number.isInteger(size) && size >= 1 && size <= 1024;
}

export function serializeDrawing(document: DrawingDocument): string {
  const runs: [number, PixelColor][] = [];
  for (const pixel of document.pixels) {
    const last = runs.at(-1);
    if (last && last[1] === pixel) last[0]++;
    else runs.push([1, pixel]);
  }
  return JSON.stringify({ version: 2, size: document.size, runs });
}

export function readDrawing(value: string | null): DrawingDocument {
  try {
    const parsed = JSON.parse(value ?? 'null');
    if (!validDrawingSize(parsed?.size)) return blankDrawing();

    const validColor = (pixel: unknown) =>
      pixel === null || (typeof pixel === 'string' && /^#[0-9a-f]{6}$/i.test(pixel));

    if (
      Array.isArray(parsed.pixels) &&
      parsed.pixels.length === parsed.size ** 2 &&
      parsed.pixels.every(validColor)
    )
      return { size: parsed.size, pixels: parsed.pixels };
    if (
      parsed.version === 2 &&
      Array.isArray(parsed.runs) &&
      parsed.runs.length <= parsed.size ** 2
    ) {
      const pixels: PixelColor[] = [];
      for (const run of parsed.runs) {
        if (
          !Array.isArray(run) ||
          run.length !== 2 ||
          !Number.isInteger(run[0]) ||
          run[0] < 1 ||
          pixels.length + run[0] > parsed.size ** 2 ||
          !validColor(run[1])
        )
          return blankDrawing();
        for (let index = 0; index < run[0]; index++) pixels.push(run[1]);
      }
      if (pixels.length === parsed.size ** 2) return { size: parsed.size, pixels };
    }
  } catch {
    /* Invalid stored data starts a fresh canvas. */
  }
  return blankDrawing();
}

export function resizeDrawing(document: DrawingDocument, size: DrawingSize): DrawingDocument {
  if (!validDrawingSize(size) || size === document.size) return document;
  const next = blankDrawing(size),
    edge = Math.min(size, document.size);
  for (let y = 0; y < edge; y++)
    for (let x = 0; x < edge; x++)
      next.pixels[y * size + x] = document.pixels[y * document.size + x];
  return next;
}

function retainHistory(documents: DrawingDocument[]): DrawingDocument[] {
  let pixels = 0;
  const kept: DrawingDocument[] = [];
  for (let index = documents.length - 1; index >= 0 && kept.length < 40; index--) {
    pixels += documents[index].pixels.length;
    if (pixels > 8_388_608) break;
    kept.unshift(documents[index]);
  }
  return kept;
}

export function insideDrawing(document: DrawingDocument, point: PixelPoint): boolean {
  return (
    Number.isInteger(point.x) &&
    Number.isInteger(point.y) &&
    point.x >= 0 &&
    point.y >= 0 &&
    point.x < document.size &&
    point.y < document.size
  );
}

export function drawPixelLine(
  document: DrawingDocument,
  from: PixelPoint,
  to: PixelPoint,
  color: PixelColor,
): DrawingDocument {
  if (!insideDrawing(document, from) || !insideDrawing(document, to)) return document;
  const pixels = [...document.pixels];
  let x = from.x,
    y = from.y;
  const dx = Math.abs(to.x - x),
    dy = -Math.abs(to.y - y);
  const sx = x < to.x ? 1 : -1,
    sy = y < to.y ? 1 : -1;
  let error = dx + dy;
  while (true) {
    pixels[y * document.size + x] = color;
    if (x === to.x && y === to.y) break;
    const twice = 2 * error;
    if (twice >= dy) {
      error += dy;
      x += sx;
    }
    if (twice <= dx) {
      error += dx;
      y += sy;
    }
  }
  return { ...document, pixels };
}

export function fillPixels(
  document: DrawingDocument,
  point: PixelPoint,
  color: PixelColor,
): DrawingDocument {
  if (!insideDrawing(document, point)) return document;
  const start = point.y * document.size + point.x,
    original = document.pixels[start];
  if (original === color) return document;
  const pixels = [...document.pixels],
    queue = [start];
  pixels[start] = color;
  for (let index = 0; index < queue.length; index++) {
    const slot = queue[index],
      x = slot % document.size,
      y = Math.floor(slot / document.size);
    const neighbors = [
      x > 0 ? slot - 1 : -1,
      x < document.size - 1 ? slot + 1 : -1,
      y > 0 ? slot - document.size : -1,
      y < document.size - 1 ? slot + document.size : -1,
    ];
    for (const next of neighbors)
      if (next >= 0 && pixels[next] === original) {
        pixels[next] = color;
        queue.push(next);
      }
  }
  return { ...document, pixels };
}

export function sameDrawing(a: DrawingDocument, b: DrawingDocument): boolean {
  return a.size === b.size && a.pixels.every((pixel, index) => pixel === b.pixels[index]);
}

export type DrawingAction =
  | { type: 'begin' }
  | { type: 'paint'; document: DrawingDocument }
  | { type: 'finish' }
  | { type: 'replace'; document: DrawingDocument }
  | { type: 'undo' }
  | { type: 'redo' };

export function initialDrawingHistory(document: DrawingDocument): DrawingHistory {
  return { document, past: [], future: [], stroke: null };
}

export function drawingReducer(state: DrawingHistory, action: DrawingAction): DrawingHistory {
  switch (action.type) {
    case 'begin':
      return state.stroke ? state : { ...state, stroke: state.document };
    case 'paint':
      return { ...state, document: action.document };
    case 'finish': {
      if (!state.stroke) return state;
      if (sameDrawing(state.stroke, state.document)) return { ...state, stroke: null };
      return {
        ...state,
        past: retainHistory([...state.past, state.stroke]),
        future: [],
        stroke: null,
      };
    }
    case 'replace':
      return sameDrawing(state.document, action.document)
        ? state
        : {
            document: action.document,
            past: retainHistory([...state.past, state.document]),
            future: [],
            stroke: null,
          };
    case 'undo':
      return !state.past.length || state.stroke
        ? state
        : {
            document: state.past.at(-1)!,
            past: state.past.slice(0, -1),
            future: [state.document, ...state.future],
            stroke: null,
          };
    case 'redo':
      return !state.future.length || state.stroke
        ? state
        : {
            document: state.future[0],
            past: retainHistory([...state.past, state.document]),
            future: state.future.slice(1),
            stroke: null,
          };
  }
}
