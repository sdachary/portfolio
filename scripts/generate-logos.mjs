#!/usr/bin/env node
// Regenerates src/manacitra/logos.ts from the official simple-icons registry.
// Only real brand marks are emitted (no invented glyphs) — if a requested slug is
// missing from simple-icons, generation FAILS so we never silently ship a gap.
// Usage: node scripts/generate-logos.mjs

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as si from 'simple-icons';

const KEY_TO_EXPORT = {
  cloudflare: 'siCloudflare',
  cloudflareworkers: 'siCloudflareworkers',
  github: 'siGithub',
  googlecloud: 'siGooglecloud',
  grafana: 'siGrafana',
  hono: 'siHono',
  html5: 'siHtml5',
  javascript: 'siJavascript',
  minio: 'siMinio',
  nestjs: 'siNestjs',
  nextdotjs: 'siNextdotjs',
  nginx: 'siNginx',
  nvidia: 'siNvidia',
  pihole: 'siPihole',
  postgresql: 'siPostgresql',
  rails: 'siRubyonrails',
  react: 'siReact',
  redis: 'siRedis',
  sentry: 'siSentry',
  tailscale: 'siTailscale',
  uptimekuma: 'siUptimekuma',
  vite: 'siVite',
};

const missing = Object.values(KEY_TO_EXPORT).filter((name) => !(name in si));
if (missing.length) {
  console.error(`generate-logos: missing simple-icons exports: ${missing.join(', ')}`);
  process.exit(1);
}

const entries = Object.entries(KEY_TO_EXPORT)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, exportName]) => {
    const icon = si[exportName];
    return `  ${key}: { color: '#${icon.hex}', vb: '0 0 24 24', d: '${icon.path}' },`;
  })
  .join('\n');

const header = `// Auto-generated brand logo path data (simple-icons, embedded). Generated ${new Date().toISOString().slice(0, 10)} by scripts/generate-logos.mjs — do not hand-edit.

export interface LogoDef { color: string; d: string; vb: string }

const BRAND: Record<string, LogoDef> = {
${entries}
};

// only official brand logos are rendered; services without one are text-only
// tiles (no invented glyphs). Add KEY_TO_EXPORT entries to the generator, then
// re-run: node scripts/generate-logos.mjs
export function logoFor(key: string): LogoDef | null {
  return BRAND[key] ?? null;
}
`;

const out = resolve(process.cwd(), 'src/manacitra/logos.ts');
writeFileSync(out, header);
console.log(`generate-logos: wrote ${entries.length} official logos -> src/manacitra/logos.ts`);