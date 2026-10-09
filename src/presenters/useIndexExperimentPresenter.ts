import { useEffect, useRef, useState } from 'react';

import {
  buildRecordIndex,
  createIndexRecords,
  planIndexSearch,
  type IndexSearch,
} from '../models/indexExperiment';

export function useIndexExperimentPresenter() {
  const [records, setRecords] = useState(createIndexRecords);
  const [target, setTarget] = useState(124);
  const [indexed, setIndexed] = useState(false);
  const [plan, setPlan] = useState<IndexSearch | null>(null);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [writes, setWrites] = useState(false);
  const [comparison, setComparison] = useState<Partial<Record<'scan' | 'index', number>>>({});
  const lock = useRef(false);
  useEffect(() => {
    if (!busy || !plan) return;
    const timer = setTimeout(
      () => {
        const next = step + 1;
        setStep(next);
        if (next === plan.steps.length) {
          setBusy(false);
          lock.current = false;
          setComparison((old) => ({
            ...old,
            [plan.indexed ? 'index' : 'scan']: plan.steps.length,
          }));
        }
      },
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 20 : 180,
    );
    return () => clearTimeout(timer);
  }, [busy, plan, step]);

  const search = () => {
    if (lock.current) return;
    lock.current = true;
    setPlan(planIndexSearch(records, target, indexed));
    setStep(0);
    setBusy(true);
    setWrites(false);
  };

  const clear = () => {
    setPlan(null);
    setStep(0);
    setWrites(false);
  };

  const reset = () => {
    lock.current = false;
    setBusy(false);
    setRecords(createIndexRecords());
    setTarget(124);
    setIndexed(false);
    setComparison({});
    clear();
  };

  const selectMode = (value: boolean) => {
    if (!lock.current) {
      setIndexed(value);
      clear();
    }
  };

  const selectTarget = (value: number) => {
    if (!lock.current) {
      setTarget(value);
      setComparison({});
      clear();
    }
  };

  const add = () => {
    if (lock.current) return;
    setRecords((old) => [...old, { id: 132 + old.length - 32, row: old.length }]);
    setComparison({});
    clear();
    setWrites(true);
  };

  return {
    records,
    index: buildRecordIndex(records),
    target,
    indexed,
    plan,
    step,
    busy,
    writes,
    comparison,
    search,
    reset,
    selectMode,
    selectTarget,
    add,
    done: !!plan && !busy && step === plan.steps.length,
  };
}
