import { ShareLinkFeedback } from '../components/ShareLinkFeedback';
import { findDesktopExperience } from '../models/desktopShortcuts';
import {
  ArrowUpRight,
  ExternalLink,
  RotateCcw,
  Search,
  Minus,
  Square,
  Copy,
  X,
  PanelTop,
  Link2,
} from 'lucide-react';
import type { MouseEvent } from 'react';
import { appRegistry } from '../models/appRegistry';
import { projects } from '../models/projects';
import { DesktopContextMenu } from '../components/DesktopContextMenu';
import { LayoutGrid, Sun, Moon, Monitor, Languages, Check } from 'lucide-react';
import { translate } from '../models/types';
import { launcherApps } from '../models/appRegistry';
import { DesktopShortcuts } from '../components/DesktopShortcuts';
import type { DesktopPresenter } from '../presenters/useDesktopPresenter';
import { DesktopAvatars } from '../components/DesktopAvatars';
import { DesktopWindow } from '../components/DesktopWindow';
export function DesktopView({ presenter: p }: { presenter: DesktopPresenter }) {
  const t = (en: string, es: string) => translate(p.language, [en, es]);
  const topZ = Math.max(0, ...p.windows.filter((w) => !w.minimized).map((w) => w.z));
  const contextMenu = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof Element)) return;
    const target = event.target;
    if (target.closest('.desktop-context-menu')) return;
    const icon = target.closest<HTMLElement>('[data-open]');
    const windowElement = target.closest<HTMLElement>('[data-app]');
    if (windowElement) {
      if (target.closest('input, textarea, select, a, [contenteditable="true"]')) return;
      const id = windowElement.dataset.app!;
      const state = p.windows.find((window) => window.id === id);
      if (!state) return;
      p.contextMenu.show(event, translate(p.language, appRegistry[id].title), [
        {
          label: t('Copy link', 'Copiar enlace'),
          icon: Link2,
          run: () => {
            void p.share.copy(
              id,
              id === 'experience'
                ? { experience: state.experienceTarget?.id ?? 'geopagos' }
                : undefined,
            );
          },
        },
        { label: t('Bring to front', 'Traer al frente'), icon: PanelTop, run: () => p.focus(id) },
        { label: t('Minimize', 'Minimizar'), icon: Minus, run: () => p.minimize(id) },
        {
          label: state.maximized
            ? t('Restore size', 'Restaurar tamaño')
            : t('Maximize', 'Maximizar'),
          icon: state.maximized ? Copy : Square,
          run: () => p.maximize(id),
          disabled: innerWidth <= 650,
        },
        { label: t('Close window', 'Cerrar ventana'), icon: X, run: () => p.close(id) },
      ]);
    } else if (icon) {
      const id = icon.dataset.open!;
      const experience = findDesktopExperience(id);
      if (!experience && !appRegistry[id]) return;
      const title = translate(p.language, experience?.organization ?? appRegistry[id].title);
      const actions = [
        { label: t('Open', 'Abrir'), icon: ArrowUpRight, run: () => p.openShortcut(id) },
        {
          label: t('Copy link', 'Copiar enlace'),
          icon: Link2,
          run: () => {
            void p.share.copy(
              experience ? 'experience' : id,
              experience ? { experience: experience.experience } : undefined,
            );
          },
        },
      ];
      const project = projects[id];
      if (project?.url)
        p.contextMenu.show(event, title, [
          ...actions,
          { label: t('Visit project', 'Visitar proyecto'), icon: ExternalLink, href: project.url },
          ...(p.windows.some((window) => window.id === id)
            ? [{ label: t('Close window', 'Cerrar ventana'), icon: X, run: () => p.close(id) }]
            : []),
        ]);
      else p.contextMenu.show(event, title, actions);
    } else if (target.closest('main') && !target.closest('.desktop-avatar')) {
      p.contextMenu.show(event, t('Desktop', 'Escritorio'), [
        { label: t('Search', 'Buscar'), icon: Search, run: () => p.open('search') },
        { label: t('Quick view', 'Vista rápida'), icon: LayoutGrid, run: () => p.open('quick') },
        {
          label: t('Restore icon layout', 'Restaurar distribución de iconos'),
          icon: RotateCcw,
          run: p.shortcuts.reset,
        },
        {
          label: t('Minimize all windows', 'Minimizar todas las ventanas'),
          icon: Minus,
          run: p.minimizeAll,
          disabled: !p.windows.some((window) => !window.minimized),
        },
        {
          label: t('Close all windows', 'Cerrar todas las ventanas'),
          icon: X,
          run: p.closeAll,
          disabled: !p.windows.length,
        },
      ]);
    }
    p.setActiveMenu(null);
  };
  return (
    <div id="desktop" onContextMenu={contextMenu}>
      <header className="menubar">
        <a
          href="#"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            p.open('welcome');
          }}
        >
          <img className="brand-logo" src="./assets/ketze-logo.png" alt="Ketze Studio logo" />
          <span className="brand-name">
            <span className="brand-ketze">Ketze</span>
            <span className="brand-studio">Studio</span>
          </span>
          <span className="version">PERSONAL WORKSPACE / 01</span>
        </a>
        <div className="system-menu">
          <button
            id="quick"
            aria-label={t('Quick view', 'Vista rápida')}
            onClick={() => p.open('quick')}
          >
            <LayoutGrid size={13} />
            <span>{t('Quick view', 'Vista rápida')}</span>
          </button>
          <div className="system-option">
            <button
              id="lang"
              className="system-trigger"
              aria-label={t(
                `Language: ${p.language === 'en' ? 'English' : 'Spanish'}`,
                `Idioma: ${p.language === 'en' ? 'Inglés' : 'Español'}`,
              )}
              title={t('Language', 'Idioma')}
              aria-expanded={p.activeMenu === 'language'}
              aria-controls="language-popover"
              onClick={() => p.setActiveMenu(p.activeMenu === 'language' ? null : 'language')}
            >
              <Languages size={17} />
            </button>
            {p.activeMenu === 'language' && (
              <div
                id="language-popover"
                className="system-popover"
                role="group"
                aria-label={t('Language', 'Idioma')}
              >
                <p>{t('Language', 'Idioma')}</p>
                {(['en', 'es'] as const).map((language) => (
                  <button
                    key={language}
                    aria-pressed={p.language === language}
                    onClick={() => {
                      p.setLanguage(language);
                      p.setActiveMenu(null);
                    }}
                  >
                    {language === 'en' ? 'English' : 'Español'}
                    {p.language === language && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="system-option">
            <button
              id="theme"
              className="system-trigger"
              aria-label={t(
                `Theme: ${p.theme}`,
                `Tema: ${p.theme === 'dark' ? 'Oscuro' : p.theme === 'light' ? 'Claro' : 'Automático'}`,
              )}
              title={t('Theme', 'Tema')}
              aria-expanded={p.activeMenu === 'theme'}
              aria-controls="theme-popover"
              onClick={() => p.setActiveMenu(p.activeMenu === 'theme' ? null : 'theme')}
            >
              {p.theme === 'auto' ? (
                <Monitor size={17} />
              ) : p.dark ? (
                <Moon size={17} />
              ) : (
                <Sun size={17} />
              )}
            </button>
            {p.activeMenu === 'theme' && (
              <div
                id="theme-popover"
                className="system-popover"
                role="group"
                aria-label={t('Theme', 'Tema')}
              >
                <p>{t('Appearance', 'Apariencia')}</p>
                {(['dark', 'light', 'auto'] as const).map((theme) => {
                  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
                  return (
                    <button
                      key={theme}
                      aria-pressed={p.theme === theme}
                      onClick={() => {
                        p.setTheme(theme);
                        p.setActiveMenu(null);
                      }}
                    >
                      <Icon size={15} />
                      <span>
                        {theme === 'dark'
                          ? t('Dark', 'Oscuro')
                          : theme === 'light'
                            ? t('Light', 'Claro')
                            : t('Automatic', 'Automático')}
                      </span>
                      {p.theme === theme && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <time id="clock">{p.clock}</time>
        </div>
      </header>
      <main tabIndex={-1}>
        <div className="wallpaper" aria-hidden="true">
          <div className="wallpaper-word">
            KETZE
            <br />
            <span>STUDIO.</span>
          </div>
          <div className="orb orb-one" />
          <div className="orb orb-two" />
        </div>
        <DesktopShortcuts language={p.language} presenter={p.shortcuts} />
        <DesktopAvatars collection={p.avatars} language={p.language} />
        <section id="windows" aria-label={t('Open windows', 'Ventanas abiertas')}>
          {p.windows.map((state) => (
            <DesktopWindow key={state.id} state={state} desktop={p} focused={state.z === topZ} />
          ))}
        </section>
      </main>
      <DesktopContextMenu presenter={p.contextMenu} />
      <ShareLinkFeedback presenter={p.share} language={p.language} />
      <footer className="dock-shell">
        <div
          className="dock"
          id="dock"
          aria-label={t('Application launcher', 'Lanzador de aplicaciones')}
        >
          {launcherApps
            .filter(([id]) => id !== 'tools')
            .map(([id, app]) => (
              <button
                key={id}
                data-open={id}
                className={p.windows.some((w) => w.id === id) ? 'active' : ''}
                aria-label={translate(p.language, app.title)}
                onClick={() => p.open(id)}
              >
                <span className={`icon-tile i-${id}`}>
                  <app.icon size={23} />
                </span>
                <span className="tooltip">{translate(p.language, app.title)}</span>
              </button>
            ))}
        </div>
      </footer>
    </div>
  );
}
