import { useManacitraStore } from '../store';

export default function AudioToggle() {
  const muted = useManacitraStore(s => s.audioMuted);
  const available = useManacitraStore(s => s.audioAvailable);
  const toggle = useManacitraStore(s => s.toggleAudio);

  return (
    <button
      onClick={toggle}
      disabled={!available}
      aria-pressed={!muted}
      aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      title={available ? (muted ? 'Unmute' : 'Mute') : 'Audio unavailable'}
      style={{
        background: !muted ? 'rgba(28,28,26,0.08)' : 'transparent',
        border: `1px solid ${!muted ? 'rgba(28,28,26,0.15)' : 'rgba(28,28,26,0.08)'}`,
        borderRadius: 6, padding: '4px 8px', cursor: available ? 'pointer' : 'not-allowed',
        color: !muted ? '#1c1c1a' : 'rgba(28,28,26,0.4)',
        fontSize: '.8rem', lineHeight: 1, opacity: available ? 1 : 0.35,
        fontFamily: 'inherit',
      }}
    >
      {muted ? '♪' : '♫'}
    </button>
  );
}