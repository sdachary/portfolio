import { useManacitraStore } from './store';
import { useMemo } from 'react';

export default function InfoPanel() {
  const data = useManacitraStore(s => s.data);
  const selectedId = useManacitraStore(s => s.selectedId);
  const setSelected = useManacitraStore(s => s.setSelected);
  const flyHome = useManacitraStore(s => s.flyHome);

  const info = useMemo(() => {
    if (!data || !selectedId) return null;
    for (const isl of data.islands) {
      for (const b of isl.buildings) {
        if (b.id === selectedId) {
          const h = data.health[selectedId];
          return { name: b.name, type: b.type, desc: b.desc, color: b.color, online: h?.online ?? null, island: isl.name, id: b.id };
        }
      }
    }
    for (const f of data.floating) {
      if (f.id === selectedId) {
        const h = data.health[selectedId];
        return { name: f.name, type: f.type, desc: f.desc, color: f.color, online: h?.online ?? null, island: 'Floating', id: f.id };
      }
    }
    return null;
  }, [data, selectedId]);

  if (!info) return null;

  const statusColor = info.online === null ? '#4466aa' : info.online ? '#22c55e' : '#ef4444';
  const statusText = info.online === null ? 'Unknown' : info.online ? 'Online' : 'Offline';

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 20,
      background: 'rgba(4,6,14,0.85)', backdropFilter: 'blur(24px)',
      border: `1px solid ${info.color}33`, borderRadius: 16,
      padding: '1rem 1.5rem', minWidth: 280, maxWidth: 400,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.5rem' }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>{info.name}</div>
          <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '.15em', marginTop: 2 }}>{info.type} · {info.island}</div>
        </div>
        <button
          onClick={() => { setSelected(null); flyHome(); }}
          style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.4)', borderRadius: 8, width: 28, height: 28, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >✕</button>
      </div>
      <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, margin: '0 0 .75rem' }}>{info.desc}</p>
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', background: statusColor, boxShadow: `0 0 8px ${statusColor}66` }} />
        <span style={{ fontSize: '.75rem', color: statusColor }}>{statusText}</span>
        <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
        <span style={{ fontSize: '.7rem', color: 'rgba(255,255,255,0.2)' }}>{info.id}</span>
      </div>
    </div>
  );
}
