import { Blocks, FileText } from 'lucide-react';

import { Tabs } from '../../../components/tabs/Tabs';

import { translate } from '../../../models/types';

import type { ViewProps } from '../../../models/viewProps';

import { useProjectDetailPresenter } from '../../../presenters/useProjectDetailPresenter';

import { ArchitectureView } from '../../architecture/ArchitectureView';

import { ProjectDetailView } from '../ProjectDetailView';

import styles from './RadixProjectView.module.css';

export function RadixProjectView(props: ViewProps) {
  const p = useProjectDetailPresenter();

  const navigation = (
    <div className={styles.navigation}>
      <Tabs
        label={translate(props.language, ['Radix sections', 'Secciones de Radix'])}
        idPrefix="radix-tab"
        panelId="radix-panel"
        value={p.section}
        onChange={p.setSection}
        items={[
          {
            id: 'overview',
            label: translate(props.language, ['Project', 'Proyecto']),
            icon: <FileText size={15} />,
          },
          {
            id: 'architecture',
            label: translate(props.language, ['Architecture', 'Arquitectura']),
            icon: <Blocks size={15} />,
          },
        ]}
      />
    </div>
  );

  return (
    <section id="radix-panel" role="tabpanel" aria-labelledby={`radix-tab-${p.section}`}>
      <ProjectDetailView
        {...props}
        id="radix"
        navigation={navigation}
        content={
          p.section === 'architecture' ? <ArchitectureView language={props.language} /> : undefined
        }
      />
    </section>
  );
}
