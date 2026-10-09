import { useMemo, useState } from 'react';

import {
  composeCheckout,
  type ShippingProviderId,
  type ShippingQuote,
} from '../models/injectionExperiment';

export function useInjectionExperimentPresenter() {
  const [provider, setProvider] = useState<ShippingProviderId>('standard');
  const [weightKg, setWeightKg] = useState(2);
  const [result, setResult] = useState<ShippingQuote | null>(null);
  const checkout = useMemo(() => composeCheckout(provider), [provider]);

  const selectProvider = (id: ShippingProviderId) => {
    setProvider(id);
    setResult(null);
  };

  const changeWeight = (value: number) => {
    setWeightKg(Math.max(1, Math.min(5, value)));
    setResult(null);
  };

  const calculate = () => setResult(checkout.calculate({ weightKg }));

  const reset = () => {
    setProvider('standard');
    setWeightKg(2);
    setResult(null);
  };

  return {
    provider,
    weightKg,
    result,
    selectProvider,
    changeWeight,
    calculate,
    reset,
  };
}
