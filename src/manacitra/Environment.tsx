import { Environment as DreiEnvironment } from '@react-three/drei';
import { useManacitraStore } from './store';

export default function EnvMap() {
  const hour = useManacitraStore(s => s.hour);
  const preset = hour >= 6 && hour < 18 ? 'city' : 'night';

  return (
    <DreiEnvironment
      preset={preset}
      background={false}
    />
  );
}
