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
              background: active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}`,
              borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
              color: active ? '#c8d0e0' : 'rgba(255,255,255,0.25)',
              fontSize: '.75rem',
            }}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
