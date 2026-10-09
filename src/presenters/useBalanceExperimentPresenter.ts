import { useEffect, useState } from 'react';

import {
  initialBalance,
  sendBalanced,
  tickBalance,
  toggleBalanceServer,
  type BalanceStrategy,
} from '../models/balanceExperiment';

export function useBalanceExperimentPresenter() {
  const [state, setState] = useState(initialBalance);
  const [strategy, setStrategy] = useState<BalanceStrategy>('round-robin');
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setState(tickBalance), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const send = () => setState((current) => sendBalanced(current, strategy));

  const burst = () =>
    setState((current) => {
      let next = current;
      for (let index = 0; index < 6; index++) next = sendBalanced(next, strategy);
      return next;
    });

  const reset = () => {
    setState(initialBalance());
    setRunning(false);
    setStrategy('round-robin');
  };

  return {
    state,
    strategy,
    setStrategy,
    running,
    send,
    burst,
    reset,
    toggleClock: () => setRunning((value) => !value),
    step: () => setState(tickBalance),
    toggleServer: (id: string) => setState((current) => toggleBalanceServer(current, id)),
  };
}
