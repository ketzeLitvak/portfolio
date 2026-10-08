import {
  ArrowRight,
  CheckCheck,
  Cpu,
  Inbox,
  Pause,
  Play,
  Repeat2,
  RotateCcw,
  Send,
  Sparkles,
  Timer,
} from 'lucide-react';
import type { ViewProps } from '../../models/viewProps';
import { translate, type Text } from '../../models/types';
import { useQueueExperimentPresenter } from '../../presenters/useQueueExperimentPresenter';
import { QueueOptions } from './QueueOptions';
import { QueueEvent } from './QueueEvent';
export function QueueExperimentView({ language }: ViewProps) {
  const p = useQueueExperimentPresenter(),
    s = p.state;
  const t = (text: Text) => translate(language, text);
  const lastResult = p.results.at(-1);
  const message: Text = p.waiting.some((job) => job.status === 'delayed')
    ? [
        'A delivery failed. It waits before retrying; the event is not lost.',
        'Una entrega falló. Espera antes de reintentar; el evento no se pierde.',
      ]
    : p.active.length
      ? [
          `${p.active.length} worker${p.active.length > 1 ? 's' : ''} processing. The remaining events wait their turn.`,
          `${p.active.length} worker${p.active.length > 1 ? 's' : ''} procesando. Los demás eventos esperan su turno.`,
        ]
      : p.waiting.length
        ? [
            'The queue holds the events until a worker is available. Start the clock to process them.',
            'La cola guarda los eventos hasta que haya un worker disponible. Iniciá el reloj para procesarlos.',
          ]
        : lastResult?.status === 'deduplicated'
          ? [
              'The same event arrived again. It was acknowledged without repeating its business effect.',
              'Llegó otra vez el mismo evento. Se reconoció sin repetir su efecto de negocio.',
            ]
          : lastResult?.status === 'failed'
            ? [
                'Three attempts failed. The event remains visible for investigation; no effect was applied.',
                'Fallaron tres intentos. El evento queda visible para investigar; no se realizó su efecto.',
              ]
            : lastResult && s.effects[lastResult.key] > 1
              ? [
                  `The same event now has ${s.effects[lastResult.key]} effects. Without duplicate protection, resending can repeat the operation.`,
                  `El mismo evento ya tiene ${s.effects[lastResult.key]} efectos. Sin protección de duplicados, reenviar puede repetir la operación.`,
                ]
              : lastResult
                ? [
                    'Event processed. Compare deliveries with effects: repeating a delivery need not repeat its effect.',
                    'Evento procesado. Compará entregas con efectos: repetir una entrega no tiene por qué repetir su efecto.',
                  ]
                : [
                    'Send an event. The queue holds it and a worker processes it in the background.',
                    'Enviá un evento. La cola lo guarda y un worker lo procesa en segundo plano.',
                  ];
  return (
    <div className="events-playground">
      <header className="events-intro">
        <button
          className="events-reset"
          onClick={p.reset}
          aria-label={t(['Start over', 'Empezar de nuevo'])}
          title={t(['Start over', 'Empezar de nuevo'])}
        >
          <RotateCcw size={15} />
        </button>
        <span className="events-eyebrow">
          <Sparkles size={13} />
          {t(['PLAY WITH A CONCEPT', 'JUGÁ CON UN CONCEPTO'])}
        </span>
        <h2>{t(['Where does an event go?', '¿A dónde va un evento?'])}</h2>
        <p>
          {t([
            'Send it, follow its journey, and see what happens if it fails or arrives twice.',
            'Enviá uno, seguí su recorrido y mirá qué pasa si falla o llega dos veces.',
          ])}
        </p>
      </header>
      <div className="events-toolbar">
        <div
          className="events-worker-picker"
          role="group"
          aria-label={t(['Number of workers', 'Cantidad de workers'])}
        >
          <span>{t(['Who processes?', '¿Quién procesa?'])}</span>
          {[1, 2, 3].map((count) => (
            <button
              key={count}
              aria-pressed={p.workers === count}
              data-workers={count}
              onClick={() => p.setWorkers(count)}
            >
              {count} {count === 1 ? 'worker' : 'workers'}
            </button>
          ))}
        </div>
        <div className="events-clock">
          <span>
            <Timer size={13} />
            {s.now} s · {t(p.running ? ['running', 'en marcha'] : ['paused', 'pausado'])}
          </span>
          <button
            onClick={p.toggle}
            aria-label={t(
              p.running ? ['Pause clock', 'Pausar reloj'] : ['Start clock', 'Iniciar reloj'],
            )}
            title={t(
              p.running ? ['Pause clock', 'Pausar reloj'] : ['Start clock', 'Iniciar reloj'],
            )}
          >
            {p.running ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button onClick={p.step} disabled={p.running}>
            +1 s
          </button>
        </div>
      </div>
      <div className="events-scene">
        <section className="events-stage events-waiting">
          <header>
            <Inbox size={20} />
            <h3>{t(['In the queue', 'En la cola'])}</h3>
            <span>{p.waiting.length}</span>
          </header>
          <div className="events-stage-content">
            {p.waiting.map((job) => (
              <QueueEvent key={job.id} job={job} now={s.now} language={language} />
            ))}
            {!p.waiting.length && (
              <p className="events-empty">{t(['No events waiting', 'Sin eventos en espera'])}</p>
            )}
          </div>
          <ArrowRight className="events-connector" size={18} />
        </section>
        <section className="events-stage events-processing">
          <header>
            <Cpu size={20} />
            <h3>{t(['Processing', 'Procesando'])}</h3>
            <span>{p.active.length}</span>
          </header>
          <div className="events-stage-content">
            {Array.from(
              { length: Math.max(p.workers, ...p.active.map((job) => job.worker ?? 0)) },
              (_, index) => {
                const job = p.active.find((entry) => entry.worker === index + 1);
                const remaining = job ? Math.max(0, job.finishAt - s.now) : 0;
                return (
                  <div key={index} className="events-worker" data-busy={!!job}>
                    <span>
                      Worker {index + 1}
                      <small>
                        {job
                          ? job.key
                          : t(
                              index >= p.workers
                                ? ['Finishing current task', 'Termina la tarea actual']
                                : ['Available', 'Disponible'],
                            )}
                      </small>
                    </span>
                    {job && (
                      <>
                        <strong>{remaining} s</strong>
                        <progress
                          value={3 - remaining}
                          max={3}
                          aria-label={t(['Processing progress', 'Progreso del procesamiento'])}
                        />
                        <small>
                          {t(['Attempt', 'Intento'])} {job.attempts}/3
                        </small>
                      </>
                    )}
                  </div>
                );
              },
            )}
          </div>
          <ArrowRight className="events-connector" size={18} />
        </section>
        <section className="events-stage events-results">
          <header>
            <CheckCheck size={20} />
            <h3>{t(['Results', 'Resultados'])}</h3>
            <span>{p.results.length}</span>
          </header>
          <div className="events-stage-content">
            {[...p.results].reverse().map((job) => (
              <QueueEvent key={job.id} job={job} now={s.now} language={language} />
            ))}
            {!p.results.length && (
              <p className="events-empty">{t(['Nothing processed yet', 'Todavía sin procesar'])}</p>
            )}
          </div>
        </section>
      </div>
      <div className="events-feedback" aria-live="polite" aria-atomic="true">
        <span />
        <p>{t(message)}</p>
      </div>
      <div className="events-main-action">
        <button className="events-send" onClick={p.send} disabled={p.full}>
          <Send size={16} />
          {t(['Send event', 'Enviar evento'])}
        </button>
        <button className="events-repeat" onClick={p.repeat} disabled={!s.jobs.length || p.full}>
          <Repeat2 size={16} />
          {t(['Resend last', 'Reenviar último'])}
        </button>
        <QueueOptions presenter={p} language={language} />
      </div>
      <div className="events-effects">
        <span>
          {t(['Deliveries received', 'Entregas recibidas'])}
          <strong>{s.jobs.length}</strong>
        </span>
        <span>
          {t(['Effects applied', 'Efectos realizados'])}
          <strong>{p.effects}</strong>
        </span>
        <small>
          {p.full
            ? t([
                'Demo limit: 24 deliveries. Start over to try again.',
                'Límite de la demo: 24 entregas. Reiniciá para probar otra vez.',
              ])
            : t([
                'Sending starts the clock. Resending keeps the same event key.',
                'Enviar inicia el reloj. Reenviar conserva la clave del evento.',
              ])}
        </small>
      </div>
      <footer className="events-footer">
        {t(['Local demo · simulated time and effects', 'Demo local · tiempo y efectos simulados'])}
      </footer>
      <details className="events-explanation">
        <summary>{t(['How does it work?', '¿Cómo funciona?'])}</summary>
        <p>
          {t([
            'The queue decouples receiving an event from processing it. In this model, workers take different events in parallel; each attempt lasts 3 simulated seconds.',
            'La cola separa la recepción de un evento de su procesamiento. En este modelo, los workers toman eventos distintos en paralelo; cada intento dura 3 segundos simulados.',
          ])}
        </p>
        <ul>
          <li>
            {t([
              'Retries: a failed attempt waits 1 second, then 2 before the next retry. After 3 attempts the delivery is marked failed.',
              'Reintentos: un intento fallido espera 1 segundo y luego 2 antes del siguiente reintento. Tras 3 intentos, la entrega queda fallida.',
            ])}
          </li>
          <li>
            {t([
              'Idempotency: the same event key can be received more than once while its business effect is applied only once. Turn protection off to compare.',
              'Idempotencia: la misma clave puede llegar varias veces y su efecto de negocio aplicarse una sola vez. Desactivá la protección para comparar.',
            ])}
          </li>
          <li>
            {t([
              'A delivery failure here happens before applying the effect. Real systems must also handle crashes after applying an effect and persistent deduplication. This model does not guarantee exactly-once delivery.',
              'El fallo de esta demo ocurre antes de realizar el efecto. Un sistema real también debe manejar caídas posteriores al efecto y deduplicación persistente. Este modelo no garantiza entrega exactamente una vez.',
            ])}
          </li>
        </ul>
        <a href="https://docs.bullmq.io/patterns/idempotent-jobs" target="_blank" rel="noreferrer">
          {t(['Explore idempotent jobs', 'Explorar tareas idempotentes'])} →
        </a>
      </details>
    </div>
  );
}
