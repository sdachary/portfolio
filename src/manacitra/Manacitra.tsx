import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useState, useMemo } from 'react';
import Scene from './Scene';
import { useManacitraStore } from './store';
import type { ManacitraData } from './types';

function Loader({ progress, status }: { progress: number; status: string }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: '#04060e',
      zIndex: 100, transition: 'opacity 1s ease',
    }}>
      <div style={{
        width: 48, height: 48, border: '1.5px solid rgba(255,255,255,0.06)',
        borderTopColor: '#7c3aed', borderRadius: '50%',
        animation: 'spin 1.2s cubic-bezier(0.4,0,0.2,1) infinite',
        marginBottom: '2rem',
      }} />
      <h1 style={{
        fontSize: '2.5rem', fontWeight: 300, letterSpacing: '0.12em',
        background: 'linear-gradient(135deg,#7c3aed,#3b82f6)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: '.5rem',
      }}>मानचित्र</h1>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '.85rem', letterSpacing: '.3em', textTransform: 'uppercase', marginBottom: '.75rem' }}>
        Infrastructure Map
      </p>
      <div style={{ width: 160, height: 1.5, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: '.75rem', overflow: 'hidden' }}>
        <span style={{ display: 'block', height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#7c3aed,#3b82f6)', borderRadius: 2, transition: 'width .5s ease' }} />
      </div>
      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '.75rem', fontVariantNumeric: 'tabular-nums', marginTop: '.75rem' }}>
        {status}
      </p>
    </div>
  );
}

function Header({ online, offline, total }: { online: number; offline: number; total: number }) {
  return (
    <div style={{
      position: 'fixed', top: '1.25rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10,
    }}>
      <nav style={{
        display: 'flex', alignItems: 'center', gap: '1.25rem',
        padding: '.5rem 1.25rem .5rem 1.5rem',
        background: 'rgba(4,6,14,0.75)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, fontSize: '.8rem',
      }}>
        <span style={{
          fontWeight: 500,
          background: 'linear-gradient(135deg,#c8d0e0,#6b7a99)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>मानचित्र</span>
        <span style={{ color: 'rgba(255,255,255,0.08)' }}>·</span>
        <span style={{ color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '.35rem' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', display: 'inline-block', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.4)' }} />
          {online} online
        </span>
        <span style={{ color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '.35rem', opacity: 0.5 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', display: 'inline-block', background: '#ef4444', boxShadow: '0 0 6px rgba(239,68,68,0.3)' }} />
          {offline} offline
        </span>
        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '.7rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
          {total} services
        </span>
      </nav>
    </div>
  );
}

export default function Manacitra() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Loading data...');
  const data = useManacitraStore(s => s.data);
  const setData = useManacitraStore(s => s.setData);

  const { online, offline, total } = useMemo(() => {
    if (!data) return { online: 0, offline: 0, total: 0 };
    let on = 0, off = 0, t = 0;
    const allIds = new Set<string>();
    data.islands.forEach(i => i.buildings.forEach(b => allIds.add(b.id)));
    data.floating.forEach(f => allIds.add(f.id));
    allIds.forEach(id => {
      t++;
      const h = data.health[id];
      if (!h) return;
      h.online ? on++ : off++;
    });
    return { online: on, offline: off, total: t };
  }, [data]);

  useEffect(() => {
    setProgress(5);
    fetch('/portfolio/manacitra/data.json')
      .then(r => r.json())
      .then((d: ManacitraData) => {
        setProgress(50);
        setStatus('Building scene...');
        setData(d);
        setProgress(85);
        setStatus('Finalizing...');
        setTimeout(() => {
          setProgress(100);
          setStatus('Ready');
          setLoaded(true);
        }, 200);
      })
      .catch(e => {
        setStatus('Error: ' + e.message);
      });
  }, [setData]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#04060e', position: 'relative', overflow: 'hidden' }}>
      {!loaded && <Loader progress={progress} status={status} />}
      <Header online={online} offline={offline} total={total} />
      {data && (
        <Canvas
          camera={{ fov: 45, near: 0.1, far: 100, position: [16, 14, 20] }}
          gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <Scene data={data} />
        </Canvas>
      )}
    </div>
  );
}
