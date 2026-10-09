import { useState } from 'react';

import { applyMigration, initialMigration, revertMigration } from '../models/migrationExperiment';

export function useMigrationExperimentPresenter() {
  const [state, setState] = useState(initialMigration);
  const [fail, setFail] = useState(false);

  const apply = () => setState((current) => applyMigration(current, fail));

  const revert = () => setState(revertMigration);

  const reset = () => {
    setState(initialMigration());
    setFail(false);
  };

  return { state, fail, setFail, apply, revert, reset };
}
