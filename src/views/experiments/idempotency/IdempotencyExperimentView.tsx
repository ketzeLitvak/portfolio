import { Send, KeyRound, RefreshCw, Receipt } from 'lucide-react';

import type { ViewProps } from '../../../models/viewProps';

import { translate, type Text } from '../../../models/types';

import { useIdempotencyExperimentPresenter } from '../../../presenters/useIdempotencyExperimentPresenter';

import { ExperimentWorkbench } from '../ExperimentWorkbench';

import ui from '../ExperimentUI.module.css';

import styles from './IdempotencyExperimentView.module.css';

export function IdempotencyExperimentView({ language }: ViewProps) {
  const p = useIdempotencyExperimentPresenter();

  const t = (text: Text) => translate(language, text);

  const { state } = p;
  return (
    <ExperimentWorkbench
      language={language}
      className={styles.root}
      reset={p.reset}
      title={['Retry the request. Not the payment.', 'Reintentá el pedido. No el pago.']}
      description={[
        'Send the same payment twice and see whether it is charged again.',
        'Mandá el mismo pago dos veces y mirá si se vuelve a cobrar.',
      ]}
      docs="https://docs.stripe.com/api/idempotent_requests"
      explanation={
        <>
          <p>
            {t([
              'The client reuses the same idempotency key when retrying the same operation. This model stores the payment response and amount for each key: identical retries return the original payment, while a different amount with the same key is rejected.',
              'El cliente reutiliza la clave de idempotencia al reintentar la misma operación. Este modelo guarda la respuesta del pago y su importe por clave: los reintentos idénticos devuelven el pago original y un importe distinto con la misma clave se rechaza.',
            ])}
          </p>
          <p>
            {t([
              'A lost response does not mean the server failed. The payment may already be committed; retrying with its original key avoids a second charge. A new key represents a new operation and can create another payment.',
              'Perder la respuesta no significa que el servidor falló. El pago puede estar confirmado; reintentar con su clave original evita un segundo cobro. Una clave nueva representa una operación nueva y puede crear otro pago.',
            ])}
          </p>
          <p>
            {t([
              'This local model processes requests sequentially and retains keys until reset. A real implementation needs atomic key reservation, payload validation, durable result storage, a defined retention policy, and handling of concurrent in-progress retries. Idempotency does not guarantee delivery.',
              'Este modelo local procesa pedidos secuencialmente y conserva las claves hasta reiniciar. Una implementación real necesita reservar la clave atómicamente, validar el payload, guardar resultados de forma durable, definir su retención y manejar reintentos concurrentes en curso. La idempotencia no garantiza la entrega.',
            ])}
          </p>
        </>
      }
    >
      <div className={ui.modes}>
        <button aria-pressed={p.protectedRequest} onClick={() => p.setProtectedRequest(true)}>
          {t(['With idempotency', 'Con idempotencia'])}
        </button>
        <button aria-pressed={!p.protectedRequest} onClick={() => p.setProtectedRequest(false)}>
          {t(['Without protection', 'Sin protección'])}
        </button>
      </div>
      <div className={styles.request}>
        <div className={ui.toolbar}>
          <span className={ui.badge}>
            <KeyRound size={14} />
            {p.protectedRequest ? p.key : t(['No key', 'Sin clave'])}
          </span>
          <button className={ui.secondary} disabled={!p.protectedRequest} onClick={p.newKey}>
            <RefreshCw size={14} />
            {t(['New key', 'Nueva clave'])}
          </button>
        </div>
        <label className={ui.field}>
          {t(['Payment amount', 'Importe del pago'])}
          <select value={p.amount} onChange={(event) => p.setAmount(Number(event.target.value))}>
            <option value="20">$20</option>
            <option value="35">$35</option>
          </select>
        </label>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={p.loseResponse}
            onChange={(event) => p.setLoseResponse(event.target.checked)}
          />
          {t(['Lose the response after charging', 'Perder la respuesta después de cobrar'])}
        </label>
        <button className={ui.primary} onClick={p.send}>
          <Send size={15} />
          {t(['Send / retry payment', 'Enviar / reintentar pago'])}
        </button>
      </div>
      <p className={ui.feedback} data-error={state.result === 'conflict'} aria-live="polite">
        {t(
          state.result === 'conflict'
            ? [
                '409 · Same key, different amount. Rejected without another charge.',
                '409 · Misma clave, distinto importe. Rechazado sin otro cobro.',
              ]
            : state.lost
              ? [
                  'Client timed out, but the server processed the request. Turn off the lost response and retry with the same key.',
                  'El cliente agotó la espera, pero el servidor procesó el pedido. Desactivá la pérdida de respuesta y reintentá con la misma clave.',
                ]
              : state.result === 'replayed'
                ? [
                    `Original payment #${state.paymentId} returned. No new charge.`,
                    `Se devolvió el pago original #${state.paymentId}. Sin nuevo cobro.`,
                  ]
                : state.result === 'created'
                  ? [
                      `Payment #${state.paymentId} created. A new charge was recorded.`,
                      `Pago #${state.paymentId} creado. Se registró un nuevo cobro.`,
                    ]
                  : [
                      'Send, then retry. Compare the recorded charges below.',
                      'Enviá y después reintentá. Compará los cobros registrados abajo.',
                    ],
        )}
      </p>
      <div className={ui.metrics}>
        <span>
          {t(['Charges', 'Cobros'])}
          <strong>{state.payments.length}</strong>
        </span>
        <span>
          {t(['Total charged', 'Total cobrado'])}
          <strong>${state.payments.reduce((sum, payment) => sum + payment.amount, 0)}</strong>
        </span>
      </div>
      <div
        className={styles.payments}
        aria-label={t(['Server payment records', 'Pagos registrados en el servidor'])}
      >
        <h3>
          <Receipt size={17} />
          {t(['Server ledger', 'Registro del servidor'])}
        </h3>
        {state.payments.length ? (
          state.payments.slice(-6).map((payment) => (
            <div key={payment.id}>
              <strong>#{payment.id}</strong>
              <span>{payment.key ?? '—'}</span>
              <strong>${payment.amount}</strong>
            </div>
          ))
        ) : (
          <p>{t(['No charges yet.', 'Todavía no hay cobros.'])}</p>
        )}
        {state.payments.length > 6 && (
          <p>{t(['Showing the last 6 charges.', 'Se muestran los últimos 6 cobros.'])}</p>
        )}
      </div>
    </ExperimentWorkbench>
  );
}
