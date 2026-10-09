import type { MouseEvent } from 'react';

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
  LayoutGrid,
} from 'lucide-react';

import { findDesktopExperience } from '../models/desktopShortcuts';

import { appRegistry } from '../models/appRegistry';

import { projects } from '../models/projects';

import { translate } from '../models/types';

import type { DesktopPresenter } from './useDesktopPresenter';

export function useDesktopContextActionsPresenter(p: DesktopPresenter) {
  const t = (en: string, es: string) => translate(p.language, [en, es]);

  const contextMenu = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof Element)) return;
    const target = event.target;
    if (target.closest('[role=menu]')) return;
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
    } else if (target.closest('main') && !target.closest('[data-desktop-avatar]')) {
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

  return contextMenu;
}
