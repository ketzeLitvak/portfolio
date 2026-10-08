import type { Text } from './types';
export type CacheService = 'a' | 'b';
export type CacheStrategy = 'ttl' | 'invalidate' | 'write-through';
export const cacheServices: CacheService[] = ['a', 'b'];
export const cacheStrategies: {
  id: CacheStrategy;
  title: Text;
  description: Text;
  concept: string;
}[] = [
  {
    id: 'ttl',
    title: ['Wait for expiration', 'Esperar el vencimiento'],
    description: [
      'Change the original only. Copies keep the old price until they expire.',
      'Cambia solo el original. Las copias conservan el precio anterior hasta vencer.',
    ],
    concept: 'Cache-aside + TTL',
  },
  {
    id: 'invalidate',
    title: ['Remove copies on write', 'Borrar copias al escribir'],
    description: [
      'Change the original and remove Redis and the writing service’s copy. The next read loads the new price.',
      'Cambia el original y borra Redis y la copia del servicio que escribe. La siguiente lectura carga el precio nuevo.',
    ],
    concept: 'Cache-aside + invalidation',
  },
  {
    id: 'write-through',
    title: ['Update copies on write', 'Actualizar copias al escribir'],
    description: [
      'Write the original, Redis and the writing service’s memory together in this simulation. Other memories need a notification or expiration.',
      'Escribe el original, Redis y la memoria del servicio que escribe juntos en esta simulación. Las otras memorias necesitan un aviso o vencer.',
    ],
    concept: 'Write-through',
  },
];
export interface CacheEntry {
  value: number;
  version: number;
  expires: number;
}
export interface CacheResult {
  service: CacheService;
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
  service: CacheService;
  memories: Record<CacheService, CacheEntry | null>;
  answers: Record<CacheService, CacheResult | null>;
  redis: CacheEntry | null;
  memoryTTL: number;
  redisTTL: number;
  strategy: CacheStrategy;
  notifyOthers: boolean;
  requests: number;
  last: CacheResult | null;
}
export const initialCacheScenario = (): CacheScenario => ({
  now: 0,
  value: 100,
  version: 1,
  service: 'a',
  memories: { a: null, b: null },
  answers: { a: null, b: null },
  redis: null,
  memoryTTL: 6,
  redisTTL: 20,
  strategy: 'ttl',
  notifyOthers: false,
  requests: 0,
  last: null,
});
export function queryCache(previous: CacheScenario): CacheScenario {
  const state = {
    ...previous,
    memories: { ...previous.memories },
    answers: { ...previous.answers },
  };
  const memory = state.memories[state.service];
  const route: string[] = ['memory'];
  let latency = 1;
  let entry = memory && memory.expires > state.now ? memory : null;
  let source: CacheResult['source'] = entry ? 'memory' : 'database';
  if (!entry) {
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
    state.redis = entry;
  }
  if (source !== 'memory')
    state.memories[state.service] = {
      ...entry,
      expires: Math.min(state.now + state.memoryTTL, entry.expires),
    };
  state.last = {
    service: state.service,
    source,
    value: entry.value,
    stale: entry.version !== state.version,
    latency,
    route,
  };
  state.answers[state.service] = state.last;
  state.requests++;
  return state;
}
export function updateCacheSource(previous: CacheScenario): CacheScenario {
  const state = {
    ...previous,
    value: previous.value + 10,
    version: previous.version + 1,
    memories: { ...previous.memories },
  };
  if (state.strategy === 'ttl') return state;
  if (state.strategy === 'invalidate') {
    state.redis = null;
    state.memories[state.service] = null;
  } else {
    state.redis = {
      value: state.value,
      version: state.version,
      expires: state.now + state.redisTTL,
    };
    state.memories[state.service] = { ...state.redis, expires: state.now + state.memoryTTL };
  }
  // A coordinated notification evicts other local copies; updating Redis alone cannot do this.
  if (state.notifyOthers)
    for (const service of cacheServices)
      if (service !== state.service) state.memories[service] = null;
  return state;
}
export function clearCacheCopies(state: CacheScenario): CacheScenario {
  return { ...state, memories: { a: null, b: null }, redis: null };
}
export type CacheLayer = CacheService | 'redis';
export function invalidateCacheLayer(state: CacheScenario, layer: CacheLayer): CacheScenario {
  return layer === 'redis'
    ? { ...state, redis: null }
    : { ...state, memories: { ...state.memories, [layer]: null } };
}
