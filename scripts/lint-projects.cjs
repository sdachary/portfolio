#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'public/projects.json');
const MAX_DAYS = 60;

const projects = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const now = Date.now();
let errors = 0;

const staleTokens = [
  'three.js', 'r3f', 'react three', 'kubera', 'unnati',
  'github pages', 'devendra', 'sentry', 'isometric',
];
const formerlyOk = /formerly (kanak|narad|kubera|unnati)/i;
const repoIsSubApp = ['manacitra', 'portfolio'];

function fail(msg) { errors++; console.log('✗ ' + msg); }

for (const p of projects) {
  const ageDays = (now - new Date(p.last_updated).getTime()) / 864e5;
  if (ageDays > MAX_DAYS) {
    fail(`${p.slug}: last_updated ${p.last_updated} is ${Math.round(ageDays)}d old (> ${MAX_DAYS}d)`);
  }
  const text = (p.description + ' ' + p.tags.join(' ')).toLowerCase();
  for (const t of staleTokens) {
    if (text.includes(t) && !formerlyOk.test(p.description)) {
      fail(`${p.slug}: stale token "${t}" in description/tags`);
    }
  }
  if (p.github_remote && !repoIsSubApp.includes(p.slug) && !p.github_remote.includes(`sdachary/${p.slug}.git`)) {
    fail(`${p.slug}: github_remote ${p.github_remote} doesn't match sdachary/${p.slug}.git`);
  }
  for (const field of ['name', 'slug', 'status', 'status_key', 'description', 'tags', 'last_updated', 'github_remote']) {
    if (!p[field]) fail(`${p.slug}: missing required field "${field}"`);
  }
}

if (errors === 0) {
  console.log('✓ projects.json is clean (' + projects.length + ' projects)');
} else {
  console.log(`\n${errors} issue(s) found. Fix before committing.`);
  process.exit(1);
}
