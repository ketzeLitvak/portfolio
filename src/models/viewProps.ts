import type { SavedAvatarsPresenter } from '../presenters/useSavedAvatarsPresenter';
import type { Language, AppOpenOptions, ExperienceTarget } from './types';
export interface ViewProps { language: Language; openApp: (id: string, options?: AppOpenOptions) => void; experienceTarget?: ExperienceTarget; avatarCollection?: SavedAvatarsPresenter; }
