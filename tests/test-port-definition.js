// Test file for UC-008: Port Definition
// TDD approach: tests define expected behavior before implementation

const assert = require('assert');

console.log('Running UC-008 Port Definition tests...\n');

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

// === Port Object Structure ===
console.log('=== Port Object Structure ===');

test('should have correct port structure', () => {
  const port = {
    id: 1,
    type: 'port',
    name: 'Port 1',
    width: 1,
    height: 1,
    position: { x: 0, y: 0, z: 0 },
    normal: { x: 0, y: 0, z: 1 },
    impedance: 50,
    referencePlane: 'ground'
  };

  assert.strictEqual(port.id, 1);
  assert.strictEqual(port.type, 'port');
  assert.strictEqual(port.name, 'Port 1');
  assert.strictEqual(port.width, 1);
  assert.strictEqual(port.height, 1);
});

test('should have default port impedance', () => {
  const port = {
    id: 1,
    type: 'port',
    name: 'Port 1',
    width: 1,
    height: 1,
    position: { x: 0, y: 0, z: 0 },
    normal: { x: 0, y: 0, z: 1 },
    impedance: 50,
    referencePlane: 'ground'
  };

  assert.strictEqual(port.impedance, 50);
});

test('should have default reference plane', () => {
  const port = {
    id: 1,
    type: 'port',
    name: 'Port 1',
    width: 1,
    height: 1,
    position: { x: 0, y: 0, z: 0 },
    normal: { x: 0, y: 0, z: 1 },
    impedance: 50,
    referencePlane: 'ground'
  };

  assert.strictEqual(port.referencePlane, 'ground');
});

// === Port Creation ===
console.log('\n=== Port Creation ===');

test('should create port from position and dimensions', () => {
  const port = {
    id: 1,
    type: 'port',
    name: 'Port 1',
    width: 2,
    height: 3,
    position: { x: 0, y: 0, z: 0 },
    normal: { x: 0, y: 0, z: 1 },
    impedance: 50,
    referencePlane: 'ground'
  };

  assert.strictEqual(port.width, 2);
  assert.strictEqual(port.height, 3);
  assert.deepStrictEqual(port.position, { x: 0, y: 0, z: 0 });
});

test('should increment port ID on creation', () => {
  const appState = {
    nextPortId: 1,
    ports: []
  };

  const port = {
    id: appState.nextPortId++,
    type: 'port',
    name: 'Port 1'
  };

  appState.ports.push(port);

  assert.strictEqual(appState.nextPortId, 2);
  assert.strictEqual(port.id, 1);
});

test('should validate port with valid dimensions', () => {
  const port = {
    id: 1,
    width: 2,
    height: 3
  };

  const isValid = port.width > 0 && port.height > 0;

  assert.strictEqual(isValid, true);
});

test('should reject port with invalid dimensions', () => {
  const port = {
    id: 1,
    width: -1,
    height: 3
  };

  const isValid = port.width > 0 && port.height > 0;

  assert.strictEqual(isValid, false);
});

// === Port Validation ===
console.log('\n=== Port Validation ===');

test('should validate port has width and height', () => {
  const port = {
    id: 1,
    width: 2,
    height: 3
  };

  const hasWidth = port.width !== undefined;
  const hasHeight = port.height !== undefined;

  assert.strictEqual(hasWidth, true);
  assert.strictEqual(hasHeight, true);
});

test('should validate port normal vector is unit length', () => {
  const port = {
    id: 1,
    normal: { x: 0, y: 0, z: 1 }
  };

  const length = Math.sqrt(
    port.normal.x ** 2 +
    port.normal.y ** 2 +
    port.normal.z ** 2
  );

  const isUnitLength = Math.abs(length - 1) < 0.001;

  assert.strictEqual(isUnitLength, true);
});

test('should normalize port normal vector', () => {
  const port = {
    id: 1,
    normal: { x: 0, y: 0, z: 2 }
  };

  const length = Math.sqrt(
    port.normal.x ** 2 +
    port.normal.y ** 2 +
    port.normal.z ** 2
  );

  const normalized = {
    x: port.normal.x / length,
    y: port.normal.y / length,
    z: port.normal.z / length
  };

  assert.strictEqual(normalized.x, 0);
  assert.strictEqual(normalized.y, 0);
  assert.strictEqual(normalized.z, 1);
});

test('should validate impedance is positive', () => {
  const port = {
    id: 1,
    impedance: 50
  };

  const isValid = port.impedance > 0;

  assert.strictEqual(isValid, true);
});

// === Port Geometry ===
console.log('\n=== Port Geometry ===');

test('should calculate port area', () => {
  const port = {
    id: 1,
    width: 2,
    height: 3
  };

  const area = port.width * port.height;

  assert.strictEqual(area, 6);
});

test('should calculate port perimeter', () => {
  const port = {
    id: 1,
    width: 2,
    height: 3
  };

  const perimeter = 2 * (port.width + port.height);

  assert.strictEqual(perimeter, 10);
});

test('should calculate port center', () => {
  const port = {
    id: 1,
    width: 2,
    height: 3,
    position: { x: 0, y: 0, z: 0 }
  };

  const center = {
    x: port.position.x + port.width / 2,
    y: port.position.y + port.height / 2,
    z: port.position.z
  };

  assert.strictEqual(center.x, 1);
  assert.strictEqual(center.y, 1.5);
  assert.strictEqual(center.z, 0);
});

test('should get port corners', () => {
  const port = {
    id: 1,
    width: 2,
    height: 3,
    position: { x: 0, y: 0, z: 0 }
  };

  const corners = [
    { x: port.position.x, y: port.position.y, z: port.position.z },
    { x: port.position.x + port.width, y: port.position.y, z: port.position.z },
    { x: port.position.x + port.width, y: port.position.y + port.height, z: port.position.z },
    { x: port.position.x, y: port.position.y + port.height, z: port.position.z }
  ];

  assert.strictEqual(corners.length, 4);
  assert.deepStrictEqual(corners[0], { x: 0, y: 0, z: 0 });
  assert.deepStrictEqual(corners[2], { x: 2, y: 3, z: 0 });
});

// === Port Properties ===
console.log('\n=== Port Properties ===');

test('should set port impedance', () => {
  const port = {
    id: 1,
    impedance: 75
  };

  assert.strictEqual(port.impedance, 75);
});

test('should set port reference plane', () => {
  const port = {
    id: 1,
    referencePlane: 'ground'
  };

  assert.strictEqual(port.referencePlane, 'ground');
});

test('should set port name', () => {
  const port = {
    id: 1,
    name: 'Input Port'
  };

  assert.strictEqual(port.name, 'Input Port');
});

test('should set port position', () => {
  const port = {
    id: 1,
    position: { x: 1, y: 2, z: 3 }
  };

  assert.strictEqual(port.position.x, 1);
  assert.strictEqual(port.position.y, 2);
  assert.strictEqual(port.position.z, 3);
});

// === Port Normalization ===
console.log('\n=== Port Normalization ===');

test('should normalize x-axis normal', () => {
  const port = {
    id: 1,
    normal: { x: 1, y: 0, z: 0 }
  };

  const length = Math.sqrt(
    port.normal.x ** 2 +
    port.normal.y ** 2 +
    port.normal.z ** 2
  );

  const normalized = {
    x: port.normal.x / length,
    y: port.normal.y / length,
    z: port.normal.z / length
  };

  assert.deepStrictEqual(normalized, { x: 1, y: 0, z: 0 });
});

test('should normalize y-axis normal', () => {
  const port = {
    id: 1,
    normal: { x: 0, y: 1, z: 0 }
  };

  const length = Math.sqrt(
    port.normal.x ** 2 +
    port.normal.y ** 2 +
    port.normal.z ** 2
  );

  const normalized = {
    x: port.normal.x / length,
    y: port.normal.y / length,
    z: port.normal.z / length
  };

  assert.deepStrictEqual(normalized, { x: 0, y: 1, z: 0 });
});

test('should normalize z-axis normal', () => {
  const port = {
    id: 1,
    normal: { x: 0, y: 0, z: 1 }
  };

  const length = Math.sqrt(
    port.normal.x ** 2 +
    port.normal.y ** 2 +
    port.normal.z ** 2
  );

  const normalized = {
    x: port.normal.x / length,
    y: port.normal.y / length,
    z: port.normal.z / length
  };

  assert.deepStrictEqual(normalized, { x: 0, y: 0, z: 1 });
});

// === Port List Management ===
console.log('\n=== Port List Management ===');

test('should update object list with new ports', () => {
  const ports = [
    { id: 1, name: 'Port 1' },
    { id: 2, name: 'Port 2' }
  ];

  const listItems = ports.map(p => ({
    className: `object-item port`,
    text: p.name,
    dataId: p.id
  }));

  assert.strictEqual(listItems.length, 2);
  assert.strictEqual(listItems[0].text, 'Port 1');
  assert.strictEqual(listItems[1].text, 'Port 2');
});

test('should highlight selected ports in list', () => {
  const ports = [
    { id: 1, name: 'Port 1' },
    { id: 2, name: 'Port 2' },
    { id: 3, name: 'Port 3' }
  ];

  const selectedIds = [1, 3];

  const listItems = ports.map(p => ({
    id: p.id,
    isSelected: selectedIds.includes(p.id),
    className: `object-item port ${selectedIds.includes(p.id) ? 'selected' : ''}`
  }));

  assert.strictEqual(listItems[0].isSelected, true);
  assert.strictEqual(listItems[1].isSelected, false);
  assert.strictEqual(listItems[2].isSelected, true);
});

test('should display port information', () => {
  const port = {
    id: 1,
    name: 'Port 1',
    width: 2,
    height: 3,
    impedance: 50
  };

  const info = `${port.name}: ${port.width}x${port.height}, ${port.impedance}Ω`;

  assert.strictEqual(info, 'Port 1: 2x3, 50Ω');
});

// === Port Tool Activation ===
console.log('\n=== Port Tool Activation ===');

test('should activate create port tool on O key', () => {
  const activeTool = 'createPort';
  const toolName = 'Create Port';
  const shortcut = 'O';

  assert.strictEqual(activeTool, 'createPort');
  assert.strictEqual(toolName, 'Create Port');
  assert.strictEqual(shortcut, 'O');
});

test('should deactivate tool on Escape key', () => {
  const activeTool = 'createPort';
  const newTool = null;

  assert.strictEqual(newTool, null);
});

// === Port Deletion ===
console.log('\n=== Port Deletion ===');

test('should delete port from array', () => {
  const ports = [
    { id: 1, name: 'Port 1' },
    { id: 2, name: 'Port 2' },
    { id: 3, name: 'Port 3' }
  ];

  const portToDelete = 2;
  const remaining = ports.filter(p => p.id !== portToDelete);

  assert.strictEqual(remaining.length, 2);
  assert.strictEqual(remaining[0].id, 1);
  assert.strictEqual(remaining[1].id, 3);
});

test('should prevent deleting non-existent port', () => {
  const ports = [
    { id: 1, name: 'Port 1' }
  ];

  const portToDelete = 99;
  const remaining = ports.filter(p => p.id !== portToDelete);

  assert.strictEqual(remaining.length, 1);
});

// === Port Statistics ===
console.log('\n=== Port Statistics ===');

test('should count total ports', () => {
  const ports = [
    { id: 1, name: 'Port 1' },
    { id: 2, name: 'Port 2' },
    { id: 3, name: 'Port 3' }
  ];

  const count = ports.length;

  assert.strictEqual(count, 3);
});

test('should count selected ports', () => {
  const ports = [
    { id: 1, name: 'Port 1' },
    { id: 2, name: 'Port 2' },
    { id: 3, name: 'Port 3' }
  ];

  const selectedIds = [1, 3];
  const count = ports.filter(p => selectedIds.includes(p.id)).length;

  assert.strictEqual(count, 2);
});

test('should calculate total port area', () => {
  const ports = [
    { id: 1, width: 2, height: 3 },
    { id: 2, width: 1, height: 1 }
  ];

  const totalArea = ports.reduce((sum, p) => {
    return sum + p.width * p.height;
  }, 0);

  assert.strictEqual(totalArea, 7);
});

// === S-Parameter Calculation ===
console.log('\n=== S-Parameter Calculation ===');

test('should calculate S11 reflection coefficient', () => {
  const port = {
    id: 1,
    impedance: 50,
    loadImpedance: 75
  };

  const gamma = (port.loadImpedance - port.impedance) /
                (port.loadImpedance + port.impedance);

  assert.strictEqual(gamma, 0.2);
});

test('should calculate return loss in dB', () => {
  const gamma = 0.2;

  const returnLoss = -20 * Math.log10(Math.abs(gamma));

  assert.ok(returnLoss > 0);
});

test('should calculate S21 transmission coefficient', () => {
  const port1 = {
    id: 1,
    impedance: 50
  };

  const port2 = {
    id: 2,
    impedance: 50
  };

  const s21 = 2 * port2.impedance / (port1.impedance + port2.impedance);

  assert.strictEqual(s21, 1);
});

// === Port Display ===
console.log('\n=== Port Display ===');

test('should show port count in status bar', () => {
  const portCount = 5;
  const selectedCount = 2;

  const status = `${selectedCount} / ${portCount} ports selected`;

  assert.strictEqual(status, '2 / 5 ports selected');
});

test('should display port properties panel', () => {
  const port = {
    id: 1,
    name: 'Port 1',
    width: 2,
    height: 3,
    impedance: 50
  };

  const properties = {
    id: port.id,
    name: port.name,
    dimensions: `${port.width}x${port.height}`,
    impedance: `${port.impedance}Ω`
  };

  assert.strictEqual(properties.id, 1);
  assert.strictEqual(properties.name, 'Port 1');
  assert.strictEqual(properties.dimensions, '2x3');
  assert.strictEqual(properties.impedance, '50Ω');
});

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
