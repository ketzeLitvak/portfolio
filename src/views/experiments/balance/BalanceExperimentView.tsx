import { Network, Send, Server, Power, Layers } from 'lucide-react';

import type { ViewProps } from '../../../models/viewProps';

import { translate, type Text } from '../../../models/types';

import { useBalanceExperimentPresenter } from '../../../presenters/useBalanceExperimentPresenter';

import { ExperimentWorkbench } from '../ExperimentWorkbench';

import { ExperimentClock } from '../ExperimentClock';

import ui from '../ExperimentUI.module.css';

import styles from './BalanceExperimentView.module.css';

export function BalanceExperimentView({ language }: ViewProps) {
  const p = useBalanceExperimentPresenter();

  const t = (text: Text) => translate(language, text);

  const { state } = p;
  return (
    <ExperimentWorkbench
      language={language}
      className={styles.root}
      reset={p.reset}
      title={['One entrance. Three servers.', 'Una entrada. Tres servidores.']}
      description={[
        'Send requests, stop a server, and watch where traffic goes.',
        'Mandá pedidos, apagá un servidor y mirá adónde va el tráfico.',
      ]}
      docs="https://www.haproxy.com/documentation/haproxy-configuration-tutorials/proxying-essentials/configuration-basics/backends/"
      explanation={
        <>
          <p>
            {t([
              'Round robin rotates through healthy servers. Least connections chooses the server with the fewest active connections; ties use server order. Here each request represents one connection, and each server handles multiple requests concurrently.',
              'Round robin rota entre servidores disponibles. Menos conexiones elige el que tiene menos conexiones activas; los empates usan el orden de los servidores. Acá cada pedido representa una conexión y cada servidor atiende varios pedidos a la vez.',
            ])}
          </p>
          <p>
            {t([
              'The clock controls real state changes: A finishes in 2 simulated seconds, B in 4, C in 8. Turning a server off immediately marks it unhealthy and fails its active work. New traffic avoids it; failed requests are not automatically retried. Real health checks have detection delays and retries require care with side effects.',
              'El reloj controla los cambios: A termina en 2 segundos simulados, B en 4 y C en 8. Apagar un servidor lo marca como no disponible y falla sus pedidos activos. El tráfico nuevo lo evita; los fallidos no se reintentan solos. Los health checks reales tienen demoras de detección y los reintentos requieren cuidado con los efectos secundarios.',
            ])}
          </p>
        </>
      }
    >
      <div className={ui.modes} aria-label={t(['Balancing strategy', 'Estrategia de balanceo'])}>
        <button
          aria-pressed={p.strategy === 'round-robin'}
          onClick={() => p.setStrategy('round-robin')}
        >
          Round robin
        </button>
        <button
          aria-pressed={p.strategy === 'least-connections'}
          onClick={() => p.setStrategy('least-connections')}
        >
          {t(['Least connections', 'Menos conexiones'])}
        </button>
      </div>
      <div className={ui.toolbar}>
        <span className={ui.badge}>
          <Network size={15} />
          Load balancer
        </span>
        <ExperimentClock
          language={language}
          now={state.now}
          running={p.running}
          toggle={p.toggleClock}
          step={p.step}
        />
      </div>
      <div className={styles.servers}>
        {state.servers.map((server) => {
          const active = state.requests.filter(
            (request) => request.server === server.id && request.status === 'active',
          );
          return (
            <article key={server.id} data-off={!server.healthy}>
              <header>
                <Server size={20} />
                <strong>{server.id}</strong>
                <button
                  aria-label={t([
                    `${server.healthy ? 'Stop' : 'Start'} server ${server.id}`,
                    `${server.healthy ? 'Apagar' : 'Iniciar'} servidor ${server.id}`,
                  ])}
                  aria-pressed={server.healthy}
                  onClick={() => p.toggleServer(server.id)}
                >
                  <Power size={15} />
                </button>
              </header>
              <small>
                {t(server.healthy ? ['Healthy', 'Disponible'] : ['Offline', 'Apagado'])} ·{' '}
                {server.seconds}s
              </small>
              <strong className={styles.count}>
                {active.length}
                <small>{t(['active', 'activos'])}</small>
              </strong>
              <p>
                {server.received} {t(['received', 'recibidos'])}
              </p>
              <div className={styles.jobs}>
                {active.slice(-4).map((request) => (
                  <span key={request.id}>
                    #{request.id} · {request.remaining}s
                  </span>
                ))}
                {active.length > 4 && <span>+{active.length - 4}</span>}
              </div>
            </article>
          );
        })}
      </div>
      <div className={ui.actions}>
        <button className={ui.primary} onClick={p.send}>
          <Send size={15} />
          {t(['Send request', 'Enviar pedido'])}
        </button>
        <button className={ui.secondary} onClick={p.burst}>
          <Layers size={15} />
          {t(['Send 6', 'Enviar 6'])}
        </button>
      </div>
      <div className={ui.metrics} aria-live="polite">
        <span>
          {t(['Completed', 'Terminados'])}
          <strong>{state.requests.filter((request) => request.status === 'done').length}</strong>
        </span>
        <span>
          {t(['Failed', 'Fallidos'])}
          <strong>
            {state.requests.filter((request) => request.status === 'failed').length +
              state.rejected}
          </strong>
        </span>
      </div>
      <p className={ui.feedback} aria-live="polite">
        {state.rejected > 0 && !state.servers.some((server) => server.healthy)
          ? t([
              '503 · No healthy servers. Start one to accept new requests.',
              '503 · No hay servidores disponibles. Iniciá uno para aceptar pedidos nuevos.',
            ])
          : state.requests.length
            ? t([
                `Latest request #${state.requests.at(-1)!.id} → server ${state.requests.at(-1)!.server}. Advance the clock to complete work.`,
                `Último pedido #${state.requests.at(-1)!.id} → servidor ${state.requests.at(-1)!.server}. Avanzá el reloj para terminar el trabajo.`,
              ])
            : t([
                'Try sending 6 requests, advance 2 seconds, then compare the two strategies.',
                'Probá enviar 6 pedidos, avanzar 2 segundos y comparar las dos estrategias.',
              ])}
      </p>
    </ExperimentWorkbench>
  );
}
