import { Download, Save, Check, AlertCircle, Paintbrush } from 'lucide-react';

import type { ViewProps } from '../../models/viewProps';

import type { Text } from '../../models/types';

import { translate } from '../../models/types';

import { useDrawingPresenter } from '../../presenters/useDrawingPresenter';

import { DrawingToolbar } from './components/DrawingToolbar';

import { DrawingPalette } from './components/DrawingPalette';

import { DrawingCanvas } from './components/DrawingCanvas';

import content from '../../styles/Content.module.css';

import styles from './DrawingView.module.css';

export function DrawingView({ language, drawingCollection }: ViewProps) {
  const p = useDrawingPresenter(drawingCollection);

  const t = (text: Text) => translate(language, text);

  const feedback: Record<typeof p.feedback, Text> = {
    ready: ['Draw something small. Make it yours.', 'Dibujá algo pequeño. Hacelo tuyo.'],
    exported: [
      'PNG exported with transparency, without the grid.',
      'PNG exportado con transparencia, sin la grilla.',
    ],
    character: [
      'Character saved. Drag it around the desktop.',
      'Personaje guardado. Arrastralo por el escritorio.',
    ],
    resized: [
      'Canvas resized. Undo restores its previous size and pixels.',
      'Lienzo redimensionado. Deshacer recupera su tamaño y píxeles anteriores.',
    ],
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
        <form
          className={styles.size}
          onSubmit={(event) => {
            event.preventDefault();
            p.changeSize(Number(p.sizeDraft));
          }}
        >
          <label htmlFor="drawing-size">{t(['Side length (pixels)', 'Lado (píxeles)'])}</label>
          <div>
            <input
              id="drawing-size"
              type="number"
              min="1"
              max="1024"
              step="1"
              required
              disabled={p.busy}
              value={p.sizeDraft}
              onChange={(event) => p.setSizeDraft(event.target.value)}
            />
            <button disabled={p.busy} type="submit">
              {t(['Resize', 'Aplicar'])}
            </button>
          </div>
          <small>
            1–1024 · {p.document.size} × {p.document.size}
          </small>
        </form>
      </header>
      <DrawingToolbar presenter={p} language={language} />
      <div className={styles.workspace}>
        <DrawingCanvas presenter={p} language={language} />
        <aside className={styles.sidebar}>
          <DrawingPalette presenter={p} language={language} />
          <div className={styles.preview}>
            <p>{t(['Preview', 'Vista previa'])}</p>
            <canvas
              ref={p.previewRef}
              className={styles.miniature}
              width={80}
              height={80}
              aria-hidden="true"
            />
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
      <label className={styles.characterName}>
        {t(['Character name (optional)', 'Nombre del personaje (opcional)'])}
        <input
          maxLength={24}
          value={p.characterName}
          onChange={(event) => p.setCharacterName(event.target.value)}
          placeholder="Pixel"
        />
      </label>
      <div className={styles.actions}>
        <button className={styles.primary} disabled={!p.hasPixels || p.busy} onClick={p.exportPng}>
          <Download size={16} />
          {t(['Export PNG', 'Exportar PNG'])}
        </button>
        <button
          disabled={!p.hasPixels || p.busy || !drawingCollection || p.characterCount >= 5}
          onClick={p.saveCharacter}
        >
          <Save size={16} />
          {t(['Save as character', 'Guardar como personaje'])} · {p.characterCount}/5
        </button>
      </div>
      <p className={styles.feedback} data-error={p.feedback === 'error'} role="status">
        {t(feedback[p.feedback])}
      </p>
      <details className={styles.help}>
        <summary>{t(['Keyboard & canvas tips', 'Teclado y consejos'])}</summary>
        <p id="drawing-keyboard-help">
          {t([
            'H: move canvas · P: pencil · E: eraser · F: fill · I: color picker. Focus the canvas, use arrow keys to select a pixel and Space or Enter to apply the tool. Ctrl/⌘ Z undoes a whole stroke; Ctrl/⌘ Shift Z redoes it.',
            'H: mover lienzo · P: pincel · E: borrador · F: relleno · I: cuentagotas. Enfocá el lienzo, usá las flechas para elegir un píxel y Espacio o Enter para aplicar la herramienta. Ctrl/⌘ Z deshace un trazo completo; Ctrl/⌘ Shift Z lo rehace.',
          ])}
        </p>
        <p>
          {t([
            'The checkerboard means transparency. PNGs use the canvas dimensions you choose, up to 1024 × 1024. Zoom and scroll to work on large drawings. Resizing preserves the top-left area; shrinking crops pixels and can be undone. Drawings saved as characters trim empty margins and can be dragged on the desktop. Undo history is limited by memory and lasts while this window is open.',
            'El damero indica transparencia. Los PNG usan el tamaño que elegís, hasta 1024 × 1024. Usá zoom y desplazamiento para trabajar en dibujos grandes. Redimensionar conserva la parte superior izquierda; achicar recorta píxeles y se puede deshacer. Los personajes recortan los márgenes vacíos y se pueden arrastrar por el escritorio. El historial se limita según la memoria y dura mientras la ventana está abierta.',
          ])}
        </p>
      </details>
    </div>
  );
}
