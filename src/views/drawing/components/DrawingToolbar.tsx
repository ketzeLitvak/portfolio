import {
  Hand,
  Pencil,
  Eraser,
  PaintBucket,
  Pipette,
  Undo2,
  Redo2,
  Grid2X2,
  Trash2,
} from 'lucide-react';

import type { DrawingTool } from '../../../models/drawing';

import type { Language, Text } from '../../../models/types';

import { translate } from '../../../models/types';

import type { DrawingPresenter } from '../../../presenters/useDrawingPresenter';

import styles from '../DrawingView.module.css';

const tools = [
  { id: 'pan', label: ['Move canvas', 'Mover lienzo'], icon: Hand, key: 'H' },
  { id: 'pencil', label: ['Pencil', 'Pincel'], icon: Pencil, key: 'P' },
  { id: 'eraser', label: ['Eraser', 'Borrador'], icon: Eraser, key: 'E' },
  { id: 'fill', label: ['Fill', 'Relleno'], icon: PaintBucket, key: 'F' },
  { id: 'picker', label: ['Color picker', 'Cuentagotas'], icon: Pipette, key: 'I' },
] satisfies { id: DrawingTool; label: Text; icon: typeof Pencil; key: string }[];

export function DrawingToolbar({
  presenter: p,
  language,
}: {
  presenter: DrawingPresenter;
  language: Language;
}) {
  const t = (text: Text) => translate(language, text);

  return (
    <div className={styles.toolbar}>
      <div
        className={styles.toolGroup}
        role="group"
        aria-label={t(['Drawing tools', 'Herramientas de dibujo'])}
      >
        {tools.map(({ id, label, icon: Icon, key }) => (
          <button
            key={id}
            aria-pressed={p.tool === id}
            aria-label={t(label)}
            title={`${t(label)} (${key})`}
            disabled={p.busy}
            onClick={() => p.setTool(id)}
          >
            <Icon size={17} />
            <span>{t(label)}</span>
          </button>
        ))}
      </div>
      <div
        className={styles.toolGroup}
        role="group"
        aria-label={t(['Canvas actions', 'Acciones del lienzo'])}
      >
        <button
          aria-label={t(['Undo', 'Deshacer'])}
          title={t(['Undo (Ctrl/⌘ Z)', 'Deshacer (Ctrl/⌘ Z)'])}
          disabled={!p.canUndo}
          onClick={p.undo}
        >
          <Undo2 size={17} />
        </button>
        <button
          aria-label={t(['Redo', 'Rehacer'])}
          title={t(['Redo (Ctrl/⌘ Shift Z)', 'Rehacer (Ctrl/⌘ Shift Z)'])}
          disabled={!p.canRedo}
          onClick={p.redo}
        >
          <Redo2 size={17} />
        </button>
        <button
          aria-label={t(['Show grid', 'Mostrar grilla'])}
          title={t(['Show grid', 'Mostrar grilla'])}
          aria-pressed={p.grid}
          onClick={() => p.setGrid(!p.grid)}
        >
          <Grid2X2 size={17} />
        </button>
        <button
          aria-label={t(['Clear canvas', 'Limpiar lienzo'])}
          title={t(['Clear canvas · can be undone', 'Limpiar lienzo · se puede deshacer'])}
          disabled={!p.hasPixels || p.busy}
          onClick={p.clear}
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
}
