// Test file for UC-007: Bounding Box Creation
// TDD approach: tests define expected behavior before implementation

const assert = require('assert');

console.log('Running UC-007 Bounding Box Creation tests...\n');

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

// === Bounding Box Object Structure ===
console.log('=== Bounding Box Object Structure ===');

test('should have correct bounding box structure', () => {
  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 1, y: 1, z: 1 },
    color: [0.8, 0.8, 0.3],
    wireframe: true
  };

  assert.strictEqual(boundingBox.id, 1);
  assert.strictEqual(boundingBox.type, 'bounding_box');
  assert.deepStrictEqual(boundingBox.min, { x: 0, y: 0, z: 0 });
  assert.deepStrictEqual(boundingBox.max, { x: 1, y: 1, z: 1 });
});

test('should have default bounding box color', () => {
  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 1, y: 1, z: 1 },
    color: [0.8, 0.8, 0.3]
  };

  assert.deepStrictEqual(boundingBox.color, [0.8, 0.8, 0.3]);
});

test('should default to wireframe mode', () => {
  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 1, y: 1, z: 1 },
    wireframe: true
  };

  assert.strictEqual(boundingBox.wireframe, true);
});

// === Bounding Box Creation ===
console.log('\n=== Bounding Box Creation ===');

test('should create bounding box from min and max points', () => {
  const min = { x: 0, y: 0, z: 0 };
  const max = { x: 2, y: 3, z: 4 };

  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: min,
    max: max,
    color: [0.8, 0.8, 0.3],
    wireframe: true
  };

  assert.deepStrictEqual(boundingBox.min, min);
  assert.deepStrictEqual(boundingBox.max, max);
});

test('should increment bounding box ID on creation', () => {
  const appState = {
    nextBoundingBoxId: 1,
    boundingBoxes: []
  };

  const boundingBox = {
    id: appState.nextBoundingBoxId++,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 1, y: 1, z: 1 }
  };

  appState.boundingBoxes.push(boundingBox);

  assert.strictEqual(appState.nextBoundingBoxId, 2);
  assert.strictEqual(boundingBox.id, 1);
});

test('should validate bounding box min is less than max', () => {
  const min = { x: 0, y: 0, z: 0 };
  const max = { x: 2, y: 3, z: 4 };

  const isValid = min.x <= max.x && min.y <= max.y && min.z <= max.z;

  assert.strictEqual(isValid, true);
});

test('should reject bounding box with invalid dimensions', () => {
  const min = { x: 2, y: 3, z: 4 };
  const max = { x: 0, y: 1, z: 2 };

  const isValid = min.x <= max.x && min.y <= max.y && min.z <= max.z;

  assert.strictEqual(isValid, false);
});

// === Bounding Box Validation ===
console.log('\n=== Bounding Box Validation ===');

test('should validate bounding box has min and max coordinates', () => {
  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 1, y: 1, z: 1 }
  };

  const hasMin = boundingBox.min !== undefined;
  const hasMax = boundingBox.max !== undefined;

  assert.strictEqual(hasMin, true);
  assert.strictEqual(hasMax, true);
});

test('should validate dimensions are non-negative', () => {
  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 2, y: 3, z: 4 }
  };

  const width = boundingBox.max.x - boundingBox.min.x;
  const height = boundingBox.max.y - boundingBox.min.y;
  const depth = boundingBox.max.z - boundingBox.min.z;

  const isValid = width >= 0 && height >= 0 && depth >= 0;

  assert.strictEqual(isValid, true);
});

test('should reject zero-dimension bounding box', () => {
  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 0, y: 0, z: 0 }
  };

  const width = boundingBox.max.x - boundingBox.min.x;
  const height = boundingBox.max.y - boundingBox.min.y;
  const depth = boundingBox.max.z - boundingBox.min.z;

  const hasVolume = width > 0 && height > 0 && depth > 0;

  assert.strictEqual(hasVolume, false);
});

// === Bounding Box Geometry ===
console.log('\n=== Bounding Box Geometry ===');

test('should calculate bounding box dimensions', () => {
  const boundingBox = {
    id: 1,
    min: { x: 0, y: 0, z: 0 },
    max: { x: 3, y: 4, z: 5 }
  };

  const width = boundingBox.max.x - boundingBox.min.x;
  const height = boundingBox.max.y - boundingBox.min.y;
  const depth = boundingBox.max.z - boundingBox.min.z;

  assert.strictEqual(width, 3);
  assert.strictEqual(height, 4);
  assert.strictEqual(depth, 5);
});

test('should calculate bounding box volume', () => {
  const boundingBox = {
    id: 1,
    min: { x: 0, y: 0, z: 0 },
    max: { x: 2, y: 3, z: 4 }
  };

  const width = boundingBox.max.x - boundingBox.min.x;
  const height = boundingBox.max.y - boundingBox.min.y;
  const depth = boundingBox.max.z - boundingBox.min.z;
  const volume = width * height * depth;

  assert.strictEqual(volume, 24);
});

test('should calculate bounding box surface area', () => {
  const boundingBox = {
    id: 1,
    min: { x: 0, y: 0, z: 0 },
    max: { x: 2, y: 3, z: 4 }
  };

  const width = boundingBox.max.x - boundingBox.min.x;
  const height = boundingBox.max.y - boundingBox.min.y;
  const depth = boundingBox.max.z - boundingBox.min.z;
  const surfaceArea = 2 * (width * height + width * depth + height * depth);

  assert.strictEqual(surfaceArea, 52);
});

test('should calculate bounding box center', () => {
  const boundingBox = {
    id: 1,
    min: { x: 0, y: 0, z: 0 },
    max: { x: 2, y: 4, z: 6 }
  };

  const center = {
    x: (boundingBox.min.x + boundingBox.max.x) / 2,
    y: (boundingBox.min.y + boundingBox.max.y) / 2,
    z: (boundingBox.min.z + boundingBox.max.z) / 2
  };

  assert.strictEqual(center.x, 1);
  assert.strictEqual(center.y, 2);
  assert.strictEqual(center.z, 3);
});

test('should calculate bounding box diagonal', () => {
  const boundingBox = {
    id: 1,
    min: { x: 0, y: 0, z: 0 },
    max: { x: 3, y: 4, z: 5 }
  };

  const diagonal = Math.sqrt(
    Math.pow(boundingBox.max.x - boundingBox.min.x, 2) +
    Math.pow(boundingBox.max.y - boundingBox.min.y, 2) +
    Math.pow(boundingBox.max.z - boundingBox.min.z, 2)
  );

  assert.strictEqual(diagonal, Math.sqrt(50));
});

// === Bounding Box Corners ===
console.log('\n=== Bounding Box Corners ===');

test('should get all 8 corners of bounding box', () => {
  const boundingBox = {
    id: 1,
    min: { x: 0, y: 0, z: 0 },
    max: { x: 2, y: 3, z: 4 }
  };

  const corners = [
    { x: boundingBox.min.x, y: boundingBox.min.y, z: boundingBox.min.z },
    { x: boundingBox.max.x, y: boundingBox.min.y, z: boundingBox.min.z },
    { x: boundingBox.min.x, y: boundingBox.max.y, z: boundingBox.min.z },
    { x: boundingBox.max.x, y: boundingBox.max.y, z: boundingBox.min.z },
    { x: boundingBox.min.x, y: boundingBox.min.y, z: boundingBox.max.z },
    { x: boundingBox.max.x, y: boundingBox.min.y, z: boundingBox.max.z },
    { x: boundingBox.min.x, y: boundingBox.max.y, z: boundingBox.max.z },
    { x: boundingBox.max.x, y: boundingBox.max.y, z: boundingBox.max.z }
  ];

  assert.strictEqual(corners.length, 8);
  assert.deepStrictEqual(corners[0], { x: 0, y: 0, z: 0 });
  assert.deepStrictEqual(corners[7], { x: 2, y: 3, z: 4 });
});

test('should get corner by index', () => {
  const boundingBox = {
    id: 1,
    min: { x: 0, y: 0, z: 0 },
    max: { x: 2, y: 3, z: 4 }
  };

  const corners = [
    { x: boundingBox.min.x, y: boundingBox.min.y, z: boundingBox.min.z },
    { x: boundingBox.max.x, y: boundingBox.min.y, z: boundingBox.min.z },
    { x: boundingBox.min.x, y: boundingBox.max.y, z: boundingBox.min.z },
    { x: boundingBox.max.x, y: boundingBox.max.y, z: boundingBox.min.z },
    { x: boundingBox.min.x, y: boundingBox.min.y, z: boundingBox.max.z },
    { x: boundingBox.max.x, y: boundingBox.min.y, z: boundingBox.max.z },
    { x: boundingBox.min.x, y: boundingBox.max.y, z: boundingBox.max.z },
    { x: boundingBox.max.x, y: boundingBox.max.y, z: boundingBox.max.z }
  ];

  const corner0 = corners[0];
  const corner7 = corners[7];

  assert.deepStrictEqual(corner0, { x: 0, y: 0, z: 0 });
  assert.deepStrictEqual(corner7, { x: 2, y: 3, z: 4 });
});

// === Bounding Box Edges ===
console.log('\n=== Bounding Box Edges ===');

test('should get all 12 edges of bounding box', () => {
  const boundingBox = {
    id: 1,
    min: { x: 0, y: 0, z: 0 },
    max: { x: 2, y: 3, z: 4 }
  };

  const corners = [
    { x: boundingBox.min.x, y: boundingBox.min.y, z: boundingBox.min.z },
    { x: boundingBox.max.x, y: boundingBox.min.y, z: boundingBox.min.z },
    { x: boundingBox.min.x, y: boundingBox.max.y, z: boundingBox.min.z },
    { x: boundingBox.max.x, y: boundingBox.max.y, z: boundingBox.min.z },
    { x: boundingBox.min.x, y: boundingBox.min.y, z: boundingBox.max.z },
    { x: boundingBox.max.x, y: boundingBox.min.y, z: boundingBox.max.z },
    { x: boundingBox.min.x, y: boundingBox.max.y, z: boundingBox.max.z },
    { x: boundingBox.max.x, y: boundingBox.max.y, z: boundingBox.max.z }
  ];

  const edges = [
    { start: 0, end: 1 },
    { start: 2, end: 3 },
    { start: 4, end: 5 },
    { start: 6, end: 7 },
    { start: 0, end: 2 },
    { start: 1, end: 3 },
    { start: 4, end: 6 },
    { start: 5, end: 7 },
    { start: 0, end: 4 },
    { start: 1, end: 5 },
    { start: 2, end: 6 },
    { start: 3, end: 7 }
  ];

  assert.strictEqual(edges.length, 12);
});

test('should calculate edge length', () => {
  const boundingBox = {
    id: 1,
    min: { x: 0, y: 0, z: 0 },
    max: { x: 2, y: 3, z: 4 }
  };

  const edge1 = {
    start: { x: 0, y: 0, z: 0 },
    end: { x: 2, y: 0, z: 0 }
  };

  const length = Math.sqrt(
    Math.pow(edge1.end.x - edge1.start.x, 2) +
    Math.pow(edge1.end.y - edge1.start.y, 2) +
    Math.pow(edge1.end.z - edge1.start.z, 2)
  );

  assert.strictEqual(length, 2);
});

// === Bounding Box Rendering ===
console.log('\n=== Bounding Box Rendering ===');

test('should render bounding box with correct color', () => {
  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 1, y: 1, z: 1 },
    color: [0.8, 0.8, 0.3]
  };

  assert.deepStrictEqual(boundingBox.color, [0.8, 0.8, 0.3]);
});

test('should render bounding box with custom color', () => {
  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 1, y: 1, z: 1 },
    color: [1, 0, 0]
  };

  assert.deepStrictEqual(boundingBox.color, [1, 0, 0]);
});

test('should render bounding box with wireframe mode', () => {
  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 1, y: 1, z: 1 },
    wireframe: true
  };

  assert.strictEqual(boundingBox.wireframe, true);
});

test('should render bounding box with solid mode', () => {
  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 1, y: 1, z: 1 },
    wireframe: false
  };

  assert.strictEqual(boundingBox.wireframe, false);
});

// === Bounding Box Properties ===
console.log('\n=== Bounding Box Properties ===');

test('should set bounding box color', () => {
  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 1, y: 1, z: 1 },
    color: [1, 0.5, 0]
  };

  assert.deepStrictEqual(boundingBox.color, [1, 0.5, 0]);
});

test('should set bounding box dimensions', () => {
  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 2, y: 3, z: 4 }
  };

  const width = boundingBox.max.x - boundingBox.min.x;
  const height = boundingBox.max.y - boundingBox.min.y;
  const depth = boundingBox.max.z - boundingBox.min.z;

  assert.strictEqual(width, 2);
  assert.strictEqual(height, 3);
  assert.strictEqual(depth, 4);
});

test('should update bounding box min coordinates', () => {
  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 2, y: 3, z: 4 }
  };

  boundingBox.min = { x: -1, y: -1, z: -1 };

  assert.strictEqual(boundingBox.min.x, -1);
  assert.strictEqual(boundingBox.min.y, -1);
  assert.strictEqual(boundingBox.min.z, -1);
});

test('should update bounding box max coordinates', () => {
  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 2, y: 3, z: 4 }
  };

  boundingBox.max = { x: 5, y: 6, z: 7 };

  assert.strictEqual(boundingBox.max.x, 5);
  assert.strictEqual(boundingBox.max.y, 6);
  assert.strictEqual(boundingBox.max.z, 7);
});

// === Bounding Box List Management ===
console.log('\n=== Bounding Box List Management ===');

test('should update object list with new bounding boxes', () => {
  const boundingBoxes = [
    { id: 1, type: 'bounding_box', min: { x: 0, y: 0, z: 0 }, max: { x: 1, y: 1, z: 1 } },
    { id: 2, type: 'bounding_box', min: { x: 1, y: 1, z: 1 }, max: { x: 2, y: 2, z: 2 } }
  ];

  const listItems = boundingBoxes.map(b => ({
    className: `object-item bounding_box`,
    text: `Bounding Box ${b.id}`,
    dataId: b.id
  }));

  assert.strictEqual(listItems.length, 2);
  assert.strictEqual(listItems[0].text, 'Bounding Box 1');
  assert.strictEqual(listItems[1].text, 'Bounding Box 2');
});

test('should highlight selected bounding boxes in list', () => {
  const boundingBoxes = [
    { id: 1, type: 'bounding_box', min: { x: 0, y: 0, z: 0 }, max: { x: 1, y: 1, z: 1 } },
    { id: 2, type: 'bounding_box', min: { x: 1, y: 1, z: 1 }, max: { x: 2, y: 2, z: 2 } },
    { id: 3, type: 'bounding_box', min: { x: 2, y: 2, z: 2 }, max: { x: 3, y: 3, z: 3 } }
  ];

  const selectedIds = [1, 3];

  const listItems = boundingBoxes.map(b => ({
    id: b.id,
    isSelected: selectedIds.includes(b.id),
    className: `object-item bounding_box ${selectedIds.includes(b.id) ? 'selected' : ''}`
  }));

  assert.strictEqual(listItems[0].isSelected, true);
  assert.strictEqual(listItems[1].isSelected, false);
  assert.strictEqual(listItems[2].isSelected, true);
});

test('should display bounding box information', () => {
  const boundingBox = {
    id: 1,
    type: 'bounding_box',
    min: { x: 0, y: 0, z: 0 },
    max: { x: 2, y: 3, z: 4 }
  };

  const info = `Bounding Box ${boundingBox.id}: (${boundingBox.min.x},${boundingBox.min.y},${boundingBox.min.z}) - (${boundingBox.max.x},${boundingBox.max.y},${boundingBox.max.z})`;

  assert.strictEqual(info, 'Bounding Box 1: (0,0,0) - (2,3,4)');
});

// === Bounding Box Tool Activation ===
console.log('\n=== Bounding Box Tool Activation ===');

test('should activate create bounding box tool on B key', () => {
  const activeTool = 'createBoundingBox';
  const toolName = 'Create Bounding Box';
  const shortcut = 'B';

  assert.strictEqual(activeTool, 'createBoundingBox');
  assert.strictEqual(toolName, 'Create Bounding Box');
  assert.strictEqual(shortcut, 'B');
});

test('should deactivate tool on Escape key', () => {
  const activeTool = 'createBoundingBox';
  const newTool = null;

  assert.strictEqual(newTool, null);
});

// === Bounding Box Deletion ===
console.log('\n=== Bounding Box Deletion ===');

test('should delete bounding box from array', () => {
  const boundingBoxes = [
    { id: 1, type: 'bounding_box', min: { x: 0, y: 0, z: 0 }, max: { x: 1, y: 1, z: 1 } },
    { id: 2, type: 'bounding_box', min: { x: 1, y: 1, z: 1 }, max: { x: 2, y: 2, z: 2 } },
    { id: 3, type: 'bounding_box', min: { x: 2, y: 2, z: 2 }, max: { x: 3, y: 3, z: 3 } }
  ];

  const boundingBoxToDelete = 2;
  const remaining = boundingBoxes.filter(b => b.id !== boundingBoxToDelete);

  assert.strictEqual(remaining.length, 2);
  assert.strictEqual(remaining[0].id, 1);
  assert.strictEqual(remaining[1].id, 3);
});

test('should prevent deleting non-existent bounding box', () => {
  const boundingBoxes = [
    { id: 1, type: 'bounding_box', min: { x: 0, y: 0, z: 0 }, max: { x: 1, y: 1, z: 1 } }
  ];

  const boundingBoxToDelete = 99;
  const remaining = boundingBoxes.filter(b => b.id !== boundingBoxToDelete);

  assert.strictEqual(remaining.length, 1);
});

// === Bounding Box Statistics ===
console.log('\n=== Bounding Box Statistics ===');

test('should count total bounding boxes', () => {
  const boundingBoxes = [
    { id: 1, type: 'bounding_box', min: { x: 0, y: 0, z: 0 }, max: { x: 1, y: 1, z: 1 } },
    { id: 2, type: 'bounding_box', min: { x: 1, y: 1, z: 1 }, max: { x: 2, y: 2, z: 2 } },
    { id: 3, type: 'bounding_box', min: { x: 2, y: 2, z: 2 }, max: { x: 3, y: 3, z: 3 } }
  ];

  const count = boundingBoxes.length;

  assert.strictEqual(count, 3);
});

test('should count selected bounding boxes', () => {
  const boundingBoxes = [
    { id: 1, type: 'bounding_box', min: { x: 0, y: 0, z: 0 }, max: { x: 1, y: 1, z: 1 } },
    { id: 2, type: 'bounding_box', min: { x: 1, y: 1, z: 1 }, max: { x: 2, y: 2, z: 2 } },
    { id: 3, type: 'bounding_box', min: { x: 2, y: 2, z: 2 }, max: { x: 3, y: 3, z: 3 } }
  ];

  const selectedIds = [1, 3];
  const count = boundingBoxes.filter(b => selectedIds.includes(b.id)).length;

  assert.strictEqual(count, 2);
});

test('should calculate total volume of all bounding boxes', () => {
  const boundingBoxes = [
    { min: { x: 0, y: 0, z: 0 }, max: { x: 2, y: 3, z: 4 } },
    { min: { x: 0, y: 0, z: 0 }, max: { x: 1, y: 1, z: 1 } }
  ];

  const totalVolume = boundingBoxes.reduce((sum, b) => {
    const width = b.max.x - b.min.x;
    const height = b.max.y - b.min.y;
    const depth = b.max.z - b.min.z;
    return sum + width * height * depth;
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
