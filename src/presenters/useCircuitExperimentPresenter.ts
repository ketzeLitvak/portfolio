import { useEffect, useRef, useState } from 'react';

import { initialCircuitScenario, requestCircuit, tickCircuit } from '../models/circuitExperiment';

export function useCircuitExperimentPresenter() {
  const [state, setState] = useState(initialCircuitScenario);
  const [busy, setBusy] = useState(false);
  const [running, setRunning] = useState(false);
  const lock = useRef(false);
  useEffect(() => {
    if (!running || busy) return;
    const timer = setInterval(() => setState(tickCircuit), 1000);
    return () => clearInterval(timer);
  }, [running, busy]);
  useEffect(() => {
    if (!busy) return;
    const timer = setTimeout(
      () => {
        setState(requestCircuit);
        setBusy(false);
        lock.current = false;
      },
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 30
        : state.status === 'open' && state.enabled
          ? 50
          : state.healthy
            ? 120
            : 800,
    );
    return () => clearTimeout(timer);
  }, [busy, state.status, state.enabled, state.healthy]);

  const request = () => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
  };

  const reset = () => {
    lock.current = false;
    setBusy(false);
    setRunning(false);
    setState(initialCircuitScenario());
  };

  return {
    state,
    busy,
    running,
    request,
    reset,
    selectMode: (enabled: boolean) => {
      if (!lock.current) {
        setState(initialCircuitScenario(enabled, state.healthy));
        setRunning(false);
      }
    },
    toggleHealth: () => {
      if (!lock.current) setState((s) => ({ ...s, healthy: !s.healthy }));
    },
    step: () => {
      if (!lock.current) setState(tickCircuit);
    },
    toggleClock: () => setRunning((v) => !v),
  };
}
