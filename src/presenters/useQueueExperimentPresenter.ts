import { useEffect, useState } from 'react';
import { enqueueJob, initialQueueScenario, tickQueue } from '../models/queueExperiment';
export type EventDelivery = 'normal' | 'retry' | 'fail';
export function useQueueExperimentPresenter() {
  const [state, setState] = useState(initialQueueScenario);
  const [workers, setWorkers] = useState(1);
  const [delivery, setDelivery] = useState<EventDelivery>('normal');
  const [idempotent, setIdempotent] = useState(true);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(
      () => setState((previous) => tickQueue(previous, workers, idempotent)),
      1000,
    );
    return () => clearInterval(timer);
  }, [running, workers, idempotent]);
  const step = () => setState((previous) => tickQueue(previous, workers, idempotent));
  const send = () => {
    if (state.jobs.length >= 24) return;
    setState((previous) =>
      enqueueJob(
        previous,
        `event-${previous.nextId.toString().padStart(3, '0')}`,
        3,
        delivery === 'normal' ? 0 : delivery === 'retry' ? 1 : 3,
      ),
    );
    setRunning(true);
  };
  const repeat = () => {
    const last = state.jobs.at(-1);
    if (!last || state.jobs.length >= 24) return;
    setState((previous) =>
      enqueueJob(previous, last.key, 3, delivery === 'normal' ? 0 : delivery === 'retry' ? 1 : 3),
    );
    setRunning(true);
  };
  const reset = () => {
    setRunning(false);
    setState(initialQueueScenario());
    setWorkers(1);
    setDelivery('normal');
    setIdempotent(true);
  };
  const waiting = state.jobs.filter((job) => job.status === 'waiting' || job.status === 'delayed');
  const results = state.jobs
    .filter((job) => ['completed', 'failed', 'deduplicated'].includes(job.status))
    .sort((a, b) => (a.completedAt ?? 0) - (b.completedAt ?? 0) || a.id - b.id);
  const active = state.jobs.filter((job) => job.status === 'active');
  const effects = Object.values(state.effects).reduce((sum, count) => sum + count, 0);
  return {
    state,
    workers,
    setWorkers,
    delivery,
    setDelivery,
    idempotent,
    setIdempotent,
    running,
    toggle: () => setRunning((previous) => !previous),
    step,
    send,
    repeat,
    reset,
    waiting,
    active,
    results,
    effects,
    full: state.jobs.length >= 24,
  };
}
