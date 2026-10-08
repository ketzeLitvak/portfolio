import { useEffect, useRef } from 'react';
import type { PointerEvent } from 'react';
import type { WindowState } from '../models/types';
import type { DesktopPresenter } from './useDesktopPresenter';
export function useWindowPresenter(state: WindowState, desktop: DesktopPresenter) {
  const ref = useRef<HTMLElement>(null);
  const { resize } = desktop;
  const drag = useRef<{
    pointer: number;
    x: number;
    y: number;
    left: number;
    top: number;
    width: number;
  } | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || state.maximized || state.minimized || innerWidth <= 650) return;
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.borderBoxSize[0];
      if (box) resize(state.id, Math.round(box.inlineSize), Math.round(box.blockSize));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [state.id, state.maximized, state.minimized, resize]);
  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.button !== 0 ||
      (event.target as HTMLElement).closest('button') ||
      innerWidth <= 650 ||
      state.maximized
    )
      return;
    const width = ref.current?.getBoundingClientRect().width ?? state.width;
    drag.current = {
      pointer: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: state.left,
      top: state.top,
      width,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d?.pointer === event.pointerId)
      desktop.move(state.id, d.left + event.clientX - d.x, d.top + event.clientY - d.y, d.width);
  };
  const endDrag = () => {
    drag.current = null;
  };
  const doubleClick = (event: React.MouseEvent) => {
    if (!(event.target as HTMLElement).closest('button') && innerWidth > 650)
      desktop.maximize(state.id);
  };
  return { ref, startDrag, moveDrag, endDrag, doubleClick };
}
