import { useManacitraStore } from '../store';

export default function SearchBar() {
  const q = useManacitraStore(s => s.searchQuery);
  const set = useManacitraStore(s => s.setSearchQuery);

  return (
    <input
      type="search"
      value={q}
      onChange={e => set(e.target.value)}
      placeholder="Search services..."
      aria-label="Search services"
      style={{
        background: 'rgba(4,6,14,0.75)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, padding: '6px 12px', color: '#c8d0e0',
        fontSize: '.8rem', outline: 'none', width: 180,
      }}
    />
  );
}
