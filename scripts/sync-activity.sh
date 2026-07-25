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
    entries.push({ phase: "", project: repo, description: msg, date, status: "completed" });
  }
}

entries.sort((a,b) => b.date.localeCompare(a.date));
const merged = [...entries, ...existing].slice(0, 30);
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
