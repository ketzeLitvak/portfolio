import eventStyles from './QueueExperimentView.module.css';

import { Check, Copy, Timer, X } from 'lucide-react';

import type { DemoJob } from '../../../models/queueExperiment';

import { translate, type Language } from '../../../models/types';

export function QueueEvent({
  job,
  now,
  language,
}: {
  job: DemoJob;
  now: number;
  language: Language;
}) {
  const Icon =
    job.status === 'completed'
      ? Check
      : job.status === 'failed'
        ? X
        : job.status === 'deduplicated'
          ? Copy
          : Timer;
  const label =
    job.status === 'completed'
      ? (['Effect applied', 'Efecto realizado'] as const)
      : job.status === 'failed'
        ? (['Failed after 3 attempts', 'Falló tras 3 intentos'] as const)
        : job.status === 'deduplicated'
          ? (['Duplicate · no new effect', 'Duplicado · sin efecto nuevo'] as const)
          : job.status === 'delayed'
            ? (['Retry in', 'Reintento en'] as const)
            : (['Waiting for a worker', 'Espera un worker'] as const);
  return (
    <div className={eventStyles.eventsEvent} data-status={job.status}>
      <span className={eventStyles.eventsEventKey}>
        {job.key}
        <small>#{job.id}</small>
      </span>
      <span className={eventStyles.eventsEventStatus}>
        <Icon size={12} />
        {translate(language, label)}
        {job.status === 'delayed' && ` ${Math.max(0, job.readyAt - now)} s`}
      </span>
    </div>
  );
}
