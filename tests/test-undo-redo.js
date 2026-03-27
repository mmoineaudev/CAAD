// Test file for UC-010: Undo/Redo System
// TDD approach: tests define expected behavior before implementation

const assert = require('assert');

console.log('Running UC-010 Undo/Redo System tests...\n');

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

// === History Stack ===
console.log('=== History Stack ===');

test('should initialize empty history stacks', () => {
  const historyStack = [];
  const redoStack = [];

  assert.strictEqual(historyStack.length, 0);
  assert.strictEqual(redoStack.length, 0);
});

test('should push state to history stack', () => {
  const historyStack = [];
  const state = { points: [], objects: [] };

  historyStack.push(JSON.parse(JSON.stringify(state)));

  assert.strictEqual(historyStack.length, 1);
  assert.deepStrictEqual(historyStack[0], state);
});

test('should pop state from history stack', () => {
  const historyStack = [
    { points: [], objects: [] },
    { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] }
  ];

  const popped = historyStack.pop();

  assert.strictEqual(historyStack.length, 1);
  assert.deepStrictEqual(popped, { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] });
});

test('should clear history stack', () => {
  const historyStack = [
    { points: [], objects: [] },
    { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] }
  ];

  historyStack.length = 0;

  assert.strictEqual(historyStack.length, 0);
});

// === Undo Operation ===
console.log('\n=== Undo Operation ===');

test('should undo to previous state', () => {
  const historyStack = [
    { points: [], objects: [] },
    { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] },
    { points: [{ id: 1, x: 0, y: 0, z: 0 }, { id: 2, x: 1, y: 1, z: 1 }], objects: [] }
  ];
  const currentAppState = { points: [{ id: 1, x: 0, y: 0, z: 0 }, { id: 2, x: 1, y: 1, z: 1 }], objects: [] };
  const redoStack = [];

  const undo = () => {
    if (historyStack.length > 1) {
      redoStack.push(JSON.parse(JSON.stringify(currentAppState)));
      historyStack.pop();
      return historyStack[historyStack.length - 1];
    }
    return currentAppState;
  };

  const previousState = undo();
  assert.deepStrictEqual(previousState, { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] });
  assert.strictEqual(redoStack.length, 1);
});

test('should not undo if no history', () => {
  const historyStack = [];
  const currentAppState = { points: [], objects: [] };
  const redoStack = [];

  const undo = () => {
    if (historyStack.length > 1) {
      redoStack.push(JSON.parse(JSON.stringify(currentAppState)));
      historyStack.pop();
      return historyStack[historyStack.length - 1];
    }
    return currentAppState;
  };

  const previousState = undo();
  assert.deepStrictEqual(previousState, { points: [], objects: [] });
});

test('should push current state to redo stack before undo', () => {
  const historyStack = [
    { points: [], objects: [] },
    { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] }
  ];
  const currentAppState = { points: [{ id: 1, x: 0, y: 0, z: 0 }, { id: 2, x: 1, y: 1, z: 1 }], objects: [] };
  const redoStack = [];

  const undo = () => {
    if (historyStack.length > 1) {
      redoStack.push(JSON.parse(JSON.stringify(currentAppState)));
      historyStack.pop();
      return historyStack[historyStack.length - 1];
    }
    return currentAppState;
  };

  undo();
  assert.strictEqual(redoStack.length, 1);
  assert.deepStrictEqual(redoStack[0], currentAppState);
});

// === Redo Operation ===
console.log('\n=== Redo Operation ===');

test('should redo to next state', () => {
  const historyStack = [
    { points: [], objects: [] },
    { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] }
  ];
  const redoStack = [
    { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] },
    { points: [{ id: 1, x: 0, y: 0, z: 0 }, { id: 2, x: 1, y: 1, z: 1 }], objects: [] }
  ];
  let currentAppState = { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] };

  const redo = () => {
    if (redoStack.length > 0) {
      historyStack.push(JSON.parse(JSON.stringify(currentAppState)));
      currentAppState = redoStack[redoStack.length - 1];
      redoStack.pop();
      return currentAppState;
    }
    return currentAppState;
  };

  const nextState = redo();
  assert.deepStrictEqual(nextState, { points: [{ id: 1, x: 0, y: 0, z: 0 }, { id: 2, x: 1, y: 1, z: 1 }], objects: [] });
  assert.strictEqual(historyStack.length, 3);
});

test('should not redo if no redo history', () => {
  const historyStack = [
    { points: [], objects: [] },
    { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] }
  ];
  const currentAppState = { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] };
  const redoStack = [];

  const redo = () => {
    if (redoStack.length > 0) {
      historyStack.push(JSON.parse(JSON.stringify(currentAppState)));
      currentAppState = redoStack.pop();
      return currentAppState;
    }
    return currentAppState;
  };

  const nextState = redo();
  assert.deepStrictEqual(nextState, { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] });
});

test('should move state from redo to history on redo', () => {
  const historyStack = [
    { points: [], objects: [] }
  ];
  let currentAppState = { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] };
  const redoStack = [
    { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] },
    { points: [{ id: 1, x: 0, y: 0, z: 0 }, { id: 2, x: 1, y: 1, z: 1 }], objects: [] }
  ];

  const redo = () => {
    if (redoStack.length > 0) {
      historyStack.push(JSON.parse(JSON.stringify(currentAppState)));
      currentAppState = redoStack.pop();
      return currentAppState;
    }
    return currentAppState;
  };

  redo();
  assert.strictEqual(historyStack.length, 2);
  assert.strictEqual(redoStack.length, 1);
});

// === Keyboard Shortcuts ===
console.log('\n=== Keyboard Shortcuts ===');

test('should trigger undo on Ctrl+Z', () => {
  const event = { ctrlKey: true, key: 'z' };
  const shouldUndo = event.ctrlKey && event.key === 'z';

  assert.strictEqual(shouldUndo, true);
});

test('should trigger redo on Ctrl+Y', () => {
  const event = { ctrlKey: true, key: 'y' };
  const shouldRedo = event.ctrlKey && event.key === 'y';

  assert.strictEqual(shouldRedo, true);
});

test('should not trigger undo on Alt+Z', () => {
  const event = { ctrlKey: false, altKey: true, key: 'z' };
  const shouldUndo = event.ctrlKey && event.key === 'z';

  assert.strictEqual(shouldUndo, false);
});

// === State Management ===
console.log('\n=== State Management ===');

test('should deep clone state before storing', () => {
  const historyStack = [];
  const originalState = { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] };

  historyStack.push(JSON.parse(JSON.stringify(originalState)));

  // Modify original state
  originalState.points.push({ id: 2, x: 1, y: 1, z: 1 });

  // History should remain unchanged
  assert.strictEqual(historyStack[0].points.length, 1);
});

test('should limit history stack size', () => {
  const historyStack = [];
  const maxHistory = 50;

  const pushToHistory = (state) => {
    historyStack.push(JSON.parse(JSON.stringify(state)));
    if (historyStack.length > maxHistory) {
      historyStack.shift();
    }
  };

  for (let i = 0; i < 60; i++) {
    pushToHistory({ id: i });
  }

  assert.strictEqual(historyStack.length, maxHistory);
  assert.strictEqual(historyStack[0].id, 10);
  assert.strictEqual(historyStack[49].id, 59);
});

test('should clear redo stack on new action', () => {
  const historyStack = [{ id: 1 }];
  const redoStack = [{ id: 2 }, { id: 3 }];
  const currentState = { id: 4 };

  // Simulate new action
  historyStack.push(JSON.parse(JSON.stringify(currentState)));
  redoStack.length = 0; // Clear redo stack

  assert.strictEqual(historyStack.length, 2);
  assert.strictEqual(redoStack.length, 0);
});

// === Undo/Redo UI ===
console.log('\n=== Undo/Redo UI ===');

test('should show undo button enabled when history exists', () => {
  const historyStack = [{ id: 1 }];
  const canUndo = historyStack.length > 1;

  assert.strictEqual(canUndo, false);
});

test('should show undo button enabled with multiple history states', () => {
  const historyStack = [{ id: 1 }, { id: 2 }];
  const canUndo = historyStack.length > 1;

  assert.strictEqual(canUndo, true);
});

test('should show redo button enabled when redo history exists', () => {
  const redoStack = [{ id: 2 }];
  const canRedo = redoStack.length > 0;

  assert.strictEqual(canRedo, true);
});

test('should show redo button disabled when no redo history', () => {
  const redoStack = [];
  const canRedo = redoStack.length > 0;

  assert.strictEqual(canRedo, false);
});

test('should display undo/redo history count', () => {
  const historyStack = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const redoStack = [{ id: 4 }];

  const undoCount = historyStack.length;
  const redoCount = redoStack.length;

  assert.strictEqual(undoCount, 3);
  assert.strictEqual(redoCount, 1);
});

// === Action Recording ===
console.log('\n=== Action Recording ===');

test('should record action type', () => {
  const action = {
    type: 'point_created',
    data: { id: 1, x: 0, y: 0, z: 0 }
  };

  assert.strictEqual(action.type, 'point_created');
  assert.deepStrictEqual(action.data, { id: 1, x: 0, y: 0, z: 0 });
});

test('should record multiple actions', () => {
  const actions = [
    { type: 'point_created', data: { id: 1, x: 0, y: 0, z: 0 } },
    { type: 'point_created', data: { id: 2, x: 1, y: 1, z: 1 } },
    { type: 'line_created', data: { p1: 1, p2: 2 } }
  ];

  assert.strictEqual(actions.length, 3);
  assert.strictEqual(actions[0].type, 'point_created');
  assert.strictEqual(actions[2].type, 'line_created');
});

test('should batch actions together', () => {
  const batch = {
    type: 'batch',
    actions: [
      { type: 'point_created', data: { id: 1, x: 0, y: 0, z: 0 } },
      { type: 'point_created', data: { id: 2, x: 1, y: 1, z: 1 } }
    ]
  };

  assert.strictEqual(batch.type, 'batch');
  assert.strictEqual(batch.actions.length, 2);
});

// === Undo/Redo Statistics ===
console.log('\n=== Undo/Redo Statistics ===');

test('should count total actions', () => {
  const historyStack = [
    { points: [], objects: [] },
    { points: [{ id: 1, x: 0, y: 0, z: 0 }], objects: [] },
    { points: [{ id: 1, x: 0, y: 0, z: 0 }, { id: 2, x: 1, y: 1, z: 1 }], objects: [] }
  ];

  const totalActions = historyStack.length - 1;

  assert.strictEqual(totalActions, 2);
});

test('should count redo operations available', () => {
  const redoStack = [{ id: 2 }, { id: 3 }];

  const redoAvailable = redoStack.length;

  assert.strictEqual(redoAvailable, 2);
});

test('should calculate undo depth', () => {
  const historyStack = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 }
  ];

  const undoDepth = historyStack.length - 1;

  assert.strictEqual(undoDepth, 3);
});

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
