import { useEffect, useState } from 'react';
import type { ManacitraData } from './types';

export function useManacitraData(): {
  data: ManacitraData | null;
  online: number;
  offline: number;
  total: number;
} {
  const [data, setData] = useState<ManacitraData | null>(null);
  const [online, setOnline] = useState(0);
  const [offline, setOffline] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('/manacitra/data.json')
      .then(r => r.json())
      .then((d: ManacitraData) => {
        setData(d);
        let on = 0, off = 0, t = 0;
        const allIds = new Set<string>();
        d.islands.forEach(i => i.buildings.forEach(b => allIds.add(b.id)));
        d.floating.forEach(f => allIds.add(f.id));
        allIds.forEach(id => {
          t++;
          const h = d.health[id];
          if (!h) return;
          h.online ? on++ : off++;
        });
        setOnline(on);
        setOffline(off);
        setTotal(t);
      });
  }, []);

  return { data, online, offline, total };
}
