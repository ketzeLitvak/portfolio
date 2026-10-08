import { useEffect, useRef, useState } from 'react';
import {
  initialCacheScenario,
  queryCache,
  updateCacheSource,
  clearCacheCopies,
  invalidateCacheLayer,
} from '../models/cacheExperiment';
import type {
  CacheScenario,
  CacheService,
  CacheStrategy,
  CacheLayer,
} from '../models/cacheExperiment';
export type CacheStop = 'client' | 'memory' | 'redis' | 'database';
type CacheJourney = { stops: CacheStop[]; turn: number; result: CacheScenario };
export function useCacheExperimentPresenter() {
  const [state, setState] = useState(initialCacheScenario);
  const [journey, setJourney] = useState<CacheJourney | null>(null);
  const [frame, setFrame] = useState(0);
  const [event, setEvent] = useState<
    'idle' | 'read' | 'write' | 'expire' | 'clear' | 'service' | 'strategy' | 'invalidate'
  >('idle');
  const busyRef = useRef(false);
  const [clockRunning, setClockRunning] = useState(false);
  useEffect(() => {
    if (!clockRunning || journey) return;
    const timer = setInterval(
      () =>
        setState((previous) =>
          busyRef.current ? previous : { ...previous, now: previous.now + 1 },
        ),
      1000,
    );
    return () => clearInterval(timer);
  }, [clockRunning, journey]);
  const [firstLatency, setFirstLatency] = useState<number | null>(null);
  useEffect(() => {
    if (!journey) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(
      () => {
        if (frame + 1 < journey.stops.length) setFrame(frame + 1);
        else {
          setState(journey.result);
          setFirstLatency((previous) => previous ?? journey.result.last!.latency);
          setEvent('read');
          setJourney(null);
          busyRef.current = false;
        }
      },
      reducedMotion ? 30 : 420,
    );
    return () => clearTimeout(timer);
  }, [journey, frame]);
  const query = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    const result = queryCache(state);
    const route = result.last!.route as CacheStop[];
    setFrame(0);
    setJourney({
      stops: ['client', ...route, ...route.slice(0, -1).reverse(), 'client'],
      turn: route.length,
      result,
    });
  };
  const change = (next: CacheScenario, nextEvent: typeof event) => {
    if (busyRef.current) return;
    setState(next);
    setEvent(nextEvent);
  };
  const reset = () => {
    setJourney(null);
    setClockRunning(false);
    busyRef.current = false;
    setState(initialCacheScenario());
    setFrame(0);
    setFirstLatency(null);
    setEvent('idle');
  };
  return {
    state,
    journey,
    frame,
    event,
    firstLatency,
    clockRunning,
    toggleClock: () => setClockRunning((previous) => !previous),
    advanceClock: () => {
      if (!busyRef.current) setState((previous) => ({ ...previous, now: previous.now + 1 }));
    },
    invalidate: (layer: CacheLayer) => change(invalidateCacheLayer(state, layer), 'invalidate'),
    busy: journey !== null,
    active: journey?.stops[frame],
    returning: !!journey && frame > journey.turn,
    query,
    write: () => change(updateCacheSource(state), 'write'),
    expire: () =>
      change(
        { ...state, now: state.now + Math.max(state.memoryTTL, state.redisTTL) + 1 },
        'expire',
      ),
    clear: () => change(clearCacheCopies(state), 'clear'),
    selectService: (service: CacheService) => change({ ...state, service }, 'service'),
    selectStrategy: (strategy: CacheStrategy) => change({ ...state, strategy }, 'strategy'),
    notify: (notifyOthers: boolean) => change({ ...state, notifyOthers }, 'strategy'),
    reset,
  };
}
