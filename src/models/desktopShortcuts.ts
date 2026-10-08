import { launcherApps } from './appRegistry';
import { projects } from './projects';

export const desktopApps = launcherApps.filter(([id]) => id !== 'tools');
export const desktopProjects = Object.entries(projects);
export const desktopShortcutIds = [
  ...desktopApps.map(([id]) => id),
  ...desktopProjects.map(([id]) => id),
];
