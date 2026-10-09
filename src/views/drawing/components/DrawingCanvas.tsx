import { translate, type Language } from '../../../models/types';

import type { DrawingPresenter } from '../../../presenters/useDrawingPresenter';

import styles from '../DrawingView.module.css';

export function DrawingCanvas({
  presenter: p,
  language,
}: {
  presenter: DrawingPresenter;
  language: Language;
}) {
  const size = p.document.size;
  return (
    <div>
      <div className={styles.zoom}>
        <label>
          {translate(language, ['Zoom', 'Zoom'])}
          <input
            aria-label="Zoom"
            type="range"
            min="1"
            max="16"
            step="1"
            value={p.zoom}
            onChange={(event) => p.setZoom(Number(event.target.value))}
          />
        </label>
        <span>{p.zoom}×</span>
      </div>
      <div className={styles.canvasViewport}>
        <div className={styles.canvasWrap} style={{ width: `${p.zoom * 100}%` }}>
          <canvas
            ref={p.canvasRef}
            width={Math.max(512, size)}
            height={Math.max(512, size)}
            className={styles.canvas}
            data-tool={p.tool}
            tabIndex={0}
            role="img"
            aria-label={translate(language, [
              `Pixel art canvas, ${size} by ${size} pixels. Use arrows to move and Space to draw.`,
              `Lienzo de pixel art, ${size} por ${size} píxeles. Usá las flechas para moverte y Espacio para dibujar.`,
            ])}
            aria-describedby="drawing-keyboard-help"
            onPointerDown={p.pointerDown}
            onPointerMove={p.pointerMove}
            onPointerUp={p.finishStroke}
            onPointerCancel={p.finishStroke}
            onLostPointerCapture={p.finishStroke}
            onContextMenu={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          />
          {p.grid && (size <= 64 || p.zoom >= Math.ceil(size / 64)) && (
            <span
              className={styles.gridOverlay}
              aria-hidden="true"
              style={{ backgroundSize: `${100 / size}% ${100 / size}%` }}
            />
          )}
          <span
            className={styles.cursor}
            aria-hidden="true"
            style={{
              left: `${(Math.min(p.cursor.x, size - 1) / size) * 100}%`,
              top: `${(Math.min(p.cursor.y, size - 1) / size) * 100}%`,
              width: `${100 / size}%`,
              height: `${100 / size}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
