import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useManacitraStore } from './store';
import { serviceBasePos, serviceTopPos, zoneCenterPos, zoneCorner } from './positions';
import type { ManacitraData } from './types';

const MAX_CANVAS = 4096;
const GRID_SIZE = 34;
const GRID_DIV = 20;
const GRID_HALF = GRID_SIZE / 2;
const GRID_STEP = GRID_SIZE / GRID_DIV;
const HOME_TARGET = new THREE.Vector3(0, 0.5, 0);
const PARTICLE_COUNT = 3;
const PARTICLE_SPEED = 0.22;

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
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_DIV; i++) {
    const pos = -GRID_HALF + i * GRID_STEP;
    const major = i % 5 === 0;
    const a = project(-GRID_HALF, 0, pos);
    const b = project(GRID_HALF, 0, pos);
    const c2 = project(pos, 0, -GRID_HALF);
    const d = project(pos, 0, GRID_HALF);
    if (a && b) {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = major ? 'rgba(28,28,26,0.10)' : 'rgba(28,28,26,0.05)';
      ctx.stroke();
    }
    if (c2 && d) {
      ctx.beginPath();
      ctx.moveTo(c2.x, c2.y);
      ctx.lineTo(d.x, d.y);
      ctx.strokeStyle = major ? 'rgba(28,28,26,0.10)' : 'rgba(28,28,26,0.05)';
      ctx.stroke();
    }
  }
}

function healthColor(id: string, health: ManacitraData['health']): string {
  const h = health[id];
  if (!h) return '#8a8577';
  return h.online ? '#2f6d4f' : '#b5472e';
}

function screen(c: Ctx2D, p: { x: number; y: number; z: number }) {
  return c.project(p.x, p.y, p.z);
}

interface AnchorMap {
  byId: Map<string, { x: number; y: number; z: number }>;
  zones: ManacitraData['zones'];
  health: ManacitraData['health'];
}

function buildAnchors(data: ManacitraData): AnchorMap {
  const byId = new Map<string, { x: number; y: number; z: number }>();
  for (const zone of data.zones) {
    byId.set(zone.id, zoneCenterPos(zone));
    zone.services.forEach((svc, i) => {
      byId.set(svc.id, serviceBasePos(zone, i, zone.services.length));
    });
  }
  return { byId, zones: data.zones, health: data.health };
}

function quadPoint(
  fp: { x: number; y: number; z: number },
  mid: { x: number; y: number; z: number },
  tp: { x: number; y: number; z: number },
  t: number,
): { x: number; y: number; z: number } {
  const inv = 1 - t;
  return {
    x: inv * inv * fp.x + 2 * inv * t * mid.x + t * t * tp.x,
    y: inv * inv * fp.y + 2 * inv * t * mid.y + t * t * tp.y,
    z: inv * inv * fp.z + 2 * inv * t * mid.z + t * t * tp.z,
  };
}

function connectionCurve(
  c: Ctx2D,
  anchors: AnchorMap,
  from: string,
  to: string,
): { pts: { x: number; y: number }[]; fp: { x: number; y: number; z: number }; mid: { x: number; y: number; z: number }; tp: { x: number; y: number; z: number } } | null {
  const fp = anchors.byId.get(from);
  const tp = anchors.byId.get(to);
  if (!fp || !tp) return null;
  const mid = {
    x: (fp.x + tp.x) / 2,
    y: Math.max(fp.y, tp.y) + Math.abs(tp.y - fp.y) * 0.12 + 0.35,
    z: (fp.z + tp.z) / 2,
  };
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= 20; i++) {
    const p = screen(c, quadPoint(fp, mid, tp, i / 20));
    if (!p) return null;
    pts.push(p);
  }
  return { pts, fp, mid, tp };
}

function drawConnections(c: Ctx2D, anchors: AnchorMap, connections: ManacitraData['connections']) {
  const { ctx } = c;
  ctx.setLineDash([5, 6]);
  ctx.lineCap = 'round';
  for (const conn of connections) {
    const curve = connectionCurve(c, anchors, conn.from, conn.to);
    if (!curve) continue;
    ctx.beginPath();
    ctx.moveTo(curve.pts[0].x, curve.pts[0].y);
    for (const p of curve.pts.slice(1)) ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = 'rgba(28,28,26,0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawFlowParticles(c: Ctx2D, anchors: AnchorMap, connections: ManacitraData['connections'], t: number) {
  const { ctx } = c;
  connections.forEach((conn, ci) => {
    const curve = connectionCurve(c, anchors, conn.from, conn.to);
    if (!curve) return;
    for (let p = 0; p < PARTICLE_COUNT; p++) {
      const phase = (t * PARTICLE_SPEED + p / PARTICLE_COUNT + ci * 0.13) % 1;
      const world = quadPoint(curve.fp, curve.mid, curve.tp, phase);
      const pt = screen(c, world);
      if (!pt) continue;
      const alpha = 0.25 + 0.75 * Math.sin(Math.PI * Math.min(phase * 3, 1));
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(181,71,46,${alpha})`;
      ctx.fill();
    }
  });
}

function drawZoneLabels(c: Ctx2D, anchors: AnchorMap) {
  const { ctx } = c;
  ctx.textAlign = 'center';
  for (const zone of anchors.zones) {
    const corner = zoneCorner(zone);
    const lp = screen(c, { x: corner.x + zone.size / 2, y: 0.3, z: corner.z - 0.7 });
    if (!lp) continue;
    ctx.font = '600 12px "IBM Plex Mono","SF Mono",ui-monospace,monospace';
    ctx.fillStyle = '#1c1c1a';
    ctx.fillText(zone.name, lp.x, lp.y);
    if (zone.subtitle) {
      const sp = screen(c, { x: corner.x + zone.size / 2, y: 0.1, z: corner.z - 0.7 });
      if (sp) {
        ctx.font = '400 9px "IBM Plex Mono","SF Mono",ui-monospace,monospace';
        ctx.fillStyle = 'rgba(28,28,26,0.45)';
        ctx.fillText(zone.subtitle, sp.x, sp.y);
      }
    }
  }
}

function drawServiceLabels(c: Ctx2D, anchors: AnchorMap) {
  const { ctx } = c;
  ctx.textAlign = 'center';
  ctx.font = '500 9px "IBM Plex Mono","SF Mono",ui-monospace,monospace';
  for (const zone of anchors.zones) {
    for (let i = 0; i < zone.services.length; i++) {
      const svc = zone.services[i];
      const top = serviceTopPos(zone, svc.h ?? 1.5, i, zone.services.length);
      const p = screen(c, { x: top.x, y: top.y + 0.45, z: top.z });
      if (!p) continue;
      ctx.fillStyle = '#1c1c1a';
      ctx.fillText(svc.name, p.x, p.y);
    }
  }
}

function drawBadges(c: Ctx2D, anchors: AnchorMap) {
  const { ctx } = c;
  for (const zone of anchors.zones) {
    for (let i = 0; i < zone.services.length; i++) {
      const svc = zone.services[i];
      const top = serviceTopPos(zone, svc.h ?? 1.5, i, zone.services.length);
      const p = screen(c, { x: top.x, y: top.y + 0.8, z: top.z });
      if (!p) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = healthColor(svc.id, anchors.health);
      ctx.fill();
      ctx.strokeStyle = 'rgba(28,28,26,0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
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

  const selectedId = useManacitraStore(s => s.selectedId);
  const visibleLayers = useManacitraStore(s => s.visibleLayers);
  const reducedMotion = useManacitraStore(s => s.reducedMotion);

  const anchors = useMemo(() => buildAnchors(data), [data]);
  const flowRef = useRef(0);

  useEffect(() => {
    dirty.current = true;
  }, [selectedId, visibleLayers, data]);

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
      if (visibleLayers.zones) drawZoneLabels(c, anchors);
      if (visibleLayers.connections) drawConnections(c, anchors, data.connections);
      if (visibleLayers.labels) {
        drawServiceLabels(c, anchors);
        drawBadges(c, anchors);
      }
    }
    tex.needsUpdate = true;
  };

  useFrame((state) => {
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
      const bgDist = distToTarget + 34;
      const fgDist = Math.max(distToTarget - 24, 2.5);

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
    } else if (visibleLayers.connections && !reducedMotion) {
      flowRef.current += state.clock.getDelta();
      const { W, H } = view.current;
      const ctx = fgCanvas.getContext('2d')!;
      const project = (x: number, y: number, z: number) => {
        const v = new THREE.Vector3(x, y, z).project(camera);
        if (v.z < -1 || v.z > 1) return null;
        return { x: (v.x + 1) * 0.5 * W, y: (1 - v.y) * 0.5 * H };
      };
      const c2: Ctx2D = { ctx, W, H, project };
      ctx.clearRect(0, 0, W, H);
      if (visibleLayers.zones) drawZoneLabels(c2, anchors);
      drawConnections(c2, anchors, data.connections);
      if (visibleLayers.labels) {
        drawServiceLabels(c2, anchors);
        drawBadges(c2, anchors);
      }
      drawFlowParticles(c2, anchors, data.connections, flowRef.current);
      fgTex.needsUpdate = true;
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
