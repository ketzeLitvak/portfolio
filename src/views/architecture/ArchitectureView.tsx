import { Map, Route } from 'lucide-react';

import { radixArchitecture } from '../../models/architecture/radixArchitecture';

import type { ViewProps } from '../../models/viewProps';

import { translate } from '../../models/types';

import { useArchitecturePresenter } from '../../presenters/useArchitecturePresenter';

import { Tabs } from '../../components/tabs/Tabs';

import { ArchitectureMap } from './components/ArchitectureMap';

import { ArchitectureDetails } from './components/ArchitectureDetails';

import { ArchitectureFlow } from './components/ArchitectureFlow';

import styles from './ArchitectureView.module.css';

export function ArchitectureView({ language }: Pick<ViewProps, 'language'>) {
  const project = radixArchitecture,
    p = useArchitecturePresenter(project);

  const t = (en: string, es: string) => translate(language, [en, es]);

  return (
    <div className={styles.root}>
      <p className={styles.description}>{translate(language, project.description)}</p>
      <Tabs
        label={t('Architecture views', 'Vistas de arquitectura')}
        idPrefix="architecture-tab"
        panelId="architecture-panel"
        value={p.mode}
        onChange={p.changeMode}
        items={[
          { id: 'map', label: t('Explore the map', 'Explorar el mapa'), icon: <Map size={15} /> },
          {
            id: 'flow',
            label: t('Follow the data', 'Seguir los datos'),
            icon: <Route size={15} />,
          },
        ]}
      />
      <section
        id="architecture-panel"
        role="tabpanel"
        aria-labelledby={`architecture-tab-${p.mode}`}
        tabIndex={0}
      >
        {p.mode === 'flow' && (
          <ArchitectureFlow project={project} presenter={p} language={language} />
        )}
        <div className={styles.layout}>
          <ArchitectureMap project={project} presenter={p} language={language} />
          <ArchitectureDetails presenter={p} language={language} />
        </div>
      </section>
      <footer className={styles.source}>{translate(language, project.source)}</footer>
    </div>
  );
}
