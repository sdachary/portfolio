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
        background: hc ? 'rgba(28,28,26,0.08)' : 'transparent',
        border: `1px solid ${hc ? 'rgba(28,28,26,0.15)' : 'rgba(28,28,26,0.08)'}`,
        borderRadius: 6, padding: '4px 8px', cursor: 'pointer',
        color: hc ? '#1c1c1a' : 'rgba(28,28,26,0.4)',
        fontSize: '.8rem', lineHeight: 1, fontFamily: 'inherit',
      }}
    >
      {hc ? 'Aa+' : 'Aa'}
    </button>
  );
}