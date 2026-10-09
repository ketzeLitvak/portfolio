import styles from './ApplicationIcon.module.css';

import { classNames } from '../../../utils/classNames';

import type { LucideIcon } from 'lucide-react';

export function ApplicationIcon({
  id,
  icon: Icon,
  logo,
  size = 28,
}: {
  id: string;
  icon?: LucideIcon;
  logo?: string;
  size?: number;
}) {
  return (
    <span
      className={classNames(styles.iconTile, logo ? styles.projectIconTile : styles[`i-${id}`])}
    >
      {logo ? <img src={logo} alt="" draggable={false} /> : Icon && <Icon size={size} />}
    </span>
  );
}
