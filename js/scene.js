/** Three.js scene, camera, renderer, and lighting. */

// Scene
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1e1e35);
scene.fog = new THREE.FogExp2(0x1e1e35, 0.004);

// Camera
export const camera = new THREE.PerspectiveCamera(
  50,
  innerWidth / innerHeight,
  0.1,
  250
);
camera.position.set(30, 24, 30);
camera.lookAt(0, 0, 0);

// Renderer
export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;
document.body.appendChild(renderer.domElement);

// Lighting
scene.add(new THREE.AmbientLight(0x555577, 1.2));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
keyLight.position.set(25, 35, 20);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x6688cc, 0.8);
fillLight.position.set(-20, 10, -15);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xff8866, 0.5);
rimLight.position.set(0, -10, 25);
scene.add(rimLight);

const backLight = new THREE.DirectionalLight(0xaaaadd, 0.6);
backLight.position.set(-10, 20, -25);
scene.add(backLight);

/** Updates camera and renderer when the window is resized. */
export function handleResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}
