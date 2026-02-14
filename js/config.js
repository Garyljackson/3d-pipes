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

/** Returns the four directions perpendicular to the given direction. */
export function perpendicularDirs(direction) {
  return DIRECTIONS.filter(v => Math.abs(v.dot(direction)) < 0.01);
}

/** Checks if two Vector3s are exactly equal. */
export function vectorEquals(a, b) {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}
