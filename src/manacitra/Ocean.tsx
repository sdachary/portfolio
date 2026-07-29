import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useManacitraStore } from './store';

const vert = `
uniform float uTime;
varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  vec3 pos = position;
  float wave1 = sin(pos.x * 0.3 + pos.z * 0.2 + uTime * 0.4) * 0.08;
  float wave2 = sin(pos.x * 0.5 - pos.z * 0.4 + uTime * 0.6) * 0.05;
  float wave3 = sin(pos.x * 0.15 + pos.z * 0.25 + uTime * 0.25) * 0.12;
  pos.y += wave1 + wave2 + wave3;
  vElevation = pos.y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const frag = `
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uTime;
varying vec2 vUv;
varying float vElevation;

void main() {
  float depth = vUv.y;
  float wave = sin(vUv.x * 8.0 + uTime * 0.5) * 0.3 + 0.5;
  vec3 col = mix(uColor1, uColor2, depth * 0.6 + wave * 0.2);
  float fresnel = 1.0 - abs(vUv.y - 0.5) * 2.0;
  fresnel = pow(fresnel, 1.5) * 0.3;
  col += vec3(0.1, 0.15, 0.3) * fresnel;
  float alpha = 0.55 + depth * 0.25;
  gl_FragColor = vec4(col, alpha);
}
`;

export default function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const hour = useManacitraStore(s => s.hour);
  const isNight = hour < 6 || hour >= 18;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(isNight ? 0x060e24 : 0x0a1a3a) },
    uColor2: { value: new THREE.Color(isNight ? 0x0c1a30 : 0x142850) },
  }), [isNight]);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
      <planeGeometry args={[60, 60, 128, 128]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
