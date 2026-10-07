import { Character } from 'faceshape-react';
import { X } from 'lucide-react';
import { avatarShapes, type SavedAvatar } from '../models/avatars';
import { translate, type Language } from '../models/types';
import type { SavedAvatarsPresenter } from '../presenters/useSavedAvatarsPresenter';
import { useDraggableAvatarPresenter } from '../presenters/useDraggableAvatarPresenter';

function DesktopAvatar({ avatar, collection, language }: { avatar: SavedAvatar; collection: SavedAvatarsPresenter; language: Language }) {
  const p = useDraggableAvatarPresenter(avatar.position ?? { x: .5, y: .86 }, position => collection.place(avatar.id, position));
  return <div ref={p.ref} className="desktop-avatar" data-avatar-id={avatar.id} tabIndex={0} role="group" aria-label={translate(language, [`Drag ${avatar.name || 'avatar'}`, `Arrastrar ${avatar.name || 'avatar'}`])} title={translate(language, ['Drag to move. You can also use the arrow keys.', 'Arrastrá para mover. También podés usar las flechas del teclado.'])} onPointerDown={p.startDrag} onPointerMove={p.moveDrag} onPointerUp={p.endDrag} onPointerCancel={p.endDrag} onKeyDown={p.moveWithKeyboard}>
    <Character name={avatar.name} shape={avatarShapes[avatar.shape].shape} expression={avatar.expression} face={{ eyes: avatar.eyes, mouth: avatar.mouth, eyebrows: avatar.eyebrows }} color={avatar.color} size={70} motion={{ lookAt: 'cursor', idle: false, blink: false }} label={avatar.name || translate(language, ['Saved avatar', 'Avatar guardado'])}/>
    <span className="desktop-avatar-name">{avatar.name || translate(language, ['Unnamed', 'Sin nombre'])}</span>
    <button onClick={() => collection.remove(avatar.id)} aria-label={translate(language, [`Remove ${avatar.name || 'avatar'} from desktop`, `Eliminar ${avatar.name || 'avatar'} del escritorio`])}><X size={14}/></button>
  </div>;
}
export function DesktopAvatars({ collection, language }: { collection: SavedAvatarsPresenter; language: Language }) {
  return <div className="desktop-avatars" aria-label={translate(language, ['Desktop characters', 'Personajes del escritorio'])}>{collection.avatars.map(avatar => <DesktopAvatar key={avatar.id} avatar={avatar} collection={collection} language={language}/>)}</div>;
}
