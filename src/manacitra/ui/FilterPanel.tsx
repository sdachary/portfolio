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
              background: active ? 'rgba(28,28,26,0.08)' : 'transparent',
              border: `1px solid ${active ? 'rgba(28,28,26,0.15)' : 'rgba(28,28,26,0.08)'}`,
              borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
              color: active ? '#1c1c1a' : 'rgba(28,28,26,0.35)',
              fontSize: '.75rem', fontFamily: 'inherit',
            }}
          >
            {s === 'online' ? '● Live' : '● Attention'}
          </button>
        );
      })}
    </div>
  );
}