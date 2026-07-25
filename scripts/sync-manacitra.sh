#!/usr/bin/env bash
set -euo pipefail
REPO_DIR="${REPO_DIR:-/home/ubuntu/portfolio}"
DATA_FILE="public/manacitra/data.json"

cd "$REPO_DIR"
git pull --ff-only origin main

[ -f "$DATA_FILE" ] || { echo "ERROR: $DATA_FILE not found"; exit 1; }

TMP=$(mktemp)

node -e "
const fs = require('fs');
const { execSync } = require('child_process');
const data = JSON.parse(fs.readFileSync('$DATA_FILE', 'utf8'));

async function check(url, timeout=4000) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), timeout);
  try {
    const r = await fetch(url, { signal: c.signal, method: 'GET', redirect: 'follow' });
    clearTimeout(t);
    return r.ok || [301, 302, 308, 401, 405].includes(r.status);
  } catch {
    clearTimeout(t);
    return false;
  }
}

async function run() {
  data.generated_at = new Date().toISOString();

  const checks = [
    // oradb services — checked via SSH (curl localhost on oradb)
    { id: 'nginx',       cmd: 'ssh -o StrictHostKeyChecking=accept-new 140.245.227.176 "curl -s -o /dev/null -w %{http_code} http://localhost 2>/dev/null" 2>/dev/null | grep -qE "^[234]"', ssh: true },
    { id: 'postgrest',   cmd: 'ssh -o StrictHostKeyChecking=accept-new 140.245.227.176 "curl -s -o /dev/null -w %{http_code} http://localhost:3000 2>/dev/null" 2>/dev/null | grep -qE "^[234]"', ssh: true },
    { id: 'better-auth', cmd: 'ssh -o StrictHostKeyChecking=accept-new 140.245.227.176 "curl -s -o /dev/null -w %{http_code} http://localhost:4000/api/auth/health 2>/dev/null" 2>/dev/null | grep -qE "^[234]"', ssh: true },
    { id: 'mail-relay',  cmd: 'ssh -o StrictHostKeyChecking=accept-new 140.245.227.176 "curl -s -o /dev/null -w %{http_code} http://localhost:4001/health 2>/dev/null" 2>/dev/null | grep -qE "^[234]"', ssh: true },
    { id: 'kubera',      cmd: 'ssh -o StrictHostKeyChecking=accept-new 140.245.227.176 "curl -s -o /dev/null -w %{http_code} http://localhost:3002 2>/dev/null" 2>/dev/null | grep -qE "^[234]"', ssh: true },
    { id: 'bepara-api',  cmd: 'ssh -o StrictHostKeyChecking=accept-new 140.245.227.176 "curl -s -o /dev/null -w %{http_code} http://localhost:3001/api/health 2>/dev/null" 2>/dev/null | grep -qE "^[234]"', ssh: true },
    { id: 'unnati-server',cmd:'ssh -o StrictHostKeyChecking=accept-new 140.245.227.176 "curl -s -o /dev/null -w %{http_code} http://localhost:4002/api/health 2>/dev/null" 2>/dev/null | grep -qE "^[234]"', ssh: true },
    { id: 'headroom',    cmd: 'ssh -o StrictHostKeyChecking=accept-new 140.245.227.176 "curl -s -o /dev/null -w %{http_code} http://localhost:8787 2>/dev/null" 2>/dev/null | grep -qE "^[234]"', ssh: true },
    { id: 'uptime-kuma', cmd: 'ssh -o StrictHostKeyChecking=accept-new 140.245.227.176 "curl -s -o /dev/null -w %{http_code} http://localhost:3003 2>/dev/null" 2>/dev/null | grep -qE "^[234]"', ssh: true },
    { id: 'pg16',        cmd: 'ssh -o StrictHostKeyChecking=accept-new 140.245.227.176 "pg_isready -q" 2>/dev/null', ssh: true },
    { id: 'redis',       cmd: 'ssh -o StrictHostKeyChecking=accept-new 140.245.227.176 "redis-cli ping" 2>/dev/null | grep -q PONG', ssh: true },
    { id: 'mcp-hub',     url: 'http://localhost:3000/api/health' },
    { id: 'paca',        url: 'http://localhost:80/' },
    { id: 'nim-proxy',   url: 'http://localhost:8082/' },
    { id: 'ttyd',        url: 'http://localhost:7681/' },
    { id: 'minio',       cmd: 'sudo docker inspect paca-minio-1 2>/dev/null | python3 -c "import json,sys; print(0 if json.load(sys.stdin)[0][\"State\"][\"Health\"][\"Status\"]==\"healthy\" else 1)"', ssh: true },
    { id: 'cloudflared', cmd: 'ssh -o StrictHostKeyChecking=accept-new 140.245.227.176 "curl -s -o /dev/null -w %{http_code} http://localhost:3002 2>/dev/null" 2>/dev/null | grep -qE "^[234]"', ssh: true },
    // CF Pages — direct HTTP
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
  let idx = 0;
  for (const c of checks) {
    let ok;
    if (c.ssh) {
      try {
        execSync(c.cmd, { timeout: 8000, stdio: 'pipe' });
        ok = true;
      } catch {
        ok = false;
      }
    } else {
      ok = await check(c.url);
    }
    results[c.id] = ok;
    process.stdout.write(ok ? '.' : 'x');
    idx++;
  }
  console.log();

  const health = {};
  for (const [id, ok] of Object.entries(results)) {
    health[id] = { online: ok, checked_at: data.generated_at };
  }
  data.health = health;

  const online = Object.values(health).filter(h => h.online).length;
  data.stats = data.stats || {};
  data.stats.online = online;
  data.stats.total = Object.keys(health).length;
  data.stats.total_services = online;

  fs.writeFileSync('$DATA_FILE', JSON.stringify(data, null, 2) + '\n');
  console.log('Health: %d/%d online', online, data.stats.total);
}

run().catch(e => { console.error(e); process.exit(1); });
" 2>&1 | tee "$TMP"

git add "$DATA_FILE"
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  git commit -m "sync: manacitra $(date +%F)"
  git push origin main
  echo "Pushed."
fi
