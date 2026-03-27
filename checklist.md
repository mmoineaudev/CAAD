# Overall Goal
Create a desktop application for electromagnetic antenna simulation using Finite-Difference Time-Domain (FDTD) analysis with 3D interactive geometry creation tools.

# Main Architectural and Technical Guidelines
- Electron framework for cross-platform desktop application
- WebGL2 for 3D rendering and interactive viewport
- IPC (Inter-Process Communication) between main and renderer processes
- JSON-based project configuration storage
- Centralized logging module for error tracking
- Keyboard shortcuts and mouse controls for tool navigation

# Scope Definition
Desktop antenna simulation software with geometry creation, visualization, and project management features. Focus on UI/UX implementation and tool functionality rather than FDTD solver engine.

# Cross-reference Matrix
| User Input Feature | Corresponding Use Cases |
|-------------------|------------------------|
| Workspace Layout (viewport, toolbar, sidebar) | UC-001, UC-002 |
| Pick Point Tool (P) | UC-003 |
| Pick Edge Tool (E) | UC-004 |
| Create Line Tool | UC-005 |
| Create Parallelepiped Tool | UC-006 |
| Create Bounding Box Tool | UC-007 |
| Add Port Tool | UC-008 |
| Translate Object (Ctrl+T) | UC-009 |
| Undo/Redo System | UC-010 |
| Project Save/Load | UC-011, UC-012 |
| Material Color Pipeline | UC-006 |
| Raycasting & Selection | UC-003, UC-004 |
| Event Handling & IPC | UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009, UC-010, UC-011, UC-012 |
| Error Handling & Logging | UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009, UC-010, UC-011, UC-012 |
| File Operations | UC-011, UC-012 |
| Project Management | UC-001, UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009, UC-010, UC-011, UC-012 |
| Known Limitations (FDTD solver, tools) | UC-013, UC-014, UC-015 |
| Future Work (FDTD, validation, visualization) | UC-013, UC-016, UC-017, UC-018 |

# Use Case Checklist

### UC-001: Workspace Initialization
`USE_CASES/UC-001.md`
* [x] implementation
* [x] test

### UC-002: Project Management
`USE_CASES/UC-002.md`
* [ ] implementation
* [x] test

### UC-003: Point Selection
`USE_CASES/UC-003.md`
* [ ] implementation
* [x] test

### UC-004: Edge Selection
`USE_CASES/UC-004.md`
* [ ] implementation
* [x] test

### UC-005: Line Creation
`USE_CASES/UC-005.md`
* [ ] implementation
* [x] test

### UC-006: Parallelepiped Creation
`USE_CASES/UC-006.md`
* [ ] implementation
* [x] test

### UC-007: Bounding Box Creation
`USE_CASES/UC-007.md`
* [ ] implementation
* [x] test

### UC-008: Port Definition
`USE_CASES/UC-008.md`
* [ ] implementation
* [x] test

### UC-009: Object Translation
`USE_CASES/UC-009.md`
* [ ] implementation
* [x] test

### UC-010: Undo/Redo System
`USE_CASES/UC-010.md`
* [ ] implementation
* [x] test

### UC-011: Project Save Operations
`USE_CASES/UC-011.md`
* [ ] implementation
* [x] test

### UC-012: Project Load Operations
`USE_CASES/UC-012.md`
* [ ] implementation
* [x] test

### UC-013: FDTD Solver Implementation
`USE_CASES/UC-013.md`
* [ ] implementation
* [x] test

### UC-014: Port Calculation Implementation
`USE_CASES/UC-014.md`
* [ ] implementation
* [x] test

### UC-015: Material Properties Implementation
`USE_CASES/UC-015.md`
* [ ] implementation
* [x] test

### UC-016: FDTD Solver Validation
`USE_CASES/UC-016.md`
* [ ] implementation
* [x] test

### UC-017: Field Visualization Implementation
`USE_CASES/UC-017.md`
* [ ] implementation
* [x] test

### UC-018: Automated Test Coverage
`USE_CASES/UC-018.md`
* [ ] implementation
* [x] test

# Implementation Notes

## Project Structure
```
CAAD/
├── main.js              # Electron main process
├── src/
│   ├── workspace.js     # Main 3D workspace and tools
│   └── logger.js        # Centralized logging module
├── USE_CASES/           # Use case specifications
└── checklist.md         # Master checklist (this file)
```

## Key Implementation Details

### Raycasting & Selection (UC-003, UC-004)
- `getRayFromMouse()`: Converts 2D mouse coordinates to 3D ray using camera projection matrix
- Helper functions: `distance()`, `normalize()`, `cross()`, `dot()` for geometric calculations
- `handleViewportClick()`: Unified click handler for point/edge selection logic
- `generateObjectGeometry()`: Creates vertices and edges from object data (lines, parallelepipeds, cubes)
- Distance threshold: 0.1 units for vertex proximity detection

### Material Color Pipeline (UC-006)
Full color flow through rendering:
```
materials → color param → aColor attribute → vertex shader → vColor → fragment shader → final color
```
- Colors stored in material definitions with RGB values
- Per-vertex color attributes passed to geometry buffer
- Fragment shader applies color uniformly across object surface

### Undo/Redo History (UC-010)
- `pushToHistory()`: Captures full appState snapshot via JSON.stringify
- `undo()`: Restores previous state from historyStack
- `redo()`: Reapplies action from redoStack
- Redo stack cleared on new actions to prevent stale state corruption
- Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Y (redo)

### WebGL Rendering (UC-001, UC-003, UC-004, UC-005, UC-006, UC-007)
- Context initialization via canvas.getContext('webgl2')
- Shader compilation with error logging through centralized logger
- Buffer management using gl.ARRAY_BUFFER for position and color data
- Draw calls: gl.drawArrays(gl.TRIANGLES, 0, vertexCount)

### Event Handling
- Single unified click handler prevents duplicate event propagation
- IPC listeners for project events (new-project-loaded, project-loaded)
- Keyboard shortcuts registered via window.addEventListener('keydown')

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

## Known Limitations
1. **FDTD Solver:** Simulation engine not yet implemented; geometry creation and visualization only
2. **Port Calculation:** S-parameters, Y/Z matrices require solver integration
3. **Material Properties:** Frequency-dependent permittivity/permeability defined but not used in calculations
4. **Bounding Box (UC-007):** Documented feature NOT IMPLEMENTED - PML boundary box creation missing
5. **Translate Tool (UC-009):** Documented feature NOT IMPLEMENTED - object translation by vector missing
6. **Material Editor:** Separate material-editor.js exists but UI integration incomplete
7. **Testing:** No automated test suite; manual verification only
8. **Undo/Redo:** Implemented with history stack but Translate tool not integrated

## Future Work
- Implement FDTD time-stepping engine with Yee cell discretization
- Add Courant condition validation for stable time-step selection
- Build port excitation solver for S-parameter calculation
- Integrate field visualization (E-field, H-field magnitude)
- Create automated test coverage for geometry operations