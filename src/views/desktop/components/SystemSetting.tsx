import { Check, type LucideIcon } from 'lucide-react';

import styles from './DesktopMenuBar.module.css';

export function SystemSetting<T extends string>({
  id,
  label,
  title,
  heading,
  icon: Icon,
  open,
  value,
  options,
  onToggle,
  onSelect,
}: {
  id: string;
  label: string;
  title: string;
  heading: string;
  icon: LucideIcon;
  open: boolean;
  value: T;
  options: { value: T; label: string; icon?: LucideIcon }[];
  onToggle: () => void;
  onSelect: (value: T) => void;
}) {
  const panelId = id + '-popover';

  return (
    <div className={styles.systemOption} data-system-option>
      <button
        id={id}
        className={styles.systemTrigger}
        aria-label={label}
        title={title}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <Icon size={17} />
      </button>
      {open && (
        <div id={panelId} className={styles.systemPopover} role="group" aria-label={title}>
          <p>{heading}</p>
          {options.map((option) => {
            const OptionIcon = option.icon;
            return (
              <button
                key={option.value}
                aria-pressed={value === option.value}
                onClick={() => onSelect(option.value)}
              >
                {OptionIcon ? (
                  <>
                    <OptionIcon size={15} />
                    <span>{option.label}</span>
                  </>
                ) : (
                  option.label
                )}
                {value === option.value && <Check size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
