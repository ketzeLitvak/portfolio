import { useEffect, useState } from 'react';

import {
  initialRateScenario,
  rateAvailable,
  requestRate,
  tickRate,
  type RateClientId,
  type RateStrategy,
} from '../models/rateExperiment';

export function useRateExperimentPresenter() {
  const [state, setState] = useState(initialRateScenario);
  const [client, setClient] = useState<RateClientId>('a');
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setState(tickRate), 1000);
    return () => clearInterval(timer);
  }, [running]);

  const send = (count: number) => {
    setState((previous) => {
      let next = previous;
      for (let i = 0; i < count; i++) next = requestRate(next, client);
      return {
        ...next,
        batch: {
          accepted: next.accepted - previous.accepted,
          rejected: next.rejected - previous.rejected,
        },
      };
    });
  };

  const selectStrategy = (strategy: RateStrategy) => {
    setState(initialRateScenario(strategy));
    setRunning(false);
  };

  const reset = () => {
    setState(initialRateScenario());
    setClient('a');
    setRunning(false);
  };

  return {
    state,
    client,
    running,
    batch: state.batch,
    available: rateAvailable(state, client),
    send,
    reset,
    selectStrategy,
    selectClient: (id: RateClientId) => {
      setClient(id);
      setState((previous) => ({ ...previous, batch: null }));
    },
    step: () => setState(tickRate),
    toggle: () => setRunning((v) => !v),
  };
}
