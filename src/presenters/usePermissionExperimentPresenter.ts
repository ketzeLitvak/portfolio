import { useEffect, useRef, useState } from 'react';

import {
  assignPermissionRole,
  evaluatePermission,
  initialPermissionScenario,
} from '../models/permissionExperiment';

import type { PermissionScenario, PermissionRole } from '../models/permissionExperiment';

export function usePermissionExperimentPresenter() {
  const [scenario, setScenario] = useState(initialPermissionScenario);
  const [checking, setChecking] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const busy = useRef(false);
  const result = evaluatePermission(scenario);
  const role: PermissionRole | 'owner' = result.owner
    ? 'owner'
    : result.editor
      ? 'editor'
      : result.viewer
        ? 'viewer'
        : 'none';
  useEffect(() => {
    if (!checking) return;
    const timer = setTimeout(
      () => {
        setChecking(false);
        setAttempted(true);
        busy.current = false;
      },
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 30 : 650,
    );
    return () => clearTimeout(timer);
  }, [checking]);

  const update = (patch: Partial<PermissionScenario>) => {
    if (busy.current) return;
    setScenario((previous) => ({ ...previous, ...patch }));
    setAttempted(false);
  };

  const setRole = (next: PermissionRole) => {
    if (busy.current || result.owner) return;
    setScenario((previous) => assignPermissionRole(previous, next));
    setAttempted(false);
  };

  const attempt = () => {
    if (busy.current) return;
    busy.current = true;
    setAttempted(false);
    setChecking(true);
  };

  const reset = () => {
    busy.current = false;
    setChecking(false);
    setAttempted(false);
    setScenario(initialPermissionScenario());
  };

  return { scenario, result, role, update, setRole, attempt, checking, attempted, reset };
}
