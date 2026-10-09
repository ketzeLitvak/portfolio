import contentStyles from '../../styles/Content.module.css';

import { ArrowUpRight } from 'lucide-react';

export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className={contentStyles.btn} href={href} target="_blank" rel="noopener">
      {children}
      <ArrowUpRight size={14} />
    </a>
  );
}
