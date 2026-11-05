import * as THREE from 'three';

// Five point clouds the particles morph between, one per site section:
// 0 neural core · 1 DNA helix · 2 orbit rings · 3 data terrain · 4 galaxy
export const SHAPE_COUNT = 5;

export const SHAPE_COLORS: [string, string][] = [
  ['#5eead4', '#8b5cf6'],
  ['#a78bfa', '#f472b6'],
  ['#38bdf8', '#5eead4'],
  ['#22d3ee', '#818cf8'],
  ['#f472b6', '#fbbf24'],
];

/** Where each shape sits and how big it is (desktop / mobile). */
export const SHAPE_LAYOUT = {
  desktop: {
    offsets: [
      [2.15, 0.05, 0],
      [-2.5, 0, 0],
      [2.5, 0, -0.6],
      [0, -0.2, -1.2],
      [0, 0.1, 0],
    ],
    scales: [1, 1, 0.95, 1, 1.05],
  },
  mobile: {
    offsets: [
      [0, 1.1, -1.5],
      [0, 0, -2],
      [0, 0, -2],
      [0, -0.2, -2.5],
      [0, 0.4, -1.5],
    ],
    scales: [0.85, 0.8, 0.8, 0.8, 0.85],
  },
};

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rand = () => number;
const v = new THREE.Vector3();

function randomInSphere(r: Rand, radius: number) {
  const u = r() * 2 - 1;
  const theta = r() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  const rad = radius * Math.cbrt(r());
  return v.set(Math.cos(theta) * s * rad, u * rad, Math.sin(theta) * s * rad);
}

function neuralCore(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const shell = Math.floor(n * 0.7);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    if (i < shell) {
      const y = 1 - (i / (shell - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const R = 2.05 + (r() - 0.5) * 0.12;
      v.set(Math.cos(theta) * rad * R, y * R, Math.sin(theta) * rad * R);
    } else {
      // inner "neurons": denser towards the middle
      const dir = randomInSphere(r, 1).normalize();
      dir.multiplyScalar(0.35 + Math.pow(r(), 0.7) * 1.5);
    }
    v.toArray(out, i * 3);
  }
  return out;
}

function helix(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const H = 6.6;
  const turns = 2.4;
  const R = 1.05;
  const rungs = 30;
  const tilt = new THREE.Euler(0.15, 0, 0.42);
  for (let i = 0; i < n; i++) {
    const kind = r();
    if (kind < 0.78) {
      const t = r();
      const ang = t * turns * Math.PI * 2 + (kind < 0.39 ? 0 : Math.PI);
      const j = (r() - 0.5) * 0.16;
      v.set(Math.cos(ang) * (R + j), (t - 0.5) * H + (r() - 0.5) * 0.05, Math.sin(ang) * (R + j));
    } else {
      const k = Math.floor(r() * rungs) / rungs + 0.5 / rungs;
      const ang = k * turns * Math.PI * 2;
      const s = r() * 2 - 1;
      v.set(Math.cos(ang) * R * s, (k - 0.5) * H + (r() - 0.5) * 0.03, Math.sin(ang) * R * s);
    }
    v.applyEuler(tilt);
    v.toArray(out, i * 3);
  }
  return out;
}

function orbits(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const rings = [
    { R: 2.25, e: new THREE.Euler(1.2, 0.2, 0) },
    { R: 2.0, e: new THREE.Euler(0.3, 0.9, 0.6) },
    { R: 2.45, e: new THREE.Euler(-0.7, -0.5, 1.1) },
  ];
  for (let i = 0; i < n; i++) {
    if (r() < 0.14) {
      randomInSphere(r, 0.6);
    } else {
      const ring = rings[Math.floor(r() * rings.length)];
      const a = r() * Math.PI * 2;
      const j = (r() - 0.5) * 0.12;
      v.set(Math.cos(a) * (ring.R + j), (r() - 0.5) * 0.08, Math.sin(a) * (ring.R + j)).applyEuler(ring.e);
    }
    v.toArray(out, i * 3);
  }
  return out;
}

function terrain(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const side = Math.ceil(Math.sqrt(n));
  const size = 10;
  const tilt = new THREE.Euler(0.95, 0, 0);
  for (let i = 0; i < n; i++) {
    const gx = (i % side) / (side - 1) - 0.5;
    const gz = Math.floor(i / side) / (side - 1) - 0.5;
    const x = gx * size + (r() - 0.5) * 0.02;
    const z = gz * size + (r() - 0.5) * 0.02;
    const y =
      Math.sin(x * 0.8) * 0.35 +
      Math.cos(z * 1.1 + x * 0.35) * 0.35 +
      Math.sin((x + z) * 0.45) * 0.25;
    v.set(x, y, z).applyEuler(tilt);
    v.y -= 0.6;
    v.toArray(out, i * 3);
  }
  return out;
}

function galaxy(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const arms = 4;
  const tilt = new THREE.Euler(0.55, 0, 0.15);
  for (let i = 0; i < n; i++) {
    const radius = Math.pow(r(), 1.5) * 3.8 + 0.05;
    const branch = ((i % arms) / arms) * Math.PI * 2;
    const spin = radius * 1.15;
    const spread = (axis: number) => Math.pow(r(), 3) * (r() < 0.5 ? 1 : -1) * 0.45 * radius * axis;
    v.set(
      Math.cos(branch + spin) * radius + spread(1),
      spread(0.35),
      Math.sin(branch + spin) * radius + spread(1),
    ).applyEuler(tilt);
    v.toArray(out, i * 3);
  }
  return out;
}

export function buildShapes(count: number) {
  const r = mulberry32(27);
  return [neuralCore(count, r), helix(count, r), orbits(count, r), terrain(count, r), galaxy(count, r)];
}
