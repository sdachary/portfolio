import { useState } from 'react';
import { useManacitraStore } from '../store';

export default function TouchControls() {
  const flyHome = useManacitraStore(s => s.flyHome);
  const [isTouch] = useState(() => typeof window !== 'undefined' && 'ontouchstart' in window);

  if (!isTouch) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '5.5rem', right: '1rem', zIndex: 30,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <button
        onClick={flyHome}
        aria-label="Return to overview"
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(4,6,14,0.75)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
          fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        ⌂
      </button>
    </div>
  );
}
