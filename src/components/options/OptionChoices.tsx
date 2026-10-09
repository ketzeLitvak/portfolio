import optionStyles from './OptionsPopover.module.css';

import { Check } from 'lucide-react';

import { translate, type Language, type Text } from '../../models/types';

import type { OptionsAppearance } from './OptionsPopover';

export interface OptionChoice<T extends string> {
  id: T;
  title: Text;
  description: Text;
}

export function OptionChoices<T extends string>({
  language,
  appearance,
  label,
  value,
  options,
  onChange,
}: {
  language: Language;
  appearance: OptionsAppearance;
  label: string;
  value: T;
  options: readonly OptionChoice<T>[];
  onChange: (id: T) => void;
}) {
  return (
    <div
      className={
        appearance === 'cache'
          ? optionStyles.cacheStrategyChoices
          : appearance === 'events'
            ? optionStyles.eventsDeliveries
            : undefined
      }
      role="group"
      aria-label={label}
    >
      {options.map((option) => (
        <button
          key={option.id}
          aria-pressed={value === option.id}
          data-option={option.id}
          data-strategy={appearance === 'cache' ? option.id : undefined}
          data-delivery={appearance === 'events' ? option.id : undefined}
          onClick={() => onChange(option.id)}
        >
          <span>
            <strong>{translate(language, option.title)}</strong>
            {value === option.id && <Check size={14} />}
          </span>
          <small>{translate(language, option.description)}</small>
        </button>
      ))}
    </div>
  );
}
