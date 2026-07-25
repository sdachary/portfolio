#!/usr/bin/env bash
set -euo pipefail
# sync-manacitra.sh — update infrastructure data (health checks) and push to portfolio
# Runs on oradev. Systemd timer: manacitra-sync.timer (weekly)

REPO_DIR="/home/deepak/Work/portfolio"
DATA_FILE="public/manacitra/data.json"

cd "$REPO_DIR"

git pull --ff-only origin main

if [ ! -f "$DATA_FILE" ]; then
  echo "ERROR: $DATA_FILE not found"
  exit 1
fi

TMP=$(mktemp)
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$DATA_FILE', 'utf8'));

async function check(url, timeout=5000) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), timeout);
  try {
    const r = await fetch(url, { signal: c.signal, method: 'HEAD' });
    clearTimeout(t);
    return r.ok;
  } catch {
    clearTimeout(t);
    return false;
  }
}

async function run() {
  data.generated_at = new Date().toISOString();

  const checks = [
    { id: 'nginx',       url: 'http://140.245.227.176' },
    { id: 'postgrest',   url: 'http://140.245.227.176:3000' },
    { id: 'better-auth', url: 'http://140.245.227.176:4000/api/auth/health' },
    { id: 'mail-relay',  url: 'http://140.245.227.176:4001/health' },
    { id: 'kubera',      url: 'http://140.245.227.176:3002' },
    { id: 'bepara-api',  url: 'http://140.245.227.176:3001/api/health' },
    { id: 'unnati-server',url:'http://140.245.227.176:4002/api/health' },
    { id: 'headroom',    url: 'http://140.245.227.176:8787' },
    { id: 'uptime-kuma', url: 'http://140.245.227.176:3003' },
    { id: 'mcp-hub',     url: 'http://localhost:3000/api/admin/health' },
    { id: 'paca',        url: 'http://localhost:4000' },
    { id: 'nim-proxy',   url: 'http://localhost:8082' },
    { id: 'ttyd',        url: 'http://localhost:7681' },
    { id: 'cloudflared', url: 'http://localhost:2000/health' },
    { id: 'minio',       url: 'http://localhost:9000/minio/health/live' },
    { id: 'chitragupta', url: 'https://chitragupta.pages.dev' },
    { id: 'bepara',      url: 'https://bepara.pages.dev' },
    { id: 'udhyam',      url: 'https://udhyam.pages.dev' },
    { id: 'kubera-dash', url: 'https://kubera-d4k.pages.dev' },
    { id: 'unnati',      url: 'https://unnati-70z.pages.dev' },
    { id: 'vishwakarma', url: 'https://vishwakarma.pages.dev' },
    { id: 'saraswati',   url: 'https://saraswati-7v3.pages.dev' },
    { id: 'darpan',      url: 'https://darpan.pages.dev' },
    { id: 'narad',       url: 'https://narad-7hc.pages.dev' },
    { id: 'portfolio',   url: 'https://sdachary.github.io/portfolio' },
  ];

  const results = {};
  await Promise.all(checks.map(async (c) => {
    const ok = await check(c.url);
    results[c.id] = ok;
    process.stdout.write(ok ? '.' : 'x');
  }));
  console.log();

  const health = {};
  for (const [id, ok] of Object.entries(results)) {
    health[id] = { online: ok, checked_at: data.generated_at };
  }
  data.health = health;

  // count online
  const online = Object.values(health).filter(h => h.online).length;
  data.stats = data.stats || {};
  data.stats.online = online;
  data.stats.total = Object.keys(health).length;

  fs.writeFileSync('$DATA_FILE', JSON.stringify(data, null, 2) + '\n');
  console.log('Health: %d/%d online', online, data.stats.total);
}

run().catch(e => { console.error(e); process.exit(1); });
" 2>&1 | tee "$TMP"

if grep -q 'x' "$TMP"; then
  echo "Some services unreachable — still committing."
fi

git add "$DATA_FILE"
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  git commit -m "sync: manacitra health check $(date +%F)"
  git push origin main
  echo "Pushed updated data.json"
fi
