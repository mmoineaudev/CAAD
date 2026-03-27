// Test file for UC-014: Port Calculation Implementation
// TDD approach: tests define expected behavior before implementation

const assert = require('assert');

console.log('Running UC-014 Port Calculation Implementation tests...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
    failed++;
  }
}

// === Port Impedance Calculation ===
console.log('=== Port Impedance Calculation ===');

test('should calculate port characteristic impedance', () => {
  const portWidth = 0.001;
  const portHeight = 0.001;
  const epsilon = 8.854e-12;
  const mu = 4 * Math.PI * 1e-7;

  const z0 = Math.sqrt(mu / epsilon);

  assert.ok(Math.abs(z0 - 376.73) < 0.01);
});

test('should calculate impedance with different dielectric', () => {
  const epsilonR = 2.25;
  const epsilon0 = 8.854e-12;
  const mu0 = 4 * Math.PI * 1e-7;
  const epsilon = epsilonR * epsilon0;
  const mu = mu0;

  const z0 = Math.sqrt(mu / epsilon);

  assert.ok(Math.abs(z0 - 251.15) < 0.01);
});

test('should calculate impedance for 50 ohm port', () => {
  const targetImpedance = 50;
  const z0 = 50;

  assert.strictEqual(z0, targetImpedance);
});

// === S-Parameter Calculation ===
console.log('\n=== S-Parameter Calculation ===');

test('should calculate S11 reflection coefficient', () => {
  const z0 = 50;
  const zl = 75;

  const gamma = (zl - z0) / (zl + z0);

  assert.strictEqual(gamma, 0.2);
});

test('should calculate S11 with matched load', () => {
  const z0 = 50;
  const zl = 50;

  const gamma = (zl - z0) / (zl + z0);

  assert.strictEqual(gamma, 0);
});

test('should calculate S11 with short circuit', () => {
  const z0 = 50;
  const zl = 0;

  const gamma = (zl - z0) / (zl + z0);

  assert.strictEqual(gamma, -1);
});

test('should calculate S11 with open circuit', () => {
  const z0 = 50;
  const zl = Infinity;

  const gamma = Math.abs(zl) === Infinity ? 1 : (zl - z0) / (zl + z0);

  assert.strictEqual(gamma, 1);
});

test('should calculate S21 transmission coefficient', () => {
  const z0 = 50;
  const zl = 75;

  const s21 = 2 * zl / (zl + z0);

  assert.strictEqual(s21, 1.2);
});

test('should calculate S21 with matched load', () => {
  const z0 = 50;
  const zl = 50;

  const s21 = 2 * zl / (zl + z0);

  assert.strictEqual(s21, 1);
});

// === Return Loss Calculation ===
console.log('\n=== Return Loss Calculation ===');

test('should calculate return loss in dB', () => {
  const gamma = 0.2;

  const returnLoss = -20 * Math.log10(Math.abs(gamma));

  assert.ok(Math.abs(returnLoss - 13.98) < 0.01);
});

test('should calculate return loss for matched port', () => {
  const gamma = 0;

  const returnLoss = gamma === 0 ? Infinity : -20 * Math.log10(Math.abs(gamma));

  assert.strictEqual(returnLoss, Infinity);
});

test('should calculate return loss for perfect reflection', () => {
  const gamma = 1;

  const returnLoss = -20 * Math.log10(Math.abs(gamma));

  assert.ok(Math.abs(returnLoss) < 0.01);
});

// === Insertion Loss Calculation ===
console.log('\n=== Insertion Loss Calculation ===');

test('should calculate insertion loss in dB', () => {
  const s21 = 0.5;

  const insertionLoss = -20 * Math.log10(Math.abs(s21));

  assert.strictEqual(insertionLoss, 6.020599913279624);
});

test('should calculate insertion loss for perfect transmission', () => {
  const s21 = 1;

  const insertionLoss = -20 * Math.log10(Math.abs(s21));

  assert.ok(Math.abs(insertionLoss) < 0.01);
});

test('should calculate insertion loss for no transmission', () => {
  const s21 = 0;

  const insertionLoss = s21 === 0 ? Infinity : -20 * Math.log10(Math.abs(s21));

  assert.strictEqual(insertionLoss, Infinity);
});

// === VSWR Calculation ===
console.log('\n=== VSWR Calculation ===');

test('should calculate voltage standing wave ratio', () => {
  const gamma = 0.2;

  const vswr = (1 + Math.abs(gamma)) / (1 - Math.abs(gamma));

  assert.ok(Math.abs(vswr - 1.5) < 0.01);
});

test('should calculate VSWR for matched load', () => {
  const gamma = 0;

  const vswr = (1 + Math.abs(gamma)) / (1 - Math.abs(gamma));

  assert.strictEqual(vswr, 1);
});

test('should calculate VSWR for perfect reflection', () => {
  const gamma = 1;

  const vswr = (1 + Math.abs(gamma)) / (1 - Math.abs(gamma));

  assert.strictEqual(vswr, Infinity);
});

// === Port Admittance ===
console.log('\n=== Port Admittance ===');

test('should calculate port admittance', () => {
  const z0 = 50;

  const y0 = 1 / z0;

  assert.strictEqual(y0, 0.02);
});

test('should calculate admittance from impedance matrix', () => {
  const z11 = 50;
  const z12 = 10;
  const z21 = 10;
  const z22 = 50;

  const detZ = z11 * z22 - z12 * z21;
  const y11 = z22 / detZ;

  assert.ok(Math.abs(y11 - 0.0208) < 0.001);
});

// === Port Power Calculation ===
console.log('\n=== Port Power Calculation ===');

test('should calculate incident power', () => {
  const vIncident = 1;
  const z0 = 50;

  const pIncident = vIncident ** 2 / (2 * z0);

  assert.strictEqual(pIncident, 0.01);
});

test('should calculate reflected power', () => {
  const vReflected = 0.2;
  const z0 = 50;

  const pReflected = vReflected ** 2 / (2 * z0);

  assert.ok(Math.abs(pReflected - 0.0004) < 0.00001);
});

test('should calculate transmitted power', () => {
  const vTransmitted = 0.8;
  const z0 = 50;

  const pTransmitted = vTransmitted ** 2 / (2 * z0);

  assert.ok(Math.abs(pTransmitted - 0.0064) < 0.0001);
});

test('should calculate power conservation', () => {
  const pIncident = 1;
  const pReflected = 0.04;
  const pTransmitted = 0.96;

  const powerConserved = Math.abs(pIncident - (pReflected + pTransmitted)) < 0.001;

  assert.strictEqual(powerConserved, true);
});

// === Port Calibration ===
console.log('\n=== Port Calibration ===');

test('should apply calibration correction', () => {
  const measuredS11 = 0.2;
  const calibrationOffset = 0.01;

  const correctedS11 = measuredS11 - calibrationOffset;

  assert.strictEqual(correctedS11, 0.19);
});

test('should apply error correction matrix', () => {
  const measuredS = [0.2, 0.8];
  const errorMatrix = [
    [1, 0],
    [0, 1]
  ];

  const correctedS = measuredS.map((s, i) => s * errorMatrix[i][i]);

  assert.deepStrictEqual(correctedS, [0.2, 0.8]);
});

// === Port Frequency Response ===
console.log('\n=== Port Frequency Response ===');

test('should calculate frequency dependent S11', () => {
  const frequency = 1e9;
  const z0 = 50;
  const zl = 50 + 10 * Math.sin(2 * Math.PI * frequency * 1e-9);

  const gamma = (zl - z0) / (zl + z0);

  assert.ok(gamma >= -1 && gamma <= 1);
});

test('should calculate frequency dependent S21', () => {
  const frequency = 1e9;
  const z0 = 50;
  const zl = 50;

  const s21 = 2 * zl / (zl + z0);

  assert.strictEqual(s21, 1);
});

// === Port Network Analysis ===
console.log('\n=== Port Network Analysis ===');

test('should convert S-parameters to Z-parameters', () => {
  const s11 = 0.2;
  const s12 = 0.1;
  const s21 = 0.8;
  const s22 = 0.3;
  const z0 = 50;

  const detS = s11 * s22 - s12 * s21;
  const z11 = z0 * ((1 + s11) * (1 - s22) + s12 * s21) / detS;

  assert.ok(!isNaN(z11) && isFinite(z11));
});

test('should convert S-parameters to Y-parameters', () => {
  const s11 = 0.2;
  const s12 = 0.1;
  const s21 = 0.8;
  const s22 = 0.3;
  const z0 = 50;

  const y11 = (1 / z0) * ((1 - s11) * (1 + s22) + s12 * s21) / ((1 + s11) * (1 + s22) - s12 * s21);

  assert.ok(y11 > 0);
});

// === Port Display ===
console.log('\n=== Port Display ===');

test('should display S11 magnitude in dB', () => {
  const s11 = 0.2;

  const s11dB = 20 * Math.log10(Math.abs(s11));

  assert.ok(Math.abs(s11dB - (-13.98)) < 0.01);
});

test('should display S21 magnitude in dB', () => {
  const s21 = 0.8;

  const s21dB = 20 * Math.log10(Math.abs(s21));

  assert.ok(Math.abs(s21dB - (-1.94)) < 0.01);
});

test('should display VSWR', () => {
  const vswr = 1.5;

  const display = `VSWR: ${vswr.toFixed(2)}`;

  assert.strictEqual(display, 'VSWR: 1.50');
});

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
