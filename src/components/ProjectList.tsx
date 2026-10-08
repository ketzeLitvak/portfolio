import { ArrowUpRight } from 'lucide-react';
import { projects } from '../models/projects';
import { projectIcons } from '../models/projectIcons';
import { translate } from '../models/types';
import type { ViewProps } from '../models/viewProps';

export function ProjectList({ language, openApp }: Pick<ViewProps, 'language' | 'openApp'>) {
  const t = (en: string, es: string) => translate(language, [en, es]);
  return (
    <div className="project-list">
      <div className="folder-head">
        <span>{t('WORKSPACE / SELECTED WORK', 'ESPACIO / PROYECTOS DESTACADOS')}</span>
        <span>
          {Object.keys(projects).length} {t('items', 'elementos')}
        </span>
      </div>
      {Object.entries(projects).map(([id, p], index) => {
        const Icon = projectIcons[id];
        return (
          <button key={id} className="project-row" data-open={id} onClick={() => openApp(id)}>
            <span className="project-symbol" style={{ background: p.color }}>
              {p.logo ? <img className="project-logo" src={p.logo} alt="" /> : <Icon size={23} />}
            </span>
            <span className="project-summary">
              <b>{p.title}</b>
              <small>{translate(language, p.subtitle)}</small>
            </span>
            <span className="project-counter">0{index + 1}</span>
            <ArrowUpRight className="arrow" size={18} />
          </button>
        );
      })}
      <p className="notice">
        {t(
          'Each folder tells you what the product does and what I contributed.',
          'Cada carpeta cuenta qué hace el producto y cuál fue mi aporte.',
        )}
      </p>
    </div>
  );
}
