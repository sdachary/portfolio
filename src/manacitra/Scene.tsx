import Stars from './Stars';
import Lights from './Lights';
import EnvMap from './Environment';
import Ocean from './Ocean';
import Island from './Island';
import FloatingIsland from './FloatingIsland';
import Connections from './Connections';
import CameraRig from './CameraRig';
import Effects from './Effects';
import Particles from './Particles';
import type { ManacitraData } from './types';

export default function Scene({ data }: { data: ManacitraData }) {
  return (
    <>
      <color attach="background" args={[0x04060e]} />
      <fogExp2 attach="fog" args={[0x04060e, 0.018]} />
      <EnvMap />
      <Stars />
      <Lights />
      <Ocean />
      <Particles />
      {data.islands.map(isl => (
        <Island key={isl.id} island={isl} />
      ))}
      <group>
        {data.floating.map((f, i) => (
          <FloatingIsland key={f.id} app={f} index={i} total={data.floating.length} />
        ))}
      </group>
      <Connections islands={data.islands} floating={data.floating} connections={data.connections} />
      <CameraRig />
      <Effects />
    </>
  );
}
