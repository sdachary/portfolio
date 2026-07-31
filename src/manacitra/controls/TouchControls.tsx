import { useState } from 'react';
import { useManacitraStore } from '../store';

export default function TouchControls() {
  const resetView = useManacitraStore(s => s.resetView);
  const [isTouch] = useState(() => typeof window !== 'undefined' && 'ontouchstart' in window);

  if (!isTouch) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '5.5rem', right: '1rem', zIndex: 30,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <button
        onClick={resetView}
        aria-label="Return to overview"
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(247,245,240,0.86)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(28,28,26,0.12)',
          color: 'rgba(28,28,26,0.5)', cursor: 'pointer',
          fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        ⌂
      </button>
    </div>
  );
}