export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} color={0xf4f5f7} />
      <directionalLight
        position={[12, 18, 8]}
        intensity={1.1}
        color={0xffffff}
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
      <hemisphereLight args={[0xf4f5f7, 0xdfe1e4, 0.4]} />
    </>
  );
}
