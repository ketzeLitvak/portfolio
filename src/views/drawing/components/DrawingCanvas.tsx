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
    <div className={styles.canvasWrap}>
      <canvas
        ref={p.canvasRef}
        width={size * 20}
        height={size * 20}
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
  );
}
