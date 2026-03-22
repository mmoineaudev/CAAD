# Antenna CAD Module — Technical Analysis

## Executive Summary

This document outlines the architecture, technology decisions, and implementation strategy for a web-based CAD module designed for antenna design. The solution separates geometry creation from electromagnetic simulation, using a JSON-based exchange format.

---

## 1. Architecture Overview

### Module Separation Principle

**CAD Module** — Geometry creation, manipulation, visualization
- Runs locally in browser (React + Three.js)
- Reads/writes project.json
- No simulation capabilities

**Simulation Module** — Electromagnetic field solving
- Runs locally via Python (Meep/scikit-rf)
- Reads project.json from CAD
- Outputs field data and S-parameters
- Can be enhanced with other solvers later

```
┌─────────────────┐         JSON          ┌─────────────────┐
│                 │  ┌──────────────────►  │                 │
│   CAD Module    │                        │  Simulation     │
│   (Web/Three.js)│  ◄───────────────────  │  (Python)       │
│                 │         Mesh data      │                 │
└─────────────────┘                        └─────────────────┘
```

**Key Principle**: Single source of truth = project.json. Simulation reads it, CAD reads it back.

---

## 2. Technology Stack

### Frontend / CAD Interface
| Component | Technology | Rationale |
|-----------|------------|-----------|
| Framework | React + TypeScript | Type safety, component model |
| 3D Engine | Three.js (with @react-three/fiber) | WebGL rendering, mature ecosystem |
| State | Zustand | Minimal, no boilerplate |
| Build | Vite | Fast dev server, modern bundler |

### Backend / Simulation Interface
| Component | Technology | Rationale |
|-----------|------------|-----------|
| Language | Python 3.10+ | Existing antenna libraries |
| Solver | Meep (FDTD) | MIT open-source, well-documented |
| Analysis | scikit-rf | S-parameter processing, Smith charts |
| Interface | JSON file (no API needed) | Simple, versionable data |

### Data Pipeline
```
project.json     # CAD definition (text, human-readable)
project_mesh.h5  # Simulation mesh (optional, binary, efficient)
project_results.h5  # Simulation outputs (binary, efficient)
```

### Local Storage
```
project.json     # CAD definition
project_mesh.h5  # Simulation mesh (optional)
project_results.h5  # Simulation outputs
```

---

## 3. File Format Design — project.json

### Complete Schema Structure

```json
{
  "project": {
    "name": "antenna_patch_01",
    "created": "2026-03-25T12:00:00Z",
    "last_modified": "2026-03-25T14:30:00Z",
    "version": "1.0"
  },
  "units": {
    "length": "mm",
    "frequency": "GHz",
    "temperature": "K"
  },
  "precision": {
    "geometry_tolerance": 0.001,
    "mesh_wavelength_ratio": 20,
    "solver_tolerance": 1e-6
  },
  "global_settings": {
    "background_material": "free_space",
    "simulation_boundaries": "PML"
  },
  "materials": [
    {
      "id": "mat_copper",
      "name": "Copper",
      "type": "conductor",
      "relative_permittivity": 1.0,
      "relative_permeability": 1.0,
      "conductivity": 59600000,
      "frequency_dependent": false,
      "metadata": {
        "source": "internal",
        "standard": "IEEE"
      }
    },
    {
      "id": "mat_free_space",
      "name": "Free Space",
      "type": "free_space",
      "relative_permittivity": 1.0,
      "relative_permeability": 1.0,
      "loss_tangent": 0.0
    }
  ],
  "elements": [
    {
      "id": "elem_001",
      "type": "rectangular_prism",
      "name": "patch_conductor",
      "material_id": "mat_copper",
      "layer": "top",
      "transform": {
        "position": { "x": 0.0, "y": 0.0, "z": 0.0 },
        "rotation": { "x": 0.0, "y": 0.0, "z": 0.0 },
        "scale": { "x": 1.0, "y": 1.0, "z": 1.0 }
      },
      "dimensions": { "x": 10.0, "y": 10.0, "z": 0.035 },
      "metadata": {
        "custom_property": "value"
      }
    }
  ],
  "simulation_setup": {
    "frequency_range": {
      "start": 2.4,
      "end": 2.5,
      "unit": "GHz"
    },
    "ports": [
      {
        "id": "port_001",
        "element_id": "elem_001",
        "type": "waveguide",
        "orientation": "z"
      }
    ],
    "monitors": [
      {
        "type": "far_field",
        "frequency": 2.45,
        "spherical": true
      }
    ]
  }
}
```

### Supported Element Types
- `rectangular_prism` — Box shapes (patches, substrates)
- `cylinder` — Rods, vias, probes
- `sphere` — Spherical objects (rarely used)
- `cone` — Tapered elements
- `torus` — Ring antennas
- `extrusion` — Custom cross-section extruded along path
- `custom` — User-defined geometry (future)

### Supported Materials
- `conductor` — Has conductivity
- `dielectric` — Has relative_permittivity, loss_tangent
- `magnetic` — Has relative_permeability
- `free_space` — Vacuum/air baseline
- `custom` — User-defined properties

---

## 4. Component Structure (React + TypeScript)

### Application Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Menu Bar (File, Edit, View, Help)                              │
├──────────────────┬──────────────────────────────────────────────┤
│                  │                                              │
│  Scene Tree      │              3D Viewport                     │
│  (Hierarchy)     │              (Three.js Canvas)               │
│                  │                                              │
│  ────────────────┤              ─────────────────────────────   │
│                  │              ─────────────────────────────   │
│  Inspector Panel │              (OrbitControls)                 │
│                  │                                              │
├──────────────────┴──────────────────────────────────────────────┤
│  Status Bar (Units, Precision, Selection Info)                  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Tree

```
App
├── MainMenu
│   ├── FileMenu (New, Open, Save, SaveAs, Export)
│   ├── EditMenu (Undo, Redo, Cut, Copy, Paste)
│   └── ViewMenu (Reset View, Toggle Grid, Toggle Snap)
│
├── Workspace
│   ├── Toolbar
│   │   ├── ToolButton (Select, Box, Cylinder, Sphere, Extrude)
│   │   ├── UndoButton
│   │   ├── RedoButton
│   │   └── PrecisionDropdown (0.001mm, 0.01mm, 0.1mm, 1.0mm)
│   │
│   ├── Viewport
│   │   ├── ThreeScene
│   │   │   ├── OrbitControls
│   │   │   ├── GridHelper
│   │   │   ├── ElementRenderer
│   │   │   ├── SelectionHighlight
│   │   │   ├── TransformControls
│   │   │   └── GridSnapping
│   │   │
│   │   ├── Overlay
│   │   │   └── DimensionLabels (precision mode)
│   │   │
│   ├── LeftPanel
│   │   ├── SceneTree
│   │   │   ├── TreeNode (recursive)
│   │   │   └── TreeContextMenu
│   │   │
│   │   └── InspectorPanel
│   │       ├── PropertyGroup
│   │       │   ├── PositionInputs (x, y, z)
│   │       │   ├── DimensionInputs (x, y, z)
│   │       │   ├── MaterialSelector
│   │       │   └── CustomPropertyRow
│   │       └── ActionButtons (Apply, Cancel)
│   │
│   └── StatusBar
│       ├── ModeIndicator
│       ├── UnitDisplay
│       ├── PrecisionDisplay
│       ├── SelectionInfo
│       └── FPSCounter
│
└── StatusBar
```

### State Management (Zustand)

```typescript
interface ProjectStore {
  // State
  project: Project;
  selectedElementId: string | null;
  activeTool: 'select' | 'box' | 'cylinder' | 'sphere' | 'transform';
  precisionMode: number;
  history: {
    past: Project[];
    present: Project;
    future: Project[];
  };
  
  // Actions
  loadProject: (data: Project) => void;
  saveProject: () => Project;
  addElement: (element: ProjectElement) => void;
  updateElement: (id: string, updates: Partial<ProjectElement>) => void;
  deleteElement: (id: string) => void;
  setSelection: (id: string | null) => void;
  setTool: (tool: string) => void;
  setPrecision: (tolerance: number) => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Helpers
  getElement: (id: string) => ProjectElement | undefined;
  getMaterial: (id: string) => Material | undefined;
  generateId: () => string;
}
```

### Key Interaction Flows

**Creating an Element**
1. User clicks "Box" in toolbar → `state.tool.mode = "box"`
2. User clicks in viewport (raycast → 3D coordinate)
3. Box appears at click position with default dimensions
4. InspectorPanel shows new element's properties
5. User adjusts dimensions in Inspector
6. User clicks "Apply" or "Enter"
7. Element added to `state.project.elements`

**Transforming an Element**
1. User selects element in SceneTree or Viewport
2. `state.selection.elementId = "elem_001"`
3. TransformControls appears (arrows for X/Y/Z translation)
4. User drags arrow → element moves
5. `state.project.elements` updated in real-time
6. Viewport re-renders (Three.js auto)

**Undo/Redo**
1. Every element modification pushes current state to history.past
2. Present state becomes the new state
3. Future states cleared (new branch)
4. Undo: pop from past, push present to future
5. Redo: pop from future, push present to past

---

## 5. Feature List

### Core CAD Features (Phase 1)
- [x] Create basic shapes (box, cylinder, sphere)
- [x] Transform operations (move, rotate, scale)
- [x] Material assignment
- [x] Import/export JSON format
- [x] Scene hierarchy / grouping
- [x] Snap-to-grid
- [x] Measurement tools (distance, area, volume)
- [x] View manipulation (orbit, pan, zoom)
- [x] Precision mode toggle (visual vs exact)

### Simulation Integration Features (Phase 2)
- [ ] Auto-generate mesh from geometry
- [ ] Visualize mesh quality
- [ ] Run simulation (local)
- [ ] Import simulation results
- [ ] Visualize fields (E-field, H-field, S-parameters)
- [ ] Parametric sweeps (change dimension, re-run)

### UX Features (Phase 3+)
- [ ] Undo/redo
- [ ] Project versioning (git-like or snapshots)
- [ ] Templates (patch antenna, dipole, array)
- [ ] Unit converter
- [ ] Export to common formats (STL, STEP)

---

## 6. Implementation Strategy

### Phase 1: Minimum Viable CAD (2-3 months)
**Goal**: Thomas can build simple patch antennas
- Basic shape creation (box, cylinder)
- Transform operations (move, rotate)
- JSON import/export
- Basic material library
- Undo/redo implementation
- Thomas can design patches, save them

### Phase 2: Simulation Integration (3-4 months)
**Goal**: Thomas can run simple simulations
- Export to simulation-ready format
- Integrate with Meep (FDTD solver)
- Basic S-parameter visualization
- Thomas can simulate S11, VSWR

### Phase 3: Advanced Features (ongoing)
**Goal**: Production-ready tool
- Boolean operations (union, subtract)
- Parametric sweeps
- Better meshing
- Import/export standards (STEP, STL)

### Phase 4: Optimization (when needed)
**Goal**: Scale to complex designs
- Parallel simulation
- GPU acceleration
- Cloud offloading

---

## 7. Meep & scikit-rf Explained

### Meep (MIT Electromagnetic Engineering)

**What it is**: Open-source FDTD (Finite-Difference Time-Domain) electromagnetic field solver.

**What it does**: Simulates how electromagnetic waves propagate through materials and structures.

**Workflow**:
```python
import meep as mp

# Define geometry (rectangles, cylinders, etc.)
geometry = [mp.Cylinder(radius=5, material=mp.Metal, center=(0,0))]

# Set up simulation
sim = mp.Simulation(cell_size=..., geometry=...)

# Run
sim.run(until=100)

# Get results
E = sim.get_field_point(mp.Ez, (0,0,0))
```

**Pros**: Free, accurate, good documentation, active community
**Cons**: Requires understanding of FDTD (meshing, PML boundaries, Courant condition)

### scikit-rf (scikit-rf.org)

**What it is**: Python library for RF/microwave engineering and network analysis.

**What it does**: Works with S-parameters and network analysis.

**Workflow**:
```python
import skrf as rf

# Read S-parameter file from Meep
network = rf.Network('antenna_sim.s2p')

# Plot return loss
network.plot_s_db('1,1')  # S11

# Calculate VSWR
vswr = network.vswr

# Smith chart
network.plot_s_smith()
```

**Pros**: Industry-standard file formats, microwave engineering math built-in
**Cons**: Doesn't do simulation itself — works with simulation output

### How They Fit Together

```
CAD Module (Three.js) → Geometry → project.json
                              ↓
                    Meep (FDTD Solver) → Fields + S-parameters
                              ↓
                    scikit-rf (Analysis) → S11, VSWR, Smith Chart
```

---

## 8. Main Pitfalls to Avoid

### 1. Precision vs Performance Trade-off
**Problem**: User clicks on a point at 10^-9 mm precision, but WebGL float32 only has ~10^-6

**Solution**: Use double-precision internally for geometry, float32 for rendering

### 2. Coordinate System Confusion
**Problem**: Antenna design often uses different conventions than 3D graphics
- Physics: right-handed, z-up often
- Graphics: right-handed, z-forward (Three.js)

**Solution**: Pick one (recommend: z-up for physics consistency), document it

### 3. Mesh Generation Complexity
**Problem**: Tetrahedral meshing for FEM is hard. Finite-difference needs structured grids

**Solution**: Start with structured grids (FDTD), add FEM later. Use existing libraries

### 4. File Format Drift
**Problem**: JSON grows with features, becomes unparseable

**Solution**: Version the schema. Keep backward compatibility. Validate on load.

### 5. Floating Point Errors
**Problem**: Small errors accumulate in geometry operations

**Solution**: Use robust geometric kernels (CGAL, OpenCascade) if possible, or keep operations simple

### 6. Simulation Not Reflecting CAD Changes
**Problem**: User changes CAD, simulation runs on old mesh

**Solution**: Auto-mesh on every geometry change (with debouncing), show mesh preview

### 7. Over-engineering the UI
**Problem**: Building a full CAD UI from scratch is years of work

**Solution**: Use existing 3D editors (Three.js + custom), focus on antenna-specific features

---

## 9. What to Know About Building CAD Software

### Mathematical Foundation
- **Geometric modeling**: B-rep (boundary representation), CSG (constructive solid geometry)
- **Transforms**: 4x4 matrices, quaternions for rotation
- **Intersection tests**: Ray-triangle, sphere-box, etc.
- **Curve/surface representation**: NURBS (if you want parametric)

### Key Insight
**Building a CAD kernel from scratch is a multi-year project.** Don't do it. Use existing libraries or keep geometry simple.

### Existing Libraries to Study
```
CAD/Kernels:
- OpenCascade (C++) - robust, industrial-grade
- Three.js (JS) - rendering, not geometry kernel
- CGAL (C++) - computational geometry, very robust

Simulation:
- Meep (Python) - FDTD electromagnetic solver
- scikit-rf - RF/microwave engineering
- HFSS (Ansys) - commercial, has Python API
- CST Studio - commercial
```

---

## 10. Success Metrics

**Definition of Done (V1)**:
- Thomas can design a simple patch antenna
- Thomas can get S11 < -10 dB at 2.45 GHz in under 5 minutes total (design + simulate)
- Project files are version-controllable (JSON)
- No simulation time > 24 hours (goal: < 1 minute for simple designs)

---

## 11. Open Questions for Discussion with Thomas

### Simulation Requirements
1. What simulation method does Thomas use at work? (FDTD, FEM, MoM?)
2. What formats does Thomas currently use? (can we interop?)
3. What's the typical complexity of his designs? (20 elements = how many faces?)
4. What outputs matter most? (S-parameters, radiation pattern, impedance?)
5. What simulation time targets are realistic? (< 1 minute for simple designs?)
6. Does he need to import from other CAD tools?

### User Workflow
7. Does Thomas already have Meep installed at work? (can we point his workflow at our JSON files?)
8. What's the most common workflow? (design → simulate → iterate → finalize?)
9. Does he need batch processing? (parameter sweeps across many designs?)
10. Does he need to export to 3D printing formats (STL)?

### Technical Decisions
11. Do you need undo/redo at the JSON level?
12. Will simulation run locally (Python installed) or embedded (PyScript)?
13. Do you need offline capability (PWA)?
14. Version control integration (save to git)?

### Materials
15. Do you have Thomas's material list, or should we start with 3-5 common ones (copper, aluminum, FR4, air, Teflon)?
16. Should materials be editable in the CAD or via a separate Materials panel?

---

## 12. Next Steps Recommendation

1. **Week 1**: Thomas sends 3 real project files (whatever format he uses)
2. **Week 2**: Validate JSON schema with Thomas, confirm it covers his needs
3. **Week 3-4**: Basic Three.js viewer that loads JSON and shows shapes
4. **Week 5-8**: Add edit operations, save back to JSON
5. **Week 9-12**: Integrate Meep or similar for basic FDTD
6. **Week 13+**: Iterate with Thomas on real designs

---

## 13. Summary Recommendation

**Stack**: React + TypeScript + Three.js (CAD) + Python + Meep/scikit-rf (Simulation) + JSON/HDF5 (files)

**Key Decision**: Don't build a CAD kernel. Build a parametric antenna designer with basic 3D visualization.

**Biggest Risk**: Underestimating meshing complexity. Start with FDTD on structured grids.

**Success Metric**: Thomas can design a simple patch antenna and get S11 < -10 dB at 2.45 GHz in under 5 minutes total (design + simulate).

---

*Document version: 1.0*
*Created: 2026-03-25*
*Author: Development team*
