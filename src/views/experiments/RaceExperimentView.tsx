import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  ShoppingCart,
  Sparkles,
  Ticket,
  UserRound,
  X,
} from 'lucide-react';
import type { ViewProps } from '../../models/viewProps';
import { translate, type Text } from '../../models/types';
import { raceSteps, type BuyerId, type RaceMode } from '../../models/raceExperiment';
import { useRaceExperimentPresenter } from '../../presenters/useRaceExperimentPresenter';
export function RaceExperimentView({ language }: ViewProps) {
  const p = useRaceExperimentPresenter(),
    s = p.state;
  const t = (text: Text) => translate(language, text);
  const message: Text = p.done
    ? s.mode === 'unsafe'
      ? [
          'Two purchases confirmed for one ticket. Both trusted a read that was already outdated.',
          'Dos compras confirmadas para una entrada. Ambos confiaron en una lectura que ya estaba desactualizada.',
        ]
      : [
          'One purchase confirmed. Checking and reserving together prevented a second sale.',
          'Una compra confirmada. Verificar y reservar juntos evitó una segunda venta.',
        ]
    : (s.trace.at(-1) ??
      (s.mode === 'unsafe'
        ? [
            'Both buyers will read before either saves. Can they both buy the last ticket?',
            'Ambos van a leer antes de que alguno guarde. ¿Pueden comprar los dos la última entrada?',
          ]
        : [
            'The availability check and reservation happen together. Try the same two purchases.',
            'La verificación y la reserva ocurren juntas. Probá las mismas dos compras.',
          ]));
  const buyer = (id: BuyerId, name: string) => {
    const person = s.buyers[id];
    return (
      <article
        className="race-buyer"
        data-buyer={id}
        data-active={p.running && p.active === id}
        data-status={person.status}
      >
        <span className="race-avatar">
          <UserRound size={32} />
        </span>
        <h3>{name}</h3>
        <span className="race-buyer-role">{t(['Wants 1 ticket', 'Quiere 1 entrada'])}</span>
        <div className="race-buyer-status">
          {person.status === 'confirmed' ? (
            <Check size={17} />
          ) : person.status === 'rejected' ? (
            <X size={17} />
          ) : (
            <ShoppingCart size={17} />
          )}
          <strong>
            {t(
              person.status === 'confirmed'
                ? ['Purchase confirmed', 'Compra confirmada']
                : person.status === 'rejected'
                  ? ['Sold out', 'Sin entradas']
                  : person.status === 'read'
                    ? ['Saw 1 available', 'Vio 1 disponible']
                    : ['Ready to buy', 'Listo para comprar'],
            )}
          </strong>
        </div>
        <small>
          {person.read === null
            ? t(['Has not checked yet', 'Todavía no consultó'])
            : `${t(['Read stock', 'Stock consultado'])}: ${person.read}`}
        </small>
      </article>
    );
  };
  return (
    <div className="race-playground">
      <header className="race-intro">
        <button
          className="race-reset"
          onClick={p.reset}
          disabled={p.running}
          aria-label={t(['Start over', 'Empezar de nuevo'])}
          title={t(['Start over', 'Empezar de nuevo'])}
        >
          <RotateCcw size={15} />
        </button>
        <span className="race-eyebrow">
          <Sparkles size={13} />
          {t(['PLAY WITH A CONCEPT', 'JUGÁ CON UN CONCEPTO'])}
        </span>
        <h2>{t(['Two buyers. One last ticket.', 'Dos compradores. Una última entrada.'])}</h2>
        <p>
          {t([
            'They buy at the same time. Does checking availability guarantee a ticket?',
            'Compran al mismo tiempo. ¿Consultar disponibilidad garantiza una entrada?',
          ])}
        </p>
      </header>
      <div
        className="race-modes"
        role="group"
        aria-label={t(['Reservation strategy', 'Estrategia de reserva'])}
      >
        {(['unsafe', 'atomic'] as RaceMode[]).map((mode) => (
          <button
            key={mode}
            data-mode={mode}
            aria-pressed={s.mode === mode}
            disabled={p.running}
            onClick={() => p.selectMode(mode)}
          >
            {t(
              mode === 'unsafe'
                ? ['Without protection', 'Sin protección']
                : ['Atomic reservation', 'Reserva atómica'],
            )}
          </button>
        ))}
      </div>
      <div className="race-scene">
        {buyer('a', 'Ana')}
        <article className="race-stock">
          <Ticket size={34} />
          <strong>{s.stock}</strong>
          <span>{t(['Tickets available', 'Entradas disponibles'])}</span>
          <small>{t(['Shared stock', 'Stock compartido'])}</small>
          <ArrowRight className="race-link race-link-left" size={18} />
          <ArrowLeft className="race-link race-link-right" size={18} />
        </article>
        {buyer('b', 'Bruno')}
      </div>
      <div
        className="race-feedback"
        data-error={p.done && p.sales > 1}
        aria-live="polite"
        aria-atomic="true"
      >
        <span />
        <p>{t(message)}</p>
      </div>
      <div className="race-main-action">
        <button className="race-buy" onClick={p.buy} disabled={p.running}>
          <ShoppingCart size={17} />
          {t(
            p.running
              ? ['Purchases in progress…', 'Compras en curso…']
              : ['Buy at the same time', 'Comprar al mismo tiempo'],
          )}
        </button>
        <span className="race-sale-count">
          {t(['Confirmed purchases', 'Compras confirmadas'])}: <strong>{p.sales}</strong>
        </span>
      </div>
      {s.step > 0 && (
        <ol className="race-timeline" aria-label={t(['Operation order', 'Orden de operaciones'])}>
          {raceSteps[s.mode].map((step, index) => (
            <li key={index} data-done={index < s.step}>
              <span>{index + 1}</span>
              <p>
                {index < s.step
                  ? t(step.text)
                  : t(['Waiting for this step…', 'Esperando este paso…'])}
              </p>
            </li>
          ))}
        </ol>
      )}
      {p.done && (
        <div className="race-comparison">
          {(['unsafe', 'atomic'] as RaceMode[]).map((mode) => (
            <span key={mode}>
              {t(
                mode === 'unsafe'
                  ? ['Without protection', 'Sin protección']
                  : ['Atomic reservation', 'Reserva atómica'],
              )}
              <strong>
                {p.comparison[mode] === undefined
                  ? t(['Not tried yet', 'Todavía sin probar'])
                  : `${p.comparison[mode]} ${t(['confirmed', 'confirmadas'])}`}
              </strong>
            </span>
          ))}
        </div>
      )}
      <footer className="race-footer">
        {t([
          'Local simulation · illustrative operation order',
          'Simulación local · orden de operaciones de ejemplo',
        ])}
      </footer>
      <details className="race-explanation">
        <summary>{t(['How does it work?', '¿Cómo funciona?'])}</summary>
        <p>
          {t([
            'Without protection, checking and saving are separate operations. Ana reads 1, Bruno reads 1, then both confirm using that old value and write 0. Stock looks valid even though two tickets were sold. This is a race condition with a lost update.',
            'Sin protección, consultar y guardar son operaciones separadas. Ana lee 1, Bruno lee 1 y ambos confirman con ese valor anterior y escriben 0. El stock parece válido, aunque se vendieron dos entradas. Es una condición de carrera con una actualización perdida.',
          ])}
        </p>
        <p>
          {t([
            'The atomic version reserves only if current stock is positive, in the same operation. The second purchase sees 0 and cannot reserve. This demo shows Ana arriving first; with another order, Bruno could win.',
            'La versión atómica reserva solo si el stock actual es positivo, en la misma operación. La segunda compra encuentra 0 y no puede reservar. La demo muestra a Ana llegando primero; con otro orden podría ganar Bruno.',
          ])}
        </p>
        <pre>
          <code>
            {'UPDATE tickets\nSET stock = stock - 1\nWHERE id = 1 AND stock > 0\nRETURNING stock;'}
          </code>
        </pre>
        <p>
          {t([
            'In PostgreSQL, confirm the purchase only if a row is returned. Persisting the order and decrementing stock must be part of the same transaction. This browser animation models the outcome; it does not execute database operations or process payments.',
            'En PostgreSQL, confirmá la compra solo si se devuelve una fila. Guardar el pedido y descontar el stock deben formar parte de la misma transacción. Esta animación modela el resultado; no ejecuta operaciones de base de datos ni procesa pagos.',
          ])}
        </p>
        <a
          href="https://www.postgresql.org/docs/current/transaction-iso.html"
          target="_blank"
          rel="noreferrer"
        >
          {t(['Explore transaction isolation', 'Explorar aislamiento de transacciones'])} →
        </a>
      </details>
    </div>
  );
}
