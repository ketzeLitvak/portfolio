import { useSavedAvatarsPresenter } from './useSavedAvatarsPresenter';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Language, Theme, WindowState, AppOpenOptions } from '../models/types';
import { readPreference, savePreference } from '../models/types';
export function useDesktopPresenter() {
  const avatars = useSavedAvatarsPresenter();
  const [activeMenu, setActiveMenu] = useState<'language' | 'theme' | null>(null);
  useEffect(() => { const outside = (event: PointerEvent) => { if (event.target instanceof Element && !event.target.closest('.system-option')) setActiveMenu(null); }; document.addEventListener('pointerdown', outside); return () => document.removeEventListener('pointerdown', outside); }, []);
  const [language, setLanguage] = useState<Language>(() => readPreference('portfolio-language', 'en') === 'es' ? 'es' : 'en');
  const [theme, setTheme] = useState<Theme>(() => { const saved = readPreference('portfolio-theme', 'dark'); return saved === 'light' || saved === 'auto' ? saved : 'dark'; });
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const dark = theme === 'auto' ? systemDark : theme === 'dark';
  useEffect(() => { const media = window.matchMedia('(prefers-color-scheme: dark)'); const update = () => setSystemDark(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []);
  const initialWindows = () => window.innerWidth <= 650 ? [] : [
    { id: 'projects', left: window.innerWidth > 1100 ? window.innerWidth - 425 : 150, top: 155, width: 370, height: 495, z: 11, minimized: false, maximized: false },
    { id: 'welcome', left: window.innerWidth > 1100 ? 220 : 150, top: 62, width: 560, height: 445, z: 12, minimized: false, maximized: false }
  ];
  const [windows, setWindows] = useState<WindowState[]>(initialWindows);
  const z = useRef(12);
  const [clock, setClock] = useState('');
  useEffect(() => { document.documentElement.lang = language; savePreference('portfolio-language', language); }, [language]);
  useEffect(() => { document.body.classList.toggle('dark', dark); }, [dark]);
  useEffect(() => { savePreference('portfolio-theme', theme); }, [theme]);
  useEffect(() => { const update = () => setClock(new Intl.DateTimeFormat(language === 'es' ? 'es-AR' : 'en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())); update(); const timer = setInterval(update, 30000); return () => clearInterval(timer); }, [language]);
  const focus = useCallback((id: string) => { const nextZ = ++z.current; setWindows(previous => previous.map(w => w.id === id ? { ...w, minimized: false, z: nextZ } : w)); }, []);
  const open = useCallback((id: string, options?: AppOpenOptions) => { const nextZ = ++z.current; const target = id === 'experience' && options?.experience ? { experienceTarget: { id: options.experience, revision: nextZ } } : {}; setWindows(previous => {
    if (previous.some(w => w.id === id)) return previous.map(w => w.id === id ? { ...w, ...target, minimized: false, z: nextZ } : w);
    const count = previous.length; let left = Math.min(190 + count * 34, Math.max(150, innerWidth - 690)); let top = Math.min(35 + count * 24, innerHeight - 260); let width = 660; let height = 510;
    if (id === 'welcome') { left = innerWidth > 1100 ? 220 : 150; top = 62; width = 560; height = 445; }
    if (id === 'projects') { width = 370; height = 495; if (innerWidth > 1100) { left = innerWidth - 425; top = 155; } }
    return [...previous, { id, left, top, width, height, z: nextZ, minimized: false, maximized: false, ...target }];
  }); }, []);
  const close = useCallback((id: string) => setWindows(previous => previous.filter(w => w.id !== id)), []);
  const minimize = useCallback((id: string) => setWindows(previous => previous.map(w => w.id === id ? { ...w, minimized: true } : w)), []);
  const maximize = useCallback((id: string) => setWindows(previous => previous.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w)), []);
  const move = useCallback((id: string, left: number, top: number, width: number) => setWindows(previous => previous.map(w => w.id === id ? { ...w, left: Math.max(0, Math.min(innerWidth - width, left)), top: Math.max(0, Math.min(innerHeight - 190, top)) } : w)), []);
  const resize = useCallback((id: string, width: number, height: number) => setWindows(previous => previous.map(w => w.id === id && !w.maximized && (w.width !== width || w.height !== height) ? { ...w, width, height } : w)), []);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key !== 'Escape') return; if (activeMenu) { setActiveMenu(null); return; } const top = windows.filter(w => !w.minimized).sort((a, b) => b.z - a.z)[0]; if (top) close(top.id); }; document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey); }, [windows, close, activeMenu]);
  return { avatars, activeMenu, setActiveMenu, language, theme, dark, setLanguage, setTheme, clock, windows, focus, open, close, minimize, maximize, move, resize };
}
export type DesktopPresenter = ReturnType<typeof useDesktopPresenter>;
