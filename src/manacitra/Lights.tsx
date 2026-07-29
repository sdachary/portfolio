export default function Lights() {
  return (
    <>
      <ambientLight color={0x223355} intensity={0.8} />
      <directionalLight
        color={0xffeedd}
        intensity={2.5}
        position={[12, 20, 8]}
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
      <directionalLight color={0x6666ff} intensity={0.4} position={[-8, 6, -10]} />
      <directionalLight color={0x4488ff} intensity={0.2} position={[0, -4, 12]} />
    </>
  );
}
