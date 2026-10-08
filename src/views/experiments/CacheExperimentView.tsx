import type { ViewProps } from '../../models/viewProps';
import { translate, type Text } from '../../models/types';
import { useCacheExperimentPresenter } from '../../presenters/useCacheExperimentPresenter';
import { ExperimentShell } from './ExperimentShell';
export function CacheExperimentView({ language }: ViewProps) {
  const p = useCacheExperimentPresenter(),
    s = p.state;
  const t = (text: Text) => translate(language, text);
  return (
    <ExperimentShell
      language={language}
      title={['Fast, fresh, or both?', '¿Rápido, actualizado o ambos?']}
      description={[
        'Trace a read through memory, Redis and the source. Advance the clock to expire entries. All data and latency are simulated.',
        'Seguí una lectura por memoria, Redis y el origen. Avanzá el reloj para vencer entradas. Los datos y las latencias son simulados.',
      ]}
      docs="https://redis.io/docs/latest/commands/expire/"
      reset={p.reset}
    >
      <div className="experiment-controls">
        {(['memory', 'redis'] as const).map((layer) => (
          <label key={layer}>
            {layer === 'memory'
              ? t(['Memory TTL (seconds)', 'TTL de memoria (segundos)'])
              : 'Redis TTL (s)'}
            <input
              type="number"
              min="1"
              max="60"
              value={s[`${layer}TTL`]}
              onChange={(e) =>
                p.update({
                  [`${layer}TTL`]: Math.min(60, Math.max(1, Number(e.target.value) || 1)),
                })
              }
            />
          </label>
        ))}
      </div>
      <div className="experiment-checks">
        <label>
          <input
            type="checkbox"
            checked={s.memoryEnabled}
            onChange={(e) => p.update({ memoryEnabled: e.target.checked })}
          />
          {t(['Memory enabled', 'Memoria activa'])}
        </label>
        <label>
          <input
            type="checkbox"
            checked={s.redisEnabled}
            onChange={(e) => p.update({ redisEnabled: e.target.checked })}
          />
          Redis
        </label>
        <label>
          <input
            type="checkbox"
            checked={s.invalidate}
            onChange={(e) => p.update({ invalidate: e.target.checked })}
          />
          {t(['Invalidate on write', 'Invalidar al escribir'])}
        </label>
      </div>
      <div className="experiment-actions">
        <button onClick={p.query}>{t(['Read value', 'Leer valor'])}</button>
        <button onClick={p.advance}>+5 s</button>
        <button onClick={p.write}>{t(['Update source +10', 'Actualizar origen +10'])}</button>
        <button onClick={p.clear}>{t(['Clear cache', 'Vaciar caché'])}</button>
      </div>
      <div className="experiment-stages">
        {(['memory', 'redis', 'database'] as const).map((layer) => {
          const entry = layer === 'database' ? null : s[layer];
          const enabled = layer === 'database' || s[`${layer}Enabled`];
          return (
            <article key={layer} data-highlight={s.last?.source === layer}>
              <small>
                {layer === 'memory'
                  ? t(['Memory', 'Memoria'])
                  : layer === 'database'
                    ? t(['Source', 'Origen'])
                    : 'Redis'}
              </small>
              <strong>
                {layer === 'database' ? s.value : !enabled ? '—' : (entry?.value ?? '∅')}
              </strong>
              <span>
                {layer === 'database'
                  ? `v${s.version}`
                  : !enabled
                    ? t(['Disabled', 'Desactivado'])
                    : !entry
                      ? t(['Empty', 'Vacío'])
                      : entry.expires <= s.now
                        ? t(['Expired', 'Vencido'])
                        : `${Math.ceil(entry.expires - s.now)} s · v${entry.version}`}
              </span>
            </article>
          );
        })}
      </div>
      {s.last && (
        <div className="experiment-result" data-success={!s.last.stale}>
          <div>
            <strong>
              {s.last.route.join(' → ')} · {s.last.latency} ms
            </strong>
            <p>
              {t(
                s.last.stale
                  ? [
                      'Stale read: the source changed while a cached copy remains valid.',
                      'Lectura desactualizada: el origen cambió y todavía hay una copia válida en caché.',
                    ]
                  : [
                      'The returned value matches the source.',
                      'El valor devuelto coincide con el origen.',
                    ],
              )}
            </p>
          </div>
        </div>
      )}
      <div className="experiment-metrics">
        <span>
          {t(['Clock', 'Reloj'])}
          <strong>{s.now} s</strong>
        </span>
        <span>
          {t(['Reads', 'Lecturas'])}
          <strong>{s.requests}</strong>
        </span>
        <span>
          Hit rate<strong>{s.requests ? Math.round((s.hits / s.requests) * 100) : 0}%</strong>
        </span>
        <span>
          {t(['Average latency', 'Latencia media'])}
          <strong>{s.requests ? Math.round(s.totalLatency / s.requests) : 0} ms</strong>
        </span>
      </div>
      <p className="experiment-note">
        {t([
          'TTL changes apply to the next stored entries. Writing without invalidation can return an old value until expiration.',
          'Los cambios de TTL aplican a las próximas entradas guardadas. Escribir sin invalidar puede devolver un valor anterior hasta el vencimiento.',
        ])}
      </p>
    </ExperimentShell>
  );
}
