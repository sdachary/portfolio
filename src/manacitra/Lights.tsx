export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} color={0x223355} />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.5}
        color={0xffeedd}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <directionalLight
        position={[-10, 5, -5]}
        intensity={0.5}
        color={0x4488ff}
      />
      <directionalLight
        position={[0, 15, -15]}
        intensity={0.6}
        color={0x88bbff}
      />
    </>
  );
}
