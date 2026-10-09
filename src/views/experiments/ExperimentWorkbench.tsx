import type { ReactNode } from 'react';

import { translate, type Language, type Text } from '../../models/types';

import { classNames } from '../../utils/classNames';

import { ExperimentHeader } from './ExperimentHeader';

import { ExperimentExplanation } from './ExperimentExplanation';

import styles from './ExperimentWorkbench.module.css';

export function ExperimentWorkbench({
  language,
  title,
  description,
  reset,
  busy,
  className,
  children,
  explanation,
  docs,
  real = false,
  error,
}: {
  language: Language;
  title: Text;
  description: Text;
  reset: () => void;
  busy?: boolean;
  className: string;
  children: ReactNode;
  explanation: ReactNode;
  docs: string;
  real?: boolean;
  error?: boolean;
}) {
  return (
    <div className={classNames(styles.root, className)}>
      <ExperimentHeader
        language={language}
        appearance="lab"
        title={title}
        description={description}
        reset={reset}
        disabled={busy}
      />
      {children}
      {error && (
        <p className={styles.error} role="alert">
          {translate(language, [
            'Your browser could not complete the operation. Try again in a browser with Web Crypto support.',
            'El navegador no pudo completar la operación. Probá de nuevo en un navegador con soporte de Web Crypto.',
          ])}
        </p>
      )}
      <footer className={styles.footer}>
        {translate(
          language,
          real
            ? [
                'Real cryptography · runs in your browser',
                'Criptografía real · se ejecuta en tu navegador',
              ]
            : ['Local model · illustrative operations', 'Modelo local · operaciones de ejemplo'],
        )}
      </footer>
      <ExperimentExplanation language={language} appearance="lab">
        {explanation}
        <a href={docs} target="_blank" rel="noreferrer">
          {translate(language, ['Explore the concept', 'Explorar el concepto'])} →
        </a>
      </ExperimentExplanation>
    </div>
  );
}
