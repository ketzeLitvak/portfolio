import assert from 'node:assert/strict';

import test from 'node:test';

import {
  CheckoutService,
  composeCheckout,
  type ShippingOrder,
  type ShippingProvider,
} from '../src/models/injectionExperiment.ts';

test('checkout delegates each order to an independently injected provider', () => {
  const calls: ShippingOrder[] = [];
  const response = { fee: 17, days: 3 };
  const spy: ShippingProvider = {
    quote(order) {
      calls.push(order);
      return response;
    },
  };
  const checkout = new CheckoutService(spy);
  const first = { weightKg: 1 };
  const second = { weightKg: 5 };
  assert.equal(checkout.calculate(first), response);
  assert.equal(checkout.calculate(second), response);
  assert.deepEqual(calls, [first, second]);
  assert.equal(calls[0], first);
  assert.equal(calls[1], second);
});

test('composition wires interchangeable implementations and a predictable test stub', () => {
  const order = { weightKg: 2 };
  assert.deepEqual(composeCheckout('standard').calculate(order), { fee: 8, days: 5 });
  assert.deepEqual(composeCheckout('express').calculate(order), { fee: 14, days: 1 });
  const testCheckout = composeCheckout('stub');
  assert.deepEqual(testCheckout.calculate(order), { fee: 42, days: 2 });
  assert.deepEqual(testCheckout.calculate({ weightKg: 5 }), { fee: 42, days: 2 });
});
