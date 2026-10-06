import { UsersRound, BriefcaseBusiness, GraduationCap } from 'lucide-react';
import { experiences, experienceSkillLabels } from '../models/experience';
import { translate } from '../models/types';
import type { ViewProps } from '../models/viewProps';
import { useExperiencePresenter } from '../presenters/useExperiencePresenter';
import { OpenButton } from '../components/Actions';
const tabIcons = [BriefcaseBusiness, GraduationCap, UsersRound];
export function ExperienceView({ language, openApp }: ViewProps) {
  const p = useExperiencePresenter(), entry = p.entry;
  const t = (en: string, es: string) => translate(language, [en, es]);
  return <div className="pad experience-view"><p className="kicker">{t('BUILDING, TEACHING & LEADING', 'DESARROLLO, DOCENCIA Y LIDERAZGO')}</p><h2>{t('Experience', 'Experiencia')}</h2>
    <div className="experience-tabs" role="tablist" aria-label={t('Experience areas', 'Áreas de experiencia')}>{experiences.map((experience, index) => { const Icon = tabIcons[index]; return <button key={experience.id} id={`experience-tab-${experience.id}`} role="tab" aria-selected={p.selected === index} tabIndex={p.selected === index ? 0 : -1} aria-controls="experience-panel" onClick={() => p.setSelected(index)} onKeyDown={p.navigateTabs}><Icon size={16}/>{translate(language, experience.tab)}</button>; })}</div>
    <section id="experience-panel" role="tabpanel" aria-labelledby={`experience-tab-${entry.id}`} tabIndex={0}><header className="experience-header">{entry.logo ? <img src={entry.logo} alt={`${translate(language, entry.organization)} logo`}/> : <span className="experience-people"><UsersRound size={32}/></span>}<div><p className="experience-period">{translate(language, entry.period)}</p><h3>{translate(language, entry.organization)}</h3><p className="experience-role">{translate(language, entry.role)}</p></div></header>
      <p className="experience-summary">{translate(language, entry.summary)}</p>
      <div className="experience-contributions">{entry.contributions.map((contribution, index) => <article key={`${entry.id}-${index}`}><span aria-hidden="true">0{index + 1}</span><div><h4>{translate(language, contribution.title)}</h4><p>{translate(language, contribution.description)}</p></div></article>)}</div>
      <div className="tags">{entry.skills.map(skill => <span key={skill}>{experienceSkillLabels[skill] ? translate(language, experienceSkillLabels[skill]) : skill}</span>)}</div>
      {entry.project && <OpenButton id={entry.project} openApp={openApp}>{t('Explore Radix', 'Explorar Radix')}</OpenButton>}
    </section>
  </div>;
}
