import { ArrowDownToLine, ArrowUpFromLine, Lightbulb, Map } from 'lucide-react';

import { translate, type Language } from '../../../models/types';

import type { ArchitecturePresenter } from '../../../presenters/useArchitecturePresenter';

import { architectureIcons } from './ArchitectureMap';

import styles from '../ArchitectureView.module.css';

export function ArchitectureDetails({
  presenter: p,
  language,
}: {
  presenter: ArchitecturePresenter;
  language: Language;
}) {
  const node = p.node,
    Icon = architectureIcons[node.icon];
  return (
    <aside
      id="architecture-detail"
      ref={p.detailsRef}
      className={styles.details}
      aria-label={translate(language, ['Component details', 'Detalle del componente'])}
    >
      <header>
        <Icon size={21} />
        <h3>{translate(language, node.title)}</h3>
      </header>
      <div className={styles.tags}>
        {node.technology.map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
      </div>
      <p>{translate(language, node.role)}</p>
      <dl>
        <dt>
          <ArrowDownToLine size={13} />
          {translate(language, ['Receives', 'Recibe'])}
        </dt>
        <dd>{translate(language, node.input)}</dd>
        <dt>
          <ArrowUpFromLine size={13} />
          {translate(language, ['Produces', 'Produce'])}
        </dt>
        <dd>{translate(language, node.output)}</dd>
      </dl>
      <div className={styles.rationale}>
        <h4>
          <Lightbulb size={14} />
          {translate(language, ['Design decision', 'Decisión de diseño'])}
        </h4>
        <p>{translate(language, node.rationale)}</p>
      </div>
      <button className={styles.backToMap} onClick={p.backToMap}>
        <Map size={14} />
        {translate(language, ['Back to the map', 'Volver al mapa'])}
      </button>
    </aside>
  );
}
