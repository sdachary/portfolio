export interface Env {
  TELEGRAM_BOT_TOKEN: string
  TELEGRAM_CHAT_ID: string
}

async function sendTelegram(text: string, env: Env): Promise<boolean> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return false
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown' }),
  })
  return res.ok
}

function formatGitHub(body: any): string {
  const run = body.workflow_run || {}
  const repo = body.repository?.full_name || 'unknown'
  const action = body.action || 'unknown'
  const conclusion = run.conclusion || ''
  const name = run.name || 'unknown'
  const url = run.html_url || ''
  const actor = body.sender?.login || 'unknown'
  const emoji = conclusion === 'failure' || conclusion === 'cancelled' ? '❌' : conclusion === 'success' ? '✅' : '⚠️'
  return `${emoji} *GitHub Actions* \`${repo}\`\n*Workflow:* ${name}\n*Action:* ${action}\n*Conclusion:* ${conclusion}\n*Triggered by:* ${actor}\n${url ? `[View Run](${url})` : ''}`
}

function formatSentry(body: any): string {
  const event = body.event || body || {}
  const title = event.title || body.message || 'unknown error'
  const project = body.project_name || body.project || 'unknown'
  const level = event.level || body.level || 'error'
  const url = event.web_url || event.url || ''
  const culprit = event.culprit || event.transaction || ''
  const emoji = level === 'error' ? '🚨' : level === 'warning' ? '⚠️' : '🔍'
  return `${emoji} *Sentry Alert* \`${project}\`\n*Level:* ${level}\n*Error:* ${title}\n${culprit ? `*Culprit:* ${culprit}` : ''}\n${url ? `[View Event](${url})` : ''}`
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const url = new URL(request.url)
    let body: any

    try {
      body = await request.json()
    } catch {
      return new Response('Invalid JSON', { status: 400 })
    }

    let text = ''

    if (url.pathname === '/github') {
      text = formatGitHub(body)
    } else if (url.pathname === '/sentry') {
      text = formatSentry(body)
    } else {
      return new Response('Not found', { status: 404 })
    }

    const ok = await sendTelegram(text, env)
    return new Response(ok ? 'ok' : 'telegram failed', { status: ok ? 200 : 502 })
  },
}
