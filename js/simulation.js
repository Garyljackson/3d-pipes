import { CONFIG } from './config.js';
import { scene, camera, renderer, handleResize } from './scene.js';
import { sharedCylinderGeo, sharedSphereGeo } from './geometry.js';
import { Grid } from './grid.js';
import { Pipe } from './pipe.js';
import { setupUI } from './ui.js';

// State
let grid = new Grid(CONFIG.gridSize);
let pipeGroup = new THREE.Group();
scene.add(pipeGroup);

let walkers = [];
let totalPipes = 0;
let totalSegments = 0;
let frame = 0;
let cameraAngle = 0;

/** Creates a new pipe walker and adds it to the scene. */
function spawn() {
  const pipe = new Pipe(grid, pipeGroup);
  if (pipe.alive) {
    walkers.push(pipe);
    totalPipes++;
  }
}

/** Removes all pipes and resets the grid. */
function clearAll() {
  scene.remove(pipeGroup);

  // Dispose dynamically-created geometries (elbow tubes), but keep shared ones
  pipeGroup.traverse(obj => {
    if (obj.geometry && obj.geometry !== sharedCylinderGeo && obj.geometry !== sharedSphereGeo) {
      obj.geometry.dispose();
    }
  });

  pipeGroup = new THREE.Group();
  scene.add(pipeGroup);
  grid.clear();
  walkers = [];
  totalPipes = 0;
  totalSegments = 0;
}

/** Main animation loop. */
function animate() {
  requestAnimationFrame(animate);
  frame++;

  // Advance pipes (multiple steps per frame at higher speeds)
  const steps = Math.max(1, Math.round(CONFIG.speedMultiplier));
  for (let s = 0; s < steps; s++) {
    let anyMoved = false;

    for (const walker of walkers) {
      if (walker.alive && walker.step()) {
        totalSegments++;
        anyMoved = true;
      }
    }

    // If no pipe moved, check whether to reset or spawn new pipes
    if (!anyMoved) {
      if (grid.fillRatio() >= CONFIG.fillThreshold) clearAll();
      const count = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) spawn();
    }

    // Randomly spawn extra pipes to maintain variety
    const aliveCount = walkers.filter(w => w.alive).length;
    if (aliveCount < CONFIG.maxPipes && Math.random() < CONFIG.extraSpawnChance) {
      spawn();
    }
  }

  // Orbit camera
  if (CONFIG.orbitCamera) {
    cameraAngle += CONFIG.orbitSpeed;
    camera.position.set(
      Math.cos(cameraAngle) * CONFIG.cameraRadius,
      18 + Math.sin(cameraAngle * 0.37) * 10,
      Math.sin(cameraAngle) * CONFIG.cameraRadius
    );
    camera.lookAt(0, 0, 0);
  }

  // Update stats HUD every 20 frames
  if (frame % 20 === 0) {
    document.getElementById('stat-pipes').textContent = `Pipes: ${totalPipes}`;
    document.getElementById('stat-segments').textContent = `Segments: ${totalSegments}`;
    document.getElementById('stat-fill').textContent = `Fill: ${(grid.fillRatio() * 100).toFixed(1)}%`;
  }

  renderer.render(scene, camera);
}

// --- Initialize ---
setupUI({
  onRestart: () => { clearAll(); spawn(); },
});

window.addEventListener('resize', handleResize);

spawn();
animate();
