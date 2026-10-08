import { createPortal } from 'react-dom';
import { Check, ChevronDown, X } from 'lucide-react';
import { useExperimentPopoverPresenter } from '../../presenters/useExperimentPopoverPresenter';
import type {
  useQueueExperimentPresenter,
  EventDelivery,
} from '../../presenters/useQueueExperimentPresenter';
import { translate, type Language, type Text } from '../../models/types';
const deliveries: { id: EventDelivery; title: Text; description: Text }[] = [
  {
    id: 'normal',
    title: ['No failures', 'Sin fallos'],
    description: [
      'The next event succeeds on its first attempt.',
      'El próximo evento se procesa al primer intento.',
    ],
  },
  {
    id: 'retry',
    title: ['Fail once', 'Fallar una vez'],
    description: [
      'The next event fails, waits and tries again.',
      'El próximo evento falla, espera y vuelve a intentar.',
    ],
  },
  {
    id: 'fail',
    title: ['Always fail', 'Fallar siempre'],
    description: [
      'After three attempts it moves to failed results.',
      'Después de tres intentos queda como fallido.',
    ],
  },
];
export function QueueOptions({
  presenter: p,
  language,
}: {
  presenter: ReturnType<typeof useQueueExperimentPresenter>;
  language: Language;
}) {
  const pop = useExperimentPopoverPresenter();
  const t = (text: Text) => translate(language, text);
  const selected = deliveries.find((entry) => entry.id === p.delivery)!;
  return (
    <>
      <button
        className="events-options-trigger"
        ref={pop.triggerRef}
        onClick={pop.toggle}
        aria-controls={pop.id}
        aria-expanded={!!pop.position}
        aria-label={`${t(['Delivery scenario', 'Escenario de entrega'])}: ${t(selected.title)}`}
      >
        {t(selected.title)}
        <ChevronDown size={13} />
      </button>
      {pop.position &&
        createPortal(
          <div
            className="events-options"
            id={pop.id}
            ref={pop.panelRef}
            style={pop.position}
            role="region"
            aria-label={t(['Explore event delivery', 'Explorar entrega de eventos'])}
          >
            <header>
              <strong>{t(['What if something goes wrong?', '¿Y si algo sale mal?'])}</strong>
              <button
                aria-label={t(['Close options', 'Cerrar opciones'])}
                onClick={() => {
                  pop.close();
                  pop.triggerRef.current?.focus();
                }}
              >
                <X size={15} />
              </button>
            </header>
            <div
              className="events-deliveries"
              role="group"
              aria-label={t(['Next event', 'Próximo evento'])}
            >
              {deliveries.map((entry) => (
                <button
                  key={entry.id}
                  data-delivery={entry.id}
                  aria-pressed={p.delivery === entry.id}
                  onClick={() => p.setDelivery(entry.id)}
                >
                  <span>
                    <strong>{t(entry.title)}</strong>
                    {p.delivery === entry.id && <Check size={14} />}
                  </span>
                  <small>{t(entry.description)}</small>
                </button>
              ))}
            </div>
            <label className="events-idempotency">
              <input
                type="checkbox"
                checked={p.idempotent}
                onChange={(event) => p.setIdempotent(event.target.checked)}
              />
              <span>
                {t([
                  'Avoid repeating effects for the same event',
                  'Evitar repetir efectos del mismo evento',
                ])}
                <small>
                  {t([
                    'Checked when each attempt finishes.',
                    'Se comprueba al terminar cada intento.',
                  ])}
                </small>
              </span>
            </label>
            <p>
              {t([
                'Failure settings apply to new deliveries. Events already in the queue keep their settings.',
                'Los fallos elegidos aplican a las próximas entregas. Los eventos que ya están en cola conservan su configuración.',
              ])}
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}
