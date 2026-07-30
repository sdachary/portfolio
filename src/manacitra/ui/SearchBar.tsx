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
        background: 'rgba(28,28,26,0.04)', border: '1px solid rgba(28,28,26,0.10)',
        borderRadius: 6, padding: '6px 12px', color: '#1c1c1a',
        fontSize: '.8rem', outline: 'none', width: 180, fontFamily: 'inherit',
      }}
    />
  );
}