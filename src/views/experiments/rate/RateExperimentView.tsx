import { ArrowRight, Send, Waves } from 'lucide-react';

import type { ViewProps } from '../../../models/viewProps';

import { translate, type Text } from '../../../models/types';

import { rateCapacity, ratePeriod, type RateStrategy } from '../../../models/rateExperiment';

import { useRateExperimentPresenter } from '../../../presenters/useRateExperimentPresenter';

import { OptionsPopover } from '../../../components/options/OptionsPopover';

import { OptionChoices } from '../../../components/options/OptionChoices';

import { ExperimentClock } from '../ExperimentClock';

import { ExperimentWorkbench } from '../ExperimentWorkbench';

import ui from '../ExperimentUI.module.css';

import styles from './RateExperimentView.module.css';

const strategies: { id: RateStrategy; title: Text; description: Text }[] = [
  {
    id: 'fixed',
    title: ['Fixed window', 'Ventana fija'],
    description: ['The quota resets every 6 seconds.', 'El cupo se reinicia cada 6 segundos.'],
  },
  {
    id: 'sliding',
    title: ['Sliding window', 'Ventana deslizante'],
    description: [
      'Counts accepted requests in the last 6 seconds.',
      'Cuenta consultas aceptadas en los últimos 6 segundos.',
    ],
  },
  {
    id: 'bucket',
    title: ['Token bucket', 'Token bucket'],
    description: [
      'Holds 3 tokens. Recovers one every 2 seconds.',
      'Guarda 3 tokens. Recupera uno cada 2 segundos.',
    ],
  },
];

export function RateExperimentView({ language }: ViewProps) {
  const p = useRateExperimentPresenter(),
    s = p.state,
    c = s.clients[p.client];

  const t = (text: Text) => translate(language, text);

  const name = t(strategies.find((entry) => entry.id === s.strategy)!.title);
  return (
    <ExperimentWorkbench
      language={language}
      className={styles.root}
      reset={p.reset}
      title={['How many requests are too many?', '¿Cuántas consultas son demasiadas?']}
      description={[
        'Send a burst. The API accepts some requests and stops the rest.',
        'Mandá una ráfaga. La API acepta algunas consultas y frena el resto.',
      ]}
      docs="https://learn.microsoft.com/en-us/aspnet/core/performance/rate-limit"
      explanation={
        <>
          <p>
            {t([
              'Fixed window: 3 requests per client in each 6-second block. Try 3 at second 5 and another 3 at second 6: the boundary allows both bursts.',
              'Ventana fija: 3 consultas por cliente en cada bloque de 6 segundos. Probá 3 en el segundo 5 y otras 3 en el 6: el cambio de bloque permite ambas ráfagas.',
            ])}
          </p>
          <p>
            {t([
              'Sliding window: this model stores exact accepted timestamps and counts only the last 6 seconds. Token bucket: capacity 3, continuous refill of 0.5 tokens per second, one token per request. Rejected requests do not consume quota.',
              'Ventana deslizante: este modelo guarda los tiempos exactos de las consultas aceptadas y cuenta solo los últimos 6 segundos. Token bucket: capacidad 3, recarga continua de 0,5 tokens por segundo y un token por consulta. Los rechazos no consumen cupo.',
            ])}
          </p>
          <p>
            {t([
              'Quotas are separate for clients A and B. Changing strategy starts a new scenario. The clock starts paused. Status 429 and Retry-After are illustrative; this page does not make API calls. Shared limits across replicas require shared state or coordination.',
              'Los cupos son independientes para A y B. Cambiar estrategia inicia otro escenario. El reloj empieza pausado. El estado 429 y Retry-After son de ejemplo; la página no llama a una API. Un límite compartido entre réplicas requiere estado compartido o coordinación.',
            ])}
          </p>
        </>
      }
    >
      <div className={ui.toolbar}>
        <div className={styles.clients} role="group" aria-label={t(['Client', 'Cliente'])}>
          {(['a', 'b'] as const).map((id) => (
            <button key={id} aria-pressed={p.client === id} onClick={() => p.selectClient(id)}>
              {t(['Client', 'Cliente'])} {id.toUpperCase()}
            </button>
          ))}
        </div>
        <ExperimentClock
          language={language}
          now={s.now}
          running={p.running}
          toggle={p.toggle}
          step={p.step}
        />
      </div>
      <div className={styles.route}>
        <div>
          <Send size={24} />
          <strong>{p.client.toUpperCase()}</strong>
          <small>{t(['Your client', 'Tu cliente'])}</small>
        </div>
        <ArrowRight size={20} />
        <div className={styles.quota}>
          <strong>
            {p.available}/{rateCapacity}
          </strong>
          <small>{t(['Requests available', 'Consultas disponibles'])}</small>
          <div className={styles.tokens}>
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} data-full={i < p.available} />
            ))}
          </div>
        </div>
        <ArrowRight size={20} />
        <div>
          <Waves size={24} />
          <strong>API</strong>
          <small>{t(['Protected service', 'Servicio protegido'])}</small>
        </div>
      </div>
      <div className={styles.window}>
        <span>{name}</span>
        <span>
          {s.strategy === 'fixed'
            ? `${ratePeriod - (s.now % ratePeriod)}s ${t(['until reset', 'para reiniciar'])}`
            : s.strategy === 'sliding'
              ? `${c.hits.length} ${t(['in the last 6s', 'en los últimos 6s'])}`
              : `${c.tokens.toFixed(1)} ${t(['tokens', 'tokens'])}`}
        </span>
        <progress
          max={s.strategy === 'bucket' ? 3 : 6}
          value={
            s.strategy === 'bucket'
              ? c.tokens
              : s.strategy === 'sliding'
                ? c.hits.length
                  ? s.now - c.hits[0]
                  : 0
                : s.now % 6
          }
          aria-label={t(['Quota progress', 'Progreso del cupo'])}
        />
      </div>
      <div className={ui.actions}>
        <button className={ui.primary} onClick={() => p.send(1)}>
          <Send size={15} />
          {t(['Send request', 'Enviar consulta'])}
        </button>
        <button className={ui.secondary} onClick={() => p.send(5)}>
          <Waves size={15} />
          {t(['Burst of 5', 'Ráfaga de 5'])}
        </button>
        <OptionsPopover
          language={language}
          appearance="lab"
          valueLabel={name}
          label={t(['Strategy', 'Estrategia']) + ': ' + name}
          title={t(['Limiting strategy', 'Estrategia de límite'])}
        >
          {(close) => (
            <OptionChoices
              language={language}
              appearance="lab"
              label={t(['Strategy', 'Estrategia'])}
              value={s.strategy}
              options={strategies}
              onChange={(id) => {
                p.selectStrategy(id);
                close();
              }}
            />
          )}
        </OptionsPopover>
      </div>
      <p className={ui.feedback} aria-live="polite">
        {p.batch
          ? `${p.batch.accepted} ${t(['accepted', 'aceptadas'])} · ${p.batch.rejected} ${t(['limited', 'limitadas'])}`
          : t([
              'Try sending 5 at once. Switch clients to see their independent quota.',
              'Probá enviar 5 juntas. Cambiá de cliente para ver su cupo independiente.',
            ])}
      </p>
      <div className={ui.metrics}>
        <span>
          {t(['Accepted', 'Aceptadas'])}
          <strong>{s.accepted}</strong>
        </span>
        <span>
          {t(['Limited', 'Limitadas'])}
          <strong>{s.rejected}</strong>
        </span>
      </div>
      <ol className={styles.results} aria-label={t(['Recent requests', 'Últimas consultas'])}>
        {s.results
          .slice(-6)
          .reverse()
          .map((r) => (
            <li key={r.id} data-accepted={r.accepted}>
              <span>
                #{r.id} · {r.client.toUpperCase()} · {r.now}s
              </span>
              <strong>{r.accepted ? '200 OK' : '429'}</strong>
              <small>
                {r.accepted ? t(['Accepted', 'Aceptada']) : `Retry-After: ${r.retryAfter}s`}
              </small>
            </li>
          ))}
      </ol>
    </ExperimentWorkbench>
  );
}
