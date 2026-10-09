import assert from 'node:assert/strict';
import test from 'node:test';
import {
  initialBalance,
  sendBalanced,
  tickBalance,
  toggleBalanceServer,
} from '../src/models/balanceExperiment.ts';
import { createRequestTrace } from '../src/models/tracingExperiment.ts';
import {
  initialMigration,
  applyMigration,
  revertMigration,
} from '../src/models/migrationExperiment.ts';
import { initialIdempotency, submitPayment } from '../src/models/idempotencyExperiment.ts';

test('balancer rotates healthy servers, completes work, and favors free connections', () => {
  let state = initialBalance();
  for (let index = 0; index < 6; index++) state = sendBalanced(state, 'round-robin');
  assert.deepEqual(
    state.requests.map((request) => request.server),
    ['A', 'B', 'C', 'A', 'B', 'C'],
  );
  state = tickBalance(tickBalance(state));
  assert.equal(state.requests.filter((request) => request.status === 'done').length, 2);
  state = sendBalanced(state, 'least-connections');
  assert.equal(state.requests.at(-1)?.server, 'A');
  state = toggleBalanceServer(state, 'A');
  assert.equal(state.requests.at(-1)?.status, 'failed');
  for (let index = 0; index < 4; index++) state = sendBalanced(state, 'round-robin');
  assert.ok(state.requests.slice(-4).every((request) => request.server !== 'A'));
  state = toggleBalanceServer(toggleBalanceServer(state, 'B'), 'C');
  const rejected = sendBalanced(state, 'least-connections');
  assert.equal(rejected.rejected, 1);
  assert.equal(rejected.requests.length, state.requests.length);
});

test('trace parents contain child intervals and IDs correlate one request', () => {
  for (const scenario of ['normal', 'slow', 'error'] as const) {
    const trace = createRequestTrace(5, scenario);
    assert.equal(trace.id.length, 32);
    assert.ok(trace.spans.every((span) => span.id.length === 16));
    assert.equal(new Set(trace.spans.map((span) => span.id)).size, 4);
    for (const child of trace.spans.filter((span) => span.parent)) {
      const parent = trace.spans.find((span) => span.id === child.parent)!;
      assert.ok(child.start >= parent.start);
      assert.ok(child.start + child.duration <= parent.start + parent.duration);
    }
    assert.equal(trace.spans[0].error, scenario === 'error');
  }
  assert.equal(createRequestTrace(1, 'slow').duration, 860);
  assert.notEqual(createRequestTrace(1, 'normal').id, createRequestTrace(2, 'normal').id);
});

test('migration failure is atomic; applying and reverting changes schema and rows', () => {
  let state = initialMigration();
  const original = structuredClone(state);
  assert.deepEqual(applyMigration(state, true), { ...original, result: 'failed' });
  state = applyMigration(state);
  assert.deepEqual(
    state.rows.map((row) => row.email),
    [null, null],
  );
  const failed = applyMigration(state, true);
  assert.equal(failed.version, 1);
  assert.deepEqual(failed.rows, state.rows);
  state = applyMigration(failed);
  assert.deepEqual(
    state.rows.map((row) => row.email),
    ['ada@example.com', 'alan@example.com'],
  );
  state = applyMigration(state);
  assert.equal(state.version, 3);
  state = revertMigration(revertMigration(state));
  assert.equal(state.version, 1);
  assert.deepEqual(
    state.rows.map((row) => row.email),
    [null, null],
  );
  state = revertMigration(state);
  assert.deepEqual(state.rows, original.rows);
});

test('payment retries survive lost responses and reject changed payloads', () => {
  let state = submitPayment(initialIdempotency(), 'order-1', 20, true);
  assert.equal(state.lost, true);
  state = submitPayment(state, 'order-1', 20);
  assert.equal(state.result, 'replayed');
  assert.equal(state.paymentId, 1);
  assert.equal(state.payments.length, 1);
  state = submitPayment(state, 'order-1', 35);
  assert.equal(state.result, 'conflict');
  assert.equal(state.payments.length, 1);
  state = submitPayment(state, 'order-2', 35);
  assert.equal(state.payments.length, 2);
  state = submitPayment(submitPayment(state, null, 20), null, 20);
  assert.equal(state.payments.length, 4);
});
