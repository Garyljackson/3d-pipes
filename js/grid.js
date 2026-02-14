import { CONFIG } from './config.js';

/**
 * 3D occupancy grid. Tracks which cells in a size×size×size cube
 * are occupied by pipe segments.
 */
export class Grid {
  constructor(size) {
    this.size = size;
    this.cells = new Set();
  }

  /** Returns a string key for the given cell coordinates. */
  key(x, y, z) {
    return `${x},${y},${z}`;
  }

  /** Returns true if (x, y, z) is within grid bounds. */
  inBounds(x, y, z) {
    return x >= 0 && x < this.size
        && y >= 0 && y < this.size
        && z >= 0 && z < this.size;
  }

  /** Returns true if the cell at (x, y, z) is already occupied. */
  has(x, y, z) {
    return this.cells.has(this.key(x, y, z));
  }

  /** Marks the cell at (x, y, z) as occupied. */
  set(x, y, z) {
    this.cells.add(this.key(x, y, z));
  }

  /** Returns the fraction of the grid that is filled (0–1). */
  fillRatio() {
    return this.cells.size / (this.size ** 3);
  }

  /** Clears all occupied cells. */
  clear() {
    this.cells.clear();
  }

  /** Finds a random unoccupied cell, or null if none found after 300 attempts. */
  randomFreeCell() {
    for (let i = 0; i < 300; i++) {
      const x = Math.floor(Math.random() * this.size);
      const y = Math.floor(Math.random() * this.size);
      const z = Math.floor(Math.random() * this.size);
      if (!this.has(x, y, z)) return { x, y, z };
    }
    return null;
  }
}

/** Converts grid coordinates to world-space position (centered around origin). */
export function gridToWorld(x, y, z) {
  const offset = (CONFIG.gridSize * CONFIG.cellSize) / 2 - CONFIG.cellSize / 2;
  return new THREE.Vector3(
    x * CONFIG.cellSize - offset,
    y * CONFIG.cellSize - offset,
    z * CONFIG.cellSize - offset
  );
}
