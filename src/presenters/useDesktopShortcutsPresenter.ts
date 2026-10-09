import { useEffect, useMemo, useRef, useState } from 'react';

import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';

import { readPreference, savePreference } from '../models/types';

type Positions = Record<string, number>;
type Layout = { columns: number; rows: number; mobile: boolean; iconSize: number };
type Drag = {
  id: string;
  pointer: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
  moved: boolean;
  target: number | null;
};
const storageKey = 'ketze-desktop-shortcuts';

function loadPositions(): { desktop: Positions; mobile: Positions } {
  try {
    const saved = JSON.parse(readPreference(storageKey, '{}'));
    // Older snapshots pinned every automatic slot to the previous grid dimensions.
    // Start those snapshots from the corrected layout; v2 stores only moved icons.
    if (saved?.version !== 2) return { desktop: {}, mobile: {} };

    const valid = (value: unknown): Positions =>
      value && typeof value === 'object'
        ? Object.fromEntries(
            Object.entries(value).filter(([, slot]) => Number.isSafeInteger(slot) && slot >= 0),
          )
        : {};

    return { desktop: valid(saved?.desktop), mobile: valid(saved?.mobile) };
  } catch {
    return { desktop: {}, mobile: {} };
  }
}

function resolvePositions(
  ids: string[],
  saved: Positions,
  layout: Layout,
  basicCount: number,
  projectCount: number,
  experimentCount: number,
): Positions {
  const capacity = layout.columns * layout.rows;
  const result: Positions = {},
    used = new Set<number>();
  for (const id of ids) {
    const slot = saved[id];
    if (slot !== undefined && slot < capacity && !used.has(slot)) {
      result[id] = slot;
      used.add(slot);
    }
  }
  const projectStart = Math.ceil(basicCount / layout.rows) * layout.rows;
  const experienceStart = projectStart + Math.ceil(projectCount / layout.rows) * layout.rows;
  const experimentStart = ids.length - experimentCount;
  const ordered = layout.mobile
    ? ids
    : [...ids.slice(experimentStart), ...ids.slice(0, experimentStart)];
  for (const id of ordered)
    if (result[id] === undefined) {
      const index = ids.indexOf(id);
      const preferred =
        !layout.mobile && index >= experimentStart
          ? Math.max(0, layout.columns - Math.ceil(experimentCount / layout.rows)) * layout.rows +
            index -
            experimentStart
          : layout.mobile || index < basicCount
            ? index
            : index < basicCount + projectCount
              ? projectStart + index - basicCount
              : experienceStart + index - basicCount - projectCount;
      let slot = preferred < capacity && !used.has(preferred) ? preferred : 0;
      while (used.has(slot)) slot++;
      result[id] = slot;
      used.add(slot);
    }
  return result;
}

export function useDesktopShortcutsPresenter(
  ids: string[],
  basicCount: number,
  projectCount: number,
  experimentCount: number,
  open: (id: string) => void,
) {
  const gridRef = useRef<HTMLElement>(null);
  const [layout, setLayout] = useState<Layout>({
    columns: 12,
    rows: 1,
    mobile: false,
    iconSize: 48,
  });
  const [saved, setSaved] = useState(loadPositions);
  const [drag, setDrag] = useState<Drag | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const suppressClick = useRef<string | null>(null);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const measure = () => {
      const css = getComputedStyle(grid);
      const mobile = innerWidth <= 650;
      const width = grid.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight);
      const height = grid.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom);
      const next = {
        iconSize: 48,
        columns: mobile
          ? 3
          : Math.max(
              1,
              Math.floor((width + parseFloat(css.columnGap)) / (88 + parseFloat(css.columnGap))),
            ),
        rows: mobile
          ? 1
          : Math.max(
              1,
              Math.floor((height + parseFloat(css.rowGap)) / (76 + parseFloat(css.rowGap))),
            ),
        mobile,
      };
      next.rows = Math.max(next.rows, Math.ceil(ids.length / next.columns));
      const rowHeight = (height - (next.rows - 1) * parseFloat(css.rowGap)) / next.rows;
      next.iconSize = mobile ? 48 : Math.min(48, Math.max(18, Math.floor(rowHeight - 32)));
      setLayout((previous) =>
        previous.columns === next.columns &&
        previous.rows === next.rows &&
        previous.mobile === next.mobile &&
        previous.iconSize === next.iconSize
          ? previous
          : next,
      );
      dragRef.current = null;
      setDrag(null);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [ids.length, experimentCount]);
  useEffect(() => {
    savePreference(storageKey, JSON.stringify({ version: 2, ...saved }));
  }, [saved]);
  const mode = layout.mobile ? 'mobile' : 'desktop';
  const positions = useMemo(
    () => resolvePositions(ids, saved[mode], layout, basicCount, projectCount, experimentCount),
    [ids, saved, mode, layout, basicCount, projectCount, experimentCount],
  );

  const cellStyle = (slot: number): CSSProperties => ({
    gridColumn: layout.mobile ? (slot % layout.columns) + 1 : Math.floor(slot / layout.rows) + 1,
    gridRow: layout.mobile ? Math.floor(slot / layout.columns) + 1 : (slot % layout.rows) + 1,
  });

  const targetAt = (x: number, y: number): number | null => {
    const grid = gridRef.current;
    if (!grid) return null;
    const rect = grid.getBoundingClientRect(),
      css = getComputedStyle(grid);
    const left = rect.left + parseFloat(css.paddingLeft),
      top = rect.top + parseFloat(css.paddingTop);
    const widths = css.gridTemplateColumns.split(' ').map(parseFloat),
      heights = css.gridTemplateRows.split(' ').map(parseFloat);
    const gapX = parseFloat(css.columnGap),
      gapY = parseFloat(css.rowGap);

    const track = (coordinate: number, sizes: number[], gap: number) => {
      let start = 0;
      for (let i = 0; i < sizes.length; i++) {
        if (coordinate >= start && coordinate < start + sizes[i] + gap / 2) return i;
        start += sizes[i] + gap;
      }
      return -1;
    };

    const column = track(x - left, widths, gapX),
      row = track(y - top + grid.scrollTop, heights, gapY);
    if (column < 0 || row < 0) return null;
    return layout.mobile ? row * layout.columns + column : column * layout.rows + row;
  };

  const finish = (event: ReactPointerEvent<HTMLButtonElement>, cancelled = false) => {
    const current = dragRef.current;
    if (!current || current.pointer !== event.pointerId) return;
    if (current.moved) {
      suppressClick.current = current.id;
      if (!cancelled && current.target !== null) {
        const next = { ...saved[mode] },
          previous = positions[current.id];
        const occupant = ids.find((id) => id !== current.id && positions[id] === current.target);
        if (occupant) next[occupant] = previous;
        next[current.id] = current.target;
        setSaved((value) => ({ ...value, [mode]: next }));
      }
    }
    dragRef.current = null;
    setDrag(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const buttonProps = (id: string) => ({
    style: {
      ...cellStyle(positions[id]),
      ...(drag?.id === id && drag.moved
        ? { transform: `translate(${drag.dx}px, ${drag.dy}px)`, zIndex: 5 }
        : {}),
    },
    'data-dragging': drag?.id === id && drag.moved ? 'true' : undefined,
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0 || dragRef.current) return;
      suppressClick.current = null;
      const next: Drag = {
        id,
        pointer: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        dx: 0,
        dy: 0,
        moved: false,
        target: positions[id],
      };
      dragRef.current = next;
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => {
      const current = dragRef.current;
      if (!current || current.pointer !== event.pointerId) return;
      const dx = event.clientX - current.startX,
        dy = event.clientY - current.startY;
      const moved = current.moved || Math.hypot(dx, dy) > 6;
      const next = { ...current, dx, dy, moved, target: targetAt(event.clientX, event.clientY) };
      dragRef.current = next;
      if (moved) setDrag(next);
    },
    onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => finish(event),
    onPointerCancel: (event: ReactPointerEvent<HTMLButtonElement>) => finish(event, true),
    onLostPointerCapture: () => {
      dragRef.current = null;
      setDrag(null);
    },
    onClick: () => {
      if (suppressClick.current === id) {
        suppressClick.current = null;
        return;
      }
      open(id);
    },
  });

  const reset = () => setSaved((value) => ({ ...value, [mode]: {} }));

  return {
    reset,
    gridRef,
    gridStyle: {
      gridTemplateRows: `repeat(${layout.rows}, ${layout.mobile ? '90px' : 'minmax(0, 1fr)'})`,
      gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
      '--shortcut-size': `${layout.iconSize}px`,
    } as CSSProperties,
    buttonProps,
    dropStyle: drag?.moved && drag.target !== null ? cellStyle(drag.target) : null,
  };
}
