import { CONFIG } from './config.js';

const SPEED_PRESETS = [
  { label: 'Slow',      multiplier: 0.3 },
  { label: 'Normal',    multiplier: 1 },
  { label: 'Fast',      multiplier: 3 },
  { label: 'Ludicrous', multiplier: 8 },
];

/**
 * Wires up the UI buttons to simulation callbacks.
 * @param {Object} callbacks
 * @param {Function} callbacks.onRestart - Called when Restart is clicked
 */
export function setupUI({ onRestart }) {
  let speedIndex = 1;

  document.getElementById('btn-restart').onclick = onRestart;

  document.getElementById('btn-style').onclick = (e) => {
    CONFIG.jointStyle = CONFIG.jointStyle === 'elbow' ? 'ball' : 'elbow';
    e.target.textContent = `Style: ${CONFIG.jointStyle === 'elbow' ? 'Elbow' : 'Ball'}`;
  };

  document.getElementById('btn-speed').onclick = (e) => {
    speedIndex = (speedIndex + 1) % SPEED_PRESETS.length;
    CONFIG.speedMultiplier = SPEED_PRESETS[speedIndex].multiplier;
    e.target.textContent = `Speed: ${SPEED_PRESETS[speedIndex].label}`;
  };

  document.getElementById('btn-camera').onclick = (e) => {
    CONFIG.orbitCamera = !CONFIG.orbitCamera;
    e.target.textContent = `Orbit: ${CONFIG.orbitCamera ? 'On' : 'Off'}`;
  };
}
