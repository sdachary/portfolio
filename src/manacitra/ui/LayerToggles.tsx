import { useManacitraStore } from '../store';
import type { VisibleLayers } from '../store';

const LAYERS: { key: keyof VisibleLayers; label: string }[] = [
  { key: 'islands', label: 'Islands' },
  { key: 'floating', label: 'Floating' },
  { key: 'connections', label: 'Connections' },
  { key: 'labels', label: 'Labels' },
];

export default function LayerToggles() {
  const layers = useManacitraStore(s => s.visibleLayers);
  const toggle = useManacitraStore(s => s.toggleLayer);

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {LAYERS.map(l => {
        const active = layers[l.key];
        return (
          <button
            key={l.key}
            onClick={() => toggle(l.key)}
            aria-pressed={active}
            style={{
              background: active ? 'rgba(28,28,26,0.08)' : 'transparent',
              border: `1px solid ${active ? 'rgba(28,28,26,0.15)' : 'rgba(28,28,26,0.06)'}`,
              borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
              color: active ? '#1c1c1a' : 'rgba(28,28,26,0.3)',
              fontSize: '.75rem', fontFamily: 'inherit',
            }}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}