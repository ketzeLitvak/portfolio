export interface CartEvent {
  id: number;
  delta: 1 | -1;
  reason: 'add' | 'remove' | 'compensate';
  reverses?: number;
}
export interface EventCart {
  quantity: number;
  total: number;
}
export const cartUnitPrice = 20;

export function projectCart(events: CartEvent[], until = events.length): EventCart {
  const quantity = events.slice(0, until).reduce((sum, event) => sum + event.delta, 0);
  return { quantity, total: quantity * cartUnitPrice };
}

export function appendCartEvent(events: CartEvent[], reason: CartEvent['reason']): CartEvent[] {
  if (events.length >= 24) return events;
  const last = events.at(-1);
  if (reason === 'compensate' && !last) return events;
  const delta = reason === 'add' ? 1 : reason === 'remove' ? -1 : last!.delta === 1 ? -1 : 1;
  if (projectCart(events).quantity + delta < 0) return events;
  return [
    ...events,
    {
      id: events.length + 1,
      delta,
      reason,
      ...(reason === 'compensate' ? { reverses: last!.id } : {}),
    },
  ];
}
