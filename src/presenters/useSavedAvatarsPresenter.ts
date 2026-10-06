import { useCallback, useState } from 'react';
import { isAvatarConfig, type AvatarConfig, type AvatarPosition, type SavedAvatar } from '../models/avatars';
const storageKey = 'ketze-desktop-avatars';
function readAvatars(): SavedAvatar[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (!Array.isArray(value)) return [];
    const ids = new Set<string>();
    return value.filter((item): item is SavedAvatar => {
      if (!isAvatarConfig(item) || typeof (item as SavedAvatar).id !== 'string' || ids.has((item as SavedAvatar).id)) return false;
      ids.add((item as SavedAvatar).id); return true;
    }).slice(0, 5).map((avatar, index) => ({ ...avatar, position: avatar.position && Number.isFinite(avatar.position.x) && Number.isFinite(avatar.position.y) ? { x: Math.max(0, Math.min(1, avatar.position.x)), y: Math.max(0, Math.min(1, avatar.position.y)) } : { x: .16 + index * .17, y: .86 } }));
  } catch { return []; }
}
export function useSavedAvatarsPresenter() {
  const [avatars, setAvatars] = useState<SavedAvatar[]>(readAvatars);
  const [error, setError] = useState(false);
  const persist = useCallback((next: SavedAvatar[]) => {
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setAvatars(next); setError(false); }
    catch { setError(true); }
  }, []);
  const save = (config: AvatarConfig) => {
    if (avatars.length >= 5 || !isAvatarConfig(config)) return;
    persist([...avatars, { ...config, id: crypto.randomUUID(), position: { x: .16 + avatars.length * .17, y: .86 } }]);
  };
  const remove = (id: string) => persist(avatars.filter(avatar => avatar.id !== id));
  const place = (id: string, position: AvatarPosition) => persist(avatars.map(avatar => avatar.id === id ? { ...avatar, position } : avatar));
  return { avatars, save, remove, place, error };
}
export type SavedAvatarsPresenter = ReturnType<typeof useSavedAvatarsPresenter>;
