/** Tunable parameters for the simulation. */
export const CONFIG = {
  // Grid
  gridSize: 16,
  cellSize: 2.0,

  // Pipes
  pipeRadius: 0.30,
  maxPipes: 10,
  straightChance: 0.70,
  minSegments: 50,
  maxSegments: 210,

  // Joint appearance
  jointStyle: 'elbow',       // 'elbow' or 'ball'
  capScale: 1.15,            // start/end cap sphere size multiplier
  jointScale: 1.35,          // ball-joint sphere size multiplier
  seamScale: 1.01,           // seam-hiding sphere size multiplier

  // Simulation
  speedMultiplier: 1,
  fillThreshold: 0.42,       // reset when grid exceeds this fill fraction
  extraSpawnChance: 0.012,   // chance per step to spawn an extra pipe

  // Camera
  orbitCamera: true,
  cameraRadius: 38,
  orbitSpeed: 0.0015,
};

/** The six cardinal directions in 3D space. */
export const DIRECTIONS = [
  new THREE.Vector3( 1,  0,  0),
  new THREE.Vector3(-1,  0,  0),
  new THREE.Vector3( 0,  1,  0),
  new THREE.Vector3( 0, -1,  0),
  new THREE.Vector3( 0,  0,  1),
  new THREE.Vector3( 0,  0, -1),
];

/**
 * Returns the four directions perpendicular to the given direction.
 * In other words: "if I'm going this way, which ways can I turn?"
 *
 * Uses the dot product to test each candidate direction:
 *   1  = same way        → filtered out
 *  -1  = opposite way    → filtered out
 *   0  = sideways (turn) → kept
 *
 * Example — pipe going right (1,0,0):
 *   right  (1,0,0)  → dot = 1  → same way, skip
 *   left  (-1,0,0)  → dot = -1 → opposite, skip
 *   up     (0,1,0)  → dot = 0  → sideways, keep
 *   down   (0,-1,0) → dot = 0  → sideways, keep
 *   fwd    (0,0,1)  → dot = 0  → sideways, keep
 *   back   (0,0,-1) → dot = 0  → sideways, keep
 *   Result: [up, down, forward, backward]
 *
 * The 0.01 threshold (instead of === 0) is a safety margin for
 * floating-point rounding errors, where a dot product that should
 * be exactly 0 might come out as something like 0.0000000001.
 */
export function perpendicularDirs(direction) {
  return DIRECTIONS.filter(v => Math.abs(v.dot(direction)) < 0.01);
}

/** Checks if two Vector3s are exactly equal. */
export function vectorEquals(a, b) {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}
