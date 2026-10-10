import { Blocks } from 'lucide-react';

import styles from './ProjectDetailView.module.css';

import contentStyles from '../../styles/Content.module.css';

import { projects } from '../../models/projects';

import { translate } from '../../models/types';

import type { ViewProps } from '../../models/viewProps';

import { ExternalLink } from '../../components/actions/ExternalLink';

import { OpenButton } from '../../components/actions/OpenButton';

export function ProjectDetailView({ id, language, openApp }: ViewProps & { id: string }) {
  const p = projects[id];

  const t = (en: string, es: string) => translate(language, [en, es]);

  return (
    <>
      <div
        className={styles.projectBanner}
        style={{ background: `color-mix(in srgb, ${p.color} 70%, #141414)` }}
      >
        <div className={styles.projectBannerTitle}>
          {p.logo && (
            <img className={styles.projectBannerLogo} src={p.logo} alt={`${p.title} logo`} />
          )}
          <h2>{p.title}</h2>
        </div>
        <span>{translate(language, p.role)}</span>
      </div>
      <div className={styles.projectBody}>
        <h3>{translate(language, p.subtitle)}</h3>
        <p>{translate(language, p.description)}</p>
        <div className={styles.contribution}>
          <b>{t('MY CONTRIBUTION', 'MI APORTE')}</b>
          <p>{translate(language, p.contribution)}</p>
        </div>
        <div className={contentStyles.tags}>
          {p.stack.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        {p.url ? (
          <ExternalLink href={p.url}>{t('Open project', 'Abrir proyecto')}</ExternalLink>
        ) : (
          p.status && <p className={contentStyles.kicker}>{translate(language, p.status)}</p>
        )}
        {id === 'radix' && (
          <OpenButton id="architecture" openApp={openApp}>
            <Blocks size={14} />
            {t('Explore the architecture', 'Explorar la arquitectura')}
          </OpenButton>
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
