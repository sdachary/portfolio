import { motion, AnimatePresence } from 'framer-motion';
import { useManacitraStore } from './store';
import { useMemo } from 'react';
import { EASE, DURATION } from './motion/constants';

function StatusDot({ online }: { online: boolean | null }) {
  const reduced = useManacitraStore(s => s.reducedMotion);
  const bg = online === null ? '#8a8577' : online ? '#2f6d4f' : '#b5472e';
  return (
    <motion.span
      animate={reduced ? {} : { scale: [1, 1.2, 1] }}
      transition={reduced ? {} : { repeat: Infinity, duration: 2, ease: 'easeInOut', repeatDelay: 3 }}
      style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', background: bg }}
    />
  );
}

export default function InfoPanel() {
  const data = useManacitraStore(s => s.data);
  const hoveredId = useManacitraStore(s => s.hoveredId);
  const selectedId = useManacitraStore(s => s.selectedId);
  const setSelected = useManacitraStore(s => s.setSelected);

  const activeId = hoveredId ?? selectedId;

  const info = useMemo(() => {
    if (!data || !activeId) return null;
    for (const zone of data.zones) {
      for (const svc of zone.services) {
        if (svc.id === activeId) {
          const h = data.health[activeId];
          return { name: svc.name, type: svc.type, desc: svc.desc, color: svc.color, online: h?.online ?? null, zone: zone.label, id: svc.id, url: svc.url };
        }
      }
    }
    return null;
  }, [data, activeId]);

  const isHover = hoveredId !== null && hoveredId === activeId;
  const close = () => setSelected(null);

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
            background: 'rgba(247,245,240,0.94)', backdropFilter: 'blur(24px)',
            border: `1px solid ${info.color}44`, borderRadius: 12,
            padding: '1rem 1.5rem', minWidth: 280, maxWidth: 400,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.5rem' }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1c1c1a', letterSpacing: '-0.01em' }}>{info.name}</div>
              <div style={{ fontSize: '.7rem', color: 'rgba(28,28,26,0.4)', textTransform: 'uppercase', letterSpacing: '.12em', marginTop: 2 }}>{info.type} · {info.zone}</div>
            </div>
            {!isHover && (
              <button
                onClick={close}
                style={{ background: 'rgba(28,28,26,0.06)', border: 'none', color: 'rgba(28,28,26,0.4)', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >✕</button>
            )}
          </div>
          <p style={{ fontSize: '.8rem', color: 'rgba(28,28,26,0.65)', lineHeight: 1.5, margin: '0 0 .75rem' }}>{info.desc}</p>
          <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
            <StatusDot online={info.online} />
            <span style={{ fontSize: '.75rem', color: info.online === null ? '#8a8577' : info.online ? '#2f6d4f' : '#b5472e' }}>
              {info.online === null ? 'Unknown' : info.online ? 'Online' : 'Offline'}
            </span>
            <span style={{ color: 'rgba(28,28,26,0.12)' }}>|</span>
            <span style={{ fontSize: '.7rem', color: 'rgba(28,28,26,0.25)' }}>{info.id}</span>
          </div>
          {info.url && (
            <div style={{ marginTop: '.6rem' }}>
              <a href={info.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: '.72rem', color: '#1c1c1a', textDecoration: 'none', borderBottom: '1px dashed rgba(28,28,26,0.3)' }}>
                {info.url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
