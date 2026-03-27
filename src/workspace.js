// Renderer process - WebGL-based 3D rendering engine with interactive tool implementation

const logger = require('./src/logger');

// Main canvas
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('webgl2');

// Application state
const appState = {
  projectName: '',
  frequencyRange: [1, 20000], // MHz
  units: 'GHz',
  points: [], // Array of points {id, x, y, z}
  objects: [], // Array of objects
  currentProjectPath: null,
  historyStack: [],
  redoStack: [],
  nextPointId: 1,
  nextObjectId: 1
};

// Current tool
let activeTool = null;
let selectedPoints = [];
let selectedEdges = [];
let selectedObject = null;

// Camera state
let camera = {
  position: { x: 0, y: 0, z: 50 },
  target: { x: 0, y: 0, z: 0 },
  up: { x: 0, y: 1, z: 0 },
  distance: 50,
  azimuth: 45, // degrees
  elevation: 30 // degrees
};

// Mouse state
let mouse = { x: 0, y: 0, down: false, startX: 0, startY: 0 };

// Tool state
const toolState = {
  pickPoint: { selectedPoints: [], tempPoint: null },
  pickEdge: { selectedEdge: null },
  createLine: { startPoint: null, endPoints: [] },
  createParallel: { startPoint: null, facePoints: [], extrusionPoint: null },
  translate: { startPoint: null, endPoint: null }
};

// Initialize WebGL
function initWebGL() {
  logger.info('Initializing WebGL');
  
  if (!ctx) {
    logger.error('[workspace] ERROR: WebGL2 context not available!');
    return false;
  }
  
  // Set canvas size
  resizeCanvas();
  
  // Enable depth testing
  ctx.enable(ctx.DEPTH_TEST);
  ctx.depthFunc(ctx.LEQUAL);
  
  // Enable back-face culling
  ctx.enable(ctx.CULL_FACE);
  ctx.cullFace(ctx.BACK);
  
  logger.info('WebGL2 context initialized');
  return true;
}

// Resize canvas
function resizeCanvas() {
  const container = document.getElementById('canvas-container');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  
  if (ctx) {
    ctx.viewport(0, 0, canvas.width, canvas.height);
  }
}

// Project 3D point to 2D screen coordinates
function projectPoint(point) {
  const aspect = canvas.width / canvas.height;
  const fov = 45;
  const distance = camera.distance;
  
  // Calculate camera rotation matrices
  const radAzimuth = (camera.azimuth * Math.PI) / 180;
  const radElevation = (camera.elevation * Math.PI) / 180;
  
  // Simple orthographic projection for basic visualization
  const x = point.x;
  const y = point.y * Math.cos(radElevation) - point.z * Math.sin(radElevation);
  const z = point.y * Math.sin(radElevation) + point.z * Math.cos(radElevation);
  
  // Rotate around Y axis
  const x2 = x * Math.cos(radAzimuth) - z * Math.sin(radAzimuth);
  const z2 = x * Math.sin(radAzimuth) + z * Math.cos(radAzimuth);
  
  // Convert to screen coordinates
  const screenX = canvas.width / 2 + x2 * 10;
  const screenY = canvas.height / 2 - y * 10;
  
  return { x: screenX, y: screenY };
}

// Convert screen coordinates to 3D ray
function getRayFromMouse(screenX, screenY) {
  // Simple ray generation for point selection
  // In a real implementation, this would use proper ray-triangle intersection
  
  const zDepth = 0;
  
  // Calculate inverse transformation
  const radElevation = (camera.elevation * Math.PI) / 180;
  const radAzimuth = (camera.azimuth * Math.PI) / 180;
  
  const x = (screenX - canvas.width / 2) / 10;
  const y = (canvas.height / 2 - screenY) / 10;
  
  // Apply rotation
  const z = (y * Math.sin(radElevation) - zDepth * Math.cos(radElevation)) / Math.sin(radElevation);
  const xRot = x * Math.cos(radAzimuth) + z * Math.sin(radAzimuth);
  const zRot = -x * Math.sin(radAzimuth) + z * Math.cos(radAzimuth);
  
  return {
    origin: { x: 0, y: 0, z: 0 },
    direction: { x: xRot, y: 0, z: zRot }
  };
}

// Calculate distance between two points
function distance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Normalize vector
function normalize(v) {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  if (len === 0) return { x: 0, y: 0, z: 0 };
  return {
    x: v.x / len,
    y: v.y / len,
    z: v.z / len
  };
}

// Cross product of two vectors
function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

// Dot product of two vectors
function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

// Draw point
function drawPoint(point, color = [1, 0, 0], radius = 3) {
  const screen = projectPoint(point);
  
  ctx.beginPath();
  ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgb(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)})`;
  ctx.fill();
}

// Draw line between two points
function drawLine(p1, p2, color = [1, 0, 0]) {
  const s1 = projectPoint(p1);
  const s2 = projectPoint(p2);
  
  ctx.beginPath();
  ctx.moveTo(s1.x, s1.y);
  ctx.lineTo(s2.x, s2.y);
  ctx.strokeStyle = `rgb(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)})`;
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Draw grid
function drawGrid() {
  const gridSize = 20;
  const step = 5;
  
  ctx.beginPath();
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1;
  
  for (let i = -gridSize; i <= gridSize; i += step) {
    // X-axis lines
    drawLine({ x: i, y: -gridSize, z: 0 }, { x: i, y: gridSize, z: 0 }, [0.2, 0.2, 0.2]);
    
    // Z-axis lines
    drawLine({ x: -gridSize, y: 0, z: i }, { x: gridSize, y: 0, z: i }, [0.2, 0.2, 0.2]);
  }
}

// Render scene
function render() {
  if (!ctx) return;
  
  // Clear canvas
  ctx.clearColor(0.12, 0.12, 0.12, 1.0);
  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
  
  // Draw grid
  drawGrid();
  
  // Draw points
  appState.points.forEach(point => {
    const isSelected = selectedPoints.some(p => p.id === point.id);
    drawPoint(point, isSelected ? [1, 0, 0] : [0.5, 0.5, 1], 4);
  });
  
  // Draw lines
  appState.objects.forEach(obj => {
    if (obj.type === 'line' && obj.points.length >= 2) {
      const isSelected = selectedObject === obj;
      drawLine(obj.points[0], obj.points[1], isSelected ? [1, 1, 0] : [0.3, 0.6, 1]);
    }
  });
  
  // Update info panel
  updateInfoPanel();
}

// Update info panel
function updateInfoPanel() {
  document.getElementById('info-points').textContent = appState.points.length;
  document.getElementById('info-objects').textContent = appState.objects.length;
  document.getElementById('info-tool').textContent = activeTool || 'None';
}

// Update status bar
function updateStatusBar(point) {
  if (point) {
    document.getElementById('status-coords').textContent = 
      `Coordinates: ${point.x.toFixed(3)}, ${point.y.toFixed(3)}, ${point.z.toFixed(3)}`;
  } else {
    document.getElementById('status-coords').textContent = 'Coordinates: 0, 0, 0';
  }
}

// Update object list in sidebar
function updateObjectList() {
  const list = document.getElementById('object-list');
  list.innerHTML = '';
  
  // Add points first
  appState.points.forEach(point => {
    const item = document.createElement('div');
    item.className = `object-item point ${selectedPoints.some(p => p.id === point.id) ? 'selected' : ''}`;
    item.textContent = point.id;
    item.dataset.type = 'point';
    item.dataset.id = point.id;
    list.appendChild(item);
  });
  
  // Add objects
  appState.objects.forEach(obj => {
    const item = document.createElement('div');
    item.className = `object-item ${selectedObject === obj ? 'selected' : ''}`;
    item.textContent = `${obj.type}: ${obj.name || obj.id}`;
    item.dataset.type = 'object';
    item.dataset.id = obj.id;
    list.appendChild(item);
  });
}

// Handle viewport click
function handleViewportClick(e) {
  const rect = canvas.getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;
  
  // Get ray from mouse
  const ray = getRayFromMouse(screenX, screenY);
  
  // Handle tool-specific click logic
  if (activeTool === 'pickPoint') {
    handlePickPointClick(screenX, screenY);
  } else if (activeTool === 'pickEdge') {
    handlePickEdgeClick(screenX, screenY);
  } else if (activeTool === 'createLine') {
    handleCreateLineClick(screenX, screenY);
  } else if (activeTool === 'translate') {
    handleTranslateClick(screenX, screenY);
  }
  
  // Update status bar
  updateStatusBar({ x: ray.origin.x, y: ray.origin.y, z: ray.origin.z });
}

// Handle pick point click
function handlePickPointClick(screenX, screenY) {
  logger.info('Pick point click');
  
  // Create new point at clicked position (z = 0 for now)
  const point = {
    id: appState.nextPointId++,
    x: (screenX - canvas.width / 2) / 10,
    y: (canvas.height / 2 - screenY) / 10,
    z: 0
  };
  
  appState.points.push(point);
  selectedPoints.push(point);
  toolState.pickPoint.selectedPoints.push(point);
  
  updateObjectList();
  render();
}

// Handle pick edge click
function handlePickEdgeClick(screenX, screenY) {
  logger.info('Pick edge click');
  
  // For now, just select the first line object
  if (appState.objects.length > 0) {
    selectedEdges = appState.objects[0].edges || [];
    toolState.pickEdge.selectedEdge = selectedEdges[0];
  }
  
  updateObjectList();
  render();
}

// Handle create line click
function handleCreateLineClick(screenX, screenY) {
  logger.info('Create line click');
  
  // Get clicked point in 3D space
  const point = {
    id: appState.nextPointId++,
    x: (screenX - canvas.width / 2) / 10,
    y: (canvas.height / 2 - screenY) / 10,
    z: 0
  };
  
  selectedPoints.push(point);
  appState.points.push(point);
  
  if (selectedPoints.length === 2) {
    // Create line object
    const lineObj = {
      id: appState.nextObjectId++,
      type: 'line',
      name: `objet${appState.nextObjectId - 1}`,
      points: [...selectedPoints]
    };
    
    appState.objects.push(lineObj);
    selectedPoints = [];
    
    updateObjectList();
    render();
  } else {
    updateObjectList();
    render();
  }
}

// Handle translate click
function handleTranslateClick(screenX, screenY) {
  logger.info('Translate click');
  
  // Get clicked point in 3D space
  const point = {
    id: appState.nextPointId++,
    x: (screenX - canvas.width / 2) / 10,
    y: (canvas.height / 2 - screenY) / 10,
    z: 0
  };
  
  if (!toolState.translate.startPoint) {
    toolState.translate.startPoint = point;
  } else if (!toolState.translate.endPoint) {
    toolState.translate.endPoint = point;
    
    // Calculate displacement vector
    const displacement = {
      x: point.x - toolState.translate.startPoint.x,
      y: point.y - toolState.translate.startPoint.y,
      z: point.z - toolState.translate.startPoint.z
    };
    
    logger.info(`Displacement: ${displacement.x.toFixed(3)}, ${displacement.y.toFixed(3)}, ${displacement.z.toFixed(3)}`);
    
    // Apply displacement to selected object
    if (selectedObject) {
      selectedObject.points.forEach(p => {
        p.x += displacement.x;
        p.y += displacement.y;
        p.z += displacement.z;
      });
    }
    
    toolState.translate = { startPoint: null, endPoint: null };
    updateObjectList();
    render();
  }
}

// Handle mouse down
function handleMouseDown(e) {
  mouse.down = true;
  mouse.startX = e.clientX;
  mouse.startY = e.clientY;
}

// Handle mouse move
function handleMouseMove(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  
  // Handle camera rotation (right-click drag)
  if (e.buttons === 2) {
    const deltaX = e.clientX - mouse.startX;
    const deltaY = e.clientY - mouse.startY;
    
    camera.azimuth += deltaX * 0.5;
    camera.elevation = Math.max(-80, Math.min(80, camera.elevation - deltaY * 0.5));
    
    mouse.startX = e.clientX;
    mouse.startY = e.clientY;
    
    render();
  }
}

// Handle mouse up
function handleMouseUp(e) {
  mouse.down = false;
}

// Handle wheel
function handleWheel(e) {
  e.preventDefault();
  
  camera.distance += e.deltaY * 0.1;
  camera.distance = Math.max(5, Math.min(500, camera.distance));
  
  render();
}

// Handle keyboard
function handleKeyDown(e) {
  // Prevent default for some keys
  if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
  
  // Tool shortcuts
  switch (e.key.toLowerCase()) {
    case 'p':
      setActiveTool('pickPoint');
      break;
    case 'e':
      setActiveTool('pickEdge');
      break;
    case 'escape':
      deselectAll();
      break;
  }
  
  // Keyboard shortcuts
  switch (e.ctrlKey ? `Ctrl+${e.key.toLowerCase()}` : e.key) {
    case 'z':
      if (e.ctrlKey) {
        e.preventDefault();
        handleUndo();
      }
      break;
    case 'y':
      if (e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        handleRedo();
      }
      break;
    case 't':
      if (e.ctrlKey) {
        e.preventDefault();
        setActiveTool('translate');
      }
      break;
  }
}

// Set active tool
function setActiveTool(tool) {
  activeTool = tool;
  
  // Update UI
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const btnMap = {
    'pickPoint': 'btn-pick-point',
    'pickEdge': 'btn-pick-edge',
    'createLine': 'btn-create-line',
    'createParallel': 'btn-create-parallel',
    'createBbox': 'btn-create-bbox',
    'addPort': 'btn-add-port',
    'translate': 'btn-translate'
  };
  
  if (btnMap[tool]) {
    document.getElementById(btnMap[tool]).classList.add('active');
  }
  
  render();
}

// Deselect all
function deselectAll() {
  selectedPoints = [];
  selectedEdges = [];
  selectedObject = null;
  activeTool = null;
  
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  updateObjectList();
  render();
}

// Handle undo
function handleUndo() {
  logger.info('Undo requested');
  window.electronAPI?.undo();
}

// Handle redo
function handleRedo() {
  logger.info('Redo requested');
  window.electronAPI?.redo();
}

// IPC event handlers
function setupIPC() {
  window.electronAPI = {
    newProject: () => {
      logger.info('New project received');
      appState.points = [];
      appState.objects = [];
      appState.nextPointId = 1;
      appState.nextObjectId = 1;
      selectedPoints = [];
      selectedObject = null;
      updateObjectList();
      render();
    },
    
    loadProject: (data) => {
      logger.info('Project loaded');
      appState.points = data.points || [];
      appState.objects = data.objects || [];
      appState.nextPointId = Math.max(...appState.points.map(p => p.id), 0) + 1;
      appState.nextObjectId = Math.max(...appState.objects.map(o => o.id), 0) + 1;
      updateObjectList();
      render();
    },
    
    stateRestored: (data) => {
      logger.info('State restored');
      appState.points = data.points || [];
      appState.objects = data.objects || [];
      updateObjectList();
      render();
    },
    
    undo: () => handleUndo(),
    redo: () => handleRedo()
  };
  
  // Listen for IPC events
  document.addEventListener('new-project-loaded', window.electronAPI.newProject);
  document.addEventListener('project-loaded', window.electronAPI.loadProject);
  document.addEventListener('state-restored', window.electronAPI.stateRestored);
}

// Setup event listeners
function setupEventListeners() {
  // Canvas events
  canvas.addEventListener('click', handleViewportClick);
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('wheel', handleWheel);
  
  // Keyboard events
  window.addEventListener('keydown', handleKeyDown);
  
  // Window resize
  window.addEventListener('resize', () => {
    resizeCanvas();
    render();
  });
  
  // Toolbar buttons
  document.getElementById('btn-pick-point').addEventListener('click', () => setActiveTool('pickPoint'));
  document.getElementById('btn-pick-edge').addEventListener('click', () => setActiveTool('pickEdge'));
  document.getElementById('btn-create-line').addEventListener('click', () => setActiveTool('createLine'));
  document.getElementById('btn-translate').addEventListener('click', () => setActiveTool('translate'));
  document.getElementById('btn-undo').addEventListener('click', handleUndo);
  document.getElementById('btn-redo').addEventListener('click', handleRedo);
  document.getElementById('btn-new').addEventListener('click', () => window.electronAPI?.newProject?.());
  document.getElementById('btn-save').addEventListener('click', () => {
    const projectData = {
      projectName: appState.projectName,
      frequencyRange: appState.frequencyRange,
      units: appState.units,
      points: appState.points,
      objects: appState.objects
    };
    window.electronAPI?.saveProject(projectData);
  });
  document.getElementById('btn-load').addEventListener('click', () => window.electronAPI?.loadProject());
}

// Initialize application
function init() {
  logger.info('Initializing workspace');
  
  if (!initWebGL()) {
    logger.error('Failed to initialize WebGL');
    return;
  }
  
  setupIPC();
  setupEventListeners();
  
  // Initial render
  render();
  
  logger.info('Workspace initialized');
}

// Start application
init();
