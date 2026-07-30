const SIZE = 30;
const DIVISIONS = 20;
const HALF = SIZE / 2;
const STEP = SIZE / DIVISIONS;

export default function Grid() {
  const minor: number[] = [];
  const major: number[] = [];
  const ticks: number[] = [];

  for (let i = 0; i <= DIVISIONS; i++) {
    const pos = -HALF + i * STEP;
    const isMajor = i % 5 === 0;
    const arr = isMajor ? major : minor;
    arr.push(pos, 0, -HALF, pos, 0, HALF);
    arr.push(-HALF, 0, pos, HALF, 0, pos);
  }

  for (let i = 0; i <= DIVISIONS; i += 5) {
    const pos = -HALF + i * STEP;
    ticks.push(-0.15, 0, pos, 0.15, 0, pos);
    ticks.push(pos, 0, -0.15, pos, 0, 0.15);
  }

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(minor), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1c1c1a" transparent opacity={0.08} />
      </lineSegments>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(major), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1c1c1a" transparent opacity={0.18} />
      </lineSegments>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(ticks), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1c1c1a" transparent opacity={0.12} />
      </lineSegments>
    </group>
  );
}