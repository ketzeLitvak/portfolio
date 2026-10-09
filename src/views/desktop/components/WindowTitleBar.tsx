import windowStyles from './DesktopWindow.module.css';

import { Minus, Square, X, Link2, type LucideIcon } from 'lucide-react';

import { translate, type WindowState } from '../../../models/types';

import type { DesktopPresenter } from '../../../presenters/useDesktopPresenter';

import type { useWindowPresenter } from '../../../presenters/useWindowPresenter';

export function WindowTitleBar({
  state,
  desktop,
  title,
  icon: Icon,
  drag,
}: {
  state: WindowState;
  desktop: DesktopPresenter;
  title: string;
  icon: LucideIcon;
  drag: ReturnType<typeof useWindowPresenter>;
}) {
  const t = (en: string, es: string) => translate(desktop.language, [en, es]);

  return (
    <div
      className={windowStyles.windowBar}
      onPointerDown={drag.startDrag}
      onPointerMove={drag.moveDrag}
      onPointerUp={drag.endDrag}
      onPointerCancel={drag.endDrag}
      onDoubleClick={drag.doubleClick}
    >
      <div className={windowStyles.windowTitle}>
        <Icon size={15} />
        <b>{title}</b>
      </div>
      <div className={windowStyles.windowActions}>
        <button
          className={windowStyles.copyLink}
          aria-label={t('Copy link', 'Copiar enlace')}
          title={t('Copy link', 'Copiar enlace')}
          onClick={() =>
            desktop.share.copy(
              state.id,
              state.id === 'experience'
                ? { experience: state.experienceTarget?.id ?? 'geopagos' }
                : undefined,
            )
          }
        >
          <Link2 size={16} />
        </button>
        <button
          className={windowStyles.minimize}
          aria-label={t('Minimize', 'Minimizar')}
          onClick={() => desktop.minimize(state.id)}
        >
          <Minus size={16} />
        </button>
        <button
          className={windowStyles.maximize}
          aria-label={t('Maximize', 'Maximizar')}
          onClick={() => desktop.maximize(state.id)}
        >
          <Square size={16} />
        </button>
        <button
          className={windowStyles.close}
          aria-label={t('Close', 'Cerrar')}
          onClick={() => desktop.close(state.id)}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
