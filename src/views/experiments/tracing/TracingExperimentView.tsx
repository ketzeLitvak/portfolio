import { Send, Activity, Check, AlertTriangle } from 'lucide-react';

import type { ViewProps } from '../../../models/viewProps';

import { translate, type Text } from '../../../models/types';

import { useTracingExperimentPresenter } from '../../../presenters/useTracingExperimentPresenter';

import { ExperimentWorkbench } from '../ExperimentWorkbench';

import ui from '../ExperimentUI.module.css';

import styles from './TracingExperimentView.module.css';

export function TracingExperimentView({ language }: ViewProps) {
  const p = useTracingExperimentPresenter();

  const t = (text: Text) => translate(language, text);

  const span = p.trace?.spans[p.selected];
  return (
    <ExperimentWorkbench
      language={language}
      className={styles.root}
      reset={p.reset}
      title={['Where did the time go?', '¿Dónde se fue el tiempo?']}
      description={[
        'Follow a payment across services. Click a span to inspect it.',
        'Seguí un pago entre servicios. Tocá un span para inspeccionarlo.',
      ]}
      docs="https://opentelemetry.io/docs/concepts/signals/traces/"
      explanation={
        <>
          <p>
            {t([
              'A trace groups the operations for one request. Each span has its own ID, parent, start time, and duration. The same trace ID travels across services through propagated context, allowing related logs to be correlated.',
              'Una traza agrupa las operaciones de un pedido. Cada span tiene su ID, padre, inicio y duración. El mismo trace ID viaja entre servicios al propagar el contexto y permite correlacionar los logs.',
            ])}
          </p>
          <p>
            {t([
              'The API span contains Auth and Payments; Payments contains the database call. Durations overlap because parents include time spent waiting for children: adding all span durations would count that time more than once. In this local example a database error propagates to Payments and API.',
              'El span de API contiene Auth y Payments; Payments contiene la consulta a la base. Las duraciones se superponen porque los padres incluyen la espera de sus hijos: sumarlas contaría ese tiempo más de una vez. En este ejemplo local un error de la base se propaga a Payments y API.',
            ])}
          </p>
        </>
      }
    >
      <div className={ui.modes}>
        {(['normal', 'slow', 'error'] as const).map((id, index) => (
          <button key={id} aria-pressed={p.scenario === id} onClick={() => p.setScenario(id)}>
            {t(
              (
                [
                  ['Normal', 'Normal'],
                  ['Slow database', 'Base lenta'],
                  ['Database error', 'Error en la base'],
                ] as const
              )[index],
            )}
          </button>
        ))}
      </div>
      <div className={ui.actions}>
        <button className={ui.primary} onClick={p.send}>
          <Send size={15} />
          {t(['Trace a request', 'Trazar un pedido'])}
        </button>
      </div>
      {p.trace ? (
        <>
          <div className={ui.metrics}>
            <span>
              <Activity size={14} /> {t(['Total duration', 'Duración total'])}
              <strong>{p.trace.duration}ms</strong>
            </span>
            <span>
              {p.trace.spans[0].error ? <AlertTriangle size={15} /> : <Check size={15} />}{' '}
              {p.trace.spans[0].error ? 'ERROR' : 'OK'}
            </span>
          </div>
          <p className={ui.code}>trace_id: {p.trace.id}</p>
          <div
            className={styles.waterfall}
            aria-label={t(['Trace waterfall', 'Línea de tiempo de la traza'])}
          >
            <div className={styles.axis}>
              <span>0ms</span>
              <span>{p.trace.duration}ms</span>
            </div>
            {p.trace.spans.map((item, index) => (
              <button
                key={item.id}
                aria-pressed={p.selected === index}
                onClick={() => p.setSelected(index)}
                className={styles.span}
              >
                <span>{item.service}</span>
                <div className={styles.track}>
                  <i
                    data-error={item.error}
                    style={{
                      marginLeft: `${(item.start / p.trace!.duration) * 100}%`,
                      width: `${(item.duration / p.trace!.duration) * 100}%`,
                    }}
                  />
                </div>
                <small>{item.duration}ms</small>
              </button>
            ))}
          </div>
          {span && (
            <article className={styles.detail} aria-live="polite">
              <h3>
                {span.service} · {span.error ? 'ERROR' : 'OK'}
              </h3>
              <p className={ui.code}>
                span_id: {span.id}
                <br />
                parent_span_id: {span.parent ?? '—'}
              </p>
              <p>
                {t(['Start', 'Inicio'])}: {span.start}ms · {t(['Duration', 'Duración'])}:{' '}
                {span.duration}ms
              </p>
              <p className={ui.code}>
                {span.error
                  ? 'ERROR database.connection_failed'
                  : `${span.service.toLowerCase()}.completed`}
                <br />
                trace_id: {p.trace.id}
              </p>
            </article>
          )}
          <p className={ui.feedback}>
            {t(
              p.trace.spans[0].error
                ? [
                    'The database failed; the error reached Payments and API. Inspect the database span and its correlated log.',
                    'La base falló; el error llegó a Payments y API. Inspeccioná su span y el log correlacionado.',
                  ]
                : p.trace.duration > 200
                  ? [
                      'The database takes 800ms. Payments and API are waiting on it.',
                      'La base tarda 800ms. Payments y API la están esperando.',
                    ]
                  : [
                      'The database takes 80ms out of 140ms total. Parent spans include that wait.',
                      'La base tarda 80ms de los 140ms totales. Los spans padres incluyen esa espera.',
                    ],
            )}
          </p>
        </>
      ) : (
        <p className={ui.feedback}>
          {t([
            'Choose a scenario and trace a request to reveal its timeline.',
            'Elegí un escenario y trazá un pedido para ver su línea de tiempo.',
          ])}
        </p>
      )}
    </ExperimentWorkbench>
  );
}
