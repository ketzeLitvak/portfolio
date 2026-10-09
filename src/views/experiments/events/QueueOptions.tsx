import eventStyles from './QueueExperimentView.module.css';

import { OptionsPopover } from '../../../components/options/OptionsPopover';

import { OptionChoices } from '../../../components/options/OptionChoices';

import type {
  useQueueExperimentPresenter,
  EventDelivery,
} from '../../../presenters/useQueueExperimentPresenter';

import { translate, type Language, type Text } from '../../../models/types';

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
  const t = (text: Text) => translate(language, text);

  const selected = deliveries.find((entry) => entry.id === p.delivery)!;
  return (
    <OptionsPopover
      language={language}
      appearance="events"
      valueLabel={t(selected.title)}
      label={t(['Delivery scenario', 'Escenario de entrega']) + ': ' + t(selected.title)}
      title={t(['What if something goes wrong?', '¿Y si algo sale mal?'])}
    >
      {() => (
        <>
          <OptionChoices
            language={language}
            appearance="events"
            label={t(['Next event', 'Próximo evento'])}
            value={p.delivery}
            options={deliveries}
            onChange={p.setDelivery}
          />
          <label className={eventStyles.eventsIdempotency}>
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
        </>
      )}
    </OptionsPopover>
  );
}
