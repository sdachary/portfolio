import { useEffect } from 'react';
import { useManacitraStore } from '../store';

export function useReducedMotion() {
  const storeVal = useManacitraStore(s => s.reducedMotion);
  const setReducedMotion = useManacitraStore(s => s.setReducedMotion);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    if (mq.matches) setReducedMotion(true);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [setReducedMotion]);

  return storeVal;
}
