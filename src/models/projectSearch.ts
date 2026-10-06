import { projects } from './projects';
import type { Text } from './types';

export const projectCategories: Record<string, Text> = {
  commerce: ['Live commerce', 'Live commerce'],
  maps: ['Maps & data', 'Mapas y datos'],
  business: ['Business management', 'Gestión de negocios'],
  library: ['Open source library', 'Librería de código abierto'],
  utilities: ['Developer tools', 'Herramientas para desarrolladores'],
};
const categoryByProject: Record<string, string> = {
  chilta: 'commerce', radix: 'maps', gira: 'business', faceshape: 'library', ketze: 'utilities',
};
const languageNames = new Set(['TypeScript', 'JavaScript', 'Python', 'C#', 'Java']);
export const searchableProjects = Object.entries(projects).map(([id, project]) => ({
  id, project, category: categoryByProject[id],
  languages: project.stack.filter(value => languageNames.has(value)),
  technologies: project.stack.filter(value => !languageNames.has(value)),
}));
export const searchLanguages = [...new Set(searchableProjects.flatMap(p => p.languages))].sort();
export const searchTechnologies = [...new Set(searchableProjects.flatMap(p => p.technologies))].sort();
export const normalizeSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
