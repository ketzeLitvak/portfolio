import contentStyles from '../../styles/Content.module.css';

import styles from './QuickView.module.css';

import type { ViewProps } from '../../models/viewProps';

import { translate } from '../../models/types';

import { ProjectList } from '../projects/components/ProjectList';

import { OpenButton } from '../../components/actions/OpenButton';

export function QuickView({ language, openApp }: ViewProps) {
  const t = (en: string, es: string) => translate(language, [en, es]);

  return (
    <div className={contentStyles.pad}>
      <p className={contentStyles.kicker}>{t('THE SHORT VERSION', 'LA VERSIÓN CORTA')}</p>
      <h2 style={{ fontSize: 32 }}>Ezequiel Ilan Litvak</h2>
      <p className={contentStyles.description}>
        {t(
          'Senior Full Stack Developer · Nearly five years of experience · Buenos Aires, Argentina',
          'Desarrollador Full Stack Senior · Casi cinco años de experiencia · Buenos Aires, Argentina',
        )}
      </p>
      <div className={styles.quickSection}>
        <h3>Geopagos</h3>
        <p>
          {t(
            'Contribute to the design and development of Acquirer in a Box. Experience in backoffice, payment security, backend services and React microfrontends.',
            'Participo en el diseño y desarrollo de Acquirer in a Box. Experiencia en backoffice, seguridad de pagos, servicios backend y microfrontends React.',
          )}
        </p>
      </div>
      <div className={styles.quickSection}>
        <h3>{t('Selected projects', 'Proyectos destacados')}</h3>
        <ProjectList language={language} openApp={openApp} />
      </div>
      <div className={styles.quickSection}>
        <h3>UTN FRBA</h3>
        <p>
          {t(
            'Final-year Information Systems Engineering student and teaching assistant. English: professional working proficiency.',
            'Estudiante del último año de Ingeniería en Sistemas de Información y ayudante de cátedra. Inglés avanzado para trabajar.',
          )}
        </p>
      </div>
      <OpenButton id="profile" openApp={openApp} primary>
        {t('Full profile & CV', 'Perfil completo y CV')}
      </OpenButton>{' '}
      <OpenButton id="contact" openApp={openApp}>
        {t('Contact', 'Contacto')}
      </OpenButton>
    </div>
  );
}
