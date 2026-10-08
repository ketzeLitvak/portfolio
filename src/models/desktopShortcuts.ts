import { experiences } from './experience';
import type { Text } from './types';
import { launcherApps } from './appRegistry';
import { projects } from './projects';

export const desktopApps = launcherApps.filter(([id]) => id !== 'tools');
export const desktopProjects = Object.entries(projects);
export const desktopExperiences = experiences.map((entry) => ({
  id: `experience-${entry.id}`,
  experience: entry.id,
  logo: entry.logo,
  title: entry.id === 'leadership' ? (['CSHA', 'CSHA'] as Text) : entry.tab,
  organization: entry.organization,
}));
export const findDesktopExperience = (id: string) =>
  desktopExperiences.find((entry) => entry.id === id);
export const desktopShortcutIds = [
  ...desktopApps.map(([id]) => id),
  ...desktopProjects.map(([id]) => id),
  ...desktopExperiences.map((entry) => entry.id),
];
