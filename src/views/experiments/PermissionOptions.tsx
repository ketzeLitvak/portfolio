import { createPortal } from 'react-dom';
import { Check, ChevronDown, X } from 'lucide-react';
import { useExperimentPopoverPresenter } from '../../presenters/useExperimentPopoverPresenter';
import { translate, type Language, type Text } from '../../models/types';
export function PermissionOptions<T extends string>({
  language,
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  language: Language;
  label: Text;
  value: T;
  options: { id: T; title: Text; description: Text }[];
  onChange: (id: T) => void;
  disabled?: boolean;
}) {
  const p = useExperimentPopoverPresenter();
  const t = (text: Text) => translate(language, text);
  const selected = options.find((option) => option.id === value)!;
  return (
    <>
      <button
        className="permission-option-trigger"
        ref={p.triggerRef}
        onClick={p.toggle}
        disabled={disabled}
        aria-controls={p.id}
        aria-expanded={!!p.position}
        aria-label={`${t(label)}: ${t(selected.title)}`}
      >
        {t(selected.title)}
        <ChevronDown size={13} />
      </button>
      {p.position &&
        createPortal(
          <div
            className="permission-options"
            id={p.id}
            ref={p.panelRef}
            style={p.position}
            role="region"
            aria-label={t(label)}
          >
            <header>
              <strong>{t(label)}</strong>
              <button
                aria-label={t(['Close options', 'Cerrar opciones'])}
                onClick={() => {
                  p.close();
                  p.triggerRef.current?.focus();
                }}
              >
                <X size={15} />
              </button>
            </header>
            <div role="group" aria-label={t(label)}>
              {options.map((option) => (
                <button
                  key={option.id}
                  aria-pressed={value === option.id}
                  data-option={option.id}
                  onClick={() => {
                    onChange(option.id);
                    p.close();
                    p.triggerRef.current?.focus();
                  }}
                >
                  <span>
                    <strong>{t(option.title)}</strong>
                    {option.id === value && <Check size={14} />}
                  </span>
                  <small>{t(option.description)}</small>
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
