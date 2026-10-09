import { Download, Image, RotateCcw, Check, AlertCircle, Paintbrush } from 'lucide-react';

import type { ViewProps } from '../../models/viewProps';

import type { Text } from '../../models/types';

import { translate } from '../../models/types';

import type { DrawingSize } from '../../models/drawing';

import { useDrawingPresenter } from '../../presenters/useDrawingPresenter';

import { DrawingToolbar } from './components/DrawingToolbar';

import { DrawingPalette } from './components/DrawingPalette';

import { DrawingCanvas } from './components/DrawingCanvas';

import content from '../../styles/Content.module.css';

import styles from './DrawingView.module.css';

export function DrawingView({ language, wallpaper }: ViewProps) {
  const p = useDrawingPresenter(wallpaper);

  const t = (text: Text) => translate(language, text);

  const feedback: Record<typeof p.feedback, Text> = {
    ready: ['Draw something small. Make it yours.', 'Dibujá algo pequeño. Hacelo tuyo.'],
    exported: [
      'PNG exported with transparency, without the grid.',
      'PNG exportado con transparencia, sin la grilla.',
    ],
    wallpaper: [
      'Your drawing is now the desktop wallpaper.',
      'Tu dibujo ahora es el fondo del escritorio.',
    ],
    restored: ['Original wallpaper restored.', 'Fondo original restaurado.'],
    error: [
      'Could not complete the operation. Your drawing is still on the canvas.',
      'No se pudo completar la operación. Tu dibujo sigue en el lienzo.',
    ],
    new: [
      'Fresh canvas. Undo brings your previous drawing back.',
      'Lienzo nuevo. Deshacer recupera tu dibujo anterior.',
    ],
  };
  return (
    <div className={styles.root} onKeyDown={p.keyDown}>
      <p className={content.kicker}>
        <Paintbrush size={13} /> PIXEL STUDIO
      </p>
      <header className={styles.header}>
        <div>
          <h2>{t(['A few pixels. Your own world.', 'Unos píxeles. Tu propio mundo.'])}</h2>
          <p>
            {t([
              'Draw with your mouse or finger. Your canvas is saved on this device.',
              'Dibujá con el mouse o el dedo. El lienzo se guarda en este dispositivo.',
            ])}
          </p>
        </div>
        <label className={styles.size}>
          {t(['Canvas', 'Lienzo'])}
          <select
            aria-label={t(['Canvas size', 'Tamaño del lienzo'])}
            disabled={p.busy}
            value={p.document.size}
            onChange={(event) => p.changeSize(Number(event.target.value) as DrawingSize)}
          >
            <option value="16">16 × 16</option>
            <option value="32">32 × 32</option>
          </select>
        </label>
      </header>
      <DrawingToolbar presenter={p} language={language} />
      <div className={styles.workspace}>
        <DrawingCanvas presenter={p} language={language} />
        <aside className={styles.sidebar}>
          <DrawingPalette presenter={p} language={language} />
          <div className={styles.preview}>
            <p>{t(['Preview', 'Vista previa'])}</p>
            <div
              className={styles.miniature}
              aria-hidden="true"
              style={{ gridTemplateColumns: `repeat(${p.document.size},1fr)` }}
            >
              {p.document.pixels.map((color, index) => (
                <i key={index} style={{ background: color ?? 'transparent' }} />
              ))}
            </div>
            <span>
              {p.document.size} × {p.document.size} px
            </span>
          </div>
        </aside>
      </div>
      <div className={styles.status}>
        <span aria-live="polite">
          {p.saved ? <Check size={13} /> : <AlertCircle size={13} />}{' '}
          {t(
            p.saved
              ? ['Saved on this device', 'Guardado en este dispositivo']
              : [
                  'Storage unavailable · export to keep your drawing',
                  'Guardado no disponible · exportá para conservar tu dibujo',
                ],
          )}
        </span>
        <span>
          {p.cursor.x + 1}, {p.cursor.y + 1}
        </span>
      </div>
      <div className={styles.actions}>
        <button className={styles.primary} disabled={!p.hasPixels || p.busy} onClick={p.exportPng}>
          <Download size={16} />
          {t(['Export PNG', 'Exportar PNG'])}
        </button>
        <button disabled={!p.hasPixels || p.busy || !wallpaper} onClick={p.applyWallpaper}>
          <Image size={16} />
          {t(['Use as wallpaper', 'Usar como fondo'])}
        </button>
        {p.hasWallpaper && (
          <button onClick={p.restoreWallpaper}>
            <RotateCcw size={15} />
            {t(['Restore wallpaper', 'Restaurar fondo'])}
          </button>
        )}
      </div>
      <p className={styles.feedback} data-error={p.feedback === 'error'} role="status">
        {t(feedback[p.feedback])}
      </p>
      <details className={styles.help}>
        <summary>{t(['Keyboard & canvas tips', 'Teclado y consejos'])}</summary>
        <p id="drawing-keyboard-help">
          {t([
            'P: pencil · E: eraser · F: fill · I: color picker. Focus the canvas, use arrow keys to select a pixel and Space or Enter to apply the tool. Ctrl/⌘ Z undoes a whole stroke; Ctrl/⌘ Shift Z redoes it.',
            'P: pincel · E: borrador · F: relleno · I: cuentagotas. Enfocá el lienzo, usá las flechas para elegir un píxel y Espacio o Enter para aplicar la herramienta. Ctrl/⌘ Z deshace un trazo completo; Ctrl/⌘ Shift Z lo rehace.',
          ])}
        </p>
        <p>
          {t([
            'The checkerboard means transparency. Exports are 512 × 512 or 1024 × 1024 pixels, with sharp edges. Changing canvas size starts a new drawing and can be undone. Only the current canvas is saved; undo history lasts while this window is open.',
            'El damero indica transparencia. Los PNG son de 512 × 512 o 1024 × 1024 píxeles, con bordes nítidos. Cambiar el tamaño inicia un dibujo nuevo y se puede deshacer. Se guarda el lienzo actual; el historial dura mientras esta ventana está abierta.',
          ])}
        </p>
      </details>
    </div>
  );
}
