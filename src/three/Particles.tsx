import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { buildShapes, SHAPE_COLORS, SHAPE_COUNT, SHAPE_LAYOUT } from './shapes';
import { scrollState } from '../lib/scroll';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uFrom;
  uniform float uTo;
  uniform float uMix;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uBurst;
  uniform float uMouseStrength;
  uniform vec3 uMouse;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  attribute vec3 aS0;
  attribute vec3 aS1;
  attribute vec3 aS2;
  attribute vec3 aS3;
  attribute vec3 aS4;
  attribute float aRand;

  varying vec3 vColor;
  varying float vAlpha;

  vec3 shapeAt(float i) {
    if (i < 0.5) return aS0;
    if (i < 1.5) return aS1;
    if (i < 2.5) return aS2;
    if (i < 3.5) return aS3;
    return aS4;
  }

  void main() {
    // every particle starts its trip a little later than the previous one
    float delay = aRand * 0.4;
    float t = clamp((uMix - delay) / (1.0 - 0.4), 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);

    vec3 p = mix(shapeAt(uFrom), shapeAt(uTo), t);

    // mid-flight swirl: particles bulge outwards while travelling
    float flight = sin(t * 3.14159);
    vec3 dir = normalize(p + vec3(0.0001));
    p += dir * flight * (0.35 + aRand * 0.9);
    p += vec3(sin(aRand * 40.0), cos(aRand * 31.0), sin(aRand * 23.0)) * flight * 0.5;

    // idle breathing + scroll-speed burst
    float ph = aRand * 6.2831;
    p += vec3(sin(uTime * 0.7 + ph), cos(uTime * 0.55 + ph * 1.3), sin(uTime * 0.45 + ph * 0.7)) * 0.035;
    p += dir * uBurst * (0.15 + aRand * 0.6);

    vec4 world = modelMatrix * vec4(p, 1.0);

    // push particles away from the mouse
    vec3 away = world.xyz - uMouse;
    float d = length(away.xy);
    float force = smoothstep(1.5, 0.0, d) * uMouseStrength;
    world.xyz += normalize(away + vec3(0.0001)) * force * 0.75;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.45 + aRand * 0.9) / -mv.z;

    vColor = mix(uColorA, uColorB, smoothstep(-2.5, 2.5, p.y + (aRand - 0.5) * 2.0));
    vColor += force * 0.45;
    vAlpha = (0.35 + aRand * 0.65) * smoothstep(16.0, 4.0, -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha);
  }
`;

const colorsA = SHAPE_COLORS.map(([a]) => new THREE.Color(a));
const colorsB = SHAPE_COLORS.map(([, b]) => new THREE.Color(b));

type Props = { count: number; mobile: boolean; finePointer: boolean; reducedMotion: boolean };

export default function Particles({ count, mobile, finePointer, reducedMotion }: Props) {
  const group = useRef<THREE.Group>(null);
  const layout = mobile ? SHAPE_LAYOUT.mobile : SHAPE_LAYOUT.desktop;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const shapes = buildShapes(count);
    geo.setAttribute('position', new THREE.BufferAttribute(shapes[0].slice(), 3));
    shapes.forEach((s, i) => geo.setAttribute(`aS${i}`, new THREE.BufferAttribute(s, 3)));
    const rand = new Float32Array(count);
    for (let i = 0; i < count; i++) rand[i] = Math.random();
    geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);
    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uFrom: { value: 0 },
          uTo: { value: 0 },
          uMix: { value: 0 },
          uSize: { value: mobile ? 34 : 30 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          uBurst: { value: 0 },
          uMouseStrength: { value: 0 },
          uMouse: { value: new THREE.Vector3(99, 99, 0) },
          uColorA: { value: colorsA[0].clone() },
          uColorB: { value: colorsB[0].clone() },
        },
      }),
    [mobile],
  );

  const tmp = useMemo(
    () => ({
      a: new THREE.Vector3(),
      b: new THREE.Vector3(),
      plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
      hit: new THREE.Vector3(),
      ray: new THREE.Raycaster(),
      spin: 0,
      lastPointer: new THREE.Vector2(),
      idle: 0,
    }),
    [],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const u = material.uniforms;
    const s = scrollState;

    s.progress = THREE.MathUtils.damp(s.progress, s.target, reducedMotion ? 8 : 3, dt);
    const p = THREE.MathUtils.clamp(s.progress, 0, SHAPE_COUNT - 1);
    const from = Math.floor(p);
    const to = Math.min(from + 1, SHAPE_COUNT - 1);
    const mix = p - from;

    u.uFrom.value = from;
    u.uTo.value = to;
    u.uMix.value = mix;
    u.uTime.value += reducedMotion ? dt * 0.3 : dt;
    u.uColorA.value.copy(colorsA[from]).lerp(colorsA[to], mix);
    u.uColorB.value.copy(colorsB[from]).lerp(colorsB[to], mix);

    const burst = reducedMotion ? 0 : Math.min(Math.abs(s.velocity) / 60, 1);
    u.uBurst.value = THREE.MathUtils.damp(u.uBurst.value, burst, 5, dt);

    const g = group.current;
    if (g) {
      tmp.a.fromArray(layout.offsets[from]);
      tmp.b.fromArray(layout.offsets[to]);
      g.position.copy(tmp.a.lerp(tmp.b, mix));
      g.scale.setScalar(THREE.MathUtils.lerp(layout.scales[from], layout.scales[to], mix));
      tmp.spin += dt * (reducedMotion ? 0.01 : 0.07);
      g.rotation.y = tmp.spin + p * 0.9;
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, state.pointer.y * -0.12, 2, dt);
    }

    // mouse interaction (desktop only), fades out when the pointer rests
    if (finePointer) {
      if (!tmp.lastPointer.equals(state.pointer)) {
        tmp.idle = 0;
        tmp.lastPointer.copy(state.pointer);
      } else {
        tmp.idle += dt;
      }
      tmp.ray.setFromCamera(state.pointer, state.camera);
      if (tmp.ray.ray.intersectPlane(tmp.plane, tmp.hit)) {
        u.uMouse.value.lerp(tmp.hit, 1 - Math.exp(-10 * dt));
      }
      const strength = tmp.idle > 1.5 ? 0 : 1;
      u.uMouseStrength.value = THREE.MathUtils.damp(u.uMouseStrength.value, strength, 3, dt);
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}
