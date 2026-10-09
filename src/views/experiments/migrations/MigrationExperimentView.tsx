import { Database, Play, Undo2 } from 'lucide-react';

import type { ViewProps } from '../../../models/viewProps';

import { translate, type Text } from '../../../models/types';

import { useMigrationExperimentPresenter } from '../../../presenters/useMigrationExperimentPresenter';

import { ExperimentWorkbench } from '../ExperimentWorkbench';

import ui from '../ExperimentUI.module.css';

import styles from './MigrationExperimentView.module.css';

const names: Text[] = [
  ['Add email column', 'Agregar columna email'],
  ['Fill existing emails', 'Completar emails existentes'],
  ['Require an email', 'Exigir un email'],
];
const sql = [
  'ALTER TABLE users ADD COLUMN email TEXT;',
  "UPDATE users SET email = lower(name) || '@example.com';",
  'ALTER TABLE users ALTER COLUMN email SET NOT NULL;',
];

export function MigrationExperimentView({ language }: ViewProps) {
  const p = useMigrationExperimentPresenter();

  const t = (text: Text) => translate(language, text);

  const { state } = p;
  return (
    <ExperimentWorkbench
      language={language}
      className={styles.root}
      reset={p.reset}
      title={['Change the schema. Keep the data.', 'Cambiá el esquema. Conservá los datos.']}
      description={[
        'Add a field, migrate existing rows, then make it required.',
        'Agregá un campo, migrá las filas existentes y después hacelo obligatorio.',
      ]}
      docs="https://www.postgresql.org/docs/current/tutorial-transactions.html"
      explanation={
        <>
          <p>
            {t([
              'Each numbered migration runs once, in order, and records the schema version. This PostgreSQL-inspired model wraps each migration and its version update in one transaction: the injected failure rolls back both, so you can retry the same migration.',
              'Cada migración numerada se ejecuta una vez, en orden, y registra la versión del esquema. Este modelo inspirado en PostgreSQL agrupa la migración y su versión en una transacción: la falla simulada revierte ambas y permite reintentar la misma migración.',
            ])}
          </p>
          <p>
            {t([
              'Expand → backfill → constrain: first add a nullable column, populate existing rows, then enforce NOT NULL. Production deployments also need compatible application versions, lock planning, and often batched backfills.',
              'Expandir → completar → restringir: primero agregá una columna nullable, completá las filas existentes y después exigí NOT NULL. En producción también necesitás versiones compatibles de la aplicación, planificar bloqueos y, frecuentemente, completar datos en lotes.',
            ])}
          </p>
          <p>
            {t([
              'A down migration is a new change, not time travel. Here reverting the backfill clears emails, and dropping the column discards its values. It cannot recover information changed by other writers; production recovery may require backups or a forward fix.',
              'Una migración down es un cambio nuevo, no un viaje en el tiempo. Acá revertir el backfill borra los emails y eliminar la columna descarta sus valores. No recupera información modificada por otros procesos; en producción puede ser necesario restaurar un backup o aplicar una corrección hacia adelante.',
            ])}
          </p>
        </>
      }
    >
      <div className={ui.toolbar}>
        <span className={ui.badge}>
          <Database size={15} />
          users
        </span>
        <strong>
          {t(['Schema version', 'Versión del esquema'])} · v{state.version}
        </strong>
      </div>
      <ol className={styles.steps}>
        {names.map((name, index) => (
          <li key={index} data-applied={index < state.version}>
            <span>{index + 1}</span>
            {t(name)}
            <small>
              {index < state.version ? t(['Applied', 'Aplicada']) : t(['Pending', 'Pendiente'])}
            </small>
          </li>
        ))}
      </ol>
      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              {state.version > 0 && <th>email {state.version === 3 && <small>NOT NULL</small>}</th>}
            </tr>
          </thead>
          <tbody>
            {state.rows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                {state.version > 0 && <td>{row.email ?? <em>NULL</em>}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {state.version < 3 && (
        <>
          <p className={ui.label}>
            {t(['Next migration', 'Próxima migración'])} · v{state.version + 1}
          </p>
          <pre className={styles.sql}>
            <code>{sql[state.version]}</code>
          </pre>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={p.fail}
              onChange={(event) => p.setFail(event.target.checked)}
            />
            {t(['Simulate a failure before commit', 'Simular una falla antes del commit'])}
          </label>
        </>
      )}
      <div className={ui.actions}>
        <button className={ui.primary} onClick={p.apply} disabled={state.version === 3}>
          <Play size={15} />
          {t(['Apply next migration', 'Aplicar próxima migración'])}
        </button>
        <button className={ui.secondary} onClick={p.revert} disabled={state.version === 0}>
          <Undo2 size={15} />
          {t(['Revert last migration', 'Revertir última migración'])}
        </button>
      </div>
      {state.version === 1 || state.version === 2 ? (
        <p className={ui.note}>
          {t([
            'Reverting this step deletes email values in this example.',
            'Revertir este paso elimina los valores de email en este ejemplo.',
          ])}
        </p>
      ) : null}
      <p className={ui.feedback} data-error={state.result === 'failed'} aria-live="polite">
        {t(
          state.result === 'failed'
            ? [
                'Transaction failed. No partial changes were committed; version and rows are unchanged. Disable the failure and retry.',
                'La transacción falló. No se guardaron cambios parciales; la versión y las filas siguen iguales. Desactivá la falla y reintentá.',
              ]
            : state.result === 'reverted'
              ? [
                  'Down migration applied. Inspect the schema and remaining data.',
                  'Migración down aplicada. Revisá el esquema y los datos que quedan.',
                ]
              : state.version === 3
                ? [
                    'All migrations applied. Every existing row now has a required email.',
                    'Todas las migraciones aplicadas. Cada fila existente tiene un email obligatorio.',
                  ]
                : state.result === 'applied'
                  ? [
                      'Migration committed. Data and schema version were updated together.',
                      'Migración confirmada. Los datos y la versión se actualizaron juntos.',
                    ]
                  : [
                      'Start with two users and no email column. Apply the first migration.',
                      'Empezá con dos usuarios y sin columna email. Aplicá la primera migración.',
                    ],
        )}
      </p>
    </ExperimentWorkbench>
  );
}
