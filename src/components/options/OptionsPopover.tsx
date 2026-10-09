import styles from './OptionsPopover.module.css';

import { createPortal } from 'react-dom';

import type { ReactNode } from 'react';

import { ChevronDown, X } from 'lucide-react';

import { useExperimentPopoverPresenter } from '../../presenters/useExperimentPopoverPresenter';

import { translate, type Language } from '../../models/types';

export type OptionsAppearance = 'cache' | 'permission' | 'events' | 'lab';

export function OptionsPopover({
  language,
  appearance,
  valueLabel,
  label,
  title = label,
  disabled,
  children,
}: {
  language: Language;
  appearance: OptionsAppearance;
  valueLabel: ReactNode;
  label: string;
  title?: string;
  disabled?: boolean;
  children: (close: () => void) => ReactNode;
}) {
  const p = useExperimentPopoverPresenter();

  const close = () => {
    p.close();
    p.triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={p.triggerRef}
        className={
          appearance === 'lab'
            ? styles.labTrigger
            : appearance === 'cache'
              ? styles.cacheStrategyTrigger
              : appearance === 'permission'
                ? styles.permissionOptionTrigger
                : styles.eventsOptionsTrigger
        }
        onClick={p.toggle}
        disabled={disabled}
        aria-controls={p.id}
        aria-expanded={!!p.position}
        aria-label={label}
        title={label}
      >
        {valueLabel}
        <ChevronDown size={13} />
      </button>
      {p.position &&
        createPortal(
          <div
            ref={p.panelRef}
            id={p.id}
            className={
              appearance === 'lab'
                ? styles.labPanel
                : appearance === 'cache'
                  ? styles.cacheStrategyPopover
                  : appearance === 'permission'
                    ? styles.permissionOptions
                    : styles.eventsOptions
            }
            style={p.position}
            role="region"
            aria-label={title}
          >
            <header>
              <strong>{title}</strong>
              <button
                onClick={close}
                aria-label={translate(language, ['Close options', 'Cerrar opciones'])}
              >
                <X size={15} />
              </button>
            </header>
            {children(close)}
          </div>,
          document.body,
        )}
    </>
  );
}
