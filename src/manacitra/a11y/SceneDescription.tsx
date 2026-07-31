import { useManacitraStore } from '../store';

export default function SceneDescription() {
  const data = useManacitraStore(s => s.data);
  if (!data) return null;

  return (
    <div aria-live="polite" aria-label="Infrastructure map" style={{
      position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
      overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0,
    }}>
      <p>Infrastructure map with {data.stats.total_services} services across {data.stats.zones} zones.</p>
      <p>{data.stats.online} online, {data.stats.total - data.stats.online} offline.</p>
      <ul>
        {data.zones.map(zone => (
          <li key={zone.id}>
            {zone.name} — {zone.subtitle} ({zone.services.length} services)
            <ul>
              {zone.services.map(svc => {
                const h = data.health[svc.id];
                return (
                  <li key={svc.id}>
                    {svc.name} — {svc.type} — {h ? (h.online ? 'Online' : 'Offline') : 'Unknown'}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
