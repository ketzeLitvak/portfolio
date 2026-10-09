import { useEffect, useRef, useState } from 'react';

import { appendCartEvent, projectCart, type CartEvent } from '../models/sourcingExperiment';

export function useSourcingExperimentPresenter() {
  const [events, setEvents] = useState<CartEvent[]>([]);
  const [cursor, setCursor] = useState(0);
  const [replaying, setReplaying] = useState(false);
  const lock = useRef(false);
  useEffect(() => {
    if (!replaying) return;
    const timer = setTimeout(
      () => {
        const next = cursor + 1;
        setCursor(next);
        if (next >= events.length) {
          setReplaying(false);
          lock.current = false;
        }
      },
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 30 : 450,
    );
    return () => clearTimeout(timer);
  }, [replaying, cursor, events.length]);

  const command = (reason: CartEvent['reason']) => {
    if (lock.current || cursor !== events.length) return;
    const next = appendCartEvent(events, reason);
    setEvents(next);
    setCursor(next.length);
  };

  const rebuild = () => {
    if (lock.current || !events.length) return;
    lock.current = true;
    setCursor(0);
    setReplaying(true);
  };

  const reset = () => {
    lock.current = false;
    setReplaying(false);
    setEvents([]);
    setCursor(0);
  };

  return {
    events,
    cursor,
    replaying,
    cart: projectCart(events, cursor),
    present: cursor === events.length,
    command,
    rebuild,
    reset,
    seek: (value: number) => {
      if (!lock.current) setCursor(Math.max(0, Math.min(events.length, value)));
    },
    live: () => setCursor(events.length),
  };
}
