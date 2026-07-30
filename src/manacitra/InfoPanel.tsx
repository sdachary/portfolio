import { motion, AnimatePresence } from 'framer-motion';
import { useManacitraStore } from './store';
import { useMemo } from 'react';
import { EASE, DURATION } from './motion/constants';

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

  const close = () => { setSelected(null); flyHome(); };

  return (
    <AnimatePresence>
      {info && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: DURATION.panel / 1000, ease: EASE.standard }}
          style={{
            position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 20,
            background: 'rgba(4,6,14,0.85)', backdropFilter: 'blur(24px)',
            border: `1px solid ${info.color}33`, borderRadius: 16,
            padding: '1rem 1.5rem', minWidth: 280, maxWidth: 400,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.5rem' }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>{info.name}</div>
              <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '.15em', marginTop: 2 }}>{info.type} · {info.island}</div>
            </div>
            <button
              onClick={close}
              style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.4)', borderRadius: 8, width: 28, height: 28, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >✕</button>
          </div>
          <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, margin: '0 0 .75rem' }}>{info.desc}</p>
          <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', background: info.online === null ? '#4466aa' : info.online ? '#22c55e' : '#ef4444', boxShadow: `0 0 8px ${info.online === null ? '#4466aa' : info.online ? '#22c55e' : '#ef4444'}66` }}
            />
            <span style={{ fontSize: '.75rem', color: info.online === null ? '#4466aa' : info.online ? '#22c55e' : '#ef4444' }}>
              {info.online === null ? 'Unknown' : info.online ? 'Online' : 'Offline'}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
            <span style={{ fontSize: '.7rem', color: 'rgba(255,255,255,0.2)' }}>{info.id}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
