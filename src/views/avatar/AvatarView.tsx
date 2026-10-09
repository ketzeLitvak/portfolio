import contentStyles from '../../styles/Content.module.css';

import styles from './AvatarView.module.css';

import { classNames } from '../../utils/classNames';

import { Download, Pause, Play, Save, X } from 'lucide-react';

import {
  Character,
  type ExpressionName,
  type EyeVariant,
  type MouthVariant,
  type EyebrowVariant,
} from 'faceshape-react';

import type { ViewProps } from '../../models/viewProps';

import { translate } from '../../models/types';

import { useAvatarPresenter } from '../../presenters/useAvatarPresenter';

import {
  avatarShapes,
  avatarExpressions,
  avatarEyes,
  avatarMouths,
  avatarEyebrows,
} from '../../models/avatars';

import { ExternalLink } from '../../components/actions/ExternalLink';

export function AvatarView({ language, avatarCollection }: ViewProps) {
  const p = useAvatarPresenter();

  const t = (en: string, es: string) => translate(language, [en, es]);

  return (
    <div className={classNames(contentStyles.pad, styles.avatarLab)}>
      <p className={contentStyles.kicker}>PLAYGROUND / 01</p>
      <h2 style={{ fontSize: 29 }}>
        {t('Give it a little character.', 'Dale un poco de personalidad.')}
      </h2>
      <div className={styles.avatarLayout}>
        <div className={styles.avatarPreview}>
          <div className={styles.avatarStage}>
            <Character
              ref={p.svgRef}
              name={p.name}
              shape={p.resolvedShape}
              expression={p.expression}
              face={{ eyes: p.eyes, mouth: p.mouth, eyebrows: p.eyebrows }}
              color={p.color}
              size={180}
              label={t('Customizable avatar', 'Avatar personalizable')}
              motion={{
                idle: p.animated,
                blink: p.animated,
                lookAt: p.animated ? 'cursor' : undefined,
              }}
              reducedMotion={!p.animated}
            />
          </div>
          <button
            className={classNames(contentStyles.btn, styles.avatarAnimation)}
            aria-pressed={p.animated}
            onClick={() => p.setAnimated(!p.animated)}
          >
            {p.animated ? <Pause size={14} /> : <Play size={14} />}{' '}
            {p.animated ? t('Pause animation', 'Pausar animación') : t('Animate', 'Animar')}
          </button>
          {avatarCollection && (
            <button
              className={classNames(contentStyles.btn, contentStyles.orange, styles.avatarSave)}
              disabled={avatarCollection.avatars.length >= 5}
              onClick={() => avatarCollection.save(p.config)}
            >
              <Save size={14} />
              {t('Save to desktop', 'Guardar en escritorio')}
            </button>
          )}
        </div>
        <div className={styles.controls}>
          <div>
            <label htmlFor="avatar-name">{t('Name', 'Nombre')}</label>
            <input
              id="avatar-name"
              type="text"
              maxLength={80}
              value={p.name}
              onChange={(e) => p.setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="avatar-shape-select">{t('Shape', 'Forma')}</label>
            <select
              id="avatar-shape-select"
              value={p.shape}
              onChange={(e) => p.setShape(e.target.value)}
            >
              {Object.entries(avatarShapes).map(([id, option]) => (
                <option key={id} value={id}>
                  {translate(language, option.label)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="avatar-expression">{t('Expression', 'Expresión')}</label>
            <select
              id="avatar-expression"
              value={p.expression}
              onChange={(e) => p.setExpression(e.target.value as ExpressionName)}
            >
              {Object.entries(avatarExpressions).map(([id, label]) => (
                <option key={id} value={id}>
                  {translate(language, label)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="avatar-eyes">{t('Eyes', 'Ojos')}</label>
            <select
              id="avatar-eyes"
              value={p.eyes}
              onChange={(e) => p.setEyes(e.target.value as EyeVariant)}
            >
              {Object.entries(avatarEyes).map(([id, label]) => (
                <option key={id} value={id}>
                  {translate(language, label)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="avatar-mouth">{t('Mouth', 'Boca')}</label>
            <select
              id="avatar-mouth"
              value={p.mouth}
              onChange={(e) => p.setMouth(e.target.value as MouthVariant)}
            >
              {Object.entries(avatarMouths).map(([id, label]) => (
                <option key={id} value={id}>
                  {translate(language, label)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="avatar-eyebrows">{t('Eyebrows', 'Cejas')}</label>
            <select
              id="avatar-eyebrows"
              value={p.eyebrows}
              onChange={(e) => p.setEyebrows(e.target.value as EyebrowVariant)}
            >
              {Object.entries(avatarEyebrows).map(([id, label]) => (
                <option key={id} value={id}>
                  {translate(language, label)}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.swatchContainer}>
            <label>{t('Color', 'Color')}</label>
            <div className={styles.swatches}>
              {p.colors.map((color, i) => (
                <button
                  key={color}
                  style={{ background: color }}
                  className={p.color === color ? styles.selected : ''}
                  aria-label={`Color ${i + 1}`}
                  aria-pressed={p.color === color}
                  onClick={() => p.setColor(color)}
                />
              ))}
            </div>
            <button className={contentStyles.btn} id="export-avatar" onClick={p.download}>
              {t('Download SVG', 'Descargar SVG')}
              <Download size={14} />
            </button>
          </div>
        </div>
      </div>
      {avatarCollection && (
        <section
          className={styles.savedAvatars}
          aria-label={t('Saved avatars', 'Avatares guardados')}
        >
          <div className={styles.savedAvatarsHeading}>
            <h3>{t('Your desktop characters', 'Tus personajes del escritorio')}</h3>
            <span>{avatarCollection.avatars.length}/5</span>
          </div>
          <p className={contentStyles.notice}>
            {t(
              'Saved in this browser. Drag up to five characters around your desktop. Select one to edit it; saving creates a new copy.',
              'Se guardan en este navegador. Podés arrastrar hasta cinco personajes por tu escritorio. Elegí uno para editarlo; guardar crea una copia.',
            )}
          </p>
          {avatarCollection.error && (
            <p className={styles.avatarStorageError} role="alert">
              {t(
                'Your browser could not save this change. Try enabling local storage.',
                'El navegador no pudo guardar el cambio. Probá habilitar el almacenamiento local.',
              )}
            </p>
          )}
          {avatarCollection.avatars.length >= 5 && (
            <p className={contentStyles.notice} role="status">
              {t(
                'All five spots are taken. Remove a character to save another.',
                'Los cinco lugares están ocupados. Eliminá un personaje para guardar otro.',
              )}
            </p>
          )}
          <div className={styles.savedAvatarList}>
            {avatarCollection.avatars.map((avatar) => (
              <div key={avatar.id} className={styles.savedAvatar}>
                <button className={styles.savedAvatarLoad} onClick={() => p.load(avatar)}>
                  <Character
                    name={avatar.name}
                    shape={avatarShapes[avatar.shape].shape}
                    expression={avatar.expression}
                    face={{ eyes: avatar.eyes, mouth: avatar.mouth, eyebrows: avatar.eyebrows }}
                    color={avatar.color}
                    size={38}
                    reducedMotion
                  />
                  <span>{avatar.name || t('Unnamed', 'Sin nombre')}</span>
                </button>
                <button
                  className={styles.savedAvatarRemove}
                  aria-label={t(
                    `Remove ${avatar.name || 'avatar'}`,
                    `Eliminar ${avatar.name || 'avatar'}`,
                  )}
                  onClick={() => avatarCollection.remove(avatar.id)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
      <p className={contentStyles.notice}>
        {t(
          'Powered by my faceshape-react library. The name changes the character’s geometry; combine shapes, expressions and facial features to make it yours.',
          'Hecho con mi librería faceshape-react. El nombre cambia la geometría del personaje; combiná formas, expresiones y rasgos para hacerlo tuyo.',
        )}
      </p>
      <ExternalLink href="https://ketzelitvak.github.io/faceshape-react/">
        {t('Explore the full library', 'Explorar la librería completa')}
      </ExternalLink>
    </div>
  );
}
