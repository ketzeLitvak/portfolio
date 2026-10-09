import { useState } from 'react';

import { readPreference } from '../models/types';

import {
  desktopDrawingsKey,
  readDesktopDrawings,
  validDrawingImage,
  type SavedDrawingCharacter,
} from '../models/desktopDrawings';

import type { AvatarPosition } from '../models/avatars';

export function useSavedDrawingsPresenter() {
  const [drawings, setDrawings] = useState(() =>
    readDesktopDrawings(readPreference(desktopDrawingsKey, '[]')),
  );
  const [error, setError] = useState(false);

  const persist = (next: SavedDrawingCharacter[]): boolean => {
    try {
      localStorage.setItem(desktopDrawingsKey, JSON.stringify(next));
      setDrawings(next);
      setError(false);
      return true;
    } catch {
      setError(true);
      return false;
    }
  };

  const save = (image: string, name: string): boolean => {
    if (drawings.length >= 5 || !validDrawingImage(image)) return false;
    return persist([
      ...drawings,
      {
        id: crypto.randomUUID(),
        name: name.trim().slice(0, 24) || `Pixel ${drawings.length + 1}`,
        image,
        position: { x: 0.25 + drawings.length * 0.12, y: 0.65 },
      },
    ]);
  };

  const remove = (id: string) => persist(drawings.filter((drawing) => drawing.id !== id));

  const place = (id: string, position: AvatarPosition) =>
    persist(drawings.map((drawing) => (drawing.id === id ? { ...drawing, position } : drawing)));

  return { drawings, save, remove, place, error };
}

export type SavedDrawingsPresenter = ReturnType<typeof useSavedDrawingsPresenter>;
