import type { ViewProps } from '../models/viewProps';
import { translate } from '../models/types';
import { OpenButton } from '../components/Actions';
export function WelcomeView({ language, openApp }: ViewProps) {
  const t = (en: string, es: string) => translate(language, [en, es]);
  return (
    <div className="welcome-content">
      <p className="kicker">KETZE / SENIOR FULL STACK</p>
      <h1>
        {t('Welcome to', 'Bienvenido a')}
        <br />
        <span className="accent">Ketze Studio.</span>
      </h1>
      <p className="description">
        {t(
          'I’m Ezequiel Ilan Litvak, though most people know me as Ketze. I build products end to end. Here you can explore my projects, experience and ideas I’ve brought to life.',
          'Me llamo Ezequiel Ilan Litvak, aunque la mayoría me conoce como Ketze. Desarrollo productos de punta a punta. Acá podés explorar mis proyectos, mi experiencia y algunas ideas que llevé a la práctica.',
        )}
      </p>
      <div className="welcome-footer">
        <OpenButton id="projects" openApp={openApp} primary>
          {t('Explore projects', 'Explorar proyectos')}
        </OpenButton>
        <OpenButton id="quick" openApp={openApp}>
          {t('Quick view', 'Vista rápida')}
        </OpenButton>
      </div>
      <p className="notice">
        {t(
          'Open an app. Move a window. Try an experiment. Make yourself at home.',
          'Abrí una app. Mové una ventana. Probá un experimento. Sentite como en casa.',
        )}
      </p>
    </div>
  );
}
