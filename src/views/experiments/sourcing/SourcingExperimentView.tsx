import { History, Minus, Plus, RotateCcw, ShoppingBag } from 'lucide-react';

import type { ViewProps } from '../../../models/viewProps';

import { translate, type Text } from '../../../models/types';

import { useSourcingExperimentPresenter } from '../../../presenters/useSourcingExperimentPresenter';

import { ExperimentWorkbench } from '../ExperimentWorkbench';

import ui from '../ExperimentUI.module.css';

import styles from './SourcingExperimentView.module.css';

export function SourcingExperimentView({ language }: ViewProps) {
  const p = useSourcingExperimentPresenter();

  const t = (text: Text) => translate(language, text);

  const disabled = p.replaying || !p.present || p.events.length >= 24;
  return (
    <ExperimentWorkbench
      language={language}
      className={styles.root}
      reset={p.reset}
      busy={p.replaying}
      title={['A cart with a memory.', 'Un carrito con memoria.']}
      description={[
        'Store what happened. Rebuild the cart by replaying its history.',
        'Guardá lo que pasó. Reconstruí el carrito recorriendo su historial.',
      ]}
      docs="https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing"
      explanation={
        <>
          <p>
            {t([
              'The event log is the source of truth. Add and remove commands append events; the cart is a projection made by summing their changes. Rebuilding discards the displayed projection and applies the same history again.',
              'El registro de eventos es la fuente de verdad. Agregar y quitar anexan eventos; el carrito es una proyección que suma sus cambios. Reconstruir descarta la proyección visible y aplica otra vez el mismo historial.',
            ])}
          </p>
          <p>
            {t([
              'Moving the slider reconstructs an earlier state without deleting later events. Undo appends a compensating event instead of editing history. Commands are enabled only at the present.',
              'El control reconstruye un estado anterior sin borrar eventos posteriores. Deshacer agrega un evento compensatorio en lugar de editar el historial. Solo podés agregar cambios estando en el presente.',
            ])}
          </p>
          <p>
            {t([
              'This browser demo keeps up to 24 events in memory. Real systems need durable storage, concurrency control, event versioning and replay-safe projections. Event sourcing is a persistence model; sending events through a queue alone does not make a system event-sourced.',
              'Esta demo conserva hasta 24 eventos en memoria. Un sistema real requiere persistencia, control de concurrencia, versiones de eventos y proyecciones que puedan reconstruirse. Event sourcing es un modelo de persistencia; enviar eventos por una cola no basta.',
            ])}
          </p>
        </>
      }
    >
      <div className={styles.cart}>
        <ShoppingBag size={34} />
        <div>
          <strong>{p.cart.quantity}</strong>
          <span>{t(['items in the cart', 'productos en el carrito'])}</span>
        </div>
        <div className={styles.total}>
          <small>{t(['Total', 'Total'])}</small>
          <strong>${p.cart.total}</strong>
        </div>
      </div>
      <div className={ui.actions}>
        <button className={ui.primary} disabled={disabled} onClick={() => p.command('add')}>
          <Plus size={16} />
          {t(['Add item', 'Agregar producto'])}
        </button>
        <button
          className={ui.secondary}
          disabled={disabled || p.cart.quantity === 0}
          onClick={() => p.command('remove')}
        >
          <Minus size={16} />
          {t(['Remove item', 'Quitar producto'])}
        </button>
        <button
          className={ui.secondary}
          disabled={p.replaying || !p.events.length}
          onClick={p.rebuild}
        >
          <History size={16} />
          {t(['Rebuild cart', 'Reconstruir carrito'])}
        </button>
      </div>
      <p className={ui.feedback} aria-live="polite">
        {p.replaying
          ? `${t(['Replaying event', 'Aplicando evento'])} ${p.cursor}/${p.events.length}`
          : !p.present
            ? t([
                'You are viewing the past. The complete history is still intact.',
                'Estás viendo el pasado. El historial completo sigue intacto.',
              ])
            : p.events.length >= 24
              ? t([
                  'Demo limit reached. Start over to create another history.',
                  'Llegaste al límite de la demo. Reiniciá para crear otro historial.',
                ])
              : t([
                  'Each item costs $20. Every change adds a new event.',
                  'Cada producto cuesta $20. Cada cambio agrega un nuevo evento.',
                ])}
      </p>
      <label className={styles.timeline}>
        {t(['Reconstruct through event', 'Reconstruir hasta el evento'])}{' '}
        <strong>
          {p.cursor}/{p.events.length}
        </strong>
        <input
          type="range"
          min={0}
          max={p.events.length}
          value={p.cursor}
          disabled={p.replaying || !p.events.length}
          onChange={(e) => p.seek(Number(e.target.value))}
        />
      </label>
      {!p.present && !p.replaying && (
        <button className={ui.secondary} onClick={p.live}>
          {t(['Return to the present', 'Volver al presente'])}
        </button>
      )}
      <section className={styles.log} aria-label={t(['Event log', 'Registro de eventos'])}>
        <header>
          <h3>{t(['History · append only', 'Historial · solo se agrega'])}</h3>
          <button
            aria-label={t(['Undo last change', 'Deshacer último cambio'])}
            title={t([
              'Undo by appending a compensating event',
              'Deshacer agregando un evento compensatorio',
            ])}
            disabled={disabled || !p.events.length}
            onClick={() => p.command('compensate')}
          >
            <RotateCcw size={14} />
          </button>
        </header>
        {!p.events.length && (
          <p className={ui.note}>
            {t([
              'Add an item to start the history.',
              'Agregá un producto para iniciar el historial.',
            ])}
          </p>
        )}
        <ol>
          {p.events.map((event, index) => (
            <li
              key={event.id}
              data-applied={index < p.cursor}
              data-current={p.replaying && index === p.cursor - 1}
            >
              <span>#{event.id}</span>
              <strong>
                {t(
                  event.reason === 'add'
                    ? ['Item added', 'Producto agregado']
                    : event.reason === 'remove'
                      ? ['Item removed', 'Producto quitado']
                      : ['Change compensated', 'Cambio compensado'],
                )}
                {event.reverses ? ` #${event.reverses}` : ''}
              </strong>
              <small>{event.delta > 0 ? '+1' : '−1'}</small>
            </li>
          ))}
        </ol>
      </section>
    </ExperimentWorkbench>
  );
}
