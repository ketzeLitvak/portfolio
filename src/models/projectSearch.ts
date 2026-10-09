import { projects } from './projects';

import { experiences, experienceSkillLabels } from './experience';

import type { Text } from './types';

export const projectCategories: Record<string, Text> = {
  commerce: ['Live commerce', 'Live commerce'],
  maps: ['Maps & data', 'Mapas y datos'],
  business: ['Business management', 'Gestión de negocios'],
  library: ['Open source library', 'Librería de código abierto'],
  utilities: ['Developer tools', 'Herramientas para desarrolladores'],
  professional: ['Professional experience', 'Experiencia profesional'],
  teaching: ['Education & teaching', 'Formación y docencia'],
  leadership: ['Leadership & education', 'Liderazgo y educación'],
};
const categoryByProject: Record<string, string> = {
  chilta: 'commerce',
  radix: 'maps',
  gira: 'business',
  faceshape: 'library',
  ketze: 'utilities',
};
const categoryByExperience: Record<string, string> = {
  geopagos: 'professional',
  utn: 'teaching',
  leadership: 'leadership',
};
const languageNames = new Set(['TypeScript', 'JavaScript', 'Python', 'C#', 'Java']);
export interface SearchEntry {
  id: string;
  kind: 'project' | 'experience';
  title: Text;
  subtitle: Text;
  logo?: string;
  category: string;
  stack: string[];
  languages: string[];
  technologies: string[];
  text: string;
  app: string;
  experience?: string;
}
const projectEntries: SearchEntry[] = Object.entries(projects).map(([id, p]) => ({
  id,
  kind: 'project',
  title: [p.title, p.title],
  subtitle: p.subtitle,
  logo: p.logo,
  category: categoryByProject[id],
  stack: p.stack,
  languages: p.stack.filter((value) => languageNames.has(value)),
  technologies: p.stack.filter((value) => !languageNames.has(value)),
  text: [p.title, ...p.subtitle, ...p.description, ...p.contribution, ...p.stack].join(' '),
  app: id,
}));
const experienceEntries: SearchEntry[] = experiences.map((entry) => ({
  id: `experience-${entry.id}`,
  kind: 'experience',
  title: entry.organization,
  subtitle: entry.role,
  logo: entry.logo,
  category: categoryByExperience[entry.id],
  stack: entry.skills,
  languages: entry.skills.filter((value) => languageNames.has(value)),
  technologies:
    entry.id === 'geopagos' ? entry.skills.filter((value) => !languageNames.has(value)) : [],
  text: [
    ...entry.organization,
    ...entry.role,
    ...entry.summary,
    ...entry.period,
    ...entry.tab,
    ...entry.contributions.flatMap((c) => [...c.title, ...c.description]),
    ...entry.skills.flatMap((skill) => experienceSkillLabels[skill] ?? [skill]),
  ].join(' '),
  app: 'experience',
  experience: entry.id,
}));
export const searchableEntries = [...projectEntries, ...experienceEntries];
export const searchLanguages = [...new Set(searchableEntries.flatMap((p) => p.languages))].sort();
export const searchTechnologies = [
  ...new Set(searchableEntries.flatMap((p) => p.technologies)),
].sort();

export const normalizeSearch = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
