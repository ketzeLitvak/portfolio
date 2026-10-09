import styles from './DesktopView.module.css';

import { classNames } from '../../utils/classNames';

import { DesktopDock } from './components/DesktopDock';

import { ShareLinkFeedback } from './components/ShareLinkFeedback';

import { DesktopContextMenu } from './components/DesktopContextMenu';

import { DesktopShortcuts } from './components/DesktopShortcuts';

import { DesktopAvatars } from './components/DesktopAvatars';

import { DesktopWindow } from './components/DesktopWindow';

import { DesktopMenuBar } from './components/DesktopMenuBar';

import { useDesktopContextActionsPresenter } from '../../presenters/useDesktopContextActionsPresenter';

import { translate } from '../../models/types';

import type { DesktopPresenter } from '../../presenters/useDesktopPresenter';

export function DesktopView({ presenter: p }: { presenter: DesktopPresenter }) {
  const t = (en: string, es: string) => translate(p.language, [en, es]);

  const topZ = Math.max(0, ...p.windows.filter((w) => !w.minimized).map((w) => w.z));
  const contextMenu = useDesktopContextActionsPresenter(p);
  return (
    <div id="desktop" className={styles.desktop} onContextMenu={contextMenu}>
      <DesktopMenuBar presenter={p} />
      <main className={styles.desktopMain} tabIndex={-1}>
        <div className={styles.wallpaper} aria-hidden="true">
          <div className={styles.wallpaperWord}>
            KETZE
            <br />
            <span>STUDIO.</span>
          </div>
          <div className={classNames(styles.orb, styles.orbOne)} />
          <div className={classNames(styles.orb, styles.orbTwo)} />
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
      <DesktopDock presenter={p} />
    </div>
  );
}
