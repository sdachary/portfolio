import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useState, useMemo } from 'react';

const _warn = console.warn.bind(console);
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return;
  _warn(...args);
};
import Scene from './Scene';
import InfoPanel from './InfoPanel';
import SearchBar from './ui/SearchBar';
import FilterPanel from './ui/FilterPanel';
import LayerToggles from './ui/LayerToggles';
import SceneDescription from './a11y/SceneDescription';
import { useReducedMotion } from './a11y/useReducedMotion';
import ContrastToggle from './ui/ContrastToggle';
import AudioToggle from './ui/AudioToggle';
import TouchControls from './controls/TouchControls';
import useAmbientAudio from './audio/useAmbientAudio';
import { useManacitraStore } from './store';
import { preloadModels } from './models';
import type { ManacitraData } from './types';

function Loader({ progress, status }: { progress: number; status: string }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: '#f4f5f7',
      zIndex: 100, transition: 'opacity 1s ease',
    }}>
      <div style={{
        width: 48, height: 48, border: '1.5px solid rgba(28,28,26,0.08)',
        borderTopColor: '#b5472e', borderRadius: '50%',
        animation: 'spin 1.2s cubic-bezier(0.4,0,0.2,1) infinite',
        marginBottom: '2rem',
      }} />
      <h1 style={{
        fontSize: '2.5rem', fontWeight: 300, letterSpacing: '-0.02em',
        color: '#1c1c1a', marginBottom: '.5rem',
      }}>Manacitra</h1>
      <p style={{ color: 'rgba(28,28,26,0.35)', fontSize: '.8rem', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '.75rem' }}>
        Infrastructure Map
      </p>
      <div style={{ width: 160, height: 1.5, background: 'rgba(28,28,26,0.06)', borderRadius: 2, marginTop: '.75rem', overflow: 'hidden' }}>
        <span style={{ display: 'block', height: '100%', width: `${progress}%`, background: '#b5472e', borderRadius: 2, transition: 'width .5s ease' }} />
      </div>
      <p style={{ color: 'rgba(28,28,26,0.25)', fontSize: '.75rem', fontVariantNumeric: 'tabular-nums', marginTop: '.75rem' }}>
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
        background: 'rgba(247,245,240,0.86)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(28,28,26,0.08)', borderRadius: 100, fontSize: '.8rem',
      }}>
        <span style={{
          fontWeight: 500, color: '#1c1c1a',
        }}>Manacitra</span>
        <span style={{ color: 'rgba(28,28,26,0.10)' }}>·</span>
        <span style={{ color: 'rgba(28,28,26,0.55)', display: 'flex', alignItems: 'center', gap: '.35rem' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', display: 'inline-block', background: '#2f6d4f' }} />
          {online} online
        </span>
        <span style={{ color: 'rgba(28,28,26,0.4)', display: 'flex', alignItems: 'center', gap: '.35rem' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', display: 'inline-block', background: '#b5472e' }} />
          {offline} offline
        </span>
        <span style={{ color: 'rgba(28,28,26,0.25)', fontSize: '.7rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
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
  const [isMobile, setIsMobile] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const data = useManacitraStore(s => s.data);
  const setData = useManacitraStore(s => s.setData);
  const highContrast = useManacitraStore(s => s.highContrast);
  useReducedMotion();
  useAmbientAudio();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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
    preloadModels();
    setProgress(5);
    fetch('/manacitra/data.json')
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
    <div data-contrast={highContrast ? 'high' : 'normal'} style={{ width: '100vw', height: '100vh', background: '#f4f5f7', position: 'relative', overflow: 'hidden' }}>
      {!loaded && <Loader progress={progress} status={status} />}
      <Header online={online} offline={offline} total={total} />
      <div style={{
        position: 'fixed', top: '4.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <button
          onClick={() => setToolsOpen(o => !o)}
          aria-label={toolsOpen ? 'Close tools' : 'Open tools'}
          style={{
            width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', fontFamily: 'inherit',
            background: toolsOpen ? 'rgba(28,28,26,0.08)' : 'transparent',
            border: `1px solid ${toolsOpen ? 'rgba(28,28,26,0.15)' : 'rgba(28,28,26,0.12)'}`,
            color: 'rgba(28,28,26,0.4)', fontSize: '.8rem', lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity .2s', opacity: toolsOpen ? 1 : 0.5,
          }}
        >{toolsOpen ? '✕' : '···'}</button>
        {toolsOpen && (
          <div style={isMobile ? {
            display: 'flex', gap: 6, alignItems: 'center', maxWidth: 'calc(100vw - 5rem)',
            overflowX: 'auto', padding: '8px 12px',
            background: 'rgba(247,245,240,0.92)', backdropFilter: 'blur(24px)',
            border: '1px solid rgba(28,28,26,0.08)', borderRadius: 16, WebkitOverflowScrolling: 'touch',
          } : {
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <SearchBar />
            <FilterPanel />
            <LayerToggles />
            <ContrastToggle />
            <AudioToggle />
          </div>
        )}
      </div>
      <SceneDescription />
      <TouchControls />
      <InfoPanel />
      {data && (
        <Canvas
          camera={{ fov: 22, near: 0.1, far: 200, position: [29, 29, 29] }}
          gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.VSMShadowMap;
          }}
          onPointerMissed={() => {
            useManacitraStore.getState().setSelected(null);
          }}
        >
          <Scene data={data} />
        </Canvas>
      )}
    </div>
  );
}
