import { useEffect, useState } from 'react';
import { enqueueJob, initialQueueScenario, tickQueue } from '../models/queueExperiment';
export function useQueueExperimentPresenter() {
  const [state, setState] = useState(initialQueueScenario);
  const [workers, setWorkers] = useState(2),
    [maxAttempts, setMaxAttempts] = useState(3),
    [failFirst, setFailFirst] = useState(0);
  const [key, setKey] = useState('event-001'),
    [idempotent, setIdempotent] = useState(true),
    [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(
      () => setState((previous) => tickQueue(previous, workers, idempotent)),
      1000,
    );
    return () => clearInterval(timer);
  }, [running, workers, idempotent]);
  const step = () => setState((previous) => tickQueue(previous, workers, idempotent));
  const enqueue = () => setState((previous) => enqueueJob(previous, key, maxAttempts, failFirst));
  const reset = () => {
    setRunning(false);
    setState(initialQueueScenario());
    setWorkers(2);
    setMaxAttempts(3);
    setFailFirst(0);
    setKey('event-001');
    setIdempotent(true);
  };
  return {
    state,
    workers,
    setWorkers,
    maxAttempts,
    setMaxAttempts,
    failFirst,
    setFailFirst,
    key,
    setKey,
    idempotent,
    setIdempotent,
    running,
    setRunning,
    step,
    enqueue,
    reset,
  };
}
