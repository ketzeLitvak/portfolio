import { Play, Pause, Plus, StepForward } from 'lucide-react';
import type { ViewProps } from '../../models/viewProps';
import { translate, type Text } from '../../models/types';
import type { JobStatus } from '../../models/queueExperiment';
import { useQueueExperimentPresenter } from '../../presenters/useQueueExperimentPresenter';
import { ExperimentShell } from './ExperimentShell';
const statusText: Record<JobStatus, Text> = {
  waiting: ['Waiting', 'Pendiente'],
  active: ['Processing', 'Procesando'],
  delayed: ['Retry scheduled', 'Reintento programado'],
  completed: ['Completed', 'Completado'],
  failed: ['Failed', 'Fallido'],
  deduplicated: ['Duplicate skipped', 'Duplicado omitido'],
};
export function QueueExperimentView({ language }: ViewProps) {
  const p = useQueueExperimentPresenter(),
    s = p.state;
  const t = (text: Text) => translate(language, text);
  return (
    <ExperimentShell
      language={language}
      title={['Deliver, retry, repeat?', '¿Procesar, reintentar, repetir?']}
      description={[
        'Explore worker concurrency, exponential retries and idempotent effects. This local model uses a simulated clock; no external queue is connected.',
        'Explorá concurrencia, reintentos exponenciales y efectos idempotentes. Este modelo local usa un reloj simulado; no hay una cola externa conectada.',
      ]}
      docs="https://docs.bullmq.io/patterns/idempotent-jobs"
      reset={p.reset}
    >
      <div className="experiment-controls">
        <label>
          {t(['Event key', 'Clave del evento'])}
          <input value={p.key} maxLength={40} onChange={(e) => p.setKey(e.target.value)} />
        </label>
        <label>
          Workers
          <select value={p.workers} onChange={(e) => p.setWorkers(Number(e.target.value))}>
            {[1, 2, 3, 4].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          {t(['Max attempts', 'Máximo de intentos'])}
          <select value={p.maxAttempts} onChange={(e) => p.setMaxAttempts(Number(e.target.value))}>
            {[1, 2, 3, 4].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          {t(['Fail first attempts', 'Fallar primeros intentos'])}
          <select value={p.failFirst} onChange={(e) => p.setFailFirst(Number(e.target.value))}>
            {[0, 1, 2, 3].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="experiment-checks">
        <label>
          <input
            type="checkbox"
            checked={p.idempotent}
            onChange={(e) => p.setIdempotent(e.target.checked)}
          />
          {t([
            'Idempotent effects (one per event key)',
            'Efectos idempotentes (uno por clave de evento)',
          ])}
        </label>
      </div>
      <div className="experiment-actions">
        <button onClick={p.enqueue} disabled={!p.key.trim() || s.jobs.length >= 24}>
          <Plus size={16} />
          {t(['Enqueue', 'Encolar'])}
        </button>
        <button onClick={() => p.setRunning(!p.running)}>
          {p.running ? <Pause size={16} /> : <Play size={16} />}{' '}
          {t(p.running ? ['Pause', 'Pausar'] : ['Run', 'Ejecutar'])}
        </button>
        <button onClick={p.step} disabled={p.running}>
          <StepForward size={16} />
          +1 s
        </button>
        <span className="experiment-badge">t = {s.now} s</span>
      </div>
      <div className="experiment-workers">
        {Array.from({ length: p.workers }, (_, i) => {
          const job = s.jobs.find((j) => j.worker === i + 1 && j.status === 'active');
          return (
            <span key={i} data-busy={!!job}>
              Worker {i + 1} · {job ? `#${job.id}` : t(['idle', 'libre'])}
            </span>
          );
        })}
      </div>
      <div className="queue-board">
        {[
          { title: ['Pending', 'Pendientes'] as Text, statuses: ['waiting', 'delayed'] },
          { title: ['Processing', 'Procesando'] as Text, statuses: ['active'] },
          {
            title: ['Results', 'Resultados'] as Text,
            statuses: ['completed', 'failed', 'deduplicated'],
          },
        ].map((lane) => {
          const jobs = s.jobs.filter((j) => lane.statuses.includes(j.status));
          return (
            <section key={lane.title[0]}>
              <h3>
                {t(lane.title)} <small>{jobs.length}</small>
              </h3>
              {jobs.map((job) => (
                <article key={job.id} data-status={job.status}>
                  <strong>
                    #{job.id} · {job.key}
                  </strong>
                  <span>{t(statusText[job.status])}</span>
                  <small>
                    {t(['Attempt', 'Intento'])} {job.attempts}/{job.maxAttempts}
                    {job.status === 'delayed' ? ` · +${job.readyAt - s.now} s` : ''}
                  </small>
                </article>
              ))}
              {!jobs.length && <p className="experiment-note">{t(['Empty', 'Vacío'])}</p>}
            </section>
          );
        })}
      </div>
      <div className="experiment-result" data-success="true">
        <div>
          <strong>
            {t(['Business effects', 'Efectos de negocio'])}:{' '}
            {Object.values(s.effects).reduce((sum, n) => sum + n, 0)}
          </strong>
          <p>
            {t([
              'Enqueue the same key twice and compare with idempotency enabled and disabled. Each attempt takes 3 simulated seconds; retry delays double: 1, 2, 4 seconds.',
              'Encolá la misma clave dos veces y compará con idempotencia activa y desactivada. Cada intento demora 3 segundos simulados; las esperas de reintento se duplican: 1, 2, 4 segundos.',
            ])}
          </p>
        </div>
      </div>
    </ExperimentShell>
  );
}
