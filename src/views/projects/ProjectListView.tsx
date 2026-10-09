import styles from './ProjectListView.module.css';

import type { ViewProps } from '../../models/viewProps';

import { ProjectList } from './components/ProjectList';

export function ProjectListView({ language, openApp }: ViewProps) {
  return (
    <div className={styles.projectListWindow}>
      <ProjectList language={language} openApp={openApp} />
    </div>
  );
}
