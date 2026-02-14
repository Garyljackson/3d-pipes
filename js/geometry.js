import { CONFIG } from './config.js';

/** Shared geometries (reused across all pipes, scaled per instance). */
export const sharedCylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 14);
export const sharedSphereGeo = new THREE.SphereGeometry(1, 14, 10);

/** Creates a cylinder mesh stretching from point `from` to point `to`. */
export function createCylinder(from, to, radius, material) {
  const mesh = new THREE.Mesh(sharedCylinderGeo, material);
  mesh.position.copy(from.clone().add(to).multiplyScalar(0.5));
  mesh.scale.set(radius, from.distanceTo(to), radius);

  const direction = new THREE.Vector3().subVectors(to, from).normalize();
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  return mesh;
}

/** Creates a sphere mesh at the given position. */
export function createSphere(position, radius, material) {
  const mesh = new THREE.Mesh(sharedSphereGeo, material);
  mesh.position.copy(position);
  mesh.scale.setScalar(radius);
  return mesh;
}

/**
 * Creates a quarter-circle elbow tube connecting two perpendicular directions.
 *
 * The pipe arrives at `position` traveling in `inDir` and leaves in `outDir`.
 * The arc spans from the entry face to the exit face of the cell.
 */
export function createElbow(position, inDir, outDir, material) {
  const half = CONFIG.cellSize / 2;

  // The arc center is at the corner where entry and exit faces meet
  const arcCenter = position.clone()
    .addScaledVector(inDir, -half)
    .addScaledVector(outDir, half);

  // Build quarter-circle sample points
  const sampleCount = 12;
  const points = [];
  for (let i = 0; i <= sampleCount; i++) {
    const angle = (i / sampleCount) * Math.PI / 2;
    points.push(
      arcCenter.clone()
        .addScaledVector(outDir, -half * Math.cos(angle))
        .addScaledVector(inDir, half * Math.sin(angle))
    );
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(curve, 12, CONFIG.pipeRadius, 12, false);
  return new THREE.Mesh(tubeGeo, material);
}
