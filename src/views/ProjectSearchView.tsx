import { ArrowUpRight, ChevronDown, Search, X } from 'lucide-react';
import { projectCategories, searchLanguages, searchTechnologies } from '../models/projectSearch';
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
    <p className="kicker">{t('FIND YOUR WAY THROUGH MY WORK', 'EXPLORÁ MIS PROYECTOS')}</p>
    <h2>{t('What are you looking for?', '¿Qué estás buscando?')}</h2>
    <p className="description">{t('Search by name, stack or what a project does. Combine filters to narrow it down.', 'Buscá por nombre, tecnologías o lo que hace un proyecto. Combiná filtros para encontrar lo que te interesa.')}</p>
    <div className="project-search-input"><Search size={18} aria-hidden="true"/><input type="search" aria-label={t('Search projects', 'Buscar proyectos')} placeholder={t('Try React, maps, live commerce…', 'Probá React, mapas, live commerce…')} value={p.query} onChange={e => p.setQuery(e.target.value)} autoFocus/>{p.query && <button aria-label={t('Clear search', 'Borrar búsqueda')} onClick={() => p.setQuery('')}><X size={16}/></button>}</div>
    <div className="search-filters">{filters.map(filter => <label key={filter.id} htmlFor={filter.id}>{filter.label}<span><select id={filter.id} value={filter.value} onChange={e => filter.change(e.target.value)}><option value="">{t('All', 'Todos')}</option>{filter.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ChevronDown size={14} aria-hidden="true"/></span></label>)}</div>
    <div className="search-results-heading"><p role="status" aria-live="polite">{p.results.length} {t(p.results.length === 1 ? 'project' : 'projects', p.results.length === 1 ? 'proyecto' : 'proyectos')}</p>{p.hasFilters && <button onClick={p.reset}>{t('Clear filters', 'Limpiar filtros')}<X size={12}/></button>}</div>
    <div className="search-results">{p.results.map(({ id, project, category }) => <button className="search-result" key={id} onClick={() => openApp(id)} data-open={id}><img src={project.logo} alt=""/><span className="search-result-copy"><span className="search-result-title">{project.title}</span><span className="search-result-description">{translate(language, project.subtitle)}</span><span className="search-result-category">{translate(language, projectCategories[category])}</span><span className="search-result-stack">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</span></span><ArrowUpRight size={18} aria-hidden="true"/></button>)}</div>
    {p.results.length === 0 && <div className="search-empty"><Search size={28}/><h3>{t('No projects found', 'No encontré proyectos')}</h3><p>{t('Try another word or remove a filter.', 'Probá otra palabra o quitá un filtro.')}</p><button className="btn" onClick={p.reset}>{t('Show all projects', 'Ver todos los proyectos')}</button></div>}
  </div>;
}
