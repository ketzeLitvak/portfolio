import contentStyles from '../../styles/Content.module.css';

import styles from './ProfileView.module.css';

import { classNames } from '../../utils/classNames';

import { Download } from 'lucide-react';

import type { ViewProps } from '../../models/viewProps';

import { translate } from '../../models/types';

import { OpenButton } from '../../components/actions/OpenButton';

export function ProfileView({ language, openApp }: ViewProps) {
  const t = (en: string, es: string) => translate(language, [en, es]);

  return (
    <div className={classNames(contentStyles.pad, styles.profileBody)}>
      <div className={styles.profileTop}>
        <div className={styles.monogram}>
          <img src="./assets/ketze-logo.png" alt="" />
        </div>
        <div>
          <h2>Ezequiel Ilan Litvak</h2>
          <small>Senior Full Stack Developer · Buenos Aires</small>
        </div>
      </div>
      <p>
        {t(
          'I enjoy understanding the entire product and making its parts work together. Collaborative and empathetic, with a positive attitude and a commitment to continuous learning.',
          'Me gusta entender el producto completo y hacer que sus partes funcionen juntas. Soy colaborativo y empático, con una actitud positiva y compromiso con el aprendizaje continuo.',
        )}
      </p>
      <div className={contentStyles.tags}>
        {['C# / .NET', 'TypeScript', 'React / Next.js', 'Python', 'Node.js', 'AWS'].map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      <a
        className={classNames(contentStyles.btn, contentStyles.primary)}
        href={
          language === 'en'
            ? './assets/Ezequiel_Litvak_CV_English.pdf'
            : './assets/Ezequiel_Ilan_Litvak_CV_Espanol.pdf'
        }
        download
      >
        {t('Download CV', 'Descargar CV')}
        <Download size={14} />
      </a>{' '}
      <OpenButton id="experience" openApp={openApp}>
        {t('Explore my experience', 'Conocé mi experiencia')}
      </OpenButton>
    </div>
  );
}
