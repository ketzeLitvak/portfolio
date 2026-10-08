import { launcherApps } from '../models/appRegistry';
import { projects } from '../models/projects';
import { translate } from '../models/types';
import type { Language } from '../models/types';
import { useDesktopShortcutsPresenter } from '../presenters/useDesktopShortcutsPresenter';
const apps = launcherApps.filter(([id]) => id !== 'tools');
const projectEntries = Object.entries(projects);
const ids = [...apps.map(([id]) => id), ...projectEntries.map(([id]) => id)];
export function DesktopShortcuts({
  language,
  open,
}: {
  language: Language;
  open: (id: string) => void;
}) {
  const p = useDesktopShortcutsPresenter(ids, apps.length, open);
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
    </section>
  );
}
