export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} color={0xf7f5f0} />
      <directionalLight
        position={[12, 18, 8]}
        intensity={1.2}
        color={0xfff8ee}
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
      <hemisphereLight args={[0xf7f5f0, 0xded9ce, 0.5]} />
    </>
  );
}