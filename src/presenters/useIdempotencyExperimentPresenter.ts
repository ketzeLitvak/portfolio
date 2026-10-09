import { useState } from 'react';

import { initialIdempotency, submitPayment } from '../models/idempotencyExperiment';

export function useIdempotencyExperimentPresenter() {
  const [state, setState] = useState(initialIdempotency);
  const [protectedRequest, setProtectedRequest] = useState(true);
  const [keyNumber, setKeyNumber] = useState(1);
  const [amount, setAmount] = useState(20);
  const [loseResponse, setLoseResponse] = useState(false);
  const key = `order-${keyNumber}`;

  const send = () =>
    setState((current) =>
      submitPayment(current, protectedRequest ? key : null, amount, loseResponse),
    );

  const reset = () => {
    setState(initialIdempotency());
    setProtectedRequest(true);
    setKeyNumber(1);
    setAmount(20);
    setLoseResponse(false);
  };

  return {
    state,
    protectedRequest,
    setProtectedRequest,
    key,
    amount,
    setAmount,
    loseResponse,
    setLoseResponse,
    send,
    reset,
    newKey: () => setKeyNumber((value) => value + 1),
  };
}
