import { Trash2 } from 'lucide-react';
import { CacheLifetime } from './CacheLifetime';
import type { CacheLayer } from '../../models/cacheExperiment';
import { cacheServices, type CacheScenario } from '../../models/cacheExperiment';
import { translate, type Language } from '../../models/types';
export function CacheMemory({
  state,
  language,
  active,
  busy,
  invalidate,
}: {
  state: CacheScenario;
  language: Language;
  active: boolean;
  busy: boolean;
  invalidate: (layer: CacheLayer) => void;
}) {
  return (
    <div className="cache-memory-pair">
      {cacheServices.map((service) => {
        const entry = state.memories[service];
        const valid = entry && entry.expires > state.now;
        const old = valid && entry.version !== state.version;
        const status = !entry
          ? (['No copy', 'Sin copia'] as const)
          : !valid
            ? (['Expired', 'Vencida'] as const)
            : old
              ? (['Old price', 'Precio anterior'] as const)
              : (['Copy saved', 'Copia guardada'] as const);
        return (
          <div
            key={service}
            className="cache-service-memory"
            data-service={service}
            data-selected={state.service === service}
            data-active={active && state.service === service}
            data-old={!!old}
          >
            <span>
              {translate(language, ['Service', 'Servicio'])} {service.toUpperCase()}
              <small>{translate(language, status)}</small>
            </span>
            <strong>{valid ? `$${entry.value}` : '—'}</strong>
            <button
              className="cache-evict"
              onClick={() => invalidate(service)}
              disabled={busy || !entry}
              aria-label={`${translate(language, ['Invalidate memory', 'Invalidar memoria'])} ${service.toUpperCase()}`}
              title={`${translate(language, ['Invalidate memory', 'Invalidar memoria'])} ${service.toUpperCase()}`}
            >
              <Trash2 size={12} />
            </button>
            <CacheLifetime
              entry={entry}
              now={state.now}
              ttl={state.memoryTTL}
              language={language}
              layer={service}
            />
          </div>
        );
      })}
    </div>
  );
}
