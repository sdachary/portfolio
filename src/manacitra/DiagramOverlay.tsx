import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import type { ManacitraData } from './types';

const MAX_CANVAS = 4096;
const GRID_SIZE = 30;
const GRID_DIV = 20;
const GRID_HALF = GRID_SIZE / 2;
const GRID_STEP = GRID_SIZE / GRID_DIV;
const HOME_TARGET = new THREE.Vector3(0, 0.5, 0);

interface Ctx2D {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  project: (x: number, y: number, z: number) => { x: number; y: number } | null;
}

function makeLayerMaterial(tex: THREE.CanvasTexture, depthTest: boolean) {
  return new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    depthTest,
    side: THREE.DoubleSide,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    toneMapped: false,
  });
}

function drawGrid(c: Ctx2D) {
  const { ctx, project } = c;
  const line = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  };

  ctx.strokeStyle = 'rgba(28,28,26,0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= GRID_DIV; i++) {
    const pos = -GRID_HALF + i * GRID_STEP;
    const a = project(-GRID_HALF, 0, pos);
    const b = project(GRID_HALF, 0, pos);
    const c2 = project(pos, 0, -GRID_HALF);
    const d = project(pos, 0, GRID_HALF);
    if (a && b) line(a.x, a.y, b.x, b.y);
    if (c2 && d) line(c2.x, c2.y, d.x, d.y);
  }
  ctx.stroke();
}

export default function DiagramOverlay({ data }: { data: ManacitraData }) {
  const camera = useThree(s => s.camera);
  const gl = useThree(s => s.gl);
  const size = useThree(s => s.size);
  const controls = useThree(s => s.controls) as { target: THREE.Vector3 } | null;

  const bgCanvas = useMemo(() => document.createElement('canvas'), []);
  const bgTex = useMemo(() => new THREE.CanvasTexture(bgCanvas), [bgCanvas]);
  const bgMat = useMemo(() => makeLayerMaterial(bgTex, true), [bgTex]);
  const bgMesh = useRef<THREE.Mesh>(null!);

  const fgCanvas = useMemo(() => document.createElement('canvas'), []);
  const fgTex = useMemo(() => new THREE.CanvasTexture(fgCanvas), [fgCanvas]);
  const fgMat = useMemo(() => makeLayerMaterial(fgTex, false), [fgTex]);
  const fgMesh = useRef<THREE.Mesh>(null!);

  const dirty = useRef(true);
  const view = useRef({ W: 0, H: 0 });
  const lastCam = useRef({ px: 0, py: 0, pz: 0, qx: 0, qy: 0, qz: 0, qw: 0 });

  useEffect(() => {
    bgTex.anisotropy = gl.capabilities.getMaxAnisotropy();
    fgTex.anisotropy = gl.capabilities.getMaxAnisotropy();
  }, [gl, bgTex, fgTex]);

  const draw = (canvas: HTMLCanvasElement, tex: THREE.CanvasTexture, isBg: boolean) => {
    const { W, H } = view.current;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, W, H);
    const project = (x: number, y: number, z: number) => {
      const v = new THREE.Vector3(x, y, z).project(camera);
      if (v.z < -1 || v.z > 1) return null;
      return { x: (v.x + 1) * 0.5 * W, y: (1 - v.y) * 0.5 * H };
    };
    const c: Ctx2D = { ctx, W, H, project };
    if (isBg) drawGrid(c);
    else {
      void data;
    }
    tex.needsUpdate = true;
  };

  useFrame(() => {
    const persp = camera as THREE.PerspectiveCamera;
    const dpr = Math.min(gl.getPixelRatio(), 2);
    const W = Math.min(Math.floor(size.width * dpr), MAX_CANVAS);
    const H = Math.min(Math.floor(size.height * dpr), MAX_CANVAS);
    if (view.current.W !== W || view.current.H !== H) {
      view.current.W = W;
      view.current.H = H;
      bgCanvas.width = W;
      bgCanvas.height = H;
      fgCanvas.width = W;
      fgCanvas.height = H;
      dirty.current = true;
    }

    const target = controls?.target ?? HOME_TARGET;
    const camPos = camera.position;
    const q = camera.quaternion;
    const cam = { px: camPos.x, py: camPos.y, pz: camPos.z, qx: q.x, qy: q.y, qz: q.z, qw: q.w };
    if (
      Math.abs(cam.px - lastCam.current.px) > 1e-4 ||
      Math.abs(cam.py - lastCam.current.py) > 1e-4 ||
      Math.abs(cam.pz - lastCam.current.pz) > 1e-4 ||
      Math.abs(cam.qx - lastCam.current.qx) > 1e-6 ||
      Math.abs(cam.qy - lastCam.current.qy) > 1e-6 ||
      Math.abs(cam.qz - lastCam.current.qz) > 1e-6 ||
      Math.abs(cam.qw - lastCam.current.qw) > 1e-6
    ) {
      lastCam.current = cam;
      dirty.current = true;
    }

    if (bgMesh.current && fgMesh.current) {
      const viewDir = new THREE.Vector3().subVectors(target, camPos).normalize();
      const distToTarget = camPos.distanceTo(target);
      const bgDist = distToTarget + 30;
      const fgDist = Math.max(distToTarget - 22, 2.5);

      bgMesh.current.position.copy(camPos).addScaledVector(viewDir, bgDist);
      bgMesh.current.quaternion.copy(camera.quaternion);
      fgMesh.current.position.copy(camPos).addScaledVector(viewDir, fgDist);
      fgMesh.current.quaternion.copy(camera.quaternion);

      const aspect = size.width / size.height;
      const bgHalfH = Math.tan(THREE.MathUtils.degToRad(persp.fov / 2)) * bgDist;
      bgMesh.current.scale.set(bgHalfH * 2 * aspect, bgHalfH * 2, 1);
      const fgHalfH = Math.tan(THREE.MathUtils.degToRad(persp.fov / 2)) * fgDist;
      fgMesh.current.scale.set(fgHalfH * 2 * aspect, fgHalfH * 2, 1);
    }

    if (dirty.current) {
      draw(bgCanvas, bgTex, true);
      draw(fgCanvas, fgTex, false);
      dirty.current = false;
    }
  });

  return (
    <>
      <mesh ref={bgMesh} material={bgMat} renderOrder={1}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh ref={fgMesh} material={fgMat} renderOrder={999}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </>
  );
}
