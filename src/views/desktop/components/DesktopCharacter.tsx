import { X } from 'lucide-react';

import type { ReactNode } from 'react';

import type { AvatarPosition } from '../../../models/avatars';

import { translate, type Language } from '../../../models/types';

import { useDraggableAvatarPresenter } from '../../../presenters/useDraggableAvatarPresenter';

import styles from './DesktopAvatars.module.css';

export function DesktopCharacter({
  id,
  name,
  position,
  place,
  remove,
  language,
  children,
}: {
  id: string;
  name: string;
  position: AvatarPosition;
  place: (position: AvatarPosition) => void;
  remove: () => void;
  language: Language;
  children: ReactNode;
}) {
  const p = useDraggableAvatarPresenter(position, place);
  return (
    <div
      ref={p.ref}
      className={styles.desktopAvatar}
      data-desktop-avatar
      data-avatar-id={id}
      tabIndex={0}
      role="group"
      aria-label={translate(language, [`Drag ${name}`, `Arrastrar ${name}`])}
      title={translate(language, [
        'Drag to move. You can also use the arrow keys.',
        'Arrastrá para mover. También podés usar las flechas del teclado.',
      ])}
      onPointerDown={p.startDrag}
      onPointerMove={p.moveDrag}
      onPointerUp={p.endDrag}
      onPointerCancel={p.endDrag}
      onKeyDown={p.moveWithKeyboard}
    >
      {children}
      <span className={styles.desktopAvatarName}>{name}</span>
      <button
        onClick={remove}
        aria-label={translate(language, [
          `Remove ${name} from desktop`,
          `Eliminar ${name} del escritorio`,
        ])}
      >
        <X size={14} />
      </button>
    </div>
  );
}
