import { ArrowUpRight, ChevronDown, Search, X } from 'lucide-react';
import { projectCategories, searchLanguages, searchTechnologies } from '../models/projectSearch';
import { experienceSkillLabels } from '../models/experience';
import { translate } from '../models/types';
import type { ViewProps } from '../models/viewProps';
import { useProjectSearchPresenter } from '../presenters/useProjectSearchPresenter';

export function ProjectSearchView({ language, openApp }: ViewProps) {
  const p = useProjectSearchPresenter();
  const t = (en: string, es: string) => translate(language, [en, es]);
  const filters = [
    { id: 'project-language', label: t('Language', 'Lenguaje'), value: p.language, change: p.setLanguage, options: searchLanguages.map(value => [value, value]) },
    { id: 'project-technology', label: t('Technology', 'Tecnología'), value: p.technology, change: p.setTechnology, options: searchTechnologies.map(value => [value, value]) },
    { id: 'project-category', label: t('Category', 'Categoría'), value: p.category, change: p.setCategory, options: Object.entries(projectCategories).map(([id, label]) => [id, translate(language, label)]) },
  ];
  return <div className="pad search-view">
    <p className="kicker">{t('FIND YOUR WAY THROUGH MY WORK', 'EXPLORÁ MI TRABAJO')}</p>
    <h2>{t('What are you looking for?', '¿Qué estás buscando?')}</h2>
    <p className="description">{t('Search projects and experience by name, technologies or skills. Combine filters to narrow it down.', 'Buscá proyectos y experiencias por nombre, tecnologías o conocimientos. Combiná filtros para encontrar lo que te interesa.')}</p>
    <div className="project-search-input"><Search size={18} aria-hidden="true"/><input type="search" aria-label={t('Search projects and experience', 'Buscar proyectos y experiencias')} placeholder={t('Try .NET, React, teaching…', 'Probá .NET, React, docencia…')} value={p.query} onChange={e => p.setQuery(e.target.value)} autoFocus/>{p.query && <button aria-label={t('Clear search', 'Borrar búsqueda')} onClick={() => p.setQuery('')}><X size={16}/></button>}</div>
    <div className="search-filters">{filters.map(filter => <label key={filter.id} htmlFor={filter.id}>{filter.label}<span><select id={filter.id} value={filter.value} onChange={e => filter.change(e.target.value)}><option value="">{t('All', 'Todos')}</option>{filter.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ChevronDown size={14} aria-hidden="true"/></span></label>)}</div>
    <div className="search-results-heading"><p role="status" aria-live="polite">{p.results.length} {t(p.results.length === 1 ? 'result' : 'results', p.results.length === 1 ? 'resultado' : 'resultados')}</p>{p.hasFilters && <button onClick={p.reset}>{t('Clear filters', 'Limpiar filtros')}<X size={12}/></button>}</div>
    <div className="search-results">{p.results.map(entry => <button className="search-result" key={entry.id} onClick={() => openApp(entry.app, entry.experience ? { experience: entry.experience } : undefined)} data-open={entry.app} data-result-id={entry.id}><img src={entry.logo} alt=""/><span className="search-result-copy"><span className="search-result-kind">{entry.kind === 'project' ? t('Project', 'Proyecto') : t('Experience', 'Experiencia')}</span><span className="search-result-title">{translate(language, entry.title)}</span><span className="search-result-description">{translate(language, entry.subtitle)}</span><span className="search-result-category">{translate(language, projectCategories[entry.category])}</span><span className="search-result-stack">{entry.stack.map(skill => <span key={skill}>{experienceSkillLabels[skill] ? translate(language, experienceSkillLabels[skill]) : skill}</span>)}</span></span><ArrowUpRight size={18} aria-hidden="true"/></button>)}</div>
    {p.results.length === 0 && <div className="search-empty"><Search size={28}/><h3>{t('No results found', 'No encontré resultados')}</h3><p>{t('Try another word or remove a filter.', 'Probá otra palabra o quitá un filtro.')}</p><button className="btn" onClick={p.reset}>{t('Show all results', 'Ver todos los resultados')}</button></div>}
  </div>;
}
