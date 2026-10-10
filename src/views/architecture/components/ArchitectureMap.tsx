import { useId, type CSSProperties } from 'react';

import { Globe, Server, Database, Workflow, Braces, Layers, MapPin } from 'lucide-react';

import type { ArchitectureProject } from '../../../models/architecture/architecture';

import { translate, type Language } from '../../../models/types';

import { useArchitectureMapPresenter } from '../../../presenters/useArchitectureMapPresenter';

import type { ArchitecturePresenter } from '../../../presenters/useArchitecturePresenter';

import styles from '../ArchitectureView.module.css';

export const architectureIcons = {
  web: Globe,
  api: Server,
  data: Database,
  worker: Workflow,
  pipeline: Braces,
  gold: Layers,
  sources: MapPin,
};

export function ArchitectureMap({
  project,
  presenter: p,
  language,
}: {
  project: ArchitectureProject;
  presenter: ArchitecturePresenter;
  language: Language;
}) {
  const map = useArchitectureMapPresenter(project.edges),
    marker = useId();
  return (
    <div ref={p.mapRef}>
      <p className={styles.mapHint}>
        {translate(language, [
          'Select a component to explore it.',
          'Elegí un componente para explorarlo.',
        ])}
      </p>
      <div
        ref={map.ref}
        className={styles.map}
        aria-label={translate(language, ['Radix component map', 'Mapa de componentes de Radix'])}
      >
        <svg
          className={styles.connections}
          viewBox={`0 0 ${map.geometry.width} ${map.geometry.height}`}
          aria-hidden="true"
        >
          <defs>
            <marker
              id={marker}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10Z" fill="currentColor" />
            </marker>
          </defs>
          {map.geometry.paths.map((path) => (
            <path
              key={path.id}
              d={path.d}
              data-edge={path.id}
              data-active={p.activeEdges.includes(path.id)}
              data-kind={path.kind}
              fill="none"
              markerEnd={`url(#${marker})`}
              markerStart={path.bidirectional ? `url(#${marker})` : undefined}
            />
          ))}
        </svg>
        {project.nodes.map((node) => {
          const Icon = architectureIcons[node.icon];
          return (
            <button
              key={node.id}
              data-node={node.id}
              data-layer={['bronze', 'silver', 'gold'].includes(node.id) ? node.id : undefined}
              data-active={p.activeNodes.includes(node.id)}
              aria-pressed={p.selected === node.id}
              aria-controls="architecture-detail"
              className={styles.node}
              style={{ '--node-row': node.row, '--node-column': node.column } as CSSProperties}
              onClick={() => p.choose(node.id)}
            >
              <span>
                <Icon size={18} />
                <strong>{translate(language, node.title)}</strong>
              </span>
              <small>{translate(language, node.subtitle)}</small>
            </button>
          );
        })}
      </div>
      <div className={styles.legend}>
        <span>
          <i />
          {translate(language, ['Data / request', 'Datos / consulta'])}
        </span>
        <span>
          <i data-async />
          {translate(language, ['Background work', 'Trabajo en segundo plano'])}
        </span>
      </div>
    </div>
  );
}
