import { useEffect, useId, useRef, useState } from 'react';
export function useExperimentPopoverPresenter() {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ left: number; top: number; width: number } | null>(
    null,
  );
  const close = () => setPosition(null);
  const toggle = () => {
    if (position) return close();
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(340, innerWidth - 24);
    const height = Math.min(410, innerHeight - 24);
    setPosition({
      width,
      left: Math.max(12, Math.min(rect.left, innerWidth - width - 12)),
      top: Math.max(12, Math.min(rect.bottom + 8, innerHeight - height - 12)),
    });
  };
  useEffect(() => {
    if (!position) return;
    const frame = requestAnimationFrame(() =>
      panelRef.current
        ?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]')
        ?.focus({ preventScroll: true }),
    );
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target))
        setPosition(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      setPosition(null);
      triggerRef.current?.focus();
    };
    const reposition = () => setPosition(null);
    const scroll = (event: Event) => {
      if (!panelRef.current?.contains(event.target as Node)) setPosition(null);
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape, true);
    document.addEventListener('wheel', scroll, { passive: true });
    document.addEventListener('touchmove', scroll, { passive: true });
    window.addEventListener('resize', reposition);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape, true);
      document.removeEventListener('wheel', scroll);
      document.removeEventListener('touchmove', scroll);
      window.removeEventListener('resize', reposition);
    };
  }, [position]);
  return { id, triggerRef, panelRef, position, toggle, close };
}
