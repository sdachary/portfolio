import { useManacitraStore } from '../store';

export default function SceneDescription() {
  const data = useManacitraStore(s => s.data);
  if (!data) return null;

  return (
    <div aria-live="polite" aria-label="Infrastructure map" style={{
      position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
      overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0,
    }}>
      <p>Infrastructure map with {data.stats.total_services} services across {data.stats.islands} islands and {data.stats.floating} floating apps.</p>
      <p>{data.stats.online} online, {data.stats.total - data.stats.online} offline.</p>
      <ul>
        {data.islands.map(isl => (
          <li key={isl.id}>
            {isl.name} — {isl.subtitle} ({isl.buildings.length} services)
            <ul>
              {isl.buildings.map(b => {
                const h = data.health[b.id];
                return (
                  <li key={b.id}>
                    {b.name} — {b.type} — {h ? (h.online ? 'Online' : 'Offline') : 'Unknown'}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
        {data.floating.length > 0 && (
          <li>
            Floating apps
            <ul>
              {data.floating.map(f => {
                const h = data.health[f.id];
                return (
                  <li key={f.id}>
                    {f.name} — {f.type} — {h ? (h.online ? 'Online' : 'Offline') : 'Unknown'}
                  </li>
                );
              })}
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
}
