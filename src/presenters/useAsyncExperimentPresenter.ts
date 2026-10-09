import { useEffect, useRef, useState } from 'react';

export function useAsyncExperimentPresenter() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const active = useRef(true);
  const version = useRef(0);
  const locked = useRef(false);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  const run = async <T>(task: () => Promise<T>, receive: (value: T) => void) => {
    if (locked.current) return;
    locked.current = true;
    const current = ++version.current;
    setBusy(true);
    setError(false);
    try {
      const result = await task();
      if (active.current && current === version.current) receive(result);
    } catch {
      if (active.current && current === version.current) setError(true);
    } finally {
      if (active.current && current === version.current) {
        locked.current = false;
        setBusy(false);
      }
    }
  };

  const clear = () => {
    version.current++;
    locked.current = false;
    setBusy(false);
    setError(false);
  };

  return { busy, error, run, clear };
}
