import { RoundedBox } from '@react-three/drei';
import type { Zone } from './types';
import { zoneCorner } from './positions';

export default function Zone({ zone }: { zone: Zone }) {
  const corner = zoneCorner(zone);
  return (
    <group>
      <RoundedBox
        args={[zone.size, 0.12, zone.size]}
        position={[corner.x + zone.size / 2, -0.06, corner.z + zone.size / 2]}
        radius={0.35}
        smoothness={3}
        castShadow={false}
        receiveShadow
      >
        <meshStandardMaterial color="#fbfbfa" roughness={1} metalness={0} transparent opacity={0.95} />
      </RoundedBox>
    </group>
  );
}
