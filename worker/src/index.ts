export interface Env {
  CONTACT_KV: KVNamespace
  RESEND_API_KEY?: string
}

const ALLOWED_ORIGINS = ['https://sdachary.github.io', 'http://localhost:5173', 'http://localhost:4173']
const CORRECT_EMAIL = 'deepakachary246@gmail.com'

function corsHeaders(origin: string): Record<string, string> {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : 'https://sdachary.github.io'
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || ''
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const headers = corsHeaders(origin)

    try {
      const body: Record<string, unknown> = await request.json()
      const { name, email, message } = body as { name?: string; email?: string; message?: string }

      if (!name || !email || !message) {
        return new Response(JSON.stringify({ error: 'name, email, and message are required' }), {
          status: 400, headers: { ...headers, 'Content-Type': 'application/json' },
        })
      }

      const entry = { name, email, message, timestamp: new Date().toISOString(), ip: request.headers.get('CF-Connecting-IP') || '' }
      const key = `contact:${Date.now()}`
      await env.CONTACT_KV.put(key, JSON.stringify(entry), { expirationTtl: 7776000 })

      if (env.RESEND_API_KEY) {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Portfolio Contact <contact@sdachary.workers.dev>',
            to: CORRECT_EMAIL,
            subject: `Portfolio Contact: ${name}`,
            text: `From: ${name} (${email})\n\n${message}`,
          }),
        })
        if (!emailRes.ok) console.error('Resend failed:', await emailRes.text())
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200, headers: { ...headers, 'Content-Type': 'application/json' },
      })
    } catch {
      return new Response(JSON.stringify({ error: 'Internal error' }), {
        status: 500, headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }
  },
}
