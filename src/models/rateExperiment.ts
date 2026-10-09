export type RateStrategy = 'fixed' | 'sliding' | 'bucket';
export type RateClientId = 'a' | 'b';
export const rateCapacity = 3;
export const ratePeriod = 6;
export interface RateClient {
  window: number;
  count: number;
  hits: number[];
  tokens: number;
  refillAt: number;
}
export interface RateResult {
  id: number;
  client: RateClientId;
  now: number;
  accepted: boolean;
  retryAfter: number;
}
export interface RateScenario {
  batch: { accepted: number; rejected: number } | null;
  strategy: RateStrategy;
  now: number;
  clients: Record<RateClientId, RateClient>;
  results: RateResult[];
  nextId: number;
  accepted: number;
  rejected: number;
}

export function initialRateScenario(strategy: RateStrategy = 'fixed'): RateScenario {
  const client = (): RateClient => ({
    window: 0,
    count: 0,
    hits: [],
    tokens: rateCapacity,
    refillAt: 0,
  });

  return {
    batch: null,
    strategy,
    now: 0,
    clients: { a: client(), b: client() },
    results: [],
    nextId: 1,
    accepted: 0,
    rejected: 0,
  };
}

export function refreshRateClient(client: RateClient, now: number): RateClient {
  const window = Math.floor(now / ratePeriod);
  return {
    ...client,
    window,
    count: window === client.window ? client.count : 0,
    hits: client.hits.filter((at) => at > now - ratePeriod),
    tokens: Math.min(
      rateCapacity,
      client.tokens + ((now - client.refillAt) * rateCapacity) / ratePeriod,
    ),
    refillAt: now,
  };
}

export function tickRate(s: RateScenario): RateScenario {
  const now = s.now + 1;
  return {
    ...s,
    now,
    clients: { a: refreshRateClient(s.clients.a, now), b: refreshRateClient(s.clients.b, now) },
  };
}

export function rateAvailable(s: RateScenario, id: RateClientId): number {
  const c = refreshRateClient(s.clients[id], s.now);
  return s.strategy === 'fixed'
    ? rateCapacity - c.count
    : s.strategy === 'sliding'
      ? rateCapacity - c.hits.length
      : Math.floor(c.tokens);
}

export function requestRate(s: RateScenario, id: RateClientId): RateScenario {
  const c = refreshRateClient(s.clients[id], s.now);
  const accepted = rateAvailable(s, id) > 0;
  const retryAfter = accepted
    ? 0
    : s.strategy === 'fixed'
      ? ratePeriod - (s.now % ratePeriod)
      : s.strategy === 'sliding'
        ? Math.max(1, (c.hits[0] ?? s.now) + ratePeriod - s.now)
        : Math.ceil(((1 - c.tokens) * ratePeriod) / rateCapacity);
  const next = accepted
    ? { ...c, count: c.count + 1, hits: [...c.hits, s.now], tokens: Math.max(0, c.tokens - 1) }
    : c;
  return {
    ...s,
    clients: { ...s.clients, [id]: next },
    accepted: s.accepted + (accepted ? 1 : 0),
    rejected: s.rejected + (accepted ? 0 : 1),
    nextId: s.nextId + 1,
    results: [
      ...s.results.slice(-15),
      { id: s.nextId, client: id, now: s.now, accepted, retryAfter },
    ],
  };
}
