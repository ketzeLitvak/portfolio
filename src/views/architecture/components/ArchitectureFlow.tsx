import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

import type { ArchitectureProject } from '../../../models/architecture/architecture';

import type { ArchitecturePresenter } from '../../../presenters/useArchitecturePresenter';

import { translate, type Language } from '../../../models/types';

import styles from '../ArchitectureView.module.css';

export function ArchitectureFlow({
  project,
  presenter: p,
  language,
}: {
  project: ArchitectureProject;
  presenter: ArchitecturePresenter;
  language: Language;
}) {
  const last = p.index === project.flow.steps.length - 1;
  return (
    <section className={styles.flow} aria-label={translate(language, project.flow.title)}>
      <div className={styles.flowHeading}>
        <span>{translate(language, project.flow.title)}</span>
        <small>
          {p.index + 1} / {project.flow.steps.length}
        </small>
      </div>
      <div className={styles.progress} aria-hidden="true">
        {project.flow.steps.map((_, index) => (
          <i key={index} data-done={index <= p.index} />
        ))}
      </div>
      <div aria-live="polite" aria-atomic="true">
        <h3>{translate(language, p.step.title)}</h3>
        <p>{translate(language, p.step.description)}</p>
      </div>
      {p.step.example && (
        <div className={styles.example}>
          <small>
            {translate(language, [
              'Illustrative example · not live data',
              'Ejemplo ilustrativo · no son datos en vivo',
            ])}
          </small>
          <div>
            <section>
              <b>{translate(language, ['Before', 'Antes'])}</b>
              <p>{translate(language, p.step.example.before)}</p>
            </section>
            <section>
              <b>{translate(language, ['After', 'Después'])}</b>
              <p>{translate(language, p.step.example.after)}</p>
            </section>
          </div>
        </div>
      )}
      <div className={styles.flowActions}>
        <button disabled={p.index === 0} onClick={() => p.go(p.index - 1)}>
          <ArrowLeft size={14} />
          {translate(language, ['Previous', 'Anterior'])}
        </button>
        <button onClick={() => p.go(last ? 0 : p.index + 1)}>
          {translate(language, last ? ['Start again', 'Volver al inicio'] : ['Next', 'Siguiente'])}
          {last ? <RotateCcw size={14} /> : <ArrowRight size={14} />}
        </button>
      </div>
    </section>
  );
}
