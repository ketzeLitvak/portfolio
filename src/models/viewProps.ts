import type { DesktopWallpaperPresenter } from '../presenters/useDesktopWallpaperPresenter';

import type { SavedAvatarsPresenter } from '../presenters/useSavedAvatarsPresenter';

import type { Language, AppOpenOptions, ExperienceTarget } from './types';

export interface ViewProps {
  wallpaper?: DesktopWallpaperPresenter;
  language: Language;
  openApp: (id: string, options?: AppOpenOptions) => void;
  experienceTarget?: ExperienceTarget;
  onExperienceChange?: (id: string) => void;
  avatarCollection?: SavedAvatarsPresenter;
}
