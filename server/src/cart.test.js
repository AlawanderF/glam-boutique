import { test } from 'node:test';
import assert from 'node:assert/strict';

const VALID_COUPONS = { GLAM10: 10, BEMVINDA15: 15, GLAMVIP20: 20 };

function normalize(code) {
  return code.trim().toUpperCase();
}

function lookup(code) {
  return VALID_COUPONS[normalize(code)];
}

test('coupon validation — accepts valid codes', () => {
  assert.equal(lookup('GLAM10'), 10);
  assert.equal(lookup('glam10'), 10);
  assert.equal(lookup(' GLAM10 '), 10);
});

test('coupon validation — rejects invalid codes', () => {
  assert.equal(lookup('INVALID'), undefined);
  assert.equal(lookup(''), undefined);
  assert.equal(lookup('GLAM5'), undefined);
});

test('coupon normalization — trim + uppercase', () => {
  assert.equal(normalize('  glam10  '), 'GLAM10');
  assert.equal(normalize('BemVinDa15'), 'BEMVINDA15');
});
