import styles from './CircuitExperimentView.module.css';

import raceStyles from '../race/RaceExperimentView.module.css';

import { ExperimentHeader } from '../ExperimentHeader';

import { ExperimentExplanation } from '../ExperimentExplanation';

import {
  ArrowRight,
  Check,
  Clock3,
  Pause,
  Play,
  PlugZap,
  Send,
  Server,
  ShieldCheck,
  ShoppingBag,
  X,
} from 'lucide-react';

import type { ViewProps } from '../../../models/viewProps';

import { translate, type Text } from '../../../models/types';

import { circuitCooldown, circuitThreshold } from '../../../models/circuitExperiment';

import { useCircuitExperimentPresenter } from '../../../presenters/useCircuitExperimentPresenter';

export function CircuitExperimentView({ language }: ViewProps) {
  const p = useCircuitExperimentPresenter(),
    s = p.state;

  const t = (text: Text) => translate(language, text);

  const remaining = Math.max(0, (s.retryAt ?? s.now) - s.now);
  const status = !s.enabled
    ? t(['Unprotected', 'Sin protección'])
    : s.status === 'closed'
      ? t(['Traffic allowed', 'Tráfico habilitado'])
      : s.status === 'open'
        ? t(['Traffic stopped', 'Tráfico cortado'])
        : t(['Ready to test', 'Listo para probar']);
  const last = s.results.at(-1);
  const feedback: Text = p.busy
    ? ['Waiting for the payment service…', 'Esperando al servicio de pagos…']
    : s.enabled && s.status === 'open'
      ? [
          'The circuit is open. New requests are rejected locally, without calling payments.',
          'El circuito está abierto. Las nuevas consultas se rechazan acá, sin llamar a pagos.',
        ]
      : s.enabled && s.status === 'half-open'
        ? [
            'The wait is over. Send one request to check whether payments recovered.',
            'Terminó la espera. Mandá una consulta para comprobar si pagos se recuperó.',
          ]
        : last?.outcome === 'success'
          ? last.probe
            ? [
                'The test succeeded. Normal traffic is allowed again.',
                'La prueba salió bien. Se habilita nuevamente el tráfico normal.',
              ]
            : [
                'Payments responded successfully. The failure counter is back to zero.',
                'Pagos respondió correctamente. El contador de fallos vuelve a cero.',
              ]
          : last?.outcome === 'failure'
            ? [
                'Payments failed. Try again or recover the service.',
                'Pagos falló. Probá otra vez o recuperá el servicio.',
              ]
            : [
                'Payments starts offline. Send requests and see when the circuit stops them.',
                'Pagos empieza caído. Mandá consultas y mirá cuándo el circuito las frena.',
              ];
  return (
    <div className={styles.circuitPlayground}>
      <ExperimentHeader
        language={language}
        appearance="race"
        title={[
          'A failing service. When do you stop?',
          'Un servicio falla. ¿Cuándo dejás de insistir?',
        ]}
        description={[
          'Protect a store from repeatedly calling an unavailable payment service.',
          'Protegé una tienda de llamar una y otra vez a un servicio de pagos caído.',
        ]}
        reset={p.reset}
        disabled={p.busy}
      />
      <div
        className={raceStyles.raceModes}
        role="group"
        aria-label={t(['Protection', 'Protección'])}
      >
        {[true, false].map((enabled) => (
          <button
            key={String(enabled)}
            data-protection={String(enabled)}
            aria-pressed={s.enabled === enabled}
            onClick={() => p.selectMode(enabled)}
            disabled={p.busy}
          >
            {t(
              enabled
                ? ['With circuit breaker', 'Con circuit breaker']
                : ['Without protection', 'Sin protección'],
            )}
          </button>
        ))}
      </div>
      <div className={styles.circuitToolbar}>
        <span>
          <Clock3 size={14} />
          {s.now}s · {t(p.running ? ['Running', 'En marcha'] : ['Paused', 'En pausa'])}
        </span>
        <div>
          <button
            onClick={p.toggleClock}
            disabled={p.busy}
            aria-label={t(
              p.running ? ['Pause clock', 'Pausar reloj'] : ['Start clock', 'Iniciar reloj'],
            )}
          >
            {p.running ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button className={styles.circuitStep} onClick={p.step} disabled={p.busy}>
            +1s
          </button>
        </div>
      </div>
      <div
        className={styles.circuitScene}
        data-status={s.enabled ? s.status : 'disabled'}
        data-busy={p.busy}
      >
        <article className={styles.circuitStore}>
          <ShoppingBag size={30} />
          <h3>{t(['Store', 'Tienda'])}</h3>
          <small>{t(['Requests a payment', 'Consulta un pago'])}</small>
        </article>
        <article className={styles.circuitGate}>
          <ShieldCheck size={30} />
          <strong>{status}</strong>
          <small>{!s.enabled ? 'OFF' : s.status.toUpperCase()}</small>
          <div className={styles.circuitFailures}>
            {Array.from({ length: circuitThreshold }, (_, i) => (
              <span key={i} data-filled={s.enabled && i < s.failures} />
            ))}
          </div>
          <span className={styles.circuitGateCaption}>
            {s.enabled && s.status === 'open'
              ? `${remaining}s ${t(['until test', 'para probar'])}`
              : s.enabled && s.status === 'half-open'
                ? t(['One test request', 'Una consulta de prueba'])
                : s.enabled
                  ? `${Math.min(s.failures, circuitThreshold)}/${circuitThreshold} ${t(['consecutive failures', 'fallos seguidos'])}`
                  : t(['Every request goes through', 'Pasan todas las consultas'])}
          </span>
          <ArrowRight className={styles.circuitArrow} size={17} />
        </article>
        <article className={styles.circuitService} data-healthy={s.healthy}>
          <Server size={30} />
          <h3>{t(['Payments', 'Pagos'])}</h3>
          <span>{t(s.healthy ? ['Available', 'Disponible'] : ['Offline', 'Caído'])}</span>
          <button className={styles.circuitHealth} disabled={p.busy} onClick={p.toggleHealth}>
            <PlugZap size={14} />
            {t(
              s.healthy
                ? ['Take offline', 'Hacer caer']
                : ['Recover service', 'Recuperar servicio'],
            )}
          </button>
        </article>
      </div>
      <div className={styles.circuitFeedback} aria-live="polite" aria-atomic="true">
        <p>{t(feedback)}</p>
      </div>
      <button className={styles.circuitSend} onClick={p.request} disabled={p.busy}>
        <Send size={17} />
        {t(
          p.busy
            ? ['Sending…', 'Enviando…']
            : s.enabled && s.status === 'half-open'
              ? ['Test recovery', 'Probar recuperación']
              : ['Send request', 'Enviar consulta'],
        )}
      </button>
      <div className={styles.circuitCounts}>
        <span>
          {t(['Reached payments', 'Llegaron a pagos'])}
          <strong>{s.reached}</strong>
        </span>
        <span>
          {t(['Stopped locally', 'Frenadas acá'])}
          <strong>{s.blocked}</strong>
        </span>
      </div>
      {!!s.results.length && (
        <ol
          className={styles.circuitResults}
          aria-label={t(['Recent requests', 'Últimas consultas'])}
        >
          {[...s.results].reverse().map((r) => (
            <li key={r.id} data-outcome={r.outcome}>
              <span>
                #{r.id}
                {r.probe && ` · ${t(['test', 'prueba'])}`}
              </span>
              {r.outcome === 'success' ? <Check size={15} /> : <X size={15} />}
              <strong>
                {t(
                  r.outcome === 'success'
                    ? ['Payment responded', 'Pagos respondió']
                    : r.outcome === 'blocked'
                      ? ['Rejected locally', 'Rechazada acá']
                      : ['Payment failed', 'Pagos falló'],
                )}
              </strong>
              <small>{r.latency} ms</small>
            </li>
          ))}
        </ol>
      )}
      <footer className={raceStyles.raceFooter}>
        {t([
          'Local simulation · illustrative response times',
          'Simulación local · tiempos de respuesta de ejemplo',
        ])}
      </footer>
      <ExperimentExplanation language={language} appearance="race">
        <p>
          {t([
            `Closed: requests reach payments. ${circuitThreshold} consecutive failures open the circuit. A successful response clears the counter.`,
            `Closed (cerrado): las consultas llegan a pagos. ${circuitThreshold} fallos consecutivos abren el circuito. Una respuesta exitosa limpia el contador.`,
          ])}
        </p>
        <p>
          {t([
            `Open: requests fail immediately without calling payments. After ${circuitCooldown} seconds on this clock, the circuit becomes half-open and allows one test.`,
            `Open (abierto): las consultas fallan inmediatamente sin llamar a pagos. Después de ${circuitCooldown} segundos de este reloj, pasa a half-open y permite una prueba.`,
          ])}
        </p>
        <p>
          {t([
            'Half-open: a successful test closes the circuit; a failed test opens it for another 6 seconds. Recovering the service does not skip the wait. The clock starts paused; use +1s or play to advance it.',
            'Half-open (semiabierto): una prueba exitosa cierra el circuito; una fallida lo abre por otros 6 segundos. Recuperar el servicio no saltea la espera. El reloj empieza pausado; avanzá con +1s o play.',
          ])}
        </p>
        <p>
          {t([
            'This demo serializes requests, permits one probe and uses consecutive failures. Real policies can use failure rates over a time window. A circuit breaker does not retry requests or guarantee successful payments. Its state here belongs to this store instance, not the payment service.',
            'Esta demo procesa una consulta por vez, permite una prueba y cuenta fallos consecutivos. Otras políticas usan porcentajes de fallos en una ventana de tiempo. Un circuit breaker no reintenta consultas ni garantiza pagos exitosos. Su estado acá pertenece a esta instancia de la tienda, no al servicio de pagos.',
          ])}
        </p>
        <a
          href="https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker"
          target="_blank"
          rel="noreferrer"
        >
          {t(['Explore circuit breakers', 'Explorar circuit breakers'])} →
        </a>
      </ExperimentExplanation>
    </div>
  );
}
