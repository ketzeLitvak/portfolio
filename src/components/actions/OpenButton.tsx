import contentStyles from '../../styles/Content.module.css';

import { classNames } from '../../utils/classNames';

import { ArrowRight } from 'lucide-react';

export function OpenButton({
  id,
  openApp,
  children,
  primary = false,
}: {
  id: string;
  openApp: (id: string) => void;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      className={classNames(contentStyles.btn, primary ? contentStyles.primary : '')}
      data-open={id}
      onClick={() => openApp(id)}
    >
      {children}
      <ArrowRight size={14} />
    </button>
  );
}
