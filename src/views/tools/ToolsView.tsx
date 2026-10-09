import contentStyles from '../../styles/Content.module.css';

import styles from './ToolsView.module.css';

import type { ViewProps } from '../../models/viewProps';

import { translate } from '../../models/types';

import { ExternalLink } from '../../components/actions/ExternalLink';

export function ToolsView({ language }: ViewProps) {
  const t = (en: string, es: string) => translate(language, [en, es]);

  return (
    <div className={contentStyles.pad}>
      <img
        className={styles.toolsProjectLogo}
        src="./assets/ketze-tools-logo.png"
        alt="Ketze Tools logo"
      />
      <p className={contentStyles.kicker}>KETZE TOOLS</p>
      <h2 style={{ fontSize: 29 }}>
        {t('Small tools for everyday development.', 'Herramientas para el desarrollo diario.')}
      </h2>
      <p className={contentStyles.description}>
        {t(
          'A collection of developer utilities, including JSON formatting and URL encoding and decoding. Explore the tools on the project website.',
          'Una colección de utilidades para desarrolladores, como formatear JSON y codificar o decodificar URLs. Explorá las herramientas en la web del proyecto.',
        )}
      </p>
      <ExternalLink href="https://ketze.com.ar">
        {t('Open Ketze Tools', 'Abrir Ketze Tools')}
      </ExternalLink>
    </div>
  );
}
