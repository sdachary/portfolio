import { OrbitControls } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useManacitraStore } from './store';

const ISO_DIST = 50;
const ISO_NORM = ISO_DIST / Math.sqrt(3);
const HOME_POS = new THREE.Vector3(ISO_NORM, ISO_NORM, ISO_NORM);
const HOME_TARGET = new THREE.Vector3(0, 0.5, 0);

const INTRO_START = new THREE.Vector3(ISO_NORM * 1.25, ISO_NORM * 1.25, ISO_NORM * 1.25);

export default function IsometricCameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null!);
  const introRef = useRef(true);
  const introStart = useRef(0);
  const camPos = useManacitraStore(s => s.camPos);
  const camTarget = useManacitraStore(s => s.camTarget);
  const isAnimating = useManacitraStore(s => s.isAnimating);

  useEffect(() => {
    const c = controlsRef.current;
    if (!c) return;
    c.enableRotate = false;
  }, []);

  useFrame(({ camera }) => {
    const c = controlsRef.current;
    if (!c) return;

    if (introRef.current) {
      if (!introStart.current) {
        camera.position.copy(INTRO_START);
        c.target.copy(HOME_TARGET);
        introStart.current = performance.now();
      }
      const t = (performance.now() - introStart.current) / 1000;
      const p = Math.min(t / 1.0, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      camera.position.lerpVectors(INTRO_START, HOME_POS, ease);
      c.update();
      if (p >= 1) {
        camera.position.copy(HOME_POS);
        c.update();
        introRef.current = false;
      }
      return;
    }

    if (isAnimating && camPos && camTarget) {
      const p = new THREE.Vector3(camPos.x, camPos.y, camPos.z);
      const t = new THREE.Vector3(camTarget.x, camTarget.y, camTarget.z);
      camera.position.lerp(p, 0.04);
      c.target.lerp(t, 0.04);
      c.update();
      if (camera.position.distanceTo(p) < 0.3 && c.target.distanceTo(t) < 0.3) {
        camera.position.copy(p);
        c.target.copy(t);
        c.update();
        useManacitraStore.setState({ isAnimating: false });
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={15}
      maxDistance={120}
      enableRotate={false}
      target={[0, 0.5, 0]}
    />
  );
}
