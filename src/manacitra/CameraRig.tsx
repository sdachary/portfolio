import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useManacitraStore } from './store';

const HOME_POS = new THREE.Vector3(16, 14, 20);
const HOME_TARGET = new THREE.Vector3(0, 0.5, 0);

export default function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null!);
  const controls = controlsRef.current;
  const camPos = useManacitraStore(s => s.camPos);
  const camTarget = useManacitraStore(s => s.camTarget);
  const isAnimating = useManacitraStore(s => s.isAnimating);
  const selectedId = useManacitraStore(s => s.selectedId);
  const introDone = useManacitraStore(s => s.introDone);
  const flyHome = useManacitraStore(s => s.flyHome);
  const finishIntro = useManacitraStore(s => s.finishIntro);
  const introPhase = useRef(0);
  const introStart = useRef(0);

  useEffect(() => {
    const c = controlsRef.current;
    if (!c) return;
    const onInteraction = () => {
      c.autoRotate = false;
      finishIntro();
    };
    c.domElement?.addEventListener('pointerdown', onInteraction);
    window.addEventListener('keydown', onInteraction);
    return () => {
      c.domElement?.removeEventListener('pointerdown', onInteraction);
      window.removeEventListener('keydown', onInteraction);
    };
  }, [finishIntro]);

  useEffect(() => {
    if (!controls) return;
    if (!selectedId && !camPos) controls.autoRotate = true;
  }, [selectedId, camPos, controls]);

  useFrame(({ camera }) => {
    const c = controlsRef.current;
    if (!c) return;

    if (!introDone && introPhase.current < 3) {
      if (introPhase.current === 0) {
        camera.position.set(24, 20, 28);
        c.target.set(0, 0.5, 0);
        introStart.current = performance.now();
        introPhase.current = 1;
      }
      const t = (performance.now() - introStart.current) / 1000;
      if (introPhase.current === 1) {
        const p = Math.min(t / 4, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        camera.position.lerpVectors(new THREE.Vector3(24, 20, 28), HOME_POS, ease);
        c.target.lerpVectors(new THREE.Vector3(0, 8, 0), HOME_TARGET, ease);
        camera.lookAt(c.target);
        c.update();
        if (p >= 1) { introPhase.current = 2; introStart.current = performance.now(); c.autoRotate = true; }
      }
      if (introPhase.current === 2) {
        c.autoRotate = true;
        if (t > 7) { introPhase.current = 3; finishIntro(); }
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { flyHome(); if (controlsRef.current) controlsRef.current.autoRotate = true; }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flyHome]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={5}
      maxDistance={45}
      maxPolarAngle={Math.PI / 2.1}
      autoRotate
      autoRotateSpeed={0.4}
      target={[0, 0.5, 0]}
    />
  );
}
