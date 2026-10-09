import styles from './ContactView.module.css';

import contentStyles from '../../styles/Content.module.css';

import { ArrowUpRight, Mail, Linkedin, Github } from 'lucide-react';

import type { ViewProps } from '../../models/viewProps';

import { translate } from '../../models/types';

export function ContactView({ language }: ViewProps) {
  const t = (en: string, es: string) => translate(language, [en, es]);

  return (
    <div className={styles.contactCard}>
      <p className={contentStyles.kicker}>{t('OPEN A CONVERSATION', 'ABRÍ UNA CONVERSACIÓN')}</p>
      <h2>
        {t('Let’s build', 'Construyamos')}
        <br />
        {t('something good.', 'algo bueno.')}
      </h2>
      <p>
        {t(
          'Want to talk about a project, an opportunity or something you’re building? Here’s where to find me.',
          '¿Querés conversar sobre un proyecto, una oportunidad o algo que estás construyendo? Podés encontrarme acá.',
        )}
      </p>
      {[
        { href: 'mailto:ketze.contact@gmail.com', label: 'ketze.contact@gmail.com', icon: Mail },
        {
          href: 'https://www.linkedin.com/in/ezequiel-litvak-30002822a/',
          label: 'LinkedIn',
          icon: Linkedin,
        },
        { href: 'https://github.com/ketzeLitvak', label: 'GitHub / ketzeLitvak', icon: Github },
      ].map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          className={styles.contactLink}
          href={href}
          target={href.startsWith('https') ? '_blank' : undefined}
          rel="noopener"
        >
          <span className={styles.contactLinkLabel}>
            <Icon size={17} aria-hidden="true" />
            {label}
          </span>
          <ArrowUpRight size={15} />
        </a>
      ))}
    </div>
  );
}
