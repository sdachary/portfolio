import { OrbitControls } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useManacitraStore } from './store';
import { DURATION } from './motion/constants';

const ISO_DIST = 50;
const ISO_NORM = ISO_DIST / Math.sqrt(3);
const HOME_POS = new THREE.Vector3(ISO_NORM, ISO_NORM, ISO_NORM);
const HOME_TARGET = new THREE.Vector3(0, 0.5, 0);
const INTRO_START = new THREE.Vector3(ISO_NORM * 1.25, ISO_NORM * 1.25, ISO_NORM * 1.25);

function easeApple(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function IsometricCameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null!);
  const introRef = useRef(true);
  const introStart = useRef(0);
  const flyStart = useRef(0);
  const flyFrom = useRef(new THREE.Vector3());
  const flyFromTarget = useRef(new THREE.Vector3());
  const camPos = useManacitraStore(s => s.camPos);
  const camTarget = useManacitraStore(s => s.camTarget);
  const isAnimating = useManacitraStore(s => s.isAnimating);
  const flyHome = useManacitraStore(s => s.flyHome);
  const reduced = useManacitraStore(s => s.reducedMotion);

  useEffect(() => {
    const c = controlsRef.current;
    if (!c) return;
    c.enableRotate = false;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') flyHome();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flyHome]);

  useFrame(({ camera }) => {
    const c = controlsRef.current;
    if (!c) return;

    if (introRef.current) {
      if (!introStart.current) {
        camera.position.copy(INTRO_START);
        c.target.copy(HOME_TARGET);
        c.update();
        introStart.current = performance.now();
      }
      if (reduced) {
        camera.position.copy(HOME_POS);
        c.update();
        introRef.current = false;
        return;
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
      const targetPos = new THREE.Vector3(camPos.x, camPos.y, camPos.z);
      const targetTgt = new THREE.Vector3(camTarget.x, camTarget.y, camTarget.z);
      if (!flyStart.current) {
        flyFrom.current.copy(camera.position);
        flyFromTarget.current.copy(c.target);
        flyStart.current = performance.now();
      }
      if (reduced) {
        camera.position.copy(targetPos);
        c.target.copy(targetTgt);
        c.update();
        flyStart.current = 0;
        useManacitraStore.setState({ isAnimating: false });
        return;
      }
      const elapsed = performance.now() - flyStart.current;
      const t = Math.min(elapsed / DURATION.camera, 1);
      const ease = easeApple(t);
      camera.position.lerpVectors(flyFrom.current, targetPos, ease);
      c.target.lerpVectors(flyFromTarget.current, targetTgt, ease);
      c.update();
      if (t >= 1) {
        camera.position.copy(targetPos);
        c.target.copy(targetTgt);
        c.update();
        flyStart.current = 0;
        useManacitraStore.setState({ isAnimating: false });
      }
    } else if (flyStart.current) {
      flyStart.current = 0;
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
