export type TraceScenario = 'normal' | 'slow' | 'error';
export interface TraceSpan {
  id: string;
  parent: string | null;
  service: string;
  start: number;
  duration: number;
  error: boolean;
}
export interface RequestTrace {
  id: string;
  duration: number;
  spans: TraceSpan[];
}

export function createRequestTrace(sequence: number, scenario: TraceScenario): RequestTrace {
  const database = scenario === 'slow' ? 800 : 80;
  const duration = 60 + database;
  const prefix = sequence.toString(16).padStart(8, '0');
  const api = `${prefix}00000001`;
  const payment = `${prefix}00000003`;
  const failed = scenario === 'error';
  return {
    id: sequence.toString(16).padStart(32, '0'),
    duration,
    spans: [
      { id: api, parent: null, service: 'API', start: 0, duration, error: failed },
      {
        id: `${prefix}00000002`,
        parent: api,
        service: 'Auth',
        start: 10,
        duration: 20,
        error: false,
      },
      {
        id: payment,
        parent: api,
        service: 'Payments',
        start: 35,
        duration: database + 20,
        error: failed,
      },
      {
        id: `${prefix}00000004`,
        parent: payment,
        service: 'Database',
        start: 45,
        duration: database,
        error: failed,
      },
    ],
  };
}
