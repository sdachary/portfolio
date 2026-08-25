export interface BlogPost {
  slug: string
  title: string
  date: string
  tags: string[]
  body: string
}

const posts: BlogPost[] = [
  {
    slug: 'darpan-scan-engine',
    title: 'Building Darpan: An AI Vulnerability Scanner',
    date: '2026-07-10',
    tags: ['darpan', 'ai', 'security'],
    body: `
      <p>Darpan started as a weekend experiment — can we build a web vulnerability scanner that actually understands what it finds? Most scanners are regex-based noise machines. I wanted something that reads a page like a security engineer would.</p>
      <p>The architecture is simple: a Cloudflare Worker crawls the target, extracts DOM + JS, sends it to Gemini for analysis, and stores findings in D1. The AI handles what would've been 200 lines of heuristic rules in a single prompt: <code>Analyze this page for XSS, CSRF, exposed secrets, and misconfigurations. Be specific about what you find and how to fix it.</code></p>
      <p>The killer feature turned out to be scheduled scans and PDF reports. You set a URL, pick daily/weekly scans, and get a Slack-ready PDF in your inbox. Built with <strong>ponytail</strong> discipline — the cron handler is 40 lines, the PDF generator wraps html2canvas+jsPDF in a React portal.</p>
      <p>Lessons: AI scanners hallucinate findings about 15% of the time, so every finding needs a "confidence" field. Also, rate limiting matters — you can't scan a production site every 5 minutes without asking.</p>
    `,
  },
  {
    slug: 'saraswati-kids-coding',
    title: 'Teaching Kids to Code with Saraswati',
    date: '2026-07-05',
    tags: ['saraswati', 'education', 'game-design'],
    body: `
      <p>Saraswati is a coding education platform for kids 8-14. The core insight: kids don't learn from tutorials, they learn from games that trick them into understanding concepts.</p>
      <p>The platform has snake-ladder (deployed with premium animations), random color game, and levels covering loops, conditionals, and debugging. Each level is a mini-game where the answer is a code snippet. Kids type Python to solve puzzles — the game interprets their answer against expected patterns.</p>
      <p>Technical choices: localStorage for progress (no auth friction for kids), printable certificates via <code>@media print</code> CSS, and a badge system that tracks streaks. The certificate modal shows stars for completed levels — kids love collecting them.</p>
      <p>What surprised me: the debugging puzzle was the most popular level. Kids enjoy being "detectives" more than writing code from scratch.</p>
    `,
  },
  {
    slug: 'sampada-multi-tenant',
    title: 'Sampada Goes Multi-Tenant',
    date: '2026-06-28',
    tags: ['sampada', 'architecture', 'infra'],
    body: `
      <p>Sampada, the personal finance app, got a full multi-tenant refactor. The old model was single-user — great for me, useless for anyone else. The new model: BYO database with API keys, isolated schemas in Postgres, and Rack::Attack rate limiting.</p>
      <p>The migration touched 16 database migrations, the entire auth flow, and every controller. The hardest part was preserving backward compatibility — existing users shouldn't notice the change. Solution: a <code>current_tenant</code> method that checks API key header first, falls back to session-based user, and defaults to the original single-tenant path.</p>
      <p>Deployed on <strong>oradb</strong> (140.245.227.176) with Docker + host Redis + Nginx nip.io proxy at <code>sampada.140.245.227.176.nip.io</code>. The multi-stage Docker build reduced image size from 1.2GB to 480MB.</p>
    `,
  },
  {
    slug: 'mcp-hub-architecture',
    title: 'Building MCP Hub: The AI Router',
    date: '2026-06-20',
    tags: ['mcp-hub', 'architecture', 'ai'],
    body: `
      <p>MCP Hub started as a simple proxy — route prompts to the cheapest available AI model. It grew into something bigger: a skill engine, a workflow orchestrator, a code-review-graph analyzer, and a memory system.</p>
      <p>The architecture is a Python FastAPI server with plugin-based tool registration. Skills are versioned Markdown files with execution metadata. The evolution engine analyzes execution results and auto-improves skills over time.</p>
      <p>The most-used feature is <code>detect_changes</code> — before I edit any repo, this tool tells me what functions I'll affect, what tests might break, and how many tokens I'll save by understanding the code graph first. It's saved me hours of context window waste.</p>
      <p>Running on <strong>oradev</strong> (68.233.97.153) behind a cloudflared tunnel, wired into my local coding agents over SSH (<code>ssh -fNL 3001:localhost:3000 oradev</code>). Multi-provider model routing sits on top, so agents fail over between providers instead of dying when one route goes stale.</p>
    `,
  },
  {
    slug: 'ponytail-philosophy',
    title: 'Why I Ship Less Code Now',
    date: '2026-06-15',
    tags: ['philosophy', 'engineering'],
    body: `
      <p>I started using <strong>ponytail</strong> — a development philosophy that asks one question before every line of code: "Does this need to exist?"</p>
      <p>The ladder: YAGNI first, then check the codebase (it probably already has what you need), then standard library, then native platform features, then existing dependencies, then one line, then — only then — the minimum code that works.</p>
      <p>The results surprised me. A feature I'd normally estimate at 200 lines became 40. A bug fix that would've touched 3 files was a single guard in a shared function. The code I do write is more correct because I spend more time understanding the problem and less time typing.</p>
      <p>Counterintuitive insight: being lazy about writing code makes you more diligent about reading it. You can't find the one-line fix in a function you haven't traced.</p>
    `,
  },
]

export default posts
