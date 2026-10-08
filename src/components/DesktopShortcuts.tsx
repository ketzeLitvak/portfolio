import {
  desktopApps as apps,
  desktopProjects as projectEntries,
  desktopExperiences,
} from '../models/desktopShortcuts';
import { translate, type Language } from '../models/types';
import type { useDesktopShortcutsPresenter } from '../presenters/useDesktopShortcutsPresenter';
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
      className="app-grid"
      id="apps"
      aria-label={translate(language, ['Desktop applications', 'Aplicaciones del escritorio'])}
    >
      {p.dropStyle && (
        <span className="shortcut-drop-target" style={p.dropStyle} aria-hidden="true" />
      )}
      {apps.map(([id, app]) => (
        <button key={id} className="app-icon" data-open={id} {...p.buttonProps(id)}>
          <span className={`icon-tile i-${id}`}>
            <app.icon size={28} />
          </span>
          <span>{translate(language, app.title)}</span>
        </button>
      ))}
      {projectEntries.map(([id, project]) => (
        <button
          key={id}
          className="app-icon project-shortcut"
          data-open={id}
          {...p.buttonProps(id)}
        >
          <span className="icon-tile project-icon-tile">
            <img src={project.logo} alt="" draggable={false} />
          </span>
          <span>{project.title}</span>
        </button>
      ))}
      {desktopExperiences.map((entry) => (
        <button
          key={entry.id}
          className="app-icon experience-shortcut"
          data-open={entry.id}
          aria-label={translate(language, entry.organization)}
          title={translate(language, entry.organization)}
          {...p.buttonProps(entry.id)}
        >
          <span className="icon-tile project-icon-tile">
            <img src={entry.logo} alt="" draggable={false} />
          </span>
          <span>{translate(language, entry.title)}</span>
        </button>
      ))}
    </section>
  );
}
