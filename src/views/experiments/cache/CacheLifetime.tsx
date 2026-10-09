import cacheStyles from './CacheExperimentView.module.css';

import type { CacheEntry } from '../../../models/cacheExperiment';

import { translate, type Language } from '../../../models/types';

export function CacheLifetime({
  entry,
  now,
  ttl,
  language,
  layer,
}: {
  entry: CacheEntry | null;
  now: number;
  ttl: number;
  language: Language;
  layer: string;
}) {
  const remaining = entry ? Math.max(0, entry.expires - now) : 0;
  return (
    <span className={cacheStyles.cacheLifetime} data-layer={layer}>
      <span>
        {entry
          ? remaining
            ? `${translate(language, ['Expires in', 'Vence en'])} ${remaining} s`
            : translate(language, ['Expired', 'Vencida'])
          : `TTL ${ttl} s`}
      </span>
      <progress
        value={remaining}
        max={ttl}
        aria-label={`${translate(language, ['Remaining lifetime', 'Tiempo restante'])} ${layer}`}
      />
    </span>
  );
}
