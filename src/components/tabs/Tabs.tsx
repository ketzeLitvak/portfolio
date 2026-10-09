import styles from './Tabs.module.css';

import { classNames } from '../../utils/classNames';

import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';

export interface TabItem<T extends string> {
  id: T;
  label: ReactNode;
  icon?: ReactNode;
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  panelId,
  className,
  idPrefix,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  panelId: string;
  className?: string;
  idPrefix?: string;
}) {
  const generatedId = useId();
  const prefix = idPrefix ?? generatedId;
  const buttons = useRef(new Map<T, HTMLButtonElement>());

  const navigate = (event: KeyboardEvent<HTMLButtonElement>) => {
    const current = items.findIndex((item) => item.id === value);
    const next =
      event.key === 'ArrowRight'
        ? (current + 1) % items.length
        : event.key === 'ArrowLeft'
          ? (current + items.length - 1) % items.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? items.length - 1
              : -1;
    if (next < 0) return;
    event.preventDefault();
    onChange(items[next].id);
    buttons.current.get(items[next].id)?.focus();
  };

  return (
    <div
      className={className ? classNames(styles.experienceTabs, className) : styles.experienceTabs}
      role="tablist"
      aria-label={label}
    >
      {items.map((item) => (
        <button
          key={item.id}
          ref={(element) => {
            if (element) buttons.current.set(item.id, element);
            else buttons.current.delete(item.id);
          }}
          id={prefix + '-' + item.id}
          role="tab"
          aria-selected={value === item.id}
          tabIndex={value === item.id ? 0 : -1}
          aria-controls={panelId}
          onClick={() => onChange(item.id)}
          onKeyDown={navigate}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
