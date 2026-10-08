import { createPortal } from 'react-dom';
import { Check, ChevronDown, Radio, TrendingUp, X } from 'lucide-react';
import { cacheStrategies } from '../../models/cacheExperiment';
import { translate, type Language } from '../../models/types';
import type { useCacheExperimentPresenter } from '../../presenters/useCacheExperimentPresenter';
import { useCacheStrategyPopoverPresenter } from '../../presenters/useCacheStrategyPopoverPresenter';
export function CacheStrategies({
  presenter: p,
  language,
}: {
  presenter: ReturnType<typeof useCacheExperimentPresenter>;
  language: Language;
}) {
  const popover = useCacheStrategyPopoverPresenter();
  const s = p.state;
  const name =
    s.strategy === 'ttl'
      ? 'TTL'
      : s.strategy === 'invalidate'
        ? translate(language, ['Invalidation', 'Invalidación'])
        : 'Write-through';
  return (
    <div className="cache-write-controls">
      <button className="cache-write" onClick={p.write} disabled={p.busy}>
        <TrendingUp size={16} />
        {translate(language, ['Change price', 'Cambiar precio'])} {s.service.toUpperCase()} · +$10
      </button>
      <button
        ref={popover.triggerRef}
        className="cache-strategy-trigger"
        disabled={p.busy}
        onClick={popover.toggle}
        aria-expanded={!!popover.position}
        aria-controls={popover.id}
        aria-label={`${translate(language, ['Strategy', 'Estrategia'])}: ${name}`}
        title={`${translate(language, ['Strategy', 'Estrategia'])}: ${name}`}
      >
        {name}
        {s.notifyOthers && s.strategy !== 'ttl' && <Radio size={12} />}
        <ChevronDown size={13} />
      </button>
      {popover.position &&
        createPortal(
          <div
            id={popover.id}
            ref={popover.panelRef}
            className="cache-strategy-popover"
            style={popover.position}
            role="region"
            aria-label={translate(language, ['Caching strategy', 'Estrategia de caché'])}
          >
            <header>
              <strong>
                {translate(language, ['When the price changes', 'Cuando cambia el precio'])}
              </strong>
              <button
                onClick={() => {
                  popover.close();
                  popover.triggerRef.current?.focus();
                }}
                aria-label={translate(language, ['Close strategies', 'Cerrar estrategias'])}
              >
                <X size={15} />
              </button>
            </header>
            <div
              className="cache-strategy-choices"
              role="group"
              aria-label={translate(language, ['Write strategy', 'Estrategia de escritura'])}
            >
              {cacheStrategies.map((entry) => (
                <button
                  key={entry.id}
                  data-strategy={entry.id}
                  aria-pressed={s.strategy === entry.id}
                  onClick={() => p.selectStrategy(entry.id)}
                >
                  <span>
                    <strong>{translate(language, entry.title)}</strong>
                    {s.strategy === entry.id && <Check size={14} />}
                  </span>
                  <small>{translate(language, entry.description)}</small>
                </button>
              ))}
            </div>
            {s.strategy !== 'ttl' && (
              <label className="cache-notify">
                <input
                  type="checkbox"
                  checked={s.notifyOthers}
                  onChange={(e) => p.notify(e.target.checked)}
                />
                <span>
                  <Radio size={14} />
                  {translate(language, [
                    'Notify the other service to remove its local copy',
                    'Avisar al otro servicio para que borre su copia local',
                  ])}
                </span>
              </label>
            )}
            <p>
              {translate(language, [
                'Applies the next time you change the price.',
                'Se aplica la próxima vez que cambies el precio.',
              ])}
            </p>
          </div>,
          document.body,
        )}
    </div>
  );
}
