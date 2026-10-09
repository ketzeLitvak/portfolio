import { OptionsPopover } from '../../../components/options/OptionsPopover';

import { OptionChoices, type OptionChoice } from '../../../components/options/OptionChoices';

import { translate, type Language, type Text } from '../../../models/types';

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
  options: OptionChoice<T>[];
  onChange: (id: T) => void;
  disabled?: boolean;
}) {
  const selected = options.find((option) => option.id === value)!;
  return (
    <OptionsPopover
      language={language}
      appearance="permission"
      valueLabel={translate(language, selected.title)}
      label={`${translate(language, label)}: ${translate(language, selected.title)}`}
      title={translate(language, label)}
      disabled={disabled}
    >
      {(close) => (
        <OptionChoices
          language={language}
          appearance="permission"
          label={translate(language, label)}
          value={value}
          options={options}
          onChange={(id) => {
            onChange(id);
            close();
          }}
        />
      )}
    </OptionsPopover>
  );
}
