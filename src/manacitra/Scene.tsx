import { Suspense } from 'react';
import Lights from './Lights';
import Zone from './Zone';
import ServiceBlock from './ServiceBlock';
import DiagramOverlay from './DiagramOverlay';
import IsometricCameraRig from './IsometricCameraRig';
import { serviceBasePos } from './positions';
import { useManacitraStore } from './store';
import type { ManacitraData } from './types';

export default function Scene({ data }: { data: ManacitraData }) {
  const setSelected = useManacitraStore(s => s.setSelected);
  const setHovered = useManacitraStore(s => s.setHovered);

  return (
    <>
      <color attach="background" args={[0xf4f5f7]} />
      <DiagramOverlay data={data} />
      <Lights />
      <Suspense fallback={null}>
        {data.zones.map(zone => (
          <Zone key={zone.id} zone={zone} />
        ))}
        {data.zones.map(zone =>
          zone.services.map((svc, i) => {
            const pos = serviceBasePos(zone, i, zone.services.length);
            return (
              <ServiceBlock
                key={svc.id}
                service={svc}
                zoneColor={zone.color}
                position={[pos.x, pos.y, pos.z]}
                onHover={setHovered}
                onSelect={id => {
                  setSelected(id);
                  if (svc.url) window.open(svc.url, '_blank', 'noopener,noreferrer');
                }}
              />
            );
          }),
        )}
      </Suspense>
      <IsometricCameraRig />
    </>
  );
}
