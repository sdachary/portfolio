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

export default function IsometricCameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null!);
  const resetToken = useManacitraStore(s => s.resetToken);
  const setSelected = useManacitraStore(s => s.setSelected);
  const lastToken = useRef(0);

  useEffect(() => {
    const c = controlsRef.current;
    if (!c) return;
    c.enableRotate = true;
    c.minPolarAngle = 0.15;
    c.maxPolarAngle = Math.PI / 2.1;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setSelected]);

  useFrame(({ camera }) => {
    const c = controlsRef.current;
    if (!c) return;
    if (resetToken !== lastToken.current) {
      lastToken.current = resetToken;
      camera.position.copy(HOME_POS);
      c.target.copy(HOME_TARGET);
      c.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={15}
      maxDistance={120}
      enableRotate
      target={[0, 0.5, 0]}
    />
  );
}
