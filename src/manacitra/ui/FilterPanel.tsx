import { useManacitraStore } from '../store';

const STATUS_OPTS: ('online' | 'offline')[] = ['online', 'offline'];

export default function FilterPanel() {
  const filters = useManacitraStore(s => s.filters);
  const set = useManacitraStore(s => s.setFilters);

  const toggleStatus = (s: 'online' | 'offline') => {
    const next = filters.status.includes(s)
      ? filters.status.filter(x => x !== s)
      : [...filters.status, s];
    set({ ...filters, status: next });
  };

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {STATUS_OPTS.map(s => {
        const active = filters.status.length === 0 || filters.status.includes(s);
        return (
          <button
            key={s}
            onClick={() => toggleStatus(s)}
            aria-pressed={active}
            style={{
              background: active ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${active ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
              color: active ? '#93c5fd' : 'rgba(255,255,255,0.3)',
              fontSize: '.75rem',
            }}
          >
            {s === 'online' ? '● Online' : '● Offline'}
          </button>
        );
      })}
    </div>
  );
}
