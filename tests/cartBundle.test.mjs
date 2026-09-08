import test from 'node:test';
import assert from 'node:assert/strict';

// Meridian Living luxury bundle discount & cart checkout calculations
function calculateBundleTotal(items, bundleDiscountPercent = 15) {
  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = items.length >= 3 ? Math.round(rawSubtotal * (bundleDiscountPercent / 100) * 100) / 100 : 0;
  const finalTotal = Math.round((rawSubtotal - discount) * 100) / 100;
  return { rawSubtotal, discount, finalTotal };
}

test('Bundle Builder: applies 15% discount when 3+ luxury items selected', () => {
  const items = [
    { name: 'Smart Ambient Lamp', price: 180.00, quantity: 1 },
    { name: 'Acoustic Wall Panel', price: 220.00, quantity: 1 },
    { name: 'Ceramic Diffuser', price: 100.00, quantity: 1 }
  ];
  const { rawSubtotal, discount, finalTotal } = calculateBundleTotal(items, 15);
  assert.equal(rawSubtotal, 500.00);
  assert.equal(discount, 75.00);
  assert.equal(finalTotal, 425.00);
});

test('Bundle Builder: standard pricing when less than 3 items selected', () => {
  const items = [
    { name: 'Smart Ambient Lamp', price: 180.00, quantity: 1 }
  ];
  const { rawSubtotal, discount, finalTotal } = calculateBundleTotal(items);
  assert.equal(rawSubtotal, 180.00);
  assert.equal(discount, 0);
  assert.equal(finalTotal, 180.00);
});
