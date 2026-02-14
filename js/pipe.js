import { CONFIG, DIRECTIONS, perpendicularDirs, vectorEquals } from './config.js';
import { createPipeMaterial } from './materials.js';
import { gridToWorld } from './grid.js';
import { createCylinder, createSphere, createElbow } from './geometry.js';

/**
 * A pipe "walker" that traverses the grid one cell at a time,
 * building 3D geometry as it goes.
 *
 * Each grid cell gets exactly one piece of geometry:
 *   - Straight cell: a cylinder from entry face to exit face
 *   - Turning cell: an elbow arc (or ball joint) from entry face to exit face
 *
 * Adjacent cells share faces, so geometry connects seamlessly.
 */
export class Pipe {
  constructor(grid, group) {
    this.grid = grid;
    this.group = group;
    this.material = createPipeMaterial();
    this.alive = true;
    this.segmentCount = 0;
    this.maxSegments = CONFIG.minSegments
      + Math.floor(Math.random() * (CONFIG.maxSegments - CONFIG.minSegments));

    // Find a free cell to start in
    const startCell = grid.randomFreeCell();
    if (!startCell) {
      this.alive = false;
      return;
    }

    this.pos = startCell;
    grid.set(startCell.x, startCell.y, startCell.z);

    // Pick an initial direction, preferring one that leads to a free neighbor
    const shuffledDirs = DIRECTIONS.slice().sort(() => Math.random() - 0.5);
    this.dir = shuffledDirs[0].clone();
    for (const d of shuffledDirs) {
      const nx = startCell.x + d.x;
      const ny = startCell.y + d.y;
      const nz = startCell.z + d.z;
      if (grid.inBounds(nx, ny, nz) && !grid.has(nx, ny, nz)) {
        this.dir = d.clone();
        break;
      }
    }

    // Draw a start-cap sphere at the entry face
    const worldPos = gridToWorld(startCell.x, startCell.y, startCell.z);
    const half = CONFIG.cellSize / 2;
    const entryFace = worldPos.clone().addScaledVector(this.dir, -half);
    this.group.add(createSphere(entryFace, CONFIG.pipeRadius * CONFIG.capScale, this.material));
  }

  /**
   * Grows the pipe by one cell. Returns true if the pipe advanced,
   * or false if it terminated.
   */
  step() {
    if (!this.alive) return false;
    if (this.segmentCount >= this.maxSegments) { this._terminate(); return false; }

    const nextDir = this._pickDirection();
    if (!nextDir) { this._terminate(); return false; }

    const nextX = this.pos.x + nextDir.x;
    const nextY = this.pos.y + nextDir.y;
    const nextZ = this.pos.z + nextDir.z;

    const currentWorldPos = gridToWorld(this.pos.x, this.pos.y, this.pos.z);
    const half = CONFIG.cellSize / 2;
    const turned = !vectorEquals(nextDir, this.dir);

    // Draw geometry for the current cell based on entry direction (this.dir) and exit direction (nextDir).
    // Straight cells get a single cylinder; turning cells get an elbow or ball joint.
    const entryFace = currentWorldPos.clone().addScaledVector(this.dir, -half);
    const exitFace = currentWorldPos.clone().addScaledVector(nextDir, half);

    if (turned) {
      if (CONFIG.jointStyle === 'elbow') {
        this.group.add(createElbow(currentWorldPos, this.dir, nextDir, this.material));
      } else {
        // Ball joint: two half-cylinders with a sphere at center
        this.group.add(createCylinder(entryFace, currentWorldPos, CONFIG.pipeRadius, this.material));
        this.group.add(createSphere(currentWorldPos, CONFIG.pipeRadius * CONFIG.jointScale, this.material));
        this.group.add(createCylinder(currentWorldPos, exitFace, CONFIG.pipeRadius, this.material));
      }
    } else {
      // Straight: single cylinder from entry face to exit face
      this.group.add(createCylinder(entryFace, exitFace, CONFIG.pipeRadius, this.material));
    }

    // Seam-hiding sphere at exit face
    this.group.add(createSphere(exitFace, CONFIG.pipeRadius * CONFIG.seamScale, this.material));

    // Advance to the next cell
    this.pos = { x: nextX, y: nextY, z: nextZ };
    this.dir = nextDir.clone();
    this.grid.set(nextX, nextY, nextZ);
    this.segmentCount++;
    return true;
  }

  /**
   * Picks the next direction to travel. Prefers going straight (based on
   * straightChance), then perpendicular turns, never reverses.
   * Returns null if completely blocked.
   */
  _pickDirection() {
    const candidates = [];
    const reverse = this.dir.clone().negate();

    // Build priority order: straight-first or turn-first based on random chance
    if (Math.random() < CONFIG.straightChance) {
      candidates.push(this.dir, ...perpendicularDirs(this.dir).sort(() => Math.random() - 0.5));
    } else {
      candidates.push(...perpendicularDirs(this.dir).sort(() => Math.random() - 0.5), this.dir);
    }

    // Add any remaining non-reverse directions
    for (const d of DIRECTIONS) {
      if (!vectorEquals(d, reverse) && !candidates.some(c => vectorEquals(c, d))) {
        candidates.push(d);
      }
    }

    // Return the first direction that leads to a free, in-bounds cell
    for (const d of candidates) {
      const tx = this.pos.x + d.x;
      const ty = this.pos.y + d.y;
      const tz = this.pos.z + d.z;
      if (this.grid.inBounds(tx, ty, tz) && !this.grid.has(tx, ty, tz)) {
        return d.clone();
      }
    }
    return null;
  }

  /** Ends the pipe with a cap (half-cylinder from entry face to center + sphere). */
  _terminate() {
    this.alive = false;
    const worldPos = gridToWorld(this.pos.x, this.pos.y, this.pos.z);
    const half = CONFIG.cellSize / 2;
    const entryFace = worldPos.clone().addScaledVector(this.dir, -half);
    this.group.add(createCylinder(entryFace, worldPos, CONFIG.pipeRadius, this.material));
    this.group.add(createSphere(worldPos, CONFIG.pipeRadius * CONFIG.capScale, this.material));
  }
}
