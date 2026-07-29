import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export default function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null!);

  useEffect(() => {
    const c = controlsRef.current;
    if (!c) return;
    const onStart = () => { c.autoRotate = false; };
    c.domElement?.addEventListener('pointerdown', onStart);
    setTimeout(() => { c.autoRotate = true; }, 3000);
    return () => c.domElement?.removeEventListener('pointerdown', onStart);
  }, []);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={6}
      maxDistance={45}
      maxPolarAngle={Math.PI / 2.1}
      autoRotate
      autoRotateSpeed={0.4}
      target={[0, 0.5, 0]}
    />
  );
}
