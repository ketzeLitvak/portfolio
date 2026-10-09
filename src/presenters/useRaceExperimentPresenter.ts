import { useEffect, useRef, useState } from 'react';
import { advanceRace, initialRaceScenario, raceSales, raceSteps } from '../models/raceExperiment';
import type { RaceMode } from '../models/raceExperiment';
export function useRaceExperimentPresenter() {
  const [state, setState] = useState(initialRaceScenario);
  const [running, setRunning] = useState(false);
  const [comparison, setComparison] = useState<Partial<Record<RaceMode, number>>>({});
  const busy = useRef(false);
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(
      () => {
        const next = advanceRace(state);
        setState(next);
        if (next.step === raceSteps[next.mode].length) {
          setComparison((previous) => ({ ...previous, [next.mode]: raceSales(next) }));
          setRunning(false);
          busy.current = false;
        }
      },
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 40 : 1000,
    );
    return () => clearTimeout(timer);
  }, [state, running]);
  const selectMode = (mode: RaceMode) => {
    if (busy.current) return;
    setState(initialRaceScenario(mode));
  };
  const buy = () => {
    if (busy.current) return;
    busy.current = true;
    setState(initialRaceScenario(state.mode));
    setRunning(true);
  };
  const reset = () => {
    busy.current = false;
    setRunning(false);
    setState(initialRaceScenario());
    setComparison({});
  };
  const done = state.step === raceSteps[state.mode].length;
  return {
    state,
    running,
    done,
    sales: raceSales(state),
    active: raceSteps[state.mode][state.step]?.buyer,
    comparison,
    selectMode,
    buy,
    reset,
  };
}
