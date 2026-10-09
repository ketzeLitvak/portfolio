import styles from './ProjectList.module.css';

import contentStyles from '../../../styles/Content.module.css';

import { ArrowUpRight } from 'lucide-react';

import { projects } from '../../../models/projects';

import { projectIcons } from '../../../models/projectIcons';

import { translate } from '../../../models/types';

import type { ViewProps } from '../../../models/viewProps';

export function ProjectList({ language, openApp }: Pick<ViewProps, 'language' | 'openApp'>) {
  const t = (en: string, es: string) => translate(language, [en, es]);

  return (
    <div className={styles.projectList}>
      <div className={styles.folderHead}>
        <span>{t('WORKSPACE / SELECTED WORK', 'ESPACIO / PROYECTOS DESTACADOS')}</span>
        <span>
          {Object.keys(projects).length} {t('items', 'elementos')}
        </span>
      </div>
      {Object.entries(projects).map(([id, p], index) => {
        const Icon = projectIcons[id];
        return (
          <button key={id} className={styles.projectRow} data-open={id} onClick={() => openApp(id)}>
            <span className={styles.projectSymbol} style={{ background: p.color }}>
              {p.logo ? (
                <img className={styles.projectLogo} src={p.logo} alt="" />
              ) : (
                <Icon size={23} />
              )}
            </span>
            <span className={styles.projectSummary}>
              <b>{p.title}</b>
              <small>{translate(language, p.subtitle)}</small>
            </span>
            <span className={styles.projectCounter}>0{index + 1}</span>
            <ArrowUpRight className={styles.arrow} size={18} />
          </button>
        );
      })}
      <p className={contentStyles.notice}>
        {t(
          'Each folder tells you what the product does and what I contributed.',
          'Cada carpeta cuenta qué hace el producto y cuál fue mi aporte.',
        )}
      </p>
    </div>
  );
}
