import {
  ArrowRight,
  Check,
  Cpu,
  Database,
  Layers,
  Laptop,
  RotateCcw,
  Sparkles,
  Timer,
  TrendingUp,
  Trash2,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import type { ViewProps } from '../../models/viewProps';
import { translate, type Text } from '../../models/types';
import {
  useCacheExperimentPresenter,
  type CacheStop,
} from '../../presenters/useCacheExperimentPresenter';
const nodes: { id: CacheStop; title: Text; subtitle: Text; icon: typeof Cpu }[] = [
  {
    id: 'client',
    title: ['Your app', 'Tu app'],
    subtitle: ['Asks for a price', 'Pide un precio'],
    icon: Laptop,
  },
  {
    id: 'memory',
    title: ['Quick copy', 'Copia rápida'],
    subtitle: ['In this app', 'En esta app'],
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
    : p.event === 'write'
      ? [
          'The original price changed. Do the copies know?',
          'El precio original cambió. ¿Las copias se enteraron?',
        ]
      : p.event === 'expire'
        ? [
            'The copies expired. Ask for the price again.',
            'Las copias vencieron. Volvé a pedir el precio.',
          ]
        : p.event === 'clear'
          ? [
              'Copies removed. The next read will fetch the original.',
              'Quitamos las copias. La próxima consulta buscará el original.',
            ]
          : !s.last
            ? [
                'Where does an app look for a price? Give it a try.',
                '¿Dónde busca una app un precio? Probalo.',
              ]
            : s.last.stale
              ? [
                  'Fast, but outdated: the copy still has the old price.',
                  'Rápido, pero desactualizado: la copia tiene el precio anterior.',
                ]
              : s.last.source === 'database'
                ? [
                    'Price found. Now we keep copies for next time.',
                    'Encontramos el precio. Guardamos copias para la próxima.',
                  ]
                : [
                    'The copy answered. We skipped the trip to the original.',
                    'Respondió la copia. Nos ahorramos el viaje al original.',
                  ];
  return (
    <div className="cache-playground">
      <header className="cache-intro">
        <span className="cache-eyebrow">
          <Sparkles size={13} />
          {t(['PLAY WITH A CONCEPT', 'JUGÁ CON UN CONCEPTO'])}
        </span>
        <h2>
          {t(['Why is the second request faster?', '¿Por qué la segunda consulta es más rápida?'])}
        </h2>
        <p>
          {t([
            'An app needs a price. Follow its journey, then ask again.',
            'Una app necesita un precio. Seguí su recorrido y después pedilo otra vez.',
          ])}
        </p>
      </header>
      <div
        className="cache-scene"
        data-traveling={p.busy}
        aria-label={t([
          'Journey from the app to the original data',
          'Recorrido de la app al dato original',
        ])}
      >
        {nodes.map(({ id, title, subtitle, icon: Icon }, index) => {
          const entry = id === 'memory' || id === 'redis' ? s[id] : null;
          const valid = entry && entry.expires > s.now;
          const value =
            id === 'database'
              ? s.value
              : id === 'client'
                ? s.last?.value
                : valid
                  ? entry.value
                  : null;
          const old =
            id !== 'database' && value !== null && value !== undefined && value !== s.value;
          const visited = p.journey
            ? p.journey.stops.slice(0, p.frame + 1).includes(id)
            : s.last?.route.includes(id);
          return (
            <article
              key={id}
              className="cache-node"
              data-active={p.active === id}
              data-visited={!!visited}
              data-old={old}
            >
              <span className="cache-node-icon">
                <Icon size={23} />
              </span>
              <h3>{t(title)}</h3>
              <span className="cache-node-subtitle">{t(subtitle)}</span>
              <strong className="cache-price">
                {value === null || value === undefined ? '—' : `$${value}`}
              </strong>
              <span className="cache-node-status">
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
              {index < nodes.length - 1 && (
                <ArrowRight className="cache-connector" size={18} aria-hidden="true" />
              )}
            </article>
          );
        })}
        {p.busy && (
          <span
            className="cache-traveler"
            style={{ '--stop': nodes.findIndex((node) => node.id === p.active) } as CSSProperties}
            aria-hidden="true"
          >
            <span />
          </span>
        )}
      </div>
      <div className="cache-narration" aria-live="polite" aria-atomic="true">
        <span className={p.busy ? 'cache-pulse' : 'cache-status-dot'} />
        <p>{t(message)}</p>
      </div>
      <div className="cache-main-action">
        <button className="cache-request" onClick={p.query} disabled={p.busy}>
          <ArrowRight size={18} />
          {t(
            p.busy
              ? ['Following the request…', 'Siguiendo la consulta…']
              : s.requests === 0
                ? ['Ask for the price', 'Pedir el precio']
                : ['Ask again', 'Pedir otra vez'],
          )}
        </button>
        {s.last && !p.busy && p.event === 'read' && (
          <span className="cache-time">
            <Timer size={15} />
            {s.last.latency} ms{' '}
            {p.firstLatency && s.last.latency < p.firstLatency ? (
              <small>
                {Math.round(p.firstLatency / s.last.latency)}× {t(['faster', 'más rápido'])}
              </small>
            ) : (
              <small>
                {t(
                  s.last.source === 'database'
                    ? ['trip to the original', 'viaje al original']
                    : ['from a copy', 'desde una copia'],
                )}
              </small>
            )}
          </span>
        )}
      </div>
      {s.requests > 0 && (
        <section className="cache-try">
          <h3>{t(['What if something changes?', '¿Y si algo cambia?'])}</h3>
          <div className="cache-try-actions">
            <button onClick={p.write} disabled={p.busy}>
              <TrendingUp size={17} />
              <span>
                {t(['Change the original price', 'Cambiar el precio original'])}
                <small>{t(['Does the copy update?', '¿Se actualiza la copia?'])}</small>
              </span>
            </button>
            <button onClick={p.expire} disabled={p.busy}>
              <Timer size={17} />
              <span>
                {t(['Let the copies expire', 'Dejar vencer las copias'])}
                <small>{t(['Where will we look now?', '¿Dónde buscamos ahora?'])}</small>
              </span>
            </button>
            {s.last?.stale && (
              <button onClick={p.clear} disabled={p.busy}>
                <Trash2 size={17} />
                <span>
                  {t(['Remove the old copies', 'Quitar las copias anteriores'])}
                  <small>
                    {t(['Fetch a fresh price next time', 'Buscar el precio nuevo después'])}
                  </small>
                </span>
              </button>
            )}
          </div>
        </section>
      )}
      <footer className="cache-footer">
        <button onClick={p.reset} disabled={p.busy}>
          <RotateCcw size={13} />
          {t(['Start over', 'Empezar de nuevo'])}
        </button>
        <span>{t(['Local demo · illustrative times', 'Demo local · tiempos ilustrativos'])}</span>
      </footer>
      <details className="cache-explanation">
        <summary>{t(['How does it work?', '¿Cómo funciona?'])}</summary>
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
                  'Local to this app, valid for 6 simulated seconds.',
                  'Local a esta app, válida por 6 segundos simulados.',
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
                  'The authoritative value. Updating it does not automatically update existing copies in this demo.',
                  'El valor de referencia. Actualizarlo no actualiza automáticamente las copias existentes en esta demo.',
                ])}
              </span>
            </li>
          </ul>
          <p>
            {t([
              'The clock advances only when you expire the copies. Removing them is called invalidation. A real system chooses a strategy based on how fresh the data must be.',
              'El reloj avanza al dejar vencer las copias. Quitarlas se llama invalidación. Un sistema real elige su estrategia según cuánto necesita que los datos estén actualizados.',
            ])}
          </p>
          <a href="https://redis.io/docs/latest/commands/expire/" target="_blank" rel="noreferrer">
            {t(['Explore expiration in Redis', 'Explorar el vencimiento en Redis'])} →
          </a>
        </div>
      </details>
    </div>
  );
}
