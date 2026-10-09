import styles from './DesktopAvatars.module.css';

import { Character } from 'faceshape-react';

import { DesktopCharacter } from './DesktopCharacter';

import type { SavedDrawingsPresenter } from '../../../presenters/useSavedDrawingsPresenter';

import { avatarShapes, type SavedAvatar } from '../../../models/avatars';

import { translate, type Language } from '../../../models/types';

import type { SavedAvatarsPresenter } from '../../../presenters/useSavedAvatarsPresenter';

function DesktopAvatar({
  avatar,
  collection,
  language,
}: {
  avatar: SavedAvatar;
  collection: SavedAvatarsPresenter;
  language: Language;
}) {
  const name = avatar.name || translate(language, ['Unnamed', 'Sin nombre']);
  return (
    <DesktopCharacter
      id={avatar.id}
      name={name}
      position={avatar.position ?? { x: 0.5, y: 0.86 }}
      place={(position) => collection.place(avatar.id, position)}
      remove={() => collection.remove(avatar.id)}
      language={language}
    >
      <Character
        name={avatar.name}
        shape={avatarShapes[avatar.shape].shape}
        expression={avatar.expression}
        face={{ eyes: avatar.eyes, mouth: avatar.mouth, eyebrows: avatar.eyebrows }}
        color={avatar.color}
        size={70}
        motion={{ lookAt: 'cursor', idle: false, blink: true }}
        label={name}
      />
    </DesktopCharacter>
  );
}

export function DesktopAvatars({
  collection,
  language,
  drawings,
}: {
  collection: SavedAvatarsPresenter;
  language: Language;
  drawings: SavedDrawingsPresenter;
}) {
  return (
    <div
      className={styles.desktopAvatars}
      aria-label={translate(language, ['Desktop characters', 'Personajes del escritorio'])}
    >
      {drawings.drawings.map((drawing) => (
        <DesktopCharacter
          key={drawing.id}
          id={drawing.id}
          name={drawing.name}
          position={drawing.position}
          place={(position) => drawings.place(drawing.id, position)}
          remove={() => drawings.remove(drawing.id)}
          language={language}
        >
          <img
            src={drawing.image}
            alt={drawing.name}
            draggable={false}
            className={styles.drawingCharacter}
          />
        </DesktopCharacter>
      ))}
      {collection.avatars.map((avatar) => (
        <DesktopAvatar
          key={avatar.id}
          avatar={avatar}
          collection={collection}
          language={language}
        />
      ))}
    </div>
  );
}
