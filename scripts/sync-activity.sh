#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$HOME/portfolio"
REPO_URL="git@github.com:sdachary/portfolio.git"

if [ ! -d "$REPO_DIR" ]; then
  git clone "$REPO_URL" "$REPO_DIR"
fi

cd "$REPO_DIR"
git fetch origin main
git reset --hard origin/main

curl -sf "https://api.github.com/users/sdachary/events/public?per_page=60" > events.json

node -e '
const fs = require("fs");
const events = JSON.parse(fs.readFileSync("events.json","utf8"));
const existing = JSON.parse(fs.readFileSync("public/activity.json","utf8"));

// A3: small manual map — repo (uppercased) -> current phase, applied to NEW entries only.
// Existing entries keep their stored phase. Keep in sync with wiki/ROADMAP.md when phases roll.
const PHASE_MAP = {
  PORTFOLIO: "Phase 61", NIDHIFLOW: "Phase 58", SAMPADA: "Phase 57", SADHAN: "Phase 60",
  MCP_HUB: "Phase 52", BEPARA: "Phase 61", CHITRAGUPTA: "Phase 61", DARPAN: "Phase 61",
  KARMA: "Phase 61", PRAYOG: "Phase 61", SRI: "Phase 61", UDHYAM: "Phase 61",
  VISHWAKARMA: "Phase 61", INDRA: "Phase 61", PACA: "Phase 52",
};
const phaseFor = repo => PHASE_MAP[repo] || "";

// A2: kind derived from conventional commit prefix
function kindFor(msg) {
  const m = msg.match(/^(feat|fix|docs|refactor|perf|test|build|ci|style|revert)(\(|:)/);
  const kind = m ? m[1] : "chore";
  return { feat: "feature", fix: "bugfix", perf: "perf", test: "test", docs: "docs",
           refactor: "refactor", build: "build", ci: "build", style: "chore", revert: "chore" }[kind] || "chore";
}

const seen = new Set(existing.map(e => e.date+"|"+e.project+"|"+e.description));
const since = new Date(Date.now() - 7*864e5);

const pushEvents = events.filter(e => e.type === "PushEvent" && new Date(e.created_at) > since);

const entries = [];
for (const ev of pushEvents) {
  const repo = ev.repo.name.replace("sdachary/","").toUpperCase();
  const date = ev.created_at.split("T")[0];
  for (const c of (ev.payload.commits || [])) {
    const msg = c.message.split("\n")[0];
    if (!msg || msg.startsWith("Merge") || msg.startsWith("chore:") || msg.startsWith("WIP")) continue;
    const key = date+"|"+repo+"|"+msg;
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push({ kind: kindFor(msg), phase: phaseFor(repo), project: repo, description: msg, date, status: "completed" });
  }
}

entries.sort((a,b) => b.date.localeCompare(a.date));

// A2: per-day dedupe — collapse multiple commits from the same repo+kind on the same day
// into one entry (keep the most recent description, count the rest). Prevents row spam.
const byDay = new Map();
for (const e of entries) {
  const k = e.date+"|"+e.project+"|"+e.kind;
  const prev = byDay.get(k);
  if (prev) { prev.count = (prev.count || 1) + 1; continue; }
  byDay.set(k, e);
}
const deduped = [...byDay.values()];

const merged = [...deduped, ...existing].slice(0, 30);
fs.writeFileSync("public/activity.json", JSON.stringify(merged, null, 2) + "\n");
'

rm -f events.json

git config user.name "portfolio-sync"
git config user.email "portfolio-sync@oradev"

git add public/activity.json
if git diff --staged --quiet; then
  echo "No new activity to sync"
else
  git commit -m "chore: sync activity [skip ci]"
  git push origin main
  echo "Activity synced"
fi
