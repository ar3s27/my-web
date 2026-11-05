import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import Particles from './Particles';

function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = -Math.random() * 14 - 1;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.008;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.03} color="#8b8aa8" transparent opacity={0.55} depthWrite={false} sizeAttenuation />
    </points>
  );
}

function CameraRig({ enabled }: { enabled: boolean }) {
  useFrame((state, delta) => {
    const cam = state.camera;
    const tx = enabled ? state.pointer.x * 0.45 : 0;
    const ty = enabled ? state.pointer.y * 0.3 : 0;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, tx, 2, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, ty, 2, delta);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

type Props = { onReady: () => void; mobile: boolean; finePointer: boolean; reducedMotion: boolean };

export default function Scene({ onReady, mobile, finePointer, reducedMotion }: Props) {
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45, near: 0.1, far: 60 }}
        dpr={[1, mobile ? 1.5 : 2]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        eventSource={document.getElementById('root') ?? undefined}
        eventPrefix="client"
        onCreated={() => requestAnimationFrame(() => onReady())}
      >
        <CameraRig enabled={finePointer && !reducedMotion} />
        <Particles count={mobile ? 9000 : 20000} mobile={mobile} finePointer={finePointer} reducedMotion={reducedMotion} />
        <Dust count={mobile ? 500 : 1400} />
      </Canvas>
    </div>
  );
}
