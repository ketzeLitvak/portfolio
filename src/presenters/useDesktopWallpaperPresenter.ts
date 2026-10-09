import { useState } from 'react';

import { readPreference } from '../models/types';

const wallpaperKey = 'ketze-desktop-wallpaper';

function validWallpaper(value: string): boolean {
  return value.length < 2_000_000 && /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(value);
}

export function useDesktopWallpaperPresenter() {
  const [image, setImage] = useState<string | null>(() => {
    const saved = readPreference(wallpaperKey, '');
    return validWallpaper(saved) ? saved : null;
  });

  const apply = (value: string): boolean => {
    if (!validWallpaper(value)) return false;
    try {
      localStorage.setItem(wallpaperKey, value);
    } catch {
      return false;
    }
    setImage(value);
    return true;
  };

  const restore = (): boolean => {
    try {
      localStorage.removeItem(wallpaperKey);
    } catch {
      return false;
    }
    setImage(null);
    return true;
  };

  return { image, apply, restore };
}

export type DesktopWallpaperPresenter = ReturnType<typeof useDesktopWallpaperPresenter>;
