export interface Payment {
  id: number;
  amount: number;
  key: string | null;
}
export interface IdempotencyState {
  payments: Payment[];
  result: 'ready' | 'created' | 'replayed' | 'conflict';
  paymentId: number | null;
  lost: boolean;
}

export function initialIdempotency(): IdempotencyState {
  return { payments: [], result: 'ready', paymentId: null, lost: false };
}

export function submitPayment(
  state: IdempotencyState,
  key: string | null,
  amount: number,
  loseResponse = false,
): IdempotencyState {
  const prior = key ? state.payments.find((payment) => payment.key === key) : undefined;
  if (prior && prior.amount !== amount)
    return { ...state, result: 'conflict', paymentId: null, lost: false };
  if (prior) return { ...state, result: 'replayed', paymentId: prior.id, lost: loseResponse };
  const payment = { id: state.payments.length + 1, amount, key };
  return {
    payments: [...state.payments, payment],
    result: 'created',
    paymentId: payment.id,
    lost: loseResponse,
  };
}
