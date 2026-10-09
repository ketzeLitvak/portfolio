export interface MigrationRow {
  id: number;
  name: string;
  email?: string | null;
}
export interface MigrationState {
  version: number;
  rows: MigrationRow[];
  result: 'ready' | 'applied' | 'reverted' | 'failed';
}

export function initialMigration(): MigrationState {
  return {
    version: 0,
    rows: [
      { id: 1, name: 'Ada' },
      { id: 2, name: 'Alan' },
    ],
    result: 'ready',
  };
}

export function applyMigration(state: MigrationState, fail = false): MigrationState {
  if (state.version >= 3) return state;
  // A failed transaction commits neither the schema version nor partial row changes.
  if (fail) return { ...state, result: 'failed' };
  const rows = state.rows.map((row) =>
    state.version === 0
      ? { ...row, email: null }
      : state.version === 1
        ? { ...row, email: `${row.name.toLowerCase()}@example.com` }
        : { ...row },
  );
  if (state.version === 2 && rows.some((row) => row.email === null || row.email === undefined))
    return { ...state, result: 'failed' };
  return { version: state.version + 1, rows, result: 'applied' };
}

export function revertMigration(state: MigrationState): MigrationState {
  if (state.version === 0) return state;
  const rows = state.rows.map((row) => {
    if (state.version === 1) return { id: row.id, name: row.name };
    if (state.version === 2) return { ...row, email: null };
    return { ...row };
  });
  return { version: state.version - 1, rows, result: 'reverted' };
}
