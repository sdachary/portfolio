import * as THREE from 'three';

export default function Ocean() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
        <planeGeometry args={[60, 60, 64, 64]} />
        <meshStandardMaterial color={0x080e20} roughness={0.3} metalness={0.6} transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
        <planeGeometry args={[60, 60, 1, 1]} />
        <meshBasicMaterial color={0x0a1628} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}
