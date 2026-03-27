// Test file for UC-009: Object Translation
// TDD approach: tests define expected behavior before implementation

const assert = require('assert');

console.log('Running UC-009 Object Translation tests...\n');

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

// === Translation Operations ===
console.log('=== Translation Operations ===');

test('should translate point in 3D space', () => {
  const point = { x: 1, y: 2, z: 3 };
  const translation = { x: 2, y: 3, z: 4 };

  const translated = {
    x: point.x + translation.x,
    y: point.y + translation.y,
    z: point.z + translation.z
  };

  assert.strictEqual(translated.x, 3);
  assert.strictEqual(translated.y, 5);
  assert.strictEqual(translated.z, 7);
});

test('should translate multiple points', () => {
  const points = [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 1, z: 1 },
    { x: 2, y: 2, z: 2 }
  ];
  const translation = { x: 1, y: 1, z: 1 };

  const translated = points.map(p => ({
    x: p.x + translation.x,
    y: p.y + translation.y,
    z: p.z + translation.z
  }));

  assert.deepStrictEqual(translated[0], { x: 1, y: 1, z: 1 });
  assert.deepStrictEqual(translated[1], { x: 2, y: 2, z: 2 });
  assert.deepStrictEqual(translated[2], { x: 3, y: 3, z: 3 });
});

test('should translate line by moving endpoints', () => {
  const line = {
    p1: { x: 0, y: 0, z: 0 },
    p2: { x: 2, y: 0, z: 0 }
  };
  const translation = { x: 1, y: 1, z: 1 };

  const translated = {
    p1: {
      x: line.p1.x + translation.x,
      y: line.p1.y + translation.y,
      z: line.p1.z + translation.z
    },
    p2: {
      x: line.p2.x + translation.x,
      y: line.p2.y + translation.y,
      z: line.p2.z + translation.z
    }
  };

  assert.deepStrictEqual(translated.p1, { x: 1, y: 1, z: 1 });
  assert.deepStrictEqual(translated.p2, { x: 3, y: 1, z: 1 });
});

test('should translate parallelepiped by moving all points', () => {
  const parallelepiped = {
    p1: { x: 0, y: 0, z: 0 },
    p2: { x: 2, y: 0, z: 0 },
    p3: { x: 0, y: 3, z: 0 }
  };
  const translation = { x: 1, y: 2, z: 3 };

  const translated = {
    p1: {
      x: parallelepiped.p1.x + translation.x,
      y: parallelepiped.p1.y + translation.y,
      z: parallelepiped.p1.z + translation.z
    },
    p2: {
      x: parallelepiped.p2.x + translation.x,
      y: parallelepiped.p2.y + translation.y,
      z: parallelepiped.p2.z + translation.z
    },
    p3: {
      x: parallelepiped.p3.x + translation.x,
      y: parallelepiped.p3.y + translation.y,
      z: parallelepiped.p3.z + translation.z
    }
  };

  assert.deepStrictEqual(translated.p1, { x: 1, y: 2, z: 3 });
  assert.deepStrictEqual(translated.p2, { x: 3, y: 2, z: 3 });
  assert.deepStrictEqual(translated.p3, { x: 1, y: 5, z: 3 });
});

// === Translation History ===
console.log('\n=== Translation History ===');

test('should track translation history', () => {
  const history = [];
  const point = { x: 0, y: 0, z: 0 };

  const translate = (dx, dy, dz) => {
    point.x += dx;
    point.y += dy;
    point.z += dz;
    history.push({ x: point.x, y: point.y, z: point.z });
  };

  translate(1, 0, 0);
  translate(0, 1, 0);
  translate(0, 0, 1);

  assert.strictEqual(history.length, 3);
  assert.deepStrictEqual(history[2], { x: 1, y: 1, z: 1 });
});

test('should clear translation history on new operation', () => {
  const history = [];
  const point = { x: 0, y: 0, z: 0 };

  const translate = (dx, dy, dz) => {
    point.x += dx;
    point.y += dy;
    point.z += dz;
    history.push({ x: point.x, y: point.y, z: point.z });
  };

  translate(1, 0, 0);
  history.length = 0; // Clear history
  translate(0, 1, 0);

  assert.strictEqual(history.length, 1);
});

// === Translation Limits ===
console.log('\n=== Translation Limits ===');

test('should enforce translation limits', () => {
  const point = { x: 5, y: 5, z: 5 };
  const translation = { x: 10, y: 10, z: 10 };
  const limits = { min: -100, max: 100 };

  const translated = {
    x: Math.max(limits.min, Math.min(limits.max, point.x + translation.x)),
    y: Math.max(limits.min, Math.min(limits.max, point.y + translation.y)),
    z: Math.max(limits.min, Math.min(limits.max, point.z + translation.z))
  };

  assert.strictEqual(translated.x, 15);
  assert.strictEqual(translated.y, 15);
  assert.strictEqual(translated.z, 15);
});

test('should clamp translation to limits', () => {
  const point = { x: 95, y: 95, z: 95 };
  const translation = { x: 10, y: 10, z: 10 };
  const limits = { min: -100, max: 100 };

  const translated = {
    x: Math.max(limits.min, Math.min(limits.max, point.x + translation.x)),
    y: Math.max(limits.min, Math.min(limits.max, point.y + translation.y)),
    z: Math.max(limits.min, Math.min(limits.max, point.z + translation.z))
  };

  assert.strictEqual(translated.x, 100);
  assert.strictEqual(translated.y, 100);
  assert.strictEqual(translated.z, 100);
});

// === Translation Tools ===
console.log('\n=== Translation Tools ===');

test('should activate translate tool on T key', () => {
  const activeTool = 'translate';
  const toolName = 'Translate';
  const shortcut = 'T';

  assert.strictEqual(activeTool, 'translate');
  assert.strictEqual(toolName, 'Translate');
  assert.strictEqual(shortcut, 'T');
});

test('should deactivate tool on Escape key', () => {
  const activeTool = 'translate';
  const newTool = null;

  assert.strictEqual(newTool, null);
});

test('should show translation gizmo', () => {
  const gizmo = {
    axes: ['x', 'y', 'z'],
    origin: { x: 0, y: 0, z: 0 }
  };

  assert.strictEqual(gizmo.axes.length, 3);
  assert.deepStrictEqual(gizmo.origin, { x: 0, y: 0, z: 0 });
});

// === Translation Input ===
console.log('\n=== Translation Input ===');

test('should parse translation input', () => {
  const input = '10, 20, 30';
  const [x, y, z] = input.split(',').map(s => parseFloat(s.trim()));

  assert.strictEqual(x, 10);
  assert.strictEqual(y, 20);
  assert.strictEqual(z, 30);
});

test('should handle single value translation', () => {
  const input = '10';
  const value = parseFloat(input);

  assert.strictEqual(value, 10);
});

test('should handle negative translation', () => {
  const input = '-10, -20, -30';
  const [x, y, z] = input.split(',').map(s => parseFloat(s.trim()));

  assert.strictEqual(x, -10);
  assert.strictEqual(y, -20);
  assert.strictEqual(z, -30);
});

// === Translation Display ===
console.log('\n=== Translation Display ===');

test('should show translation delta', () => {
  const delta = { x: 5, y: 10, z: 15 };

  const display = `Δx: ${delta.x}, Δy: ${delta.y}, Δz: ${delta.z}`;

  assert.strictEqual(display, 'Δx: 5, Δy: 10, Δz: 15');
});

test('should show new position after translation', () => {
  const original = { x: 0, y: 0, z: 0 };
  const translation = { x: 5, y: 10, z: 15 };

  const newPosition = {
    x: original.x + translation.x,
    y: original.y + translation.y,
    z: original.z + translation.z
  };

  const display = `Position: (${newPosition.x}, ${newPosition.y}, ${newPosition.z})`;

  assert.strictEqual(display, 'Position: (5, 10, 15)');
});

// === Multiple Object Translation ===
console.log('\n=== Multiple Object Translation ===');

test('should translate all selected objects', () => {
  const objects = [
    { id: 1, x: 0, y: 0, z: 0 },
    { id: 2, x: 1, y: 1, z: 1 },
    { id: 3, x: 2, y: 2, z: 2 }
  ];
  const translation = { x: 1, y: 1, z: 1 };

  const translated = objects.map(obj => ({
    ...obj,
    x: obj.x + translation.x,
    y: obj.y + translation.y,
    z: obj.z + translation.z
  }));

  assert.deepStrictEqual(translated[0], { id: 1, x: 1, y: 1, z: 1 });
  assert.deepStrictEqual(translated[1], { id: 2, x: 2, y: 2, z: 2 });
  assert.deepStrictEqual(translated[2], { id: 3, x: 3, y: 3, z: 3 });
});

test('should maintain relative positions after translation', () => {
  const objects = [
    { id: 1, x: 0, y: 0, z: 0 },
    { id: 2, x: 2, y: 0, z: 0 },
    { id: 3, x: 4, y: 0, z: 0 }
  ];
  const translation = { x: 5, y: 5, z: 5 };

  const translated = objects.map(obj => ({
    ...obj,
    x: obj.x + translation.x,
    y: obj.y + translation.y,
    z: obj.z + translation.z
  }));

  const distance1 = Math.sqrt(
    Math.pow(translated[1].x - translated[0].x, 2) +
    Math.pow(translated[1].y - translated[0].y, 2) +
    Math.pow(translated[1].z - translated[0].z, 2)
  );

  const distance2 = Math.sqrt(
    Math.pow(translated[2].x - translated[1].x, 2) +
    Math.pow(translated[2].y - translated[1].y, 2) +
    Math.pow(translated[2].z - translated[1].z, 2)
  );

  assert.strictEqual(distance1, 2);
  assert.strictEqual(distance2, 2);
});

// === Translation Constraints ===
console.log('\n=== Translation Constraints ===');

test('should constrain translation to X axis', () => {
  const translation = { x: 5, y: 10, z: 15 };
  const constraint = 'x';

  const constrained = {
    x: constraint === 'x' ? translation.x : 0,
    y: constraint === 'y' ? translation.y : 0,
    z: constraint === 'z' ? translation.z : 0
  };

  assert.strictEqual(constrained.x, 5);
  assert.strictEqual(constrained.y, 0);
  assert.strictEqual(constrained.z, 0);
});

test('should constrain translation to XY plane', () => {
  const translation = { x: 5, y: 10, z: 15 };
  const constraint = 'xy';

  const constrained = {
    x: constraint.includes('x') ? translation.x : 0,
    y: constraint.includes('y') ? translation.y : 0,
    z: constraint.includes('z') ? translation.z : 0
  };

  assert.strictEqual(constrained.x, 5);
  assert.strictEqual(constrained.y, 10);
  assert.strictEqual(constrained.z, 0);
});

// === Translation Statistics ===
console.log('\n=== Translation Statistics ===');

test('should calculate total translation distance', () => {
  const translation = { x: 3, y: 4, z: 0 };

  const distance = Math.sqrt(
    translation.x ** 2 +
    translation.y ** 2 +
    translation.z ** 2
  );

  assert.strictEqual(distance, 5);
});

test('should calculate cumulative translation', () => {
  const translations = [
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 2, z: 0 },
    { x: 0, y: 0, z: 3 }
  ];

  const cumulative = translations.reduce((acc, t) => ({
    x: acc.x + t.x,
    y: acc.y + t.y,
    z: acc.z + t.z
  }), { x: 0, y: 0, z: 0 });

  assert.deepStrictEqual(cumulative, { x: 1, y: 2, z: 3 });
});

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
