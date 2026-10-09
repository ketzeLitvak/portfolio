import styles from './CacheExperimentView.module.css';

import { classNames } from '../../../utils/classNames';

import { ExperimentHeader } from '../ExperimentHeader';

import { ExperimentExplanation } from '../ExperimentExplanation';

import { CacheLifetime } from './CacheLifetime';

import { CacheMemory } from './CacheMemory';

import { CacheStrategies } from './CacheStrategies';

import { cacheServices, cacheStrategies } from '../../../models/cacheExperiment';

import {
  Play,
  Pause,
  ArrowRight,
  Check,
  Cpu,
  Database,
  Layers,
  Laptop,
  Timer,
  Trash2,
} from 'lucide-react';

import type { CSSProperties } from 'react';

import type { ViewProps } from '../../../models/viewProps';

import { translate, type Text } from '../../../models/types';

import {
  useCacheExperimentPresenter,
  type CacheStop,
} from '../../../presenters/useCacheExperimentPresenter';

const nodes: { id: CacheStop; title: Text; subtitle: Text; icon: typeof Cpu }[] = [
  {
    id: 'client',
    title: ['Request', 'Consulta'],
    subtitle: ['Asks for a price', 'Pide un precio'],
    icon: Laptop,
  },
  {
    id: 'memory',
    title: ['Local memory', 'Memoria local'],
    subtitle: ['One copy per service', 'Una copia por servicio'],
    icon: Cpu,
  },
  {
    id: 'redis',
    title: ['Shared copy', 'Copia compartida'],
    subtitle: ['For all services', 'Para los servicios'],
    icon: Layers,
  },
  {
    id: 'database',
    title: ['Original data', 'Dato original'],
    subtitle: ['The saved price', 'El precio guardado'],
    icon: Database,
  },
];

export function CacheExperimentView({ language }: ViewProps) {
  const p = useCacheExperimentPresenter(),
    s = p.state;

  const t = (text: Text) => translate(language, text);

  const answer = s.answers[s.service];
  const strategy = cacheStrategies.find((entry) => entry.id === s.strategy)!;
  const message: Text = p.busy
    ? p.returning
      ? ['The price travels back to your app.', 'El precio vuelve a tu app.']
      : p.active === 'client'
        ? ['Your app asks: what is the price?', 'Tu app pregunta: ¿cuál es el precio?']
        : p.active === 'database'
          ? ['No copy yet. We fetch the original.', 'No hay una copia. Buscamos el original.']
          : p.journey!.result.last!.source === p.active
            ? ['Found a copy! No need to go further.', '¡Hay una copia! No hace falta seguir.']
            : [
                'No valid copy here. Let’s keep looking.',
                'Acá no hay una copia vigente. Seguimos buscando.',
              ]
    : p.event === 'invalidate'
      ? [
          'Only that copy was removed. Other memories and Redis keep their own copies.',
          'Borramos solo esa copia. Las otras memorias y Redis conservan las suyas.',
        ]
      : p.event === 'write'
        ? s.strategy === 'ttl'
          ? [
              'Only the original changed. A and B keep their copies until expiration.',
              'Cambió solo el original. A y B conservan sus copias hasta vencer.',
            ]
          : s.strategy === 'invalidate'
            ? s.notifyOthers
              ? [
                  'Copies removed in Redis, A and B. The notification reached the other service.',
                  'Borramos las copias de Redis, A y B. El aviso llegó al otro servicio.',
                ]
              : [
                  'Redis and this service’s copy were removed. The other service still has its own memory.',
                  'Borramos Redis y la copia de este servicio. El otro conserva su propia memoria.',
                ]
            : s.notifyOthers
              ? [
                  'Original and Redis updated. The other service received a notification and removed its local copy.',
                  'Actualizamos original y Redis. El otro servicio recibió un aviso y borró su copia local.',
                ]
              : [
                  'Original and Redis updated. The other service’s memory did not change.',
                  'Actualizamos original y Redis. La memoria del otro servicio no cambió.',
                ]
        : p.event === 'service'
          ? [
              'You switched services. Its memory is separate; Redis and the original are the same.',
              'Cambiaste de servicio. Su memoria es independiente; Redis y el original son los mismos.',
            ]
          : p.event === 'strategy'
            ? [
                'Strategy selected. Change the price, then compare requests from both services.',
                'Estrategia elegida. Cambiá el precio y compará consultas desde ambos servicios.',
              ]
            : !answer
              ? [
                  'Where does an app look for a price? Give it a try.',
                  '¿Dónde busca una app un precio? Probalo.',
                ]
              : answer.stale
                ? [
                    'Fast, but outdated: the copy still has the old price.',
                    'Rápido, pero desactualizado: la copia tiene el precio anterior.',
                  ]
                : answer.source === 'database'
                  ? [
                      'Price found. Now we keep copies for next time.',
                      'Encontramos el precio. Guardamos copias para la próxima.',
                    ]
                  : answer.source === 'redis'
                    ? [
                        `Service ${s.service.toUpperCase()} had no local copy. Shared Redis answered; now this service has its own copy.`,
                        `El servicio ${s.service.toUpperCase()} no tenía copia local. Respondió Redis compartido; ahora este servicio tiene su propia copia.`,
                      ]
                    : [
                        `Service ${s.service.toUpperCase()} answered from its own memory. We did not access Redis or the original.`,
                        `Respondió la memoria del servicio ${s.service.toUpperCase()}. No consultamos Redis ni el original.`,
                      ];
  return (
    <div className={styles.cachePlayground}>
      <ExperimentHeader
        language={language}
        appearance="cache"
        title={['Why is the second request faster?', '¿Por qué la segunda consulta es más rápida?']}
        description={[
          'Two services need a price. Their memory is private; Redis is shared.',
          'Dos servicios necesitan un precio. Su memoria es privada; Redis es compartido.',
        ]}
        reset={p.reset}
        disabled={p.busy}
      />
      <div className={styles.cacheToolbar}>
        <div
          className={styles.cacheServicePicker}
          role="group"
          aria-label={t(['Request destination', 'Destino de la consulta'])}
        >
          <span>{t(['Send request to', 'Consultar desde'])}</span>
          {cacheServices.map((service) => (
            <button
              key={service}
              data-service={service}
              aria-pressed={s.service === service}
              disabled={p.busy}
              onClick={() => p.selectService(service)}
            >
              {t(['Service', 'Servicio'])} {service.toUpperCase()}
            </button>
          ))}
        </div>
        <div className={styles.cacheClock}>
          <span>
            <Timer size={13} />
            {t(['Simulated clock', 'Reloj simulado'])} <strong>{s.now} s</strong> ·{' '}
            {t(
              p.busy
                ? ['paused during request', 'pausado durante consulta']
                : p.clockRunning
                  ? ['running', 'en marcha']
                  : ['paused', 'pausado'],
            )}
          </span>
          <button
            onClick={p.toggleClock}
            disabled={p.busy}
            aria-label={t(
              p.clockRunning ? ['Pause clock', 'Pausar reloj'] : ['Start clock', 'Iniciar reloj'],
            )}
            title={t(
              p.clockRunning ? ['Pause clock', 'Pausar reloj'] : ['Start clock', 'Iniciar reloj'],
            )}
          >
            {p.clockRunning ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button onClick={p.advanceClock} disabled={p.busy}>
            +1 s
          </button>
        </div>
      </div>
      <div
        className={styles.cacheScene}
        data-traveling={p.busy}
        aria-label={t([
          'Journey from the app to the original data',
          'Recorrido de la app al dato original',
        ])}
      >
        {nodes.map(({ id, title, subtitle, icon: Icon }, index) => {
          const entry = id === 'redis' ? s.redis : null;
          const valid = entry && entry.expires > s.now;
          const value =
            id === 'database'
              ? s.value
              : id === 'client'
                ? answer?.value
                : valid
                  ? entry.value
                  : null;
          const old =
            id !== 'database' && value !== null && value !== undefined && value !== s.value;
          const visited = p.journey
            ? p.journey.stops.slice(0, p.frame + 1).includes(id)
            : answer?.route.includes(id);
          return (
            <article
              key={id}
              className={styles.cacheNode}
              data-active={p.active === id}
              data-visited={!!visited}
              data-old={old}
            >
              <span className={styles.cacheNodeIcon}>
                <Icon size={23} />
              </span>
              {id === 'redis' && (
                <button
                  className={classNames(styles.cacheEvict, styles.cacheRedisEvict)}
                  onClick={() => p.invalidate('redis')}
                  disabled={p.busy || !s.redis}
                  aria-label={t(['Invalidate Redis', 'Invalidar Redis'])}
                  title={t(['Invalidate Redis', 'Invalidar Redis'])}
                >
                  <Trash2 size={13} />
                </button>
              )}
              <h3>
                {id === 'client'
                  ? `${t(['Service', 'Servicio'])} ${s.service.toUpperCase()}`
                  : t(title)}
              </h3>
              <span className={styles.cacheNodeSubtitle}>{t(subtitle)}</span>
              {id === 'memory' ? (
                <CacheMemory
                  state={s}
                  language={language}
                  active={p.active === 'memory'}
                  busy={p.busy}
                  invalidate={p.invalidate}
                />
              ) : (
                <>
                  <strong className={styles.cachePrice}>
                    {value === null || value === undefined ? '—' : `$${value}`}
                  </strong>
                  <span className={styles.cacheNodeStatus}>
                    {old
                      ? t(['Old price', 'Precio anterior'])
                      : id === 'client'
                        ? t(['Last answer', 'Última respuesta'])
                        : id === 'database'
                          ? t(['Always here', 'Siempre acá'])
                          : valid
                            ? t(['Copy saved', 'Copia guardada'])
                            : entry
                              ? t(['Copy expired', 'Copia vencida'])
                              : t(['No copy yet', 'Todavía sin copia'])}
                  </span>
                  {id === 'redis' && (
                    <CacheLifetime
                      entry={s.redis}
                      now={s.now}
                      ttl={s.redisTTL}
                      language={language}
                      layer="redis"
                    />
                  )}
                </>
              )}
              {index < nodes.length - 1 && (
                <ArrowRight className={styles.cacheConnector} size={18} aria-hidden="true" />
              )}
            </article>
          );
        })}
        {p.busy && (
          <span
            className={styles.cacheTraveler}
            style={{ '--stop': nodes.findIndex((node) => node.id === p.active) } as CSSProperties}
            aria-hidden="true"
          >
            <span />
          </span>
        )}
      </div>
      <div className={styles.cacheNarration} aria-live="polite" aria-atomic="true">
        <span className={p.busy ? styles.cachePulse : styles.cacheStatusDot} />
        <p>{t(message)}</p>
      </div>
      <div className={styles.cacheMainAction}>
        <button className={styles.cacheRequest} onClick={p.query} disabled={p.busy}>
          <ArrowRight size={18} />
          {t(
            p.busy
              ? ['Following the request…', 'Siguiendo la consulta…']
              : !answer
                ? ['Ask for the price', 'Pedir el precio']
                : ['Ask again', 'Pedir otra vez'],
          )}{' '}
          {!p.busy && s.service.toUpperCase()}
        </button>
        <CacheStrategies presenter={p} language={language} />
        {answer && !p.busy && p.event === 'read' && (
          <span className={styles.cacheTime}>
            <Timer size={15} />
            {answer.latency} ms{' '}
            {p.firstLatency && answer.latency < p.firstLatency ? (
              <small>
                {Math.round(p.firstLatency / answer.latency)}× {t(['faster', 'más rápido'])}
              </small>
            ) : (
              <small>
                {t(
                  answer.source === 'database'
                    ? ['trip to the original', 'viaje al original']
                    : ['from a copy', 'desde una copia'],
                )}
              </small>
            )}
          </span>
        )}
      </div>
      <footer className={styles.cacheFooter}>
        <span>{t(['Local demo · illustrative times', 'Demo local · tiempos ilustrativos'])}</span>
      </footer>
      <ExperimentExplanation language={language} appearance="cache">
        <div>
          <p>
            {t([
              'This is caching: keeping a nearby copy so we don’t fetch the original every time. The first read stores copies; subsequent reads can take a shorter route.',
              'Esto es caché: guardar una copia cerca para evitar buscar el original cada vez. La primera lectura guarda copias; las siguientes pueden tomar un camino más corto.',
            ])}
          </p>
          <ul>
            <li>
              <Check size={14} />
              <span>
                <b>{t(['Quick copy = memory.', 'Copia rápida = memoria.'])}</b>{' '}
                {t([
                  'Private to each service process, valid for 6 simulated seconds. A’s memory never answers B.',
                  'Privada a cada proceso de servicio, válida por 6 segundos simulados. La memoria de A nunca responde a B.',
                ])}
              </span>
            </li>
            <li>
              <Check size={14} />
              <span>
                <b>{t(['Shared copy = Redis.', 'Copia compartida = Redis.'])}</b>{' '}
                {t([
                  'Valid for 20 simulated seconds, can be shared by services.',
                  'Válida por 20 segundos simulados, puede compartirse entre servicios.',
                ])}
              </span>
            </li>
            <li>
              <Check size={14} />
              <span>
                <b>{t(['Original data = database.', 'Dato original = base de datos.'])}</b>{' '}
                {t([
                  'The authoritative value. Each write uses the selected strategy. Updating Redis does not automatically change other services’ memories.',
                  'El valor de referencia. Cada escritura usa la estrategia elegida. Actualizar Redis no cambia automáticamente las memorias de otros servicios.',
                ])}
              </span>
            </li>
          </ul>
          <p>
            {t([
              'The clock starts paused: use +1 s or start it to see copies expire. It pauses during request animations. Trash icons invalidate only that copy; other copies remain.',
              'El reloj empieza pausado: usá +1 s o inicialo para ver vencer las copias. Se pausa durante el recorrido animado. Los iconos de papelera invalidan solo esa copia; las otras permanecen.',
            ])}
          </p>
          <p>
            <b>{strategy.concept}</b> · {t(strategy.description)}
          </p>
          <p>
            {t([
              'The notification option simulates a coordination mechanism that successfully evicts other services’ copies. Real systems must handle delivery failures and concurrent operations; those are outside this demo.',
              'La opción de avisar simula un mecanismo de coordinación que logra borrar las copias de otros servicios. Un sistema real debe manejar fallos de entrega y operaciones concurrentes; esta demo no los simula.',
            ])}
          </p>
          <a
            href="https://learn.microsoft.com/en-us/azure/architecture/best-practices/caching"
            target="_blank"
            rel="noreferrer"
          >
            {t(['Explore caching strategies', 'Explorar estrategias de caché'])} →
          </a>
        </div>
      </ExperimentExplanation>
    </div>
  );
}
