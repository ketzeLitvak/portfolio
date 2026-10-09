import styles from './ExperimentHeader.module.css';

import { RotateCcw, Sparkles } from 'lucide-react';

import { translate, type Language, type Text } from '../../models/types';

export type ExperimentAppearance = 'cache' | 'permission' | 'events' | 'race' | 'lab';

export function ExperimentHeader({
  language,
  title,
  description,
  reset,
  disabled,
  appearance,
}: {
  language: Language;
  title: Text;
  description: Text;
  reset: () => void;
  disabled?: boolean;
  appearance: ExperimentAppearance;
}) {
  const label = translate(language, ['Start over', 'Empezar de nuevo']);
  return (
    <header className={styles[`${appearance}-intro`]}>
      <button
        className={styles[`${appearance}-reset`]}
        onClick={reset}
        disabled={disabled}
        aria-label={label}
        title={label}
      >
        <RotateCcw size={15} />
      </button>
      <span className={styles[`${appearance}-eyebrow`]}>
        <Sparkles size={13} />
        {translate(language, ['PLAY WITH A CONCEPT', 'JUGÁ CON UN CONCEPTO'])}
      </span>
      <h2>{translate(language, title)}</h2>
      <p>{translate(language, description)}</p>
    </header>
  );
}
