import styles from './DesktopMenuBar.module.css';

import { SystemSetting } from './SystemSetting';

import { LayoutGrid, Sun, Moon, Monitor, Languages } from 'lucide-react';

import { translate } from '../../../models/types';

import type { DesktopPresenter } from '../../../presenters/useDesktopPresenter';

export function DesktopMenuBar({ presenter: p }: { presenter: DesktopPresenter }) {
  const t = (en: string, es: string) => translate(p.language, [en, es]);

  return (
    <header className={styles.menubar}>
      <a
        href="#"
        className={styles.brand}
        onClick={(e) => {
          e.preventDefault();
          p.open('welcome');
        }}
      >
        <img className={styles.brandLogo} src="./assets/ketze-logo.png" alt="Ketze Studio logo" />
        <span className={styles.brandName}>
          <span className={styles.brandKetze}>Ketze</span>
          <span className={styles.brandStudio}>Studio</span>
        </span>
        <span className={styles.version}>PERSONAL WORKSPACE / 01</span>
      </a>
      <div className={styles.systemMenu}>
        <button
          id="quick"
          aria-label={t('Quick view', 'Vista rápida')}
          onClick={() => p.open('quick')}
        >
          <LayoutGrid size={13} />
          <span>{t('Quick view', 'Vista rápida')}</span>
        </button>
        <SystemSetting
          id="lang"
          label={t(
            `Language: ${p.language === 'en' ? 'English' : 'Spanish'}`,
            `Idioma: ${p.language === 'en' ? 'Inglés' : 'Español'}`,
          )}
          title={t('Language', 'Idioma')}
          heading={t('Language', 'Idioma')}
          icon={Languages}
          open={p.activeMenu === 'language'}
          value={p.language}
          options={[
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
          ]}
          onToggle={() => p.setActiveMenu(p.activeMenu === 'language' ? null : 'language')}
          onSelect={(language) => {
            p.setLanguage(language);
            p.setActiveMenu(null);
          }}
        />
        <SystemSetting
          id="theme"
          label={t(
            `Theme: ${p.theme}`,
            `Tema: ${p.theme === 'dark' ? 'Oscuro' : p.theme === 'light' ? 'Claro' : 'Automático'}`,
          )}
          title={t('Theme', 'Tema')}
          heading={t('Appearance', 'Apariencia')}
          icon={p.theme === 'auto' ? Monitor : p.dark ? Moon : Sun}
          open={p.activeMenu === 'theme'}
          value={p.theme}
          options={[
            { value: 'dark', label: t('Dark', 'Oscuro'), icon: Moon },
            { value: 'light', label: t('Light', 'Claro'), icon: Sun },
            { value: 'auto', label: t('Automatic', 'Automático'), icon: Monitor },
          ]}
          onToggle={() => p.setActiveMenu(p.activeMenu === 'theme' ? null : 'theme')}
          onSelect={(theme) => {
            p.setTheme(theme);
            p.setActiveMenu(null);
          }}
        />
        <time id="clock" className={styles.clock}>
          {p.clock}
        </time>
      </div>
    </header>
  );
}
