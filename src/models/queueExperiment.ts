export type JobStatus = 'waiting' | 'active' | 'delayed' | 'completed' | 'failed' | 'deduplicated';
export interface DemoJob {
  id: number;
  key: string;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  failFirst: number;
  readyAt: number;
  finishAt: number;
  worker?: number;
  completedAt?: number;
}
export interface QueueScenario {
  now: number;
  nextId: number;
  jobs: DemoJob[];
  effects: Record<string, number>;
}
export const initialQueueScenario = (): QueueScenario => ({
  now: 0,
  nextId: 1,
  jobs: [],
  effects: {},
});
export function enqueueJob(
  state: QueueScenario,
  key: string,
  maxAttempts: number,
  failFirst: number,
): QueueScenario {
  if (!key.trim() || state.jobs.length >= 24) return state;
  return {
    ...state,
    nextId: state.nextId + 1,
    jobs: [
      ...state.jobs,
      {
        id: state.nextId,
        key: key.trim(),
        status: 'waiting',
        attempts: 0,
        maxAttempts,
        failFirst,
        readyAt: state.now,
        finishAt: 0,
      },
    ],
  };
}
export function tickQueue(
  previous: QueueScenario,
  workers: number,
  idempotent: boolean,
): QueueScenario {
  const now = previous.now + 1,
    effects = { ...previous.effects };
  const jobs = previous.jobs.map((job) => ({ ...job }));
  for (const job of jobs) {
    if (job.status === 'delayed' && job.readyAt <= now) job.status = 'waiting';
    if (job.status !== 'active' || job.finishAt > now) continue;
    job.worker = undefined;
    if (job.attempts <= job.failFirst) {
      job.status = job.attempts >= job.maxAttempts ? 'failed' : 'delayed';
      job.readyAt = now + 2 ** (job.attempts - 1);
    } else if (idempotent && (Object.hasOwn(effects, job.key) ? effects[job.key] : 0) > 0)
      job.status = 'deduplicated';
    else {
      job.status = 'completed';
      Object.defineProperty(effects, job.key, {
        value: (Object.hasOwn(effects, job.key) ? effects[job.key] : 0) + 1,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
  }
  for (const job of jobs)
    if (
      ['completed', 'failed', 'deduplicated'].includes(job.status) &&
      job.completedAt === undefined
    )
      job.completedAt = now;
  const busy = new Set(jobs.filter((job) => job.status === 'active').map((job) => job.worker));
  for (let worker = 1; worker <= workers; worker++) {
    if (busy.has(worker)) continue;
    const job = jobs.find((entry) => entry.status === 'waiting');
    if (!job) break;
    job.status = 'active';
    job.worker = worker;
    job.attempts++;
    job.finishAt = now + 3;
  }
  return { ...previous, now, jobs, effects };
}
