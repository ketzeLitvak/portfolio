import { useCallback, useEffect, useRef } from 'react';

import type { KeyboardEvent, PointerEvent } from 'react';

import type { AvatarPosition } from '../models/avatars';

export function useDraggableAvatarPresenter(
  position: AvatarPosition,
  savePosition: (position: AvatarPosition) => void,
) {
  const ref = useRef<HTMLDivElement>(null);
  const current = useRef({ x: 0, y: 0 });
  const drag = useRef<{ pointer: number; x: number; y: number; left: number; top: number } | null>(
    null,
  );
  const bounds = useCallback(() => {
    const element = ref.current,
      parent = element?.parentElement;
    return {
      width: Math.max(0, (parent?.clientWidth ?? 0) - (element?.offsetWidth ?? 0)),
      height: Math.max(0, (parent?.clientHeight ?? 0) - (element?.offsetHeight ?? 0) - 105),
    };
  }, []);
  const paint = useCallback(
    (x: number, y: number) => {
      const area = bounds();
      current.current = {
        x: Math.max(0, Math.min(area.width, x)),
        y: Math.max(0, Math.min(area.height, y)),
      };
      if (ref.current)
        ref.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
    },
    [bounds],
  );
  useEffect(() => {
    const update = () => {
      const area = bounds();
      paint(position.x * area.width, position.y * area.height);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [position.x, position.y, bounds, paint]);

  const commit = () => {
    const area = bounds();
    savePosition({
      x: area.width ? current.current.x / area.width : 0,
      y: area.height ? current.current.y / area.height : 0,
    });
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as Element).closest('button')) return;
    drag.current = {
      pointer: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: current.current.x,
      top: current.current.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus({ preventScroll: true });
    event.preventDefault();
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d?.pointer === event.pointerId)
      paint(d.left + event.clientX - d.x, d.top + event.clientY - d.y);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointer !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    commit();
  };

  const moveWithKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const offsets: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const offset = offsets[event.key];
    if (!offset) return;
    event.preventDefault();
    const step = event.shiftKey ? 30 : 10;
    paint(current.current.x + offset[0] * step, current.current.y + offset[1] * step);
    commit();
  };

  return { ref, startDrag, moveDrag, endDrag, moveWithKeyboard };
}
