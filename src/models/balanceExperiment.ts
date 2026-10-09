export type BalanceStrategy = 'round-robin' | 'least-connections';
export interface BalanceServer {
  id: string;
  healthy: boolean;
  seconds: number;
  received: number;
}
export interface BalanceRequest {
  id: number;
  server: string;
  remaining: number;
  status: 'active' | 'done' | 'failed';
}
export interface BalanceState {
  servers: BalanceServer[];
  requests: BalanceRequest[];
  cursor: number;
  nextId: number;
  now: number;
  rejected: number;
}

export function initialBalance(): BalanceState {
  return {
    servers: [2, 4, 8].map((seconds, index) => ({
      id: String.fromCharCode(65 + index),
      healthy: true,
      seconds,
      received: 0,
    })),
    requests: [],
    cursor: 0,
    nextId: 1,
    now: 0,
    rejected: 0,
  };
}

export function sendBalanced(state: BalanceState, strategy: BalanceStrategy): BalanceState {
  const healthy = state.servers.filter((server) => server.healthy);
  if (!healthy.length) return { ...state, rejected: state.rejected + 1 };

  const active = (id: string) =>
    state.requests.filter((request) => request.server === id && request.status === 'active').length;

  let selected = healthy[0];
  if (strategy === 'round-robin') {
    for (let offset = 0; offset < state.servers.length; offset++) {
      const server = state.servers[(state.cursor + offset) % state.servers.length];
      if (server.healthy) {
        selected = server;
        break;
      }
    }
  } else {
    selected = healthy.reduce((best, server) =>
      active(server.id) < active(best.id) ? server : best,
    );
  }
  return {
    ...state,
    cursor: (state.servers.indexOf(selected) + 1) % state.servers.length,
    nextId: state.nextId + 1,
    servers: state.servers.map((server) =>
      server.id === selected.id ? { ...server, received: server.received + 1 } : server,
    ),
    requests: [
      ...state.requests,
      { id: state.nextId, server: selected.id, remaining: selected.seconds, status: 'active' },
    ],
  };
}

export function tickBalance(state: BalanceState): BalanceState {
  return {
    ...state,
    now: state.now + 1,
    requests: state.requests.map((request) =>
      request.status !== 'active'
        ? request
        : {
            ...request,
            remaining: Math.max(0, request.remaining - 1),
            status: request.remaining <= 1 ? 'done' : 'active',
          },
    ),
  };
}

export function toggleBalanceServer(state: BalanceState, id: string): BalanceState {
  const shuttingDown = state.servers.some((server) => server.id === id && server.healthy);
  return {
    ...state,
    servers: state.servers.map((server) =>
      server.id === id ? { ...server, healthy: !server.healthy } : server,
    ),
    requests: state.requests.map((request) =>
      shuttingDown && request.server === id && request.status === 'active'
        ? { ...request, status: 'failed' }
        : request,
    ),
  };
}
