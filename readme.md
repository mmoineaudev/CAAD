# Antenna Simulation Software Requirements Specification (Finalized)

## 1. General Overview
The software must function similarly to industry standards (e.g., CST, HFSS), enabling the creation and manipulation of 2D and 3D objects for electromagnetic simulation using a **Finite-Difference Time-Domain (FDTD)** solver exclusively.

### Launch & Project Management
*   **Execution:** Double-click executable to launch.
*   **Startup Window:** Offers project creation options.
*   **Project Structure:** A project is a directory containing all necessary files (3D models, simulation data) for a specific simulation instance.
*   **Configuration:** Upon creation, the user must define:
    *   **Frequency Range:** Minimum and Maximum frequencies between 1 MHz and 20 GHz.
    *   **Units:** 
        *   Dimensions: m, dm, cm, mm, µm.
        *   Frequencies: MHz, GHz.
        *   Other Physical Quantities: Default to SI units (V, A, Ω, etc.).

## 2. Material Properties
Objects must be defined by material characteristics dependent on frequency:
*   **Electric Permittivity ($\epsilon$):** Dielectric constant.
*   **Magnetic Permeability ($\mu$):** Magnetic property.
*   **Loss Tangent ($\tan \delta$):** Electrical loss tangent.

## 3. Simulation Capabilities (FDTD)
The tool must perform electromagnetic simulations accounting for all objects within the workspace using an FDTD engine.
*   **Outputs:** Return Loss, Efficiency, Electromagnetic Fields.
*   **Boundary Conditions:** 
    *   **Bounding Box:** Automatically generated based on a specific wavelength multiple (e.g., $10\lambda_{min}$) to ensure proper PML (Perfectly Matched Layer) placement. The box is invisible.
*   **Port Definition:** 
    *   Must support classical **Lumped Ports** and **Wave Ports**.
    *   Used to calculate Network Parameters (S, Y, Z) and field information.
    *   **Lumped Port Implementation:** Requires selection of two edges/conductors to define the voltage gap.

## 4. User Interface & Workflow
The main workspace window is divided into three sections:
1.  **Top Toolbar:** Horizontal banner containing clickable icons for tools. (Press `Esc` to deactivate active tools).
2.  **Central Viewport (70% of screen):** 
    *   Used for 3D object creation and manipulation.
    *   Displays X, Y, Z axes with an orthonormal reference frame in the bottom-right corner.
    *   **Interactivity:** Zoom/Unzoom via mouse; Pan/Rotate 3D space by holding left-click (reference frame moves accordingly).
3.  **Left Sidebar:** Vertical banner listing all 3D objects present in the simulation by name only.
    *   Selecting a name highlights the corresponding object in the viewport.
    *   Supports grouping of material/object names.

## 5. Interaction Tools
Tools are accessed via toolbar icons or keyboard shortcuts.

| Tool | Shortcut | Functionality |
| :--- | :---: | :--- |
| **Pick Point** | `P` | Selects any point in the simulation space.<br>• Selected points appear red; coordinates (X, Y, Z) display in a box at the bottom-left of the central window.<br>• Allows deselection of previously selected points.<br>• Multiple points can be selected.<br>• Object vertices are highlighted for easier selection.<br>• **Naming:** `pY` (Y = next available integer). |
| **Pick Edge** | `E` | Selects any edge of any 3D object.<br>• Selected edges appear red; **Start and End Vertex Coordinates** display in the bottom-left box.<br>• Allows deselection.<br>• Multiple edges can be selected. |
| **Create Line** | - | Creates a 2D segment object connecting two points selected via "Pick Point".<br>• Error triggered if more than two points are selected. |
| **Create Parallelepiped** | - | Traces a rectangle (2D) or parallelepiped (3D) using an extrusion workflow.<br>1. Click/Select initial point.<br>2. Drag mouse to preview size in the pre-selected plane (defines Face).<br>3. Left-click to confirm face dimensions.<br>**Case A:** Second click without moving mouse creates a 2D rectangle.<br>**Case B:** Moving mouse into non-selected planes extrudes the object to 3D (defines Depth/Volume).<br>• All 3D objects are solid (volume), not just faces. |
| **Create Bounding Box** | - | Creates an invisible bounding box based on user-defined min/max frequencies.<br>• Dimensions calculated as a specific wavelength multiple (e.g., $10\lambda_{min}$) for PML placement. |
| **Add Port** | - | Adds a simulation port (Lumped or Wave).<br>• Requires two edges to be pre-selected for Lumped Port connection. |
| **Translate Object** | `Ctrl+T` | Moves a selected object in 3D space.<br>• Requires the object and two points (via "Pick Point") to be selected.<br>• Displacement vector is defined by the two points based on **Internal ID** (`p1` < `p2`).<br>• Smallest ID = Start, Largest ID = End. |

## 6. Naming Conventions
*   **Objects:** Default name `objetX` (X = next available integer in ascending order).
*   **Selection:** Objects selectable via double-click on geometry or single-click on sidebar name.
*   **Points:** Named `pY` as defined above.

---

## Glossary of Terms
| Term | Definition |
| :--- | :--- |
| **FDTD** | Finite-Difference Time-Domain: A numerical analysis technique for solving Maxwell's equations in the time domain. |
| **PML** | Perfectly Matched Layer: An artificial absorbing boundary condition used to truncate simulation domains without reflection. |
| **Lumped Port** | A port type that excites a specific gap between conductors with a voltage source, typically used for microstrip or coaxial feeds. |
| **Wave Port** | A port type that calculates the modal fields of a waveguide cross-section to inject energy into the simulation. |
| **$\lambda_{min}$** | The wavelength corresponding to the maximum frequency ($f_{max}$) in the simulation range. |

---

## Technical Validation Notes
*   **Solver:** Confirmed as FDTD only. This dictates meshing strategies (Yee cell grid) and time-step constraints (Courant condition).
*   **Ports:** Standard Lumped/Wave ports implemented to ensure compatibility with standard antenna feed models, replacing the generic "2D connector" description.
*   **Geometry Workflow:** Parallelepiped creation follows a Face-then-Depth extrusion logic to allow precise control over 3D volume generation from 2D primitives.
*   **Translation Logic:** Vector calculation relies on internal Point IDs (`p1`, `p2`) rather than selection order to ensure deterministic behavior in scripts or macros.
