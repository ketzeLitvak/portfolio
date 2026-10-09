export type ShippingProviderId = 'standard' | 'express' | 'stub';

export interface ShippingOrder {
  weightKg: number;
}

export interface ShippingQuote {
  fee: number;
  days: number;
}

export interface ShippingProvider {
  quote(order: ShippingOrder): ShippingQuote;
}

export class StandardShipping implements ShippingProvider {
  quote(order: ShippingOrder): ShippingQuote {
    return { fee: 4 + order.weightKg * 2, days: 5 };
  }
}

export class ExpressShipping implements ShippingProvider {
  quote(order: ShippingOrder): ShippingQuote {
    return { fee: 8 + order.weightKg * 3, days: 1 };
  }
}

export class ShippingStub implements ShippingProvider {
  quote(): ShippingQuote {
    return { fee: 42, days: 2 };
  }
}

export class CheckoutService {
  private readonly shipping: ShippingProvider;

  constructor(shipping: ShippingProvider) {
    this.shipping = shipping;
  }

  calculate(order: ShippingOrder): ShippingQuote {
    return this.shipping.quote(order);
  }
}

export const shippingConstructors = {
  standard: StandardShipping,
  express: ExpressShipping,
  stub: ShippingStub,
} satisfies Record<ShippingProviderId, new () => ShippingProvider>;

// The composition root selects and creates the dependency; CheckoutService only uses it.
export function composeCheckout(provider: ShippingProviderId): CheckoutService {
  const Provider = shippingConstructors[provider];
  return new CheckoutService(new Provider());
}
