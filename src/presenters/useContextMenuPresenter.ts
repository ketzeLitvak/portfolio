import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { MouseEvent, KeyboardEvent } from 'react';

import type { LucideIcon } from 'lucide-react';

export interface ContextMenuAction {
  label: string;
  icon: LucideIcon;
  run?: () => void;
  href?: string;
  disabled?: boolean;
}
interface ContextMenuState {
  title: string;
  x: number;
  y: number;
  actions: ContextMenuAction[];
}

export function useContextMenuPresenter() {
  const [menu, setMenu] = useState<ContextMenuState | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const origin = useRef<HTMLElement | null>(null);
  const dismiss = useCallback(() => {
    setMenu(null);
    origin.current?.focus({ preventScroll: true });
  }, []);

  const show = (event: MouseEvent, title: string, actions: ContextMenuAction[]) => {
    event.preventDefault();
    const element = event.target instanceof Element ? event.target : null;
    origin.current = element?.closest<HTMLElement>('button, [data-app], main') ?? null;
    const bounds = origin.current?.getBoundingClientRect();
    setMenu({
      title,
      actions,
      x: event.clientX || bounds?.left || 8,
      y: event.clientY || bounds?.top || 8,
    });
  };

  useLayoutEffect(() => {
    const element = ref.current;
    if (!menu || !element) return;
    const bounds = element.getBoundingClientRect();
    element.style.left = `${Math.max(8, Math.min(menu.x, innerWidth - bounds.width - 8))}px`;
    element.style.top = `${Math.max(8, Math.min(menu.y, innerHeight - bounds.height - 8))}px`;
    element.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)')?.focus();
  }, [menu]);
  useEffect(() => {
    if (!menu) return;

    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !ref.current?.contains(event.target)) setMenu(null);
    };

    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      dismiss();
    };

    const resize = () => setMenu(null);

    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape, true);
    window.addEventListener('resize', resize);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape, true);
      window.removeEventListener('resize', resize);
    };
  }, [menu, dismiss]);

  const navigate = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      dismiss();
      return;
    }
    const items = [
      ...(ref.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') ?? []),
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

  return { menu, ref, show, dismiss, navigate };
}

export type ContextMenuPresenter = ReturnType<typeof useContextMenuPresenter>;
