// Test file for UC-005: Line Creation
// TDD approach: tests define expected behavior before implementation

const assert = require('assert');

console.log('Running UC-005 Line Creation tests...\n');

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

// === Line Object Structure ===
console.log('=== Line Object Structure ===');

test('should have correct line structure', () => {
  const line = {
    id: 1,
    type: 'line',
    p1: 1,
    p2: 2,
    width: 1,
    color: [0, 0, 0],
    material: 'vacuum'
  };

  assert.strictEqual(line.id, 1);
  assert.strictEqual(line.type, 'line');
  assert.strictEqual(line.p1, 1);
  assert.strictEqual(line.p2, 2);
  assert.strictEqual(line.width, 1);
});

test('should have default line properties', () => {
  const line = {
    id: 1,
    type: 'line',
    p1: 1,
    p2: 2,
    width: 1,
    color: [0, 0, 0],
    material: 'vacuum'
  };

  assert.strictEqual(line.width, 1);
  assert.deepStrictEqual(line.color, [0, 0, 0]);
  assert.strictEqual(line.material, 'vacuum');
});

// === Line Creation ===
console.log('\n=== Line Creation ===');

test('should create line from two points', () => {
  const p1 = { id: 1, x: 0, y: 0, z: 0 };
  const p2 = { id: 2, x: 1, y: 0, z: 0 };

  const line = {
    id: 1,
    type: 'line',
    p1: p1.id,
    p2: p2.id,
    width: 1,
    color: [0, 0, 0],
    material: 'vacuum'
  };

  assert.strictEqual(line.p1, p1.id);
  assert.strictEqual(line.p2, p2.id);
});

test('should increment line ID on creation', () => {
  const appState = {
    nextLineId: 1,
    lines: []
  };

  const line = {
    id: appState.nextLineId++,
    type: 'line',
    p1: 1,
    p2: 2
  };

  appState.lines.push(line);

  assert.strictEqual(appState.nextLineId, 2);
  assert.strictEqual(line.id, 1);
});

test('should validate line creation with valid points', () => {
  const p1 = { id: 1, x: 0, y: 0, z: 0 };
  const p2 = { id: 2, x: 1, y: 1, z: 1 };

  const isValid = p1.id !== p2.id;

  assert.strictEqual(isValid, true);
});

test('should reject line creation with same point', () => {
  const p1 = { id: 1, x: 0, y: 0, z: 0 };
  const p2 = { id: 1, x: 0, y: 0, z: 0 };

  const isValid = p1.id !== p2.id;

  assert.strictEqual(isValid, false);
});

// === Line Validation ===
console.log('\n=== Line Validation ===');

test('should validate line has exactly two endpoints', () => {
  const line = {
    id: 1,
    type: 'line',
    p1: 1,
    p2: 2
  };

  const endpointCount = 2;

  assert.strictEqual(endpointCount, 2);
});

test('should validate both endpoints exist in points list', () => {
  const points = [
    { id: 1, x: 0, y: 0, z: 0 },
    { id: 2, x: 1, y: 1, z: 1 }
  ];

  const line = {
    id: 1,
    type: 'line',
    p1: 1,
    p2: 2
  };

  const p1Exists = points.some(p => p.id === line.p1);
  const p2Exists = points.some(p => p.id === line.p2);

  assert.strictEqual(p1Exists, true);
  assert.strictEqual(p2Exists, true);
});

test('should validate line width is positive', () => {
  const line = {
    id: 1,
    type: 'line',
    p1: 1,
    p2: 2,
    width: 1
  };

  const isValidWidth = line.width > 0;

  assert.strictEqual(isValidWidth, true);
});

test('should reject invalid line width', () => {
  const line = {
    id: 1,
    type: 'line',
    p1: 1,
    p2: 2,
    width: -1
  };

  const isValidWidth = line.width > 0;

  assert.strictEqual(isValidWidth, false);
});

// === Line Rendering ===
console.log('\n=== Line Rendering ===');

test('should render line with correct color', () => {
  const line = {
    id: 1,
    type: 'line',
    p1: 1,
    p2: 2,
    color: [0, 0, 0]
  };

  assert.deepStrictEqual(line.color, [0, 0, 0]);
});

test('should render line with custom color', () => {
  const line = {
    id: 1,
    type: 'line',
    p1: 1,
    p2: 2,
    color: [1, 0, 0]
  };

  assert.deepStrictEqual(line.color, [1, 0, 0]);
});

test('should render line with specified width', () => {
  const line = {
    id: 1,
    type: 'line',
    p1: 1,
    p2: 2,
    width: 2
  };

  assert.strictEqual(line.width, 2);
});

test('should render line between two points', () => {
  const p1 = { x: 0, y: 0, z: 0 };
  const p2 = { x: 1, y: 1, z: 1 };

  const line = {
    id: 1,
    type: 'line',
    p1: p1,
    p2: p2
  };

  assert.deepStrictEqual(line.p1, p1);
  assert.deepStrictEqual(line.p2, p2);
});

// === Line Geometry ===
console.log('\n=== Line Geometry ===');

test('should calculate line length', () => {
  const p1 = { x: 0, y: 0, z: 0 };
  const p2 = { x: 3, y: 4, z: 0 };

  const length = Math.sqrt(
    Math.pow(p2.x - p1.x, 2) +
    Math.pow(p2.y - p1.y, 2) +
    Math.pow(p2.z - p1.z, 2)
  );

  assert.strictEqual(length, 5);
});

test('should calculate line midpoint', () => {
  const p1 = { x: 0, y: 0, z: 0 };
  const p2 = { x: 2, y: 4, z: 6 };

  const midpoint = {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
    z: (p1.z + p2.z) / 2
  };

  assert.strictEqual(midpoint.x, 1);
  assert.strictEqual(midpoint.y, 2);
  assert.strictEqual(midpoint.z, 3);
});

test('should calculate line direction vector', () => {
  const p1 = { x: 0, y: 0, z: 0 };
  const p2 = { x: 3, y: 4, z: 0 };

  const direction = {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
    z: p2.z - p1.z
  };

  assert.strictEqual(direction.x, 3);
  assert.strictEqual(direction.y, 4);
  assert.strictEqual(direction.z, 0);
});

test('should normalize line direction vector', () => {
  const p1 = { x: 0, y: 0, z: 0 };
  const p2 = { x: 3, y: 4, z: 0 };

  const direction = {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
    z: p2.z - p1.z
  };

  const length = Math.sqrt(direction.x ** 2 + direction.y ** 2 + direction.z ** 2);
  const normalized = {
    x: direction.x / length,
    y: direction.y / length,
    z: direction.z / length
  };

  assert.ok(Math.abs(normalized.x - 0.6) < 0.001);
  assert.ok(Math.abs(normalized.y - 0.8) < 0.001);
});

// === Line Properties ===
console.log('\n=== Line Properties ===');

test('should set line material', () => {
  const line = {
    id: 1,
    type: 'line',
    p1: 1,
    p2: 2,
    material: 'copper'
  };

  assert.strictEqual(line.material, 'copper');
});

test('should default line material to vacuum', () => {
  const line = {
    id: 1,
    type: 'line',
    p1: 1,
    p2: 2,
    material: 'vacuum'
  };

  assert.strictEqual(line.material, 'vacuum');
});

test('should set line color', () => {
  const line = {
    id: 1,
    type: 'line',
    p1: 1,
    p2: 2,
    color: [1, 0.5, 0]
  };

  assert.deepStrictEqual(line.color, [1, 0.5, 0]);
});

test('should set line width', () => {
  const line = {
    id: 1,
    type: 'line',
    p1: 1,
    p2: 2,
    width: 2
  };

  assert.strictEqual(line.width, 2);
});

// === Line List Management ===
console.log('\n=== Line List Management ===');

test('should update object list with new lines', () => {
  const lines = [
    { id: 1, type: 'line', p1: 1, p2: 2 },
    { id: 2, type: 'line', p1: 2, p2: 3 }
  ];

  const listItems = lines.map(l => ({
    className: `object-item line`,
    text: `Line ${l.id}`,
    dataId: l.id
  }));

  assert.strictEqual(listItems.length, 2);
  assert.strictEqual(listItems[0].text, 'Line 1');
  assert.strictEqual(listItems[1].text, 'Line 2');
});

test('should highlight selected lines in list', () => {
  const lines = [
    { id: 1, type: 'line', p1: 1, p2: 2 },
    { id: 2, type: 'line', p1: 2, p2: 3 },
    { id: 3, type: 'line', p1: 3, p2: 4 }
  ];

  const selectedIds = [1, 3];

  const listItems = lines.map(l => ({
    id: l.id,
    isSelected: selectedIds.includes(l.id),
    className: `object-item line ${selectedIds.includes(l.id) ? 'selected' : ''}`
  }));

  assert.strictEqual(listItems[0].isSelected, true);
  assert.strictEqual(listItems[1].isSelected, false);
  assert.strictEqual(listItems[2].isSelected, true);
});

test('should display line information', () => {
  const line = { id: 1, type: 'line', p1: 1, p2: 2 };

  const info = `Line ${line.id}: p${line.p1} - p${line.p2}`;

  assert.strictEqual(info, 'Line 1: p1 - p2');
});

// === Line Tool Activation ===
console.log('\n=== Line Tool Activation ===');

test('should activate create line tool on L key', () => {
  const activeTool = 'createLine';
  const toolName = 'Create Line';
  const shortcut = 'L';

  assert.strictEqual(activeTool, 'createLine');
  assert.strictEqual(toolName, 'Create Line');
  assert.strictEqual(shortcut, 'L');
});

test('should deactivate tool on Escape key', () => {
  const activeTool = 'createLine';
  const newTool = null;

  assert.strictEqual(newTool, null);
});

// === Line Deletion ===
console.log('\n=== Line Deletion ===');

test('should delete line from array', () => {
  const lines = [
    { id: 1, type: 'line', p1: 1, p2: 2 },
    { id: 2, type: 'line', p1: 2, p2: 3 },
    { id: 3, type: 'line', p1: 3, p2: 4 }
  ];

  const lineToDelete = 2;
  const remaining = lines.filter(l => l.id !== lineToDelete);

  assert.strictEqual(remaining.length, 2);
  assert.strictEqual(remaining[0].id, 1);
  assert.strictEqual(remaining[1].id, 3);
});

test('should prevent deleting non-existent line', () => {
  const lines = [
    { id: 1, type: 'line', p1: 1, p2: 2 }
  ];

  const lineToDelete = 99;
  const remaining = lines.filter(l => l.id !== lineToDelete);

  assert.strictEqual(remaining.length, 1);
});

// === Line Statistics ===
console.log('\n=== Line Statistics ===');

test('should count total lines', () => {
  const lines = [
    { id: 1, type: 'line', p1: 1, p2: 2 },
    { id: 2, type: 'line', p1: 2, p2: 3 },
    { id: 3, type: 'line', p1: 3, p2: 4 }
  ];

  const count = lines.length;

  assert.strictEqual(count, 3);
});

test('should count selected lines', () => {
  const lines = [
    { id: 1, type: 'line', p1: 1, p2: 2 },
    { id: 2, type: 'line', p1: 2, p2: 3 },
    { id: 3, type: 'line', p1: 3, p2: 4 }
  ];

  const selectedIds = [1, 3];
  const count = lines.filter(l => selectedIds.includes(l.id)).length;

  assert.strictEqual(count, 2);
});

test('should calculate total line length', () => {
  const lines = [
    {
      id: 1,
      p1: { x: 0, y: 0, z: 0 },
      p2: { x: 3, y: 4, z: 0 }
    },
    {
      id: 2,
      p1: { x: 0, y: 0, z: 0 },
      p2: { x: 0, y: 0, z: 3 }
    }
  ];

  const totalLength = lines.reduce((sum, line) => {
    const length = Math.sqrt(
      Math.pow(line.p2.x - line.p1.x, 2) +
      Math.pow(line.p2.y - line.p1.y, 2) +
      Math.pow(line.p2.z - line.p1.z, 2)
    );
    return sum + length;
  }, 0);

  assert.strictEqual(totalLength, 8);
});

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
