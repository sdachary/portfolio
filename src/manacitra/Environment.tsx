import { Environment as DreiEnvironment } from '@react-three/drei';

export default function EnvMap() {
  return (
    <DreiEnvironment
      preset="studio"
      background={false}
    />
  );
}
