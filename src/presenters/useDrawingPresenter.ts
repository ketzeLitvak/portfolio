import { useEffect, useReducer, useRef, useState } from 'react';

import type { KeyboardEvent, PointerEvent } from 'react';

import {
  blankDrawing,
  drawPixelLine,
  drawingReducer,
  drawingStorageKey,
  fillPixels,
  initialDrawingHistory,
  insideDrawing,
  readDrawing,
  type DrawingDocument,
  type DrawingSize,
  type DrawingTool,
  type PixelPoint,
} from '../models/drawing';

import { readPreference } from '../models/types';

import { downloadDrawing, drawingPng, renderDrawing } from '../utils/drawingCanvas';

import type { DesktopWallpaperPresenter } from './useDesktopWallpaperPresenter';

export function useDrawingPresenter(wallpaper?: DesktopWallpaperPresenter) {
  const [history, dispatch] = useReducer(drawingReducer, undefined, () =>
    initialDrawingHistory(readDrawing(readPreference(drawingStorageKey, ''))),
  );
  const [tool, setTool] = useState<DrawingTool>('pencil');
  const [color, setColor] = useState('#dc2626');
  const [grid, setGrid] = useState(true);
  const [saved, setSaved] = useState(true);
  const [feedback, setFeedback] = useState<
    'ready' | 'exported' | 'wallpaper' | 'restored' | 'error' | 'new'
  >('ready');
  const [cursor, setCursor] = useState<PixelPoint>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const current = useRef<DrawingDocument>(history.document);
  current.current = history.document;
  const stroke = useRef<{ pointer: number; previous: PixelPoint | null } | null>(null);
  useEffect(() => {
    try {
      localStorage.setItem(drawingStorageKey, JSON.stringify(history.document));
      setSaved(true);
    } catch {
      setSaved(false);
    }
    if (canvasRef.current) renderDrawing(canvasRef.current, history.document, 20, grid, true);
  }, [history.document, grid]);

  const position = (event: PointerEvent<HTMLCanvasElement>): PixelPoint | null => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const point = {
      x: Math.floor(((event.clientX - bounds.left) / bounds.width) * current.current.size),
      y: Math.floor(((event.clientY - bounds.top) / bounds.height) * current.current.size),
    };
    return insideDrawing(current.current, point) ? point : null;
  };

  const paint = (from: PixelPoint, to: PixelPoint) => {
    const next = drawPixelLine(current.current, from, to, tool === 'eraser' ? null : color);
    current.current = next;
    dispatch({ type: 'paint', document: next });
  };

  const single = (point: PixelPoint) => {
    if (tool === 'picker') {
      const picked = current.current.pixels[point.y * current.current.size + point.x];
      if (picked) {
        setColor(picked);
        setTool('pencil');
      }
      return;
    }
    const next =
      tool === 'fill'
        ? fillPixels(current.current, point, color)
        : drawPixelLine(current.current, point, point, tool === 'eraser' ? null : color);
    current.current = next;
    dispatch({ type: 'replace', document: next });
  };

  const pointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.button !== 0 || stroke.current) return;
    const point = position(event);
    if (!point) return;
    event.preventDefault();
    event.currentTarget.focus();
    setCursor(point);
    setFeedback('ready');
    if (tool === 'fill' || tool === 'picker') {
      single(point);
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    stroke.current = { pointer: event.pointerId, previous: point };
    dispatch({ type: 'begin' });
    paint(point, point);
  };

  const pointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const point = position(event);
    if (point) setCursor(point);
    const active = stroke.current;
    if (!active || active.pointer !== event.pointerId) return;
    if (point) paint(active.previous ?? point, point);
    active.previous = point;
  };

  const finishStroke = (event: PointerEvent<HTMLCanvasElement>) => {
    if (stroke.current?.pointer !== event.pointerId) return;
    stroke.current = null;
    dispatch({ type: 'finish' });
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const undo = () => dispatch({ type: 'undo' });

  const redo = () => dispatch({ type: 'redo' });

  const changeSize = (size: DrawingSize) => {
    dispatch({ type: 'replace', document: blankDrawing(size) });
    setCursor({ x: 0, y: 0 });
    setFeedback('new');
  };

  const clear = () => {
    dispatch({ type: 'replace', document: blankDrawing(history.document.size) });
    setFeedback('new');
  };

  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest('input,select,textarea')) return;
    if ((event.ctrlKey || event.metaKey) && ['z', 'y'].includes(event.key.toLowerCase())) {
      event.preventDefault();
      if (event.key.toLowerCase() === 'y' || event.shiftKey) redo();
      else undo();
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const shortcuts: Record<string, DrawingTool> = {
      p: 'pencil',
      e: 'eraser',
      f: 'fill',
      i: 'picker',
    };
    if (shortcuts[event.key.toLowerCase()]) {
      event.preventDefault();
      setTool(shortcuts[event.key.toLowerCase()]);
      return;
    }
    if (event.target !== canvasRef.current) return;
    const directions: Record<string, PixelPoint> = {
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
    };
    const delta = directions[event.key];
    if (delta) {
      event.preventDefault();
      setCursor((point) => ({
        x: Math.max(0, Math.min(history.document.size - 1, point.x + delta.x)),
        y: Math.max(0, Math.min(history.document.size - 1, point.y + delta.y)),
      }));
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      single({
        x: Math.min(cursor.x, history.document.size - 1),
        y: Math.min(cursor.y, history.document.size - 1),
      });
    }
  };

  const exportPng = () => {
    try {
      downloadDrawing(history.document);
      setFeedback('exported');
    } catch {
      setFeedback('error');
    }
  };

  const applyWallpaper = () => {
    try {
      setFeedback(wallpaper?.apply(drawingPng(history.document)) ? 'wallpaper' : 'error');
    } catch {
      setFeedback('error');
    }
  };

  const restoreWallpaper = () => setFeedback(wallpaper?.restore() ? 'restored' : 'error');

  return {
    document: history.document,
    tool,
    setTool,
    color,
    setColor,
    grid,
    setGrid,
    saved,
    feedback,
    cursor,
    canvasRef,
    pointerDown,
    pointerMove,
    finishStroke,
    keyDown,
    undo,
    redo,
    canUndo: history.past.length > 0 && !history.stroke,
    canRedo: history.future.length > 0 && !history.stroke,
    busy: !!history.stroke,
    clear,
    changeSize,
    exportPng,
    applyWallpaper,
    restoreWallpaper,
    hasPixels: history.document.pixels.some(Boolean),
    hasWallpaper: !!wallpaper?.image,
  };
}

export type DrawingPresenter = ReturnType<typeof useDrawingPresenter>;
