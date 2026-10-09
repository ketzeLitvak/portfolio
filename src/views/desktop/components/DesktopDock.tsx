import styles from './DesktopDock.module.css';

import { classNames } from '../../../utils/classNames';

import { ApplicationIcon } from './ApplicationIcon';

import type { CSSProperties } from 'react';

import { appRegistry } from '../../../models/appRegistry';

import { desktopApps } from '../../../models/desktopShortcuts';

import { projects } from '../../../models/projects';

import { translate } from '../../../models/types';

import type { DesktopPresenter } from '../../../presenters/useDesktopPresenter';

const pinnedIds = new Set(desktopApps.map(([id]) => id));

export function DesktopDock({ presenter: p }: { presenter: DesktopPresenter }) {
  const extraWindows = p.windows.filter((window) => !pinnedIds.has(window.id));

  const button = (id: string, dynamic = false) => {
    const app = appRegistry[id],
      Icon = app.icon;
    const open = p.windows.some((window) => window.id === id);
    const title = translate(p.language, app.title);
    const logo = dynamic ? projects[id]?.logo : undefined;
    return (
      <button
        key={id}
        className={classNames(styles.dockApp, open ? styles.active : '')}
        data-open={id}
        data-dock-group={dynamic ? 'dynamic' : 'pinned'}
        aria-label={title}
        aria-description={
          open ? translate(p.language, ['Window open', 'Ventana abierta']) : undefined
        }
        onClick={() => p.open(id)}
      >
        <ApplicationIcon id={id} icon={Icon} logo={logo} size={23} />
        <span className={styles.tooltip}>{title}</span>
      </button>
    );
  };

  return (
    <footer className={styles.dockShell}>
      <div
        className={styles.dock}
        id="dock"
        aria-label={translate(p.language, ['Application launcher', 'Lanzador de aplicaciones'])}
        style={{ '--dock-items': desktopApps.length + extraWindows.length } as CSSProperties}
      >
        {desktopApps.map(([id]) => button(id))}
        {extraWindows.length > 0 && (
          <div className={styles.dockSeparator} role="separator" aria-orientation="vertical" />
        )}
        {extraWindows.map((window) => button(window.id, true))}
      </div>
    </footer>
  );
}
