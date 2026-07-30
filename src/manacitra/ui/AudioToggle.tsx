import { useManacitraStore } from '../store';

export default function AudioToggle() {
  const muted = useManacitraStore(s => s.audioMuted);
  const toggle = useManacitraStore(s => s.toggleAudio);

  return (
    <button
      onClick={toggle}
      aria-pressed={!muted}
      aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      title={muted ? 'Unmute' : 'Mute'}
      style={{
        background: !muted ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${!muted ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 6, padding: '4px 8px', cursor: 'pointer',
        color: !muted ? '#93c5fd' : 'rgba(255,255,255,0.4)',
        fontSize: '.8rem', lineHeight: 1,
      }}
    >
      {muted ? '♪' : '♪'}
    </button>
  );
}
