import assert from 'node:assert/strict';

import test from 'node:test';

import {
  initialRateScenario,
  requestRate,
  tickRate,
  rateAvailable,
} from '../src/models/rateExperiment.ts';

import { createIndexRecords, planIndexSearch } from '../src/models/indexExperiment.ts';

import { appendCartEvent, projectCart } from '../src/models/sourcingExperiment.ts';

import {
  sha256,
  differingBits,
  comparePasswords,
  encryptMessage,
  decryptMessage,
  signMessage,
  verifyMessage,
} from '../src/models/cryptoExperiment.ts';

test('client quotas, sliding boundaries and token refill', () => {
  for (const strategy of ['fixed', 'sliding', 'bucket'] as const) {
    let s = initialRateScenario(strategy);
    for (let i = 0; i < 5; i++) s = requestRate(s, 'a');
    assert.equal(s.accepted, 3);
    assert.equal(s.rejected, 2);
    assert.equal(rateAvailable(s, 'b'), 3);
    s = requestRate(s, 'b');
    assert.equal(s.accepted, 4);
    for (let i = 0; i < 6; i++) s = tickRate(s);
    assert.equal(rateAvailable(s, 'a'), 3);
  }
  let s = initialRateScenario('sliding');
  for (let i = 0; i < 5; i++) s = tickRate(s);
  for (let i = 0; i < 3; i++) s = requestRate(s, 'a');
  s = tickRate(s);
  assert.equal(rateAvailable(s, 'a'), 0);
  assert.equal(requestRate(s, 'a').results.at(-1)?.retryAfter, 5);
  s = initialRateScenario('bucket');
  for (let i = 0; i < 3; i++) s = requestRate(s, 'a');
  s = tickRate(s);
  assert.equal(rateAvailable(s, 'a'), 0);
  s = tickRate(s);
  assert.equal(rateAvailable(s, 'a'), 1);
});

test('indexed lookups match a complete scan', () => {
  const records = createIndexRecords();
  for (const target of [...records.map((r) => r.id), 99, 132, 999]) {
    const a = planIndexSearch(records, target, false),
      b = planIndexSearch(records, target, true);
    assert.deepEqual(a.result, b.result);
    assert.ok(b.steps.length <= 6);
  }
  assert.equal(planIndexSearch(records, 124, false).steps.length, 25);
  assert.equal(planIndexSearch(records, 124, true).steps.length, 5);
});

test('append-only compensation and replay', () => {
  let events = appendCartEvent([], 'remove');
  assert.equal(events.length, 0);
  events = appendCartEvent(events, 'add');
  events = appendCartEvent(events, 'add');
  events = appendCartEvent(events, 'remove');
  const before = events;
  events = appendCartEvent(events, 'compensate');
  assert.equal(before.length, 3);
  assert.equal(events.length, 4);
  assert.equal(projectCart(events).quantity, 2);
  assert.equal(projectCart(events, 1).quantity, 1);
  assert.equal(events[3].reverses, 3);
});

test('SHA-256 known vector and per-account password salts', async () => {
  assert.equal(
    await sha256('abc'),
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
  );
  assert.equal(differingBits('00', 'ff'), 8);
  const salt = await comparePasswords('abc', true),
    plain = await comparePasswords('abc', false);
  assert.notEqual(salt.hashes[0], salt.hashes[1]);
  assert.equal(plain.hashes[0], plain.hashes[1]);
  assert.equal(salt.salts[0].length, 32);
});

test('AES-GCM round trips and rejects another key or modified bytes', async () => {
  for (const text of ['', 'Ketze 🦒 · áéí']) {
    const envelope = await encryptMessage(text);
    assert.equal(envelope.key.extractable, false);
    assert.equal(envelope.iv.length, 12);
    assert.equal(await decryptMessage(envelope, false, false), text);
    assert.equal(await decryptMessage(envelope, true, false), null);
    assert.equal(await decryptMessage(envelope, false, true), null);
  }
});

test('ECDSA rejects a modified message and another public key', async () => {
  const packet = await signMessage('Pedido #42');
  assert.equal(packet.identity.keys.privateKey.extractable, false);
  assert.equal(await verifyMessage(packet, packet.message, false), true);
  assert.equal(await verifyMessage(packet, packet.message + '!', false), false);
  assert.equal(await verifyMessage(packet, packet.message, true), false);
});
