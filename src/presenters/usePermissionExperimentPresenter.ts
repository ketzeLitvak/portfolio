import { useState } from 'react';
import { evaluatePermission, initialPermissionScenario } from '../models/permissionExperiment';
import type { PermissionScenario } from '../models/permissionExperiment';
export function usePermissionExperimentPresenter() {
  const [scenario, setScenario] = useState(initialPermissionScenario);
  const result = evaluatePermission(scenario);
  const update = (patch: Partial<PermissionScenario>) =>
    setScenario((previous) => ({ ...previous, ...patch }));
  const toggle = (group: 'editors' | 'viewers') =>
    setScenario((previous) => {
      const key = `${result.document.tenant}:${previous.user}`;
      const shortKey = result.document.tenant === 'atlas' ? previous.user : key;
      const exists = previous[group].includes(key) || previous[group].includes(shortKey);
      return {
        ...previous,
        [group]: exists
          ? previous[group].filter((entry) => entry !== key && entry !== shortKey)
          : [...previous[group], key],
      };
    });
  return {
    scenario,
    result,
    update,
    toggle,
    reset: () => setScenario(initialPermissionScenario()),
  };
}
