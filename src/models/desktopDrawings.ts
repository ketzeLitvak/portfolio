import type { AvatarPosition } from './avatars';

export interface SavedDrawingCharacter {
  id: string;
  name: string;
  image: string;
  position: AvatarPosition;
}
export const desktopDrawingsKey = 'ketze-desktop-drawings';

export function validDrawingImage(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length < 3_000_000 &&
    /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(value)
  );
}

export function readDesktopDrawings(value: string): SavedDrawingCharacter[] {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    return parsed
      .filter((item) => {
        if (
          typeof item?.id !== 'string' ||
          seen.has(item.id) ||
          typeof item.name !== 'string' ||
          !validDrawingImage(item.image) ||
          !Number.isFinite(item.position?.x) ||
          !Number.isFinite(item.position?.y)
        )
          return false;
        seen.add(item.id);
        return true;
      })
      .slice(0, 5)
      .map((item) => ({
        ...item,
        name: item.name.slice(0, 24),
        position: {
          x: Math.max(0, Math.min(1, item.position.x)),
          y: Math.max(0, Math.min(1, item.position.y)),
        },
      }));
  } catch {
    return [];
  }
}
