import { Database, ListOrdered, Plus, Search } from 'lucide-react';

import type { ViewProps } from '../../../models/viewProps';

import { translate, type Text } from '../../../models/types';

import { useIndexExperimentPresenter } from '../../../presenters/useIndexExperimentPresenter';

import { ExperimentWorkbench } from '../ExperimentWorkbench';

import ui from '../ExperimentUI.module.css';

import styles from './IndexExperimentView.module.css';

export function IndexExperimentView({ language }: ViewProps) {
  const p = useIndexExperimentPresenter();

  const t = (text: Text) => translate(language, text);

  const visited = p.plan?.steps.slice(0, p.step) ?? [];
  const current = visited.at(-1);
  return (
    <ExperimentWorkbench
      language={language}
      className={styles.root}
      reset={p.reset}
      busy={p.busy}
      title={['Find one order among many.', 'Encontrá un pedido entre muchos.']}
      description={[
        'Compare reading rows one by one with looking up a sorted index.',
        'Compará recorrer filas una por una con consultar un índice ordenado.',
      ]}
      docs="https://www.postgresql.org/docs/current/indexes.html"
      explanation={
        <>
          <p>
            {t([
              'Without an index, this model scans physical rows until it finds the order. With an index, it searches a sorted list of keys, then follows a reference to the matching row.',
              'Sin índice, este modelo recorre las filas hasta encontrar el pedido. Con índice, busca en una lista ordenada de claves y sigue una referencia a la fila encontrada.',
            ])}
          </p>
          <p>
            {t([
              'The animation uses binary search on an array to illustrate narrowing the search. It is not a PostgreSQL B-tree implementation or an EXPLAIN plan. We count comparisons, not milliseconds; index comparisons and table reads are different work.',
              'La animación usa búsqueda binaria en un array para ilustrar cómo se reduce la búsqueda. No implementa un B-tree de PostgreSQL ni un plan EXPLAIN. Contamos comparaciones, no milisegundos; comparar claves y leer filas son trabajos distintos.',
            ])}
          </p>
          <p>
            {t([
              'An index also needs storage and maintenance on writes. Adding an order shows a new table row and an index entry. Real query planners may prefer a scan when many rows are needed.',
              'El índice ocupa espacio y requiere mantenimiento al escribir. Agregar un pedido muestra una nueva fila y una entrada del índice. Un planificador real puede preferir un recorrido si necesita muchas filas.',
            ])}
          </p>
        </>
      }
    >
      <div
        className={ui.modes}
        role="group"
        aria-label={t(['Search strategy', 'Estrategia de búsqueda'])}
      >
        {[false, true].map((value) => (
          <button
            key={String(value)}
            aria-pressed={p.indexed === value}
            disabled={p.busy}
            onClick={() => p.selectMode(value)}
          >
            {t(value ? ['With index', 'Con índice'] : ['Without index', 'Sin índice'])}
          </button>
        ))}
      </div>
      <div className={styles.query}>
        <label>
          {t(['Find order', 'Buscar pedido'])}
          <select
            aria-label={t(['Order number', 'Número de pedido'])}
            value={p.target}
            disabled={p.busy}
            onChange={(e) => p.selectTarget(Number(e.target.value))}
          >
            {[
              124,
              110,
              131,
              ...p.records.filter((record) => record.id >= 132).map((record) => record.id),
              999,
            ].map((id) => (
              <option key={id} value={id}>
                #{id}
                {id === 999 ? ' · ' + t(['missing', 'inexistente']) : ''}
              </option>
            ))}
          </select>
        </label>
        <button className={ui.primary} onClick={p.search} disabled={p.busy}>
          <Search size={15} />
          {t(p.busy ? ['Searching…', 'Buscando…'] : ['Find order', 'Buscar pedido'])}
        </button>
      </div>
      {p.indexed && (
        <section className={styles.index} aria-label={t(['Sorted index', 'Índice ordenado'])}>
          <h3>
            <ListOrdered size={15} />
            {t(['Sorted index · key → row', 'Índice ordenado · clave → fila'])}
          </h3>
          <div className={styles.keys}>
            {p.index.map((r, i) => (
              <span
                key={r.id}
                data-visited={visited.some((v) => v.key === r.id)}
                data-current={current?.key === r.id}
                data-excluded={
                  !!current && current.low !== undefined && (i < current.low || i > current.high!)
                }
              >
                #{r.id}
                <small>→ {r.row + 1}</small>
              </span>
            ))}
          </div>
        </section>
      )}
      <section className={styles.table} aria-label={t(['Table rows', 'Filas de la tabla'])}>
        <header>
          <h3>
            <Database size={15} />
            {t(['Table', 'Tabla'])} · {p.records.length} {t(['rows', 'filas'])}
          </h3>
          <button
            className={styles.add}
            disabled={p.busy || p.records.length >= 36}
            onClick={p.add}
            aria-label={t(['Add an order', 'Agregar un pedido'])}
            title={t(['Add an order', 'Agregar un pedido'])}
          >
            <Plus size={15} />
          </button>
        </header>
        <div className={styles.rows}>
          {p.records.map((r) => (
            <span
              key={r.id}
              data-visited={!p.indexed && visited.some((v) => v.row === r.row)}
              data-found={p.done && p.plan?.result?.row === r.row}
            >
              <small>{r.row + 1}</small>#{r.id}
            </span>
          ))}
        </div>
      </section>
      <p className={ui.feedback} aria-live="polite">
        {p.writes
          ? t([
              'One row added. The index now also contains its key and row reference.',
              'Se agregó una fila. El índice también contiene su clave y referencia.',
            ])
          : p.done
            ? p.plan?.result
              ? `${t(['Found order', 'Pedido encontrado'])} #${p.plan.result.id} · ${t(['row', 'fila'])} ${p.plan.result.row + 1}`
              : t([
                  'Order not found. Every possible candidate was ruled out.',
                  'Pedido inexistente. Se descartaron todos los candidatos.',
                ])
            : p.busy
              ? `${t(['Checking key', 'Consultando clave'])} ${current?.key ?? '…'}`
              : t([
                  'Choose a strategy and find the same order.',
                  'Elegí una estrategia y buscá el mismo pedido.',
                ])}
      </p>
      <div className={ui.metrics}>
        <span>
          {t(
            p.indexed
              ? ['Index comparisons', 'Comparaciones del índice']
              : ['Rows inspected', 'Filas revisadas'],
          )}
          <strong>{p.step}</strong>
        </span>
        {p.indexed && (
          <span>
            {t(['Table rows fetched', 'Filas recuperadas'])}
            <strong>{p.done && p.plan?.result ? 1 : 0}</strong>
          </span>
        )}
      </div>
      {Object.keys(p.comparison).length > 0 && (
        <div className={styles.compare}>
          <span>
            {t(['Without index', 'Sin índice'])}: {p.comparison.scan ?? '—'}
          </span>
          <span>
            {t(['With index', 'Con índice'])}: {p.comparison.index ?? '—'}{' '}
            {t(['key comparisons', 'comparaciones de claves'])}
          </span>
        </div>
      )}
    </ExperimentWorkbench>
  );
}
