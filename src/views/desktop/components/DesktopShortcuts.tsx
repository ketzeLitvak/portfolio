import styles from './DesktopShortcuts.module.css';

import { DesktopShortcut } from './DesktopShortcut';

import {
  desktopApps as apps,
  desktopProjects as projectEntries,
  desktopExperiences,
  desktopExperiments,
} from '../../../models/desktopShortcuts';

import { translate, type Language } from '../../../models/types';

import type { useDesktopShortcutsPresenter } from '../../../presenters/useDesktopShortcutsPresenter';

export function DesktopShortcuts({
  language,
  presenter: p,
}: {
  language: Language;
  presenter: ReturnType<typeof useDesktopShortcutsPresenter>;
}) {
  return (
    <section
      ref={p.gridRef}
      style={p.gridStyle}
      className={styles.appGrid}
      id="apps"
      aria-label={translate(language, ['Desktop applications', 'Aplicaciones del escritorio'])}
    >
      {p.dropStyle && (
        <span className={styles.shortcutDropTarget} style={p.dropStyle} aria-hidden="true" />
      )}
      {desktopExperiments.map(([id, app]) => (
        <DesktopShortcut
          key={id}
          id={id}
          label={translate(language, app.title)}
          kind="experiment"
          icon={app.icon}
          presenter={p}
        />
      ))}
      {apps.map(([id, app]) => (
        <DesktopShortcut
          key={id}
          id={id}
          label={translate(language, app.title)}
          icon={app.icon}
          presenter={p}
        />
      ))}
      {projectEntries.map(([id, project]) => (
        <DesktopShortcut
          key={id}
          id={id}
          label={project.title}
          kind="project"
          logo={project.logo}
          presenter={p}
        />
      ))}
      {desktopExperiences.map((entry) => (
        <DesktopShortcut
          key={entry.id}
          id={entry.id}
          label={translate(language, entry.title)}
          title={translate(language, entry.organization)}
          kind="experience"
          logo={entry.logo}
          presenter={p}
        />
      ))}
    </section>
  );
}
