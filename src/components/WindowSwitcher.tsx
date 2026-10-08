import { PanelsTopLeft, X, Minus, Check } from 'lucide-react';
import { appRegistry } from '../models/appRegistry';
import { projects } from '../models/projects';
import { experiences } from '../models/experience';
import { translate, type Language, type WindowState } from '../models/types';
import { useWindowSwitcherPresenter } from '../presenters/useWindowSwitcherPresenter';

export function WindowSwitcher({
  windows,
  language,
  focus,
  close,
}: {
  windows: WindowState[];
  language: Language;
  focus: (id: string) => void;
  close: (id: string) => void;
}) {
  const p = useWindowSwitcherPresenter(windows, focus);
  const t = (en: string, es: string) => translate(language, [en, es]);
  return (
    <div ref={p.rootRef} className="window-switcher">
      <button
        ref={p.triggerRef}
        className="window-switcher-trigger"
        aria-label={t(`Open windows (${windows.length})`, `Ventanas abiertas (${windows.length})`)}
        aria-haspopup="dialog"
        aria-expanded={p.expanded}
        aria-controls="window-switcher-panel"
        onClick={() => p.setExpanded(!p.expanded)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            p.setExpanded(true);
          }
        }}
      >
        <span className="icon-tile i-window-switcher">
          <PanelsTopLeft size={23} />
        </span>
        {windows.length > 0 && (
          <span className="window-switcher-count" aria-hidden="true">
            {windows.length}
          </span>
        )}
        <span className="tooltip">{t('Open windows', 'Ventanas abiertas')}</span>
      </button>
      {p.expanded && (
        <div
          ref={p.panelRef}
          id="window-switcher-panel"
          className="window-switcher-panel"
          role="dialog"
          aria-labelledby="window-switcher-title"
          tabIndex={-1}
          onKeyDown={p.navigate}
        >
          <header>
            <h2 id="window-switcher-title">{t('Open windows', 'Ventanas abiertas')}</h2>
            <span>{windows.length}</span>
          </header>
          {windows.length ? (
            <div className="window-switcher-list">
              {p.ordered.map((window) => {
                const app = appRegistry[window.id],
                  Icon = app.icon;
                const experience =
                  window.id === 'experience'
                    ? experiences.find(
                        (entry) => entry.id === (window.experienceTarget?.id ?? 'geopagos'),
                      )
                    : undefined;
                const logo = projects[window.id]?.logo ?? experience?.logo;
                const title = translate(language, app.title);
                return (
                  <div className="window-switcher-row" key={window.id}>
                    <button
                      data-window-select={window.id}
                      className="window-switcher-select"
                      aria-current={p.activeId === window.id ? 'true' : undefined}
                      onClick={() => p.select(window.id)}
                    >
                      <span className="window-switcher-icon">
                        {logo ? <img src={logo} alt="" /> : <Icon size={20} />}
                      </span>
                      <span className="window-switcher-copy">
                        <strong>{title}</strong>
                        <small>
                          {experience ? `${translate(language, experience.tab)} · ` : ''}
                          {window.minimized
                            ? t('Minimized', 'Minimizada')
                            : p.activeId === window.id
                              ? t('Active', 'Activa')
                              : t('Open', 'Abierta')}
                        </small>
                      </span>
                      {window.minimized ? (
                        <Minus size={14} />
                      ) : p.activeId === window.id ? (
                        <Check size={14} />
                      ) : null}
                    </button>
                    <button
                      className="window-switcher-close"
                      aria-label={t(`Close ${title}`, `Cerrar ${title}`)}
                      onClick={() => close(window.id)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="window-switcher-empty">
              {t(
                'No windows open. Choose an application from the desktop.',
                'No hay ventanas abiertas. Elegí una aplicación del escritorio.',
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
