import type { LucideIcon } from 'lucide-react';

import { OptionsPopover } from '../../components/options/OptionsPopover';

import { OptionChoices, type OptionChoice } from '../../components/options/OptionChoices';

import type { Language } from '../../models/types';

export function ExperimentActionSelect<T extends string>({
  language,
  label,
  title,
  icon: Icon,
  disabled,
  value,
  options,
  onSelect,
}: {
  language: Language;
  label: string;
  title: string;
  icon: LucideIcon;
  disabled?: boolean;
  value: T;
  options: readonly OptionChoice<T>[];
  onSelect: (id: T) => void;
}) {
  return (
    <OptionsPopover
      language={language}
      appearance="lab"
      valueLabel={
        <>
          <Icon size={16} />
          {label}
        </>
      }
      label={label}
      title={title}
      disabled={disabled}
    >
      {(close) => (
        <OptionChoices
          language={language}
          appearance="lab"
          label={title}
          value={value}
          options={options}
          onChange={(id) => {
            close();
            onSelect(id);
          }}
        />
      )}
    </OptionsPopover>
  );
}
