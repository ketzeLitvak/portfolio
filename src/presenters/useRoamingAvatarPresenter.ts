import { useEffect, useRef } from 'react';

export function useRoamingAvatarPresenter() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current, parent = element?.parentElement;
    if (!element || !parent) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, last = 0, turnAt = 0;
    let x = 0, y = 0, vx = 0, vy = 0;
    const bounds = () => ({ width: Math.max(0, parent.clientWidth - element.offsetWidth), height: Math.max(0, parent.clientHeight - element.offsetHeight - 105) });
    const direction = () => { const angle = Math.random() * Math.PI * 2, speed = 18 + Math.random() * 14; vx = Math.cos(angle) * speed; vy = Math.sin(angle) * speed; };
    const initial = bounds(); x = Math.random() * initial.width; y = Math.random() * initial.height; direction();
    const paint = () => { element.style.transform = `translate3d(${x}px, ${y}px, 0)`; };
    const tick = (time: number) => {
      const delta = last ? Math.min((time - last) / 1000, .05) : 0; last = time;
      if (time >= turnAt) { direction(); turnAt = time + 4000 + Math.random() * 5000; }
      const area = bounds(); x += vx * delta; y += vy * delta;
      if (x < 0 || x > area.width) { vx *= -1; x = Math.max(0, Math.min(area.width, x)); }
      if (y < 0 || y > area.height) { vy *= -1; y = Math.max(0, Math.min(area.height, y)); }
      paint(); frame = requestAnimationFrame(tick);
    };
    const start = () => { cancelAnimationFrame(frame); last = 0; if (!media.matches) frame = requestAnimationFrame(tick); };
    const resize = () => { const area = bounds(); x = Math.min(x, area.width); y = Math.min(y, area.height); paint(); };
    paint(); start(); media.addEventListener('change', start); window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); media.removeEventListener('change', start); window.removeEventListener('resize', resize); };
  }, []);
  return { ref };
}
