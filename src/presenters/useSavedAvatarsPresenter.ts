import { useCallback, useState } from 'react';
import { isAvatarConfig, type AvatarConfig, type SavedAvatar } from '../models/avatars';
const storageKey = 'ketze-desktop-avatars';
function readAvatars(): SavedAvatar[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (!Array.isArray(value)) return [];
    const ids = new Set<string>();
    return value.filter((item): item is SavedAvatar => {
      if (!isAvatarConfig(item) || typeof (item as SavedAvatar).id !== 'string' || ids.has((item as SavedAvatar).id)) return false;
      ids.add((item as SavedAvatar).id); return true;
    }).slice(0, 5);
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
    persist([...avatars, { ...config, id: crypto.randomUUID() }]);
  };
  const remove = (id: string) => persist(avatars.filter(avatar => avatar.id !== id));
  return { avatars, save, remove, error };
}
export type SavedAvatarsPresenter = ReturnType<typeof useSavedAvatarsPresenter>;
