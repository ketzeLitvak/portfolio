import { appRegistry } from './appRegistry';
import { projects } from './projects';
import { experiences } from './experience';
import type { AppOpenOptions } from './types';

export interface DirectLinkTarget {
  id: string;
  options?: AppOpenOptions;
}
export function readDirectLink(hash = location.hash): DirectLinkTarget | null {
  const entries = [...new URLSearchParams(hash.replace(/^#/, '')).entries()];
  if (entries.length !== 1) return null;
  const [kind, id] = entries[0];
  if (kind === 'project' && Object.hasOwn(projects, id)) return { id };
  if (kind === 'experience' && experiences.some((entry) => entry.id === id))
    return { id: 'experience', options: { experience: id } };
  if (kind === 'app' && Object.hasOwn(appRegistry, id) && !Object.hasOwn(projects, id))
    return { id };
  return null;
}
export function directLinkHash(id: string, options?: AppOpenOptions): string {
  const kind = Object.hasOwn(projects, id)
    ? 'project'
    : id === 'experience' && options?.experience
      ? 'experience'
      : 'app';
  const value = kind === 'experience' ? options!.experience! : id;
  return `#${new URLSearchParams({ [kind]: value })}`;
}
export function directLinkUrl(id: string, options?: AppOpenOptions): string {
  const url = new URL(location.href);
  url.hash = directLinkHash(id, options);
  return url.href;
}
export function updateDirectLink(id: string, options?: AppOpenOptions) {
  history.replaceState(null, '', directLinkHash(id, options));
}
export function clearDirectLink(id?: string) {
  if (!id || readDirectLink()?.id === id)
    history.replaceState(null, '', location.pathname + location.search);
}
