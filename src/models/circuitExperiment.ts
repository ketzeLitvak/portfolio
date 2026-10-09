export type CircuitStatus = 'closed' | 'open' | 'half-open';
export interface CircuitResult {
  id: number;
  outcome: 'success' | 'failure' | 'blocked';
  probe: boolean;
  latency: number;
}
export interface CircuitScenario {
  enabled: boolean;
  healthy: boolean;
  status: CircuitStatus;
  failures: number;
  now: number;
  retryAt: number | null;
  reached: number;
  blocked: number;
  results: CircuitResult[];
  nextId: number;
}
export const circuitThreshold = 3;
export const circuitCooldown = 6;

export function initialCircuitScenario(enabled = true, healthy = false): CircuitScenario {
  return {
    enabled,
    healthy,
    status: 'closed',
    failures: 0,
    now: 0,
    retryAt: null,
    reached: 0,
    blocked: 0,
    results: [],
    nextId: 1,
  };
}

export function tickCircuit(s: CircuitScenario): CircuitScenario {
  const now = s.now + 1;
  return {
    ...s,
    now,
    status:
      s.enabled && s.status === 'open' && s.retryAt !== null && now >= s.retryAt
        ? 'half-open'
        : s.status,
  };
}

export function requestCircuit(s: CircuitScenario): CircuitScenario {
  const blocked = s.enabled && s.status === 'open';
  const probe = s.enabled && s.status === 'half-open';
  const outcome = blocked ? 'blocked' : s.healthy ? 'success' : 'failure';
  const failures = blocked ? s.failures : s.healthy ? 0 : s.failures + 1;
  const opens = s.enabled && outcome === 'failure' && (probe || failures >= circuitThreshold);
  return {
    ...s,
    failures,
    status: opens ? 'open' : s.enabled && outcome === 'success' ? 'closed' : s.status,
    retryAt: opens ? s.now + circuitCooldown : outcome === 'success' ? null : s.retryAt,
    reached: s.reached + (blocked ? 0 : 1),
    blocked: s.blocked + (blocked ? 1 : 0),
    nextId: s.nextId + 1,
    results: [
      ...s.results.slice(-4),
      { id: s.nextId, outcome, probe, latency: blocked ? 0 : s.healthy ? 120 : 800 },
    ],
  };
}
