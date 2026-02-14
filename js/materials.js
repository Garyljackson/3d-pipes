/** Pipe material creation. */

const PIPE_HUES = [0.0, 0.07, 0.14, 0.33, 0.50, 0.58, 0.66, 0.75, 0.85, 0.92];

/** Creates a glossy, metallic material with a random pipe color. */
export function createPipeMaterial() {
  const hue = PIPE_HUES[Math.floor(Math.random() * PIPE_HUES.length)];
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(hue, 0.7 + Math.random() * 0.25, 0.42 + Math.random() * 0.2),
    metalness: 0.70,
    roughness: 0.20,
  });
}
