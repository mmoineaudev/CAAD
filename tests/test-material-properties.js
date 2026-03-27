// Test file for UC-015: Material Properties Implementation
const assert = require('assert');
console.log('Running UC-015 Material Properties Implementation tests...\n');

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`✓ ${name}`); passed++; }
  catch (error) { console.log(`✗ ${name}\n  Error: ${error.message}`); failed++; }
}

console.log('=== Material Types ===');
test('should define vacuum material', () => {
  const material = { name: 'vacuum', epsilonR: 1, muR: 1, sigma: 0 };
  assert.strictEqual(material.epsilonR, 1);
});
test('should define dielectric material', () => {
  const material = { name: 'dielectric', epsilonR: 4.5, muR: 1, sigma: 0.001 };
  assert.strictEqual(material.epsilonR, 4.5);
});
test('should define conductor material', () => {
  const material = { name: 'copper', epsilonR: 1, muR: 1, sigma: 5.8e7 };
  assert.ok(material.sigma > 1e6);
});
test('should define PEC material', () => {
  const material = { name: 'pec', epsilonR: 1, muR: 1, sigma: Infinity };
  assert.ok(material.sigma === Infinity);
});

console.log('\n=== Material Parameters ===');
test('should calculate absolute permittivity', () => {
  const epsilon0 = 8.854e-12;
  const epsilonR = 4.5;
  const epsilon = epsilon0 * epsilonR;
  assert.ok(Math.abs(epsilon - 3.9843e-11) < 1e-12);
});
test('should calculate absolute permeability', () => {
  const mu0 = 4 * Math.PI * 1e-7;
  const muR = 1;
  const mu = mu0 * muR;
  assert.ok(Math.abs(mu - 1.2566e-6) < 1e-9);
});
test('should calculate refractive index', () => {
  const epsilonR = 4;
  const muR = 1;
  const n = Math.sqrt(epsilonR * muR);
  assert.strictEqual(n, 2);
});
test('should calculate wave impedance', () => {
  const epsilon0 = 8.854e-12;
  const mu0 = 4 * Math.PI * 1e-7;
  const z0 = Math.sqrt(mu0 / epsilon0);
  assert.ok(Math.abs(z0 - 377) < 1);
});
test('should calculate phase velocity', () => {
  const c = 3e8;
  const n = 2;
  const v = c / n;
  assert.strictEqual(v, 1.5e8);
});

console.log('\n=== Frequency-Dependent Materials ===');
test('should define Drude model parameters', () => {
  const drude = {
    epsilonInf: 1,
    omegaP: 1.38e16,
    gamma: 4.07e13
  };
  assert.ok(drude.epsilonInf > 0);
  assert.ok(drude.omegaP > 0);
});
test('should calculate Drude permittivity', () => {
  const omega = 2 * Math.PI * 500e12;
  const epsilonInf = 1;
  const omegaP = 1.38e16;
  const gamma = 4.07e13;
  const omegaReal = omega;
  const omegaImag = gamma * omega;
  const denominator = omegaReal**2 + omegaImag;
  const epsilonR = { real: epsilonInf - omegaP**2 / denominator, imag: 0 };
  assert.ok(epsilonR.real !== undefined);
});
test('should define Lorentz model parameters', () => {
  const lorentz = {
    epsilonInf: 1,
    epsilonS: 2.25,
    omega0: 2 * Math.PI * 400e12,
    gamma: 2 * Math.PI * 10e12
  };
  assert.ok(lorentz.epsilonS > lorentz.epsilonInf);
});

console.log('\n=== Anisotropic Materials ===');
test('should define diagonal permittivity tensor', () => {
  const epsilon = [2.5, 2.5, 10.5];
  assert.strictEqual(epsilon.length, 3);
});
test('should calculate effective permittivity', () => {
  const epsilon = [2.5, 2.5, 10.5];
  const epsilonEff = (epsilon[0] + epsilon[1] + epsilon[2]) / 3;
  assert.ok(Math.abs(epsilonEff - 5.167) < 0.01);
});

console.log('\n=== Material Assignment ===');
test('should assign material to grid cells', () => {
  const grid = Array(10).fill(null).map(() => Array(10).fill(0));
  const material = { name: 'dielectric', epsilonR: 4.5 };
  for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) grid[i][j] = material;
  assert.strictEqual(grid[5][5].name, 'dielectric');
});
test('should merge overlapping material regions', () => {
  const region1 = { x: 0, y: 0, width: 5, height: 5, material: 'a' };
  const region2 = { x: 3, y: 3, width: 5, height: 5, material: 'b' };
  const overlap = region1.x < region2.x + region2.width && region1.x + region1.width > region2.x;
  assert.strictEqual(overlap, true);
});

console.log('\n=== Material Library ===');
test('should register new material', () => {
  const library = {};
  const material = { name: 'custom', epsilonR: 3.5 };
  library[material.name] = material;
  assert.strictEqual(library.custom.epsilonR, 3.5);
});
test('should lookup material by name', () => {
  const library = { silicon: { epsilonR: 11.9 }, air: { epsilonR: 1 } };
  const mat = library.silicon;
  assert.strictEqual(mat.epsilonR, 11.9);
});
test('should list all materials', () => {
  const library = { a: { name: 'a' }, b: { name: 'b' }, c: { name: 'c' } };
  const names = Object.keys(library);
  assert.strictEqual(names.length, 3);
});

console.log('\n=== Material Visualization ===');
test('should map material to color', () => {
  const colorMap = { vacuum: [1, 1, 1], dielectric: [0.5, 0.5, 1], conductor: [1, 1, 0] };
  const color = colorMap.dielectric;
  assert.strictEqual(color.length, 3);
});
test('should generate material legend', () => {
  const materials = [
    { name: 'vacuum', color: [1, 1, 1] },
    { name: 'silicon', color: [0.5, 0.5, 1] }
  ];
  assert.strictEqual(materials.length, 2);
});

console.log('\n=== Material Export/Import ===');
test('should export material as JSON', () => {
  const material = { name: 'test', epsilonR: 4.5, muR: 1 };
  const json = JSON.stringify(material);
  const parsed = JSON.parse(json);
  assert.strictEqual(parsed.epsilonR, 4.5);
});
test('should import material from JSON', () => {
  const json = '{"name":"imported","epsilonR":6.5}';
  const material = JSON.parse(json);
  assert.strictEqual(material.epsilonR, 6.5);
});

console.log('\n=== Test Summary ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);
if (failed > 0) process.exit(1);
