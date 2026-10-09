import type {
  CharacterProps,
  ExpressionName,
  EyeVariant,
  MouthVariant,
  EyebrowVariant,
} from 'faceshape-react';

import {
  cat,
  cloud,
  device,
  flower,
  ghost,
  heart,
  penguin,
  planet,
  robot,
  shark,
} from 'faceshape-react/shapes';

import type { Text } from './types';

export const avatarShapes: Record<
  string,
  { label: Text; shape: CharacterProps['shape']; mouth?: MouthVariant }
> = {
  blob: { label: ['Blob', 'Blob'], shape: 'blob' },
  circle: { label: ['Circle', 'Círculo'], shape: 'circle' },
  square: { label: ['Square', 'Cuadrado'], shape: 'square' },
  star: { label: ['Star', 'Estrella'], shape: 'star' },
  triangle: { label: ['Triangle', 'Triángulo'], shape: 'triangle' },
  heart: { label: ['Heart', 'Corazón'], shape: heart },
  shark: { label: ['Shark', 'Tiburón'], shape: shark, mouth: 'shark' },
  penguin: { label: ['Penguin', 'Pingüino'], shape: penguin, mouth: 'beak' },
  cat: { label: ['Cat', 'Gato'], shape: cat, mouth: 'cat' },
  robot: { label: ['Robot', 'Robot'], shape: robot },
  planet: { label: ['Planet', 'Planeta'], shape: planet },
  cloud: { label: ['Cloud', 'Nube'], shape: cloud },
  ghost: { label: ['Ghost', 'Fantasma'], shape: ghost },
  flower: { label: ['Flower', 'Flor'], shape: flower },
  device: { label: ['Device', 'Dispositivo'], shape: device },
};
export const avatarExpressions: Record<ExpressionName, Text> = {
  neutral: ['Neutral', 'Neutral'],
  happy: ['Happy', 'Feliz'],
  sad: ['Sad', 'Triste'],
  angry: ['Angry', 'Enojado'],
  surprised: ['Surprised', 'Sorprendido'],
  sleepy: ['Sleepy', 'Dormido'],
};
export const avatarEyes: Record<string, Text> = {
  bright: ['Bright', 'Brillantes'],
  round: ['Round', 'Redondos'],
  cute: ['Cute', 'Tiernos'],
  heart: ['Hearts', 'Corazones'],
  star: ['Stars', 'Estrellas'],
  eyelashes: ['Eyelashes', 'Pestañas'],
  cyclops: ['Cyclops', 'Cíclope'],
  softLids: ['Soft lids', 'Párpados suaves'],
  spiral: ['Spirals', 'Espirales'],
};
export const avatarMouths: Record<string, Text> = {
  tongue: ['Tongue', 'Lengua'],
  standard: ['Simple line', 'Línea simple'],
  wide: ['Wide', 'Amplia'],
  gentle: ['Gentle', 'Suave'],
  toothy: ['Teeth', 'Dientes'],
  shark: ['Shark teeth', 'Dientes de tiburón'],
  beak: ['Beak', 'Pico'],
  cat: ['Cat', 'Gato'],
  smirk: ['Smirk', 'Sonrisa de lado'],
};
export const avatarEyebrows: Record<EyebrowVariant, Text> = {
  expression: ['Match expression', 'Según expresión'],
  none: ['None', 'Sin cejas'],
  soft: ['Soft', 'Suaves'],
  raised: ['Raised', 'Levantadas'],
  angry: ['Angry', 'Enojadas'],
  sad: ['Sad', 'Tristes'],
};

export interface AvatarConfig {
  name: string;
  shape: string;
  expression: ExpressionName;
  eyes: EyeVariant;
  mouth: MouthVariant;
  eyebrows: EyebrowVariant;
  color: string;
}
export interface AvatarPosition {
  x: number;
  y: number;
}
export interface SavedAvatar extends AvatarConfig {
  id: string;
  position?: AvatarPosition;
}

export function isAvatarConfig(value: unknown): value is AvatarConfig {
  if (!value || typeof value !== 'object') return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.name === 'string' &&
    p.name.length <= 80 &&
    typeof p.shape === 'string' &&
    Object.hasOwn(avatarShapes, p.shape) &&
    typeof p.expression === 'string' &&
    Object.hasOwn(avatarExpressions, p.expression) &&
    typeof p.eyes === 'string' &&
    Object.hasOwn(avatarEyes, p.eyes) &&
    typeof p.mouth === 'string' &&
    Object.hasOwn(avatarMouths, p.mouth) &&
    typeof p.eyebrows === 'string' &&
    Object.hasOwn(avatarEyebrows, p.eyebrows) &&
    typeof p.color === 'string' &&
    /^#[0-9a-f]{6}$/i.test(p.color)
  );
}
