import { Character } from 'faceshape-react';
import { X } from 'lucide-react';
import { avatarShapes, type SavedAvatar } from '../models/avatars';
import { translate, type Language } from '../models/types';
import type { SavedAvatarsPresenter } from '../presenters/useSavedAvatarsPresenter';
import { useRoamingAvatarPresenter } from '../presenters/useRoamingAvatarPresenter';

function RoamingAvatar({ avatar, remove, language }: { avatar: SavedAvatar; remove: (id: string) => void; language: Language }) {
  const p = useRoamingAvatarPresenter();
  return <div ref={p.ref} className="roaming-avatar" data-avatar-id={avatar.id}>
    <Character name={avatar.name} shape={avatarShapes[avatar.shape].shape} expression={avatar.expression} face={{ eyes: avatar.eyes, mouth: avatar.mouth, eyebrows: avatar.eyebrows }} color={avatar.color} size={70} motion={{ idle: true, blink: true }} label={avatar.name || translate(language, ['Saved avatar', 'Avatar guardado'])}/>
    <span className="roaming-avatar-name">{avatar.name || translate(language, ['Unnamed', 'Sin nombre'])}</span>
    <button onClick={() => remove(avatar.id)} aria-label={translate(language, [`Remove ${avatar.name || 'avatar'} from desktop`, `Eliminar ${avatar.name || 'avatar'} del escritorio`])}><X size={12}/></button>
  </div>;
}
export function DesktopAvatars({ collection, language }: { collection: SavedAvatarsPresenter; language: Language }) {
  return <div className="desktop-avatars" aria-label={translate(language, ['Desktop characters', 'Personajes del escritorio'])}>{collection.avatars.map(avatar => <RoamingAvatar key={avatar.id} avatar={avatar} remove={collection.remove} language={language}/>)}</div>;
}
