import { Check } from 'lucide-react';

import { drawingPalette } from '../../../models/drawing';

import { translate, type Language } from '../../../models/types';

import type { DrawingPresenter } from '../../../presenters/useDrawingPresenter';

import styles from '../DrawingView.module.css';

export function DrawingPalette({
  presenter: p,
  language,
}: {
  presenter: DrawingPresenter;
  language: Language;
}) {
  const pick = (color: string) => {
    p.setColor(color);
    if (p.tool === 'eraser' || p.tool === 'picker') p.setTool('pencil');
  };

  return (
    <div className={styles.palette}>
      <div
        className={styles.swatches}
        role="group"
        aria-label={translate(language, ['Color palette', 'Paleta de colores'])}
      >
        {drawingPalette.map((color) => (
          <button
            key={color}
            style={{ background: color }}
            aria-label={translate(language, [`Color ${color}`, `Color ${color}`])}
            aria-pressed={p.color.toLowerCase() === color}
            disabled={p.busy}
            onClick={() => pick(color)}
          >
            {p.color.toLowerCase() === color && (
              <Check
                size={15}
                color={color === '#ffffff' || color === '#facc15' ? '#353531' : '#ffffff'}
              />
            )}
          </button>
        ))}
      </div>
      <label className={styles.customColor}>
        {translate(language, ['Custom color', 'Color propio'])}
        <input
          type="color"
          value={p.color}
          disabled={p.busy}
          onChange={(event) => pick(event.target.value)}
        />
        <code>{p.color}</code>
      </label>
    </div>
  );
}
