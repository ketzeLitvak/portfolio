import assert from 'node:assert/strict';
import test from 'node:test';
import {
  blankDrawing,
  drawPixelLine,
  fillPixels,
  drawingReducer,
  initialDrawingHistory,
  readDrawing,
  resizeDrawing,
  serializeDrawing,
} from '../src/models/drawing.ts';

test('continuous strokes interpolate skipped pointer positions and undo as one operation', () => {
  const blank = blankDrawing();
  let history = initialDrawingHistory(blank);
  history = drawingReducer(history, { type: 'begin' });
  const first = drawPixelLine(history.document, { x: 0, y: 0 }, { x: 5, y: 5 }, '#dc2626');
  history = drawingReducer(history, { type: 'paint', document: first });
  const second = drawPixelLine(history.document, { x: 5, y: 5 }, { x: 15, y: 5 }, '#dc2626');
  history = drawingReducer(history, { type: 'paint', document: second });
  history = drawingReducer(history, { type: 'finish' });
  for (let index = 0; index <= 5; index++)
    assert.equal(history.document.pixels[index * 16 + index], '#dc2626');
  for (let x = 5; x < 16; x++) assert.equal(history.document.pixels[5 * 16 + x], '#dc2626');
  assert.equal(history.past.length, 1);
  history = drawingReducer(history, { type: 'undo' });
  assert.deepEqual(history.document, blank);
  history = drawingReducer(history, { type: 'redo' });
  assert.deepEqual(history.document, second);
  assert.ok(blank.pixels.every((pixel) => pixel === null));
});

test('fill respects four-connected boundaries and never wraps between rows', () => {
  const wall = drawPixelLine(blankDrawing(), { x: 7, y: 0 }, { x: 7, y: 15 }, '#353531');
  const filled = fillPixels(wall, { x: 0, y: 0 }, '#dc2626');
  for (let y = 0; y < 16; y++) {
    assert.equal(filled.pixels[y * 16 + 6], '#dc2626');
    assert.equal(filled.pixels[y * 16 + 7], '#353531');
    assert.equal(filled.pixels[y * 16 + 8], null);
  }
  assert.equal(fillPixels(filled, { x: 0, y: 0 }, '#dc2626'), filled);
  assert.equal(fillPixels(filled, { x: -1, y: 0 }, '#ffffff'), filled);
  const erased = fillPixels(filled, { x: 0, y: 0 }, null);
  assert.deepEqual(erased, wall);
});

test('new canvas is reversible and editing after undo discards the redo branch', () => {
  const drawing = drawPixelLine(blankDrawing(), { x: 2, y: 3 }, { x: 2, y: 3 }, '#388697');
  let history = drawingReducer(initialDrawingHistory(drawing), {
    type: 'replace',
    document: blankDrawing(32),
  });
  history = drawingReducer(history, { type: 'undo' });
  assert.deepEqual(history.document, drawing);
  history = drawingReducer(history, {
    type: 'replace',
    document: drawPixelLine(drawing, { x: 4, y: 4 }, { x: 4, y: 4 }, '#ffffff'),
  });
  assert.equal(history.future.length, 0);
  const state = drawingReducer(history, { type: 'redo' });
  assert.equal(state, history);
});

test('storage accepts valid canvases and rejects invalid sizes, colors or pixel counts', () => {
  const drawing = drawPixelLine(blankDrawing(32), { x: 31, y: 31 }, { x: 31, y: 31 }, '#dc2626');
  assert.deepEqual(readDrawing(JSON.stringify(drawing)), drawing);
  for (const value of [
    null,
    'bad JSON',
    JSON.stringify({ size: 99, pixels: [] }),
    JSON.stringify({ ...drawing, pixels: [] }),
    JSON.stringify({ ...drawing, pixels: Array(1024).fill('url(https://invalid)') }),
  ])
    assert.deepEqual(readDrawing(value), blankDrawing());
});

test('custom 1024 canvas resizes without losing pixels and compresses large empty regions', () => {
  const small = drawPixelLine(blankDrawing(), { x: 15, y: 15 }, { x: 15, y: 15 }, '#dc2626');
  const large = resizeDrawing(small, 1024);
  assert.equal(large.pixels.length, 1024 * 1024);
  assert.equal(large.pixels[15 * 1024 + 15], '#dc2626');
  const encoded = serializeDrawing(large);
  assert.ok(encoded.length < 1000);
  assert.deepEqual(readDrawing(encoded), large);
  const cropped = resizeDrawing(large, 37);
  assert.equal(cropped.pixels[15 * 37 + 15], '#dc2626');
  assert.equal(resizeDrawing(large, 1025), large);
  assert.equal(resizeDrawing(large, 1.5), large);
  assert.deepEqual(
    readDrawing(JSON.stringify({ version: 2, size: 1024, runs: [[1048577, null]] })),
    blankDrawing(),
  );
});
