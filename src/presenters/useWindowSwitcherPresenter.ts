import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { WindowState } from '../models/types';

export function useWindowSwitcherPresenter(windows: WindowState[], focus: (id: string) => void) {
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const ordered = [...windows].sort((a, b) => b.z - a.z);
  const activeId = ordered.find((window) => !window.minimized)?.id;
  useLayoutEffect(() => {
    if (!expanded) return;
    const panel = panelRef.current;
    (
      panel?.querySelector<HTMLElement>('[aria-current="true"]') ??
      panel?.querySelector<HTMLElement>('[data-window-select]') ??
      panel
    )?.focus();
  }, [expanded]);
  useEffect(() => {
    if (!expanded) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target))
        setExpanded(false);
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setExpanded(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape, true);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape, true);
    };
  }, [expanded]);
  const select = (id: string) => {
    setExpanded(false);
    focus(id);
  };
  const navigate = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = [
      ...(panelRef.current?.querySelectorAll<HTMLElement>('[data-window-select]') ?? []),
    ];
    if (!items.length) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    let next: number;
    if (event.key === 'ArrowDown') next = (index + 1) % items.length;
    else if (event.key === 'ArrowUp') next = (index + items.length - 1) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;
    event.preventDefault();
    items[next].focus();
  };
  return {
    expanded,
    setExpanded,
    rootRef,
    panelRef,
    triggerRef,
    ordered,
    activeId,
    select,
    navigate,
  };
}
