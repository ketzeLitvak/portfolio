import { Radio, TrendingUp } from 'lucide-react';
import { cacheStrategies } from '../../models/cacheExperiment';
import { translate, type Language } from '../../models/types';
import type { useCacheExperimentPresenter } from '../../presenters/useCacheExperimentPresenter';
export function CacheStrategies({
  presenter: p,
  language,
}: {
  presenter: ReturnType<typeof useCacheExperimentPresenter>;
  language: Language;
}) {
  const s = p.state,
    strategy = cacheStrategies.find((entry) => entry.id === s.strategy)!;
  return (
    <section className="cache-strategies">
      <h3>{translate(language, ['When the price changes…', 'Cuando cambia el precio…'])}</h3>
      <div
        className="cache-strategy-options"
        role="group"
        aria-label={translate(language, ['Write strategy', 'Estrategia de escritura'])}
      >
        {cacheStrategies.map((entry) => (
          <button
            key={entry.id}
            data-strategy={entry.id}
            aria-pressed={s.strategy === entry.id}
            onClick={() => p.selectStrategy(entry.id)}
            disabled={p.busy}
          >
            {translate(language, entry.title)}
          </button>
        ))}
      </div>
      <p className="cache-strategy-description">{translate(language, strategy.description)}</p>
      {s.strategy !== 'ttl' && (
        <label className="cache-notify">
          <input
            type="checkbox"
            checked={s.notifyOthers}
            onChange={(e) => p.notify(e.target.checked)}
            disabled={p.busy}
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
      <button className="cache-write" onClick={p.write} disabled={p.busy}>
        <TrendingUp size={16} />
        {translate(language, [
          'Change price from service',
          'Cambiar precio desde el servicio',
        ])}{' '}
        {s.service.toUpperCase()} · +$10
      </button>
      <small className="cache-strategy-hint">
        {translate(language, [
          'The selected strategy applies to this write. Then read from A and B to compare.',
          'La estrategia elegida aplica a esta escritura. Después consultá desde A y B para comparar.',
        ])}
      </small>
    </section>
  );
}
