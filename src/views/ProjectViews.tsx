import { projects } from '../models/projects';
import { translate } from '../models/types';
import type { ViewProps } from '../models/viewProps';
import { ExternalLink, OpenButton } from '../components/Actions';
import { ProjectList } from '../components/ProjectList';

export function ProjectListView({ language, openApp }: ViewProps) {
  return (
    <div className="project-list-window">
      <ProjectList language={language} openApp={openApp} />
    </div>
  );
}

export function ProjectDetailView({ id, language, openApp }: ViewProps & { id: string }) {
  const p = projects[id];
  const t = (en: string, es: string) => translate(language, [en, es]);
  return (
    <>
      <div
        className="project-banner"
        style={{ background: `color-mix(in srgb, ${p.color} 70%, #141414)` }}
      >
        <div className="project-banner-title">
          {p.logo && <img className="project-banner-logo" src={p.logo} alt={`${p.title} logo`} />}
          <h2>{p.title}</h2>
        </div>
        <span>{translate(language, p.role)}</span>
      </div>
      <div className="project-body">
        <h3>{translate(language, p.subtitle)}</h3>
        <p>{translate(language, p.description)}</p>
        <div className="contribution">
          <b>{t('MY CONTRIBUTION', 'MI APORTE')}</b>
          <p>{translate(language, p.contribution)}</p>
        </div>
        <div className="tags">
          {p.stack.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        {p.url ? (
          <ExternalLink href={p.url}>{t('Open project', 'Abrir proyecto')}</ExternalLink>
        ) : (
          p.status && <p className="kicker">{translate(language, p.status)}</p>
        )}
        {p.extra && (
          <OpenButton id={p.extra} openApp={openApp}>
            {t('Try the desktop experiment', 'Probar el experimento del escritorio')}
          </OpenButton>
        )}
      </div>
    </>
  );
}
