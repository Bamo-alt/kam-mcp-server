import { MCPResource, ResourceContent } from "mcp-framework";

class KamDocResourceResource extends MCPResource {
  uri = "resource://kam-doc-resource";
  name = "Kam Documentation";
  description = "Kam Tools Usage Specifications";
  mimeType = "text/markdown";

  async read(): Promise<ResourceContent[]> {
    return [
      {
        uri: this.uri,
        mimeType: this.mimeType,
        text: MainDocumentation,
      },
    ];
  }
}

export default KamDocResourceResource;

const MainDocumentation = `
# KAM (Kujiale Architectural Modeling Tool)

> KAM is a BIM modeling tool similar to Revit, designed for rapid architectural floor plan modeling

## I. Core Requirements

- Single floor modeling only. Multi-floor modeling requests will be rejected with "not supported" message
- Paths support straight lines and arcs only. Provide start and end coordinates in format: { p0: (x0, y0, z0), p1: (x1, y1, z1), pm?: (x, y, z) }. The optional 'pm' specifies arc midpoint - if omitted, creates straight line

---

## II. Coordinate System Specification

### 1. Coordinate System Type

- Uses **Z-up right-handed coordinate system**

### 2. Axis Definitions

- **X/Y Plane**: Represents horizontal plane, controls planar positioning
- X-axis: Positive direction points outward (toward user), negative inward (away from user)
- Y-axis: Positive direction points right, negative points left
- **Z-axis**: Points vertically upward, controls height
- Z-axis positive direction is up, negative is down

### 3. Key Planes and Rotation Rules

- **World Origin**: (0,0,0)
- **Ground Reference Plane**: z=0 plane
- **Rotation Rules**:
- X-axis rotation: Object rotates left/right
- Y-axis rotation: Object tilts forward/backward
- Z-axis rotation: Object rotates in horizontal plane

### 4. Building Orientation Definitions

- **True North**: Positive Y-axis
- **True South**: Negative Y-axis
- **True East**: Positive X-axis
- **True West**: Negative X-axis

---

## III. Measurement Standards

### 1. Default Unit

- All dimensions use **millimeters (mm)** as default unit

### 2. Standard Size References

- **Door Height**: 2000mm
- **Interior Floor Height**: 2400-3000mm
- **Interior Clear Height**: 2200-2800mm
- **Interior Net Area**: 10-100 m²

### 3. Scale Requirements

- All imported models must match real-world scale
- Scale distortions (e.g., miniature houses) are prohibited
- Imported models require scale verification to ensure proper proportional relationships with other scene objects

---

## IV. Component Specifications

### 1. Walls and Beams

- Wall paths must be drawn along centerlines. Internal area calculations, closure checks, and overlap detection use path + half-thickness offset to form outline
- Same-type components automatically connect at endpoints with miter joints

### 2. Square and Round Columns

- Drawn at center point position, defaulting to ground level with coordinates (x, y, 0)
- Square columns specified by width and depth, round columns by radius

### 3. Custom-Shape Walls and Columns

- Custom-shape walls/columns support vertical extrusion only, using 2D closed paths
- Custom column/wall paths must form closed loops using polylines

### 4. Rooms

- Rooms cannot be drawn directly - they are automatically generated from enclosed areas bounded by walls, beams, and columns
- To create a Room, first create the enclosing Walls/Columns. Verify Room and Floor generation after each creation

### 5. Floor Slabs

- Floor slabs cannot be drawn directly - they are automatically generated from rooms
- To create a Floor, first generate corresponding Room per previous step. Floor auto-generates from Room boundary. Verify Floor creation after each step

### 6. Door Openings

- Door openings placed using center point coordinates (x, y, 0), valid only on walls
- Door opening thickness automatically calculated based on host wall thickness
`;
