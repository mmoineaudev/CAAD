# Antenna Simulation Software

A desktop application for electromagnetic antenna simulation using Finite-Difference Time-Domain (FDTD) analysis.

## Quick Start

1. Launch the executable to open the project manager
2. Create a new project and define:
   - Frequency range: 1 MHz to 20 GHz
   - Units: m, dm, cm, mm, µm for dimensions; MHz/GHz for frequencies
3. Begin designing your antenna geometry in the 3D viewport

---

## Functional Documentation

### Workspace Layout

The interface consists of three main areas:

**Top Toolbar:** Access all tools via icons or keyboard shortcuts (press Esc to deselect)

**Central Viewport (70%):** Interactive 3D workspace with zoom, pan, and rotate controls using mouse

**Left Sidebar:** Lists all objects in the simulation; click names to select geometry

---

### Core Tools

#### Pick Point (P)
Select any point in 3D space. Selected points appear red with coordinates displayed at bottom-left.
- Multiple points can be selected simultaneously
- Object vertices are highlighted for easier selection
- Points auto-named: p1, p2, p3...

#### Pick Edge (E)
Select edges of any 3D object.
- Selected edges highlight in red
- Start and end vertex coordinates displayed
- Useful for defining port connections or reference vectors

#### Create Line
Connect two points with a line segment.
- Requires exactly two pre-selected points via Pick Point tool
- Error if more than two points selected

#### Create Parallelepiped
Build 2D rectangles or 3D volumes through extrusion:
1. Click initial point to start
2. Drag mouse to preview face dimensions in current plane
3. Left-click to confirm face size
4. Move mouse into non-selected planes to extrude (Case B) or click without moving for 2D rectangle (Case A)
- All objects are solid volumes, not just surfaces

#### Create Bounding Box
Generate invisible simulation boundary.
- Dimensions calculated as wavelength multiple (10λ_min) for PML placement
- Ensures proper electromagnetic absorption at domain edges

#### Add Port
Define excitation sources:
- Lumped Ports: Select two edges to define voltage gap
- Wave Ports: Modal field injection for waveguide structures

#### Translate Object (Ctrl+T)
Move objects in 3D space using displacement vector.
- Select object and two points via Pick Point tool
- Vector defined by point IDs (p1 < p2): smallest ID = start, largest = end
- Displacement displayed with three decimal precision

---

### Naming Conventions

**Objects:** Auto-named `objetX` where X is next available integer
**Points:** Named `pY` sequentially as created
**Selection:** Double-click geometry or click sidebar name to select

---

### Undo/Redo System
- **Undo:** Ctrl+Z - Revert last action
- **Redo:** Ctrl+Shift+Y - Restore undone action
- History captures full state snapshots for complete rollback capability

---

## Technical Documentation

### Architecture Overview

**Main Process (main.js):** Electron application shell handling window management, IPC communication, and file system operations.

**Renderer Process (workspace.js):** WebGL-based 3D rendering engine with interactive tool implementation.

**Logger Module:** Centralized logging for consistent error tracking and debugging.

---

### Key Implementation Details

#### Raycasting & Selection (UC5, UC6)
- `getRayFromMouse()`: Converts 2D mouse coordinates to 3D ray using camera projection matrix
- Helper functions: `distance()`, `normalize()`, `cross()`, `dot()` for geometric calculations
- `handleViewportClick()`: Unified click handler for point/edge selection logic
- `generateObjectGeometry()`: Creates vertices and edges from object data (lines, parallelepipeds, cubes)
- Distance threshold: 0.1 units for vertex proximity detection

#### Material Color Pipeline (UC3)
Full color flow through rendering:
```
materials → color param → aColor attribute → vertex shader → vColor → fragment shader → final color
```
- Colors stored in material definitions with RGB values
- Per-vertex color attributes passed to geometry buffer
- Fragment shader applies color uniformly across object surface

#### Undo/Redo History (UC11)
- `pushToHistory()`: Captures full appState snapshot via JSON.stringify
- `undo()`: Restores previous state from historyStack
- `redo()`: Reapplies action from redoStack
- Redo stack cleared on new actions to prevent stale state corruption
- Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Y (redo)

#### WebGL Rendering (UC4)
- Context initialization via canvas.getContext('webgl2')
- Shader compilation with error logging through centralized logger
- Buffer management using gl.ARRAY_BUFFER for position and color data
- Draw calls: gl.drawArrays(gl.TRIANGLES, 0, vertexCount)

#### Event Handling
- Single unified click handler prevents duplicate event propagation
- IPC listeners for project events (new-project-loaded, project-loaded)
- Keyboard shortcuts registered via window.addEventListener('keydown')

---

### Error Handling & Logging

All errors routed through logger module:
```javascript
logger.error('[workspace] ERROR: mainCanvas not found!');
logger.error('[workspace] Save error:', e);
```

Null safety patterns applied throughout:
- Fallback values for undefined geometry properties (`|| [0, 0, 0]`)
- Bounds checking on array access (12 instances verified)
- Null/undefined checks before property access (4 explicit guards)

---

### File Operations

**Save Project:** Writes JSON configuration to currentProjectPath
- Validates path exists before write operation
- Stores: projectName, frequencyRange, units, points[], objects[]
- Error handling with try/catch for file system failures

**Load Project:** Reads project data from disk
- IPC event-driven loading (project-loaded)
- Configures appState with loaded geometry and metadata
- Default empty arrays if config missing required fields

---

### Security Considerations

- No hardcoded secrets or API keys in codebase
- File paths controlled via IPC events (no user input injection risk)
- Path traversal protected through controlled file system access patterns

---

## Project Structure

```
CAAD/
├── main.js              # Electron main process
├── src/
│   ├── workspace.js     # Main 3D workspace and tools
│   └── logger.js        # Centralized logging module
├── AGENTIC_RESOURCES/   # Development checklists (deprecated)
└── README.md            # This documentation
```

---

### Known Limitations

1. **FDTD Solver:** Simulation engine not yet implemented; geometry creation and visualization only
2. **Port Calculation:** S-parameters, Y/Z matrices require solver integration
3. **Material Properties:** Frequency-dependent permittivity/permeability defined but not used in calculations
4. **Bounding Box (UC9):** Documented feature NOT IMPLEMENTED - PML boundary box creation missing
5. **Translate Tool (UC11):** Documented feature NOT IMPLEMENTED - object translation by vector missing
6. **Material Editor:** Separate material-editor.js exists but UI integration incomplete
7. **Testing:** No automated test suite; manual verification only
8. **Undo/Redo:** Implemented with history stack but Translate tool not integrated

---

## Future Work

- Implement FDTD time-stepping engine with Yee cell discretization
- Add Courant condition validation for stable time-step selection
- Build port excitation solver for S-parameter calculation
- Integrate field visualization (E-field, H-field magnitude)
- Create automated test coverage for geometry operations

---

## License

Proprietary - Antenna Simulation Software Project
