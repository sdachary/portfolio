import { useManacitraStore } from '../store';

export default function ContrastToggle() {
  const hc = useManacitraStore(s => s.highContrast);
  const set = useManacitraStore(s => s.setHighContrast);

  return (
    <button
      onClick={() => set(!hc)}
      aria-pressed={hc}
      aria-label="Toggle high contrast"
      title="High contrast"
      style={{
        background: hc ? 'rgba(107,122,153,0.2)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hc ? 'rgba(107,122,153,0.3)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 6, padding: '4px 8px', cursor: 'pointer',
        color: hc ? '#c8d0e0' : 'rgba(255,255,255,0.4)',
        fontSize: '.8rem', lineHeight: 1,
      }}
    >
      {hc ? 'Aa+' : 'Aa'}
    </button>
  );
}