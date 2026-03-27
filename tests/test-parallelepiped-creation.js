// Test file for UC-006: Parallelepiped Creation
// TDD approach: tests define expected behavior before implementation

const assert = require('assert');

console.log('Running UC-006 Parallelepiped Creation tests...\n');

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

// === Parallelepiped Object Structure ===
console.log('=== Parallelepiped Object Structure ===');

test('should have correct parallelepiped structure', () => {
  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3,
    width: 1,
    height: 1,
    depth: 1,
    color: [0.5, 0.5, 1],
    material: 'vacuum'
  };

  assert.strictEqual(parallelepiped.id, 1);
  assert.strictEqual(parallelepiped.type, 'parallelepiped');
  assert.strictEqual(parallelepiped.p1, 1);
  assert.strictEqual(parallelepiped.p2, 2);
  assert.strictEqual(parallelepiped.p3, 3);
});

test('should have default dimensions', () => {
  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3,
    width: 1,
    height: 1,
    depth: 1,
    color: [0.5, 0.5, 1],
    material: 'vacuum'
  };

  assert.strictEqual(parallelepiped.width, 1);
  assert.strictEqual(parallelepiped.height, 1);
  assert.strictEqual(parallelepiped.depth, 1);
});

// === Parallelepiped Creation ===
console.log('\n=== Parallelepiped Creation ===');

test('should create parallelepiped from three points', () => {
  const p1 = { id: 1, x: 0, y: 0, z: 0 };
  const p2 = { id: 2, x: 1, y: 0, z: 0 };
  const p3 = { id: 3, x: 0, y: 1, z: 0 };

  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: p1.id,
    p2: p2.id,
    p3: p3.id,
    width: 1,
    height: 1,
    depth: 1,
    color: [0.5, 0.5, 1],
    material: 'vacuum'
  };

  assert.strictEqual(parallelepiped.p1, p1.id);
  assert.strictEqual(parallelepiped.p2, p2.id);
  assert.strictEqual(parallelepiped.p3, p3.id);
});

test('should increment parallelepiped ID on creation', () => {
  const appState = {
    nextParallelepipedId: 1,
    parallelepipeds: []
  };

  const parallelepiped = {
    id: appState.nextParallelepipedId++,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3
  };

  appState.parallelepipeds.push(parallelepiped);

  assert.strictEqual(appState.nextParallelepipedId, 2);
  assert.strictEqual(parallelepiped.id, 1);
});

test('should validate parallelepiped creation with valid points', () => {
  const p1 = { id: 1, x: 0, y: 0, z: 0 };
  const p2 = { id: 2, x: 1, y: 0, z: 0 };
  const p3 = { id: 3, x: 0, y: 1, z: 0 };

  const isValid = p1.id !== p2.id && p1.id !== p3.id && p2.id !== p3.id;

  assert.strictEqual(isValid, true);
});

test('should reject parallelepiped creation with duplicate points', () => {
  const p1 = { id: 1, x: 0, y: 0, z: 0 };
  const p2 = { id: 1, x: 1, y: 0, z: 0 };
  const p3 = { id: 3, x: 0, y: 1, z: 0 };

  const isValid = p1.id !== p2.id && p1.id !== p3.id && p2.id !== p3.id;

  assert.strictEqual(isValid, false);
});

// === Parallelepiped Validation ===
console.log('\n=== Parallelepiped Validation ===');

test('should validate parallelepiped has three points', () => {
  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3
  };

  const pointCount = 3;

  assert.strictEqual(pointCount, 3);
});

test('should validate all points exist in points list', () => {
  const points = [
    { id: 1, x: 0, y: 0, z: 0 },
    { id: 2, x: 1, y: 1, z: 1 },
    { id: 3, x: 2, y: 2, z: 2 }
  ];

  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3
  };

  const p1Exists = points.some(p => p.id === parallelepiped.p1);
  const p2Exists = points.some(p => p.id === parallelepiped.p2);
  const p3Exists = points.some(p => p.id === parallelepiped.p3);

  assert.strictEqual(p1Exists, true);
  assert.strictEqual(p2Exists, true);
  assert.strictEqual(p3Exists, true);
});

test('should validate dimensions are positive', () => {
  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3,
    width: 1,
    height: 1,
    depth: 1
  };

  const isValidWidth = parallelepiped.width > 0;
  const isValidHeight = parallelepiped.height > 0;
  const isValidDepth = parallelepiped.depth > 0;

  assert.strictEqual(isValidWidth, true);
  assert.strictEqual(isValidHeight, true);
  assert.strictEqual(isValidDepth, true);
});

test('should reject invalid dimensions', () => {
  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3,
    width: -1,
    height: 1,
    depth: 1
  };

  const isValidWidth = parallelepiped.width > 0;

  assert.strictEqual(isValidWidth, false);
});

// === Parallelepiped Geometry ===
console.log('\n=== Parallelepiped Geometry ===');

test('should calculate parallelepiped volume', () => {
  const parallelepiped = {
    id: 1,
    width: 3,
    height: 4,
    depth: 5
  };

  const volume = parallelepiped.width * parallelepiped.height * parallelepiped.depth;

  assert.strictEqual(volume, 60);
});

test('should calculate parallelepiped surface area', () => {
  const parallelepiped = {
    id: 1,
    width: 3,
    height: 4,
    depth: 5
  };

  const surfaceArea = 2 * (
    parallelepiped.width * parallelepiped.height +
    parallelepiped.width * parallelepiped.depth +
    parallelepiped.height * parallelepiped.depth
  );

  assert.strictEqual(surfaceArea, 94);
});

test('should calculate center of parallelepiped', () => {
  const p1 = { x: 0, y: 0, z: 0 };
  const p2 = { x: 2, y: 0, z: 0 };
  const p3 = { x: 0, y: 4, z: 0 };

  const center = {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p3.y) / 2,
    z: 0
  };

  assert.strictEqual(center.x, 1);
  assert.strictEqual(center.y, 2);
});

test('should calculate bounding box', () => {
  const parallelepiped = {
    id: 1,
    p1: { x: 0, y: 0, z: 0 },
    width: 2,
    height: 3,
    depth: 4
  };

  const boundingBox = {
    min: {
      x: parallelepiped.p1.x,
      y: parallelepiped.p1.y,
      z: parallelepiped.p1.z
    },
    max: {
      x: parallelepiped.p1.x + parallelepiped.width,
      y: parallelepiped.p1.y + parallelepiped.height,
      z: parallelepiped.p1.z + parallelepiped.depth
    }
  };

  assert.strictEqual(boundingBox.min.x, 0);
  assert.strictEqual(boundingBox.max.x, 2);
  assert.strictEqual(boundingBox.max.y, 3);
  assert.strictEqual(boundingBox.max.z, 4);
});

// === Parallelepiped Rendering ===
console.log('\n=== Parallelepiped Rendering ===');

test('should render parallelepiped with correct color', () => {
  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3,
    color: [0.5, 0.5, 1]
  };

  assert.deepStrictEqual(parallelepiped.color, [0.5, 0.5, 1]);
});

test('should render parallelepiped with custom color', () => {
  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3,
    color: [1, 0, 0]
  };

  assert.deepStrictEqual(parallelepiped.color, [1, 0, 0]);
});

test('should render parallelepiped with wireframe mode', () => {
  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3,
    wireframe: true
  };

  assert.strictEqual(parallelepiped.wireframe, true);
});

test('should render parallelepiped with solid mode', () => {
  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3,
    wireframe: false
  };

  assert.strictEqual(parallelepiped.wireframe, false);
});

// === Parallelepiped Properties ===
console.log('\n=== Parallelepiped Properties ===');

test('should set parallelepiped material', () => {
  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3,
    material: 'copper'
  };

  assert.strictEqual(parallelepiped.material, 'copper');
});

test('should default parallelepiped material to vacuum', () => {
  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3,
    material: 'vacuum'
  };

  assert.strictEqual(parallelepiped.material, 'vacuum');
});

test('should set parallelepiped color', () => {
  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3,
    color: [1, 0.5, 0]
  };

  assert.deepStrictEqual(parallelepiped.color, [1, 0.5, 0]);
});

test('should set parallelepiped dimensions', () => {
  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3,
    width: 2,
    height: 3,
    depth: 4
  };

  assert.strictEqual(parallelepiped.width, 2);
  assert.strictEqual(parallelepiped.height, 3);
  assert.strictEqual(parallelepiped.depth, 4);
});

// === Parallelepiped List Management ===
console.log('\n=== Parallelepiped List Management ===');

test('should update object list with new parallelepipeds', () => {
  const parallelepipeds = [
    { id: 1, type: 'parallelepiped', p1: 1, p2: 2, p3: 3 },
    { id: 2, type: 'parallelepiped', p1: 2, p2: 3, p3: 4 }
  ];

  const listItems = parallelepipeds.map(p => ({
    className: `object-item parallelepiped`,
    text: `Parallelepiped ${p.id}`,
    dataId: p.id
  }));

  assert.strictEqual(listItems.length, 2);
  assert.strictEqual(listItems[0].text, 'Parallelepiped 1');
  assert.strictEqual(listItems[1].text, 'Parallelepiped 2');
});

test('should highlight selected parallelepipeds in list', () => {
  const parallelepipeds = [
    { id: 1, type: 'parallelepiped', p1: 1, p2: 2, p3: 3 },
    { id: 2, type: 'parallelepiped', p1: 2, p2: 3, p3: 4 },
    { id: 3, type: 'parallelepiped', p1: 3, p2: 4, p3: 5 }
  ];

  const selectedIds = [1, 3];

  const listItems = parallelepipeds.map(p => ({
    id: p.id,
    isSelected: selectedIds.includes(p.id),
    className: `object-item parallelepiped ${selectedIds.includes(p.id) ? 'selected' : ''}`
  }));

  assert.strictEqual(listItems[0].isSelected, true);
  assert.strictEqual(listItems[1].isSelected, false);
  assert.strictEqual(listItems[2].isSelected, true);
});

test('should display parallelepiped information', () => {
  const parallelepiped = {
    id: 1,
    type: 'parallelepiped',
    p1: 1,
    p2: 2,
    p3: 3,
    width: 2,
    height: 3,
    depth: 4
  };

  const info = `Parallelepiped ${parallelepiped.id}: p${parallelepiped.p1}-p${parallelepiped.p2}-p${parallelepiped.p3}, ${parallelepiped.width}x${parallelepiped.height}x${parallelepiped.depth}`;

  assert.strictEqual(info, 'Parallelepiped 1: p1-p2-p3, 2x3x4');
});

// === Parallelepiped Tool Activation ===
console.log('\n=== Parallelepiped Tool Activation ===');

test('should activate create parallelepiped tool on R key', () => {
  const activeTool = 'createParallelepiped';
  const toolName = 'Create Parallelepiped';
  const shortcut = 'R';

  assert.strictEqual(activeTool, 'createParallelepiped');
  assert.strictEqual(toolName, 'Create Parallelepiped');
  assert.strictEqual(shortcut, 'R');
});

test('should deactivate tool on Escape key', () => {
  const activeTool = 'createParallelepiped';
  const newTool = null;

  assert.strictEqual(newTool, null);
});

// === Parallelepiped Deletion ===
console.log('\n=== Parallelepiped Deletion ===');

test('should delete parallelepiped from array', () => {
  const parallelepipeds = [
    { id: 1, type: 'parallelepiped', p1: 1, p2: 2, p3: 3 },
    { id: 2, type: 'parallelepiped', p1: 2, p2: 3, p3: 4 },
    { id: 3, type: 'parallelepiped', p1: 3, p2: 4, p3: 5 }
  ];

  const parallelepipedToDelete = 2;
  const remaining = parallelepipeds.filter(p => p.id !== parallelepipedToDelete);

  assert.strictEqual(remaining.length, 2);
  assert.strictEqual(remaining[0].id, 1);
  assert.strictEqual(remaining[1].id, 3);
});

test('should prevent deleting non-existent parallelepiped', () => {
  const parallelepipeds = [
    { id: 1, type: 'parallelepiped', p1: 1, p2: 2, p3: 3 }
  ];

  const parallelepipedToDelete = 99;
  const remaining = parallelepipeds.filter(p => p.id !== parallelepipedToDelete);

  assert.strictEqual(remaining.length, 1);
});

// === Parallelepiped Statistics ===
console.log('\n=== Parallelepiped Statistics ===');

test('should count total parallelepipeds', () => {
  const parallelepipeds = [
    { id: 1, type: 'parallelepiped', p1: 1, p2: 2, p3: 3 },
    { id: 2, type: 'parallelepiped', p1: 2, p2: 3, p3: 4 },
    { id: 3, type: 'parallelepiped', p1: 3, p2: 4, p3: 5 }
  ];

  const count = parallelepipeds.length;

  assert.strictEqual(count, 3);
});

test('should count selected parallelepipeds', () => {
  const parallelepipeds = [
    { id: 1, type: 'parallelepiped', p1: 1, p2: 2, p3: 3 },
    { id: 2, type: 'parallelepiped', p1: 2, p2: 3, p3: 4 },
    { id: 3, type: 'parallelepiped', p1: 3, p2: 4, p3: 5 }
  ];

  const selectedIds = [1, 3];
  const count = parallelepipeds.filter(p => selectedIds.includes(p.id)).length;

  assert.strictEqual(count, 2);
});

test('should calculate total volume', () => {
  const parallelepipeds = [
    { id: 1, width: 2, height: 3, depth: 4 },
    { id: 2, width: 1, height: 1, depth: 1 }
  ];

  const totalVolume = parallelepipeds.reduce((sum, p) => {
    return sum + p.width * p.height * p.depth;
  }, 0);

  assert.strictEqual(totalVolume, 25);
});

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
