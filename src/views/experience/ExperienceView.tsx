import contentStyles from '../../styles/Content.module.css';

import styles from './ExperienceView.module.css';

import { classNames } from '../../utils/classNames';

import { Tabs } from '../../components/tabs/Tabs';

import { UsersRound, BriefcaseBusiness, GraduationCap } from 'lucide-react';

import { experiences, experienceSkillLabels } from '../../models/experience';

import { translate } from '../../models/types';

import type { ViewProps } from '../../models/viewProps';

import { useExperiencePresenter } from '../../presenters/useExperiencePresenter';

import { OpenButton } from '../../components/actions/OpenButton';

const tabIcons = [BriefcaseBusiness, GraduationCap, UsersRound];

export function ExperienceView({
  language,
  openApp,
  experienceTarget,
  onExperienceChange,
}: ViewProps) {
  const p = useExperiencePresenter(experienceTarget, onExperienceChange),
    entry = p.entry;

  const t = (en: string, es: string) => translate(language, [en, es]);

  return (
    <div ref={p.ref} className={classNames(contentStyles.pad, styles.experienceView)}>
      <p className={contentStyles.kicker}>
        {t('BUILDING, TEACHING & LEADING', 'DESARROLLO, DOCENCIA Y LIDERAZGO')}
      </p>
      <h2>{t('Experience', 'Experiencia')}</h2>
      <Tabs
        label={t('Experience areas', 'Áreas de experiencia')}
        value={entry.id}
        panelId="experience-panel"
        idPrefix="experience-tab"
        onChange={(id) =>
          p.setSelected(experiences.findIndex((experience) => experience.id === id))
        }
        items={experiences.map((experience, index) => {
          const Icon = tabIcons[index];
          return {
            id: experience.id,
            label: translate(language, experience.tab),
            icon: <Icon size={16} />,
          };
        })}
      />
      <section
        id="experience-panel"
        role="tabpanel"
        aria-labelledby={`experience-tab-${entry.id}`}
        tabIndex={0}
      >
        <header className={styles.experienceHeader}>
          {entry.logo ? (
            <img src={entry.logo} alt={`${translate(language, entry.organization)} logo`} />
          ) : (
            <span className={styles.experiencePeople}>
              <UsersRound size={32} />
            </span>
          )}
          <div>
            <p className={styles.experiencePeriod}>{translate(language, entry.period)}</p>
            <h3>{translate(language, entry.organization)}</h3>
            <p className={styles.experienceRole}>{translate(language, entry.role)}</p>
          </div>
        </header>
        <p className={styles.experienceSummary}>{translate(language, entry.summary)}</p>
        <div className={styles.experienceContributions}>
          {entry.contributions.map((contribution, index) => (
            <article key={`${entry.id}-${index}`}>
              <span aria-hidden="true">0{index + 1}</span>
              <div>
                <h4>{translate(language, contribution.title)}</h4>
                <p>{translate(language, contribution.description)}</p>
              </div>
            </article>
          ))}
        </div>
        <div className={contentStyles.tags}>
          {entry.skills.map((skill) => (
            <span key={skill}>
              {experienceSkillLabels[skill]
                ? translate(language, experienceSkillLabels[skill])
                : skill}
            </span>
          ))}
        </div>
        {entry.project && (
          <OpenButton id={entry.project} openApp={openApp}>
            {t('Explore Radix', 'Explorar Radix')}
          </OpenButton>
        )}
      </section>
    </div>
  );
}
