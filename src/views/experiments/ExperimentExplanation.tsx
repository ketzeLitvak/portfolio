import styles from './ExperimentExplanation.module.css';

import type { ReactNode } from 'react';

import { translate, type Language } from '../../models/types';

import type { ExperimentAppearance } from './ExperimentHeader';

export function ExperimentExplanation({
  language,
  appearance,
  children,
}: {
  language: Language;
  appearance: ExperimentAppearance;
  children: ReactNode;
}) {
  return (
    <details className={styles[`${appearance}-explanation`]}>
      <summary>{translate(language, ['How does it work?', '¿Cómo funciona?'])}</summary>
      {children}
    </details>
  );
}
