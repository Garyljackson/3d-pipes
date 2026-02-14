# 3D Pipes Screensaver

A recreation of the classic Windows 3D Pipes screensaver using [Three.js](https://threejs.org/).

## Running

ES modules require serving over HTTP. Use any local server:

```bash
npx http-server -o /pipes.html
```

## Controls

Hover to reveal the control panel (bottom-left):

- **Restart** — Clear all pipes and start fresh
- **Style** — Toggle between smooth elbow joints and ball joints
- **Speed** — Cycle through Slow / Normal / Fast / Ludicrous
- **Orbit** — Toggle automatic camera rotation

## Project Structure

```
pipes.html        — HTML/CSS layout and script entry point
js/
  config.js       — Tunable parameters and direction constants
  scene.js        — Three.js scene, camera, renderer, lighting
  materials.js    — Pipe color/material creation
  grid.js         — 3D occupancy grid and coordinate conversion
  geometry.js     — Cylinder, sphere, and elbow mesh helpers
  pipe.js         — Pipe walker class (core simulation logic)
  simulation.js   — Spawn/clear/animate loop (main entry point)
  ui.js           — Button event handlers
```
