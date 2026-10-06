import type { SavedAvatarsPresenter } from '../presenters/useSavedAvatarsPresenter';
import type { Language } from './types';
export interface ViewProps { language: Language; openApp: (id: string) => void; avatarCollection?: SavedAvatarsPresenter; }
