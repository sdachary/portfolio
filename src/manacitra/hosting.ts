import type { Zone } from './types';

interface Hosting {
  short: string;
  label: string;
  who: string;
}

// Where a zone's hardware actually lives. This is the "on-prem" framing:
// self-hosted gear is what can go down and needs attention; edge-managed and
// third-party tiers are run for us by a provider.
const ZONE_HOSTING: Record<string, Hosting> = {
  oradb: { short: 'ON-PREM', label: 'on-prem · self-hosted', who: 'oradb (dedicated server)' },
  oradev: { short: 'ON-PREM', label: 'on-prem · self-hosted', who: 'oradev (dedicated server)' },
  personal: { short: 'ON-PREM', label: 'on-prem · home', who: 'home workstation' },
  cloudflare: { short: 'EDGE-MANAGED', label: 'edge-managed · Cloudflare', who: 'Cloudflare Pages' },
  external: { short: 'THIRD-PARTY', label: 'third-party', who: 'external provider' },
};

export function hostingFor(zone: Zone): Hosting | null {
  return ZONE_HOSTING[zone.id] ?? null;
}

export const HOSTING_TIERS: { short: string; label: string }[] = [
  { short: 'ON-PREM', label: 'on-prem · self-hosted' },
  { short: 'EDGE-MANAGED', label: 'edge-managed · Cloudflare' },
  { short: 'THIRD-PARTY', label: 'third-party' },
];