export interface CacheEntry {
  value: number;
  version: number;
  expires: number;
}
export interface CacheResult {
  source: 'memory' | 'redis' | 'database';
  value: number;
  stale: boolean;
  latency: number;
  route: string[];
}
export interface CacheScenario {
  now: number;
  value: number;
  version: number;
  memory: CacheEntry | null;
  redis: CacheEntry | null;
  memoryEnabled: boolean;
  redisEnabled: boolean;
  memoryTTL: number;
  redisTTL: number;
  invalidate: boolean;
  requests: number;
  hits: number;
  totalLatency: number;
  last: CacheResult | null;
}
export const initialCacheScenario = (): CacheScenario => ({
  now: 0,
  value: 100,
  version: 1,
  memory: null,
  redis: null,
  memoryEnabled: true,
  redisEnabled: true,
  memoryTTL: 6,
  redisTTL: 20,
  invalidate: false,
  requests: 0,
  hits: 0,
  totalLatency: 0,
  last: null,
});
export function queryCache(previous: CacheScenario): CacheScenario {
  const state = { ...previous };
  const route: string[] = [];
  let latency = 0;
  let entry: CacheEntry | null = null;
  let source: CacheResult['source'] = 'database';
  if (state.memoryEnabled) {
    route.push('memory');
    latency += 1;
    if (state.memory && state.memory.expires > state.now) {
      entry = state.memory;
      source = 'memory';
    }
  }
  if (!entry && state.redisEnabled) {
    route.push('redis');
    latency += 5;
    if (state.redis && state.redis.expires > state.now) {
      entry = state.redis;
      source = 'redis';
    }
  }
  if (!entry) {
    route.push('database');
    latency += 120;
    entry = { value: state.value, version: state.version, expires: state.now + state.redisTTL };
    if (state.redisEnabled) state.redis = entry;
  }
  if (source !== 'memory' && state.memoryEnabled)
    state.memory = {
      ...entry,
      expires: Math.min(state.now + state.memoryTTL, state.redisEnabled ? entry.expires : Infinity),
    };
  state.last = {
    source,
    value: entry.value,
    stale: entry.version !== state.version,
    latency,
    route,
  };
  state.requests++;
  if (source !== 'database') state.hits++;
  state.totalLatency += latency;
  return state;
}
export function updateCacheSource(state: CacheScenario): CacheScenario {
  return {
    ...state,
    value: state.value + 10,
    version: state.version + 1,
    ...(state.invalidate ? { memory: null, redis: null } : {}),
  };
}
