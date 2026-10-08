import { useState } from 'react';
import { initialCacheScenario, queryCache, updateCacheSource } from '../models/cacheExperiment';
import type { CacheScenario } from '../models/cacheExperiment';
export function useCacheExperimentPresenter() {
  const [state, setState] = useState(initialCacheScenario);
  const update = (patch: Partial<CacheScenario>) =>
    setState((previous) => ({ ...previous, ...patch }));
  return {
    state,
    update,
    query: () => setState(queryCache),
    advance: () => setState((previous) => ({ ...previous, now: previous.now + 5 })),
    write: () => setState(updateCacheSource),
    clear: () => update({ memory: null, redis: null }),
    reset: () => setState(initialCacheScenario()),
  };
}
