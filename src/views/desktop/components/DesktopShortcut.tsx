import styles from './DesktopShortcut.module.css';

import { classNames } from '../../../utils/classNames';

import type { LucideIcon } from 'lucide-react';

import type { useDesktopShortcutsPresenter } from '../../../presenters/useDesktopShortcutsPresenter';

import { ApplicationIcon } from './ApplicationIcon';

export function DesktopShortcut({
  id,
  label,
  title,
  kind,
  icon,
  logo,
  presenter,
}: {
  id: string;
  label: string;
  title?: string;
  kind?: 'project' | 'experience' | 'experiment';
  icon?: LucideIcon;
  logo?: string;
  presenter: ReturnType<typeof useDesktopShortcutsPresenter>;
}) {
  return (
    <button
      className={classNames(styles.appIcon, kind ? styles[`${kind}-shortcut`] : '')}
      data-open={id}
      aria-label={title}
      title={title}
      {...presenter.buttonProps(id)}
    >
      <ApplicationIcon id={id} icon={icon} logo={logo} />
      <span>{label}</span>
    </button>
  );
}
