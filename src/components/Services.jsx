import { motion } from 'framer-motion'

const services = [
  {
    num: '01',
    title: 'Data Analytics & BI',
    desc: 'End-to-end analytics pipelines, interactive dashboards, and statistical models that turn raw data into C-suite decisions. Python, SQL, Power BI, Tableau, GCP BigQuery.',
    audience: 'employer',
  },
  {
    num: '02',
    title: 'AI Infrastructure & Agents',
    desc: 'Multi-agent orchestration with MCP protocol, Claude API integration, n8n automation workflows, and custom AI tools for your business processes.',
    audience: 'client',
  },
  {
    num: '03',
    title: 'Cloud Architecture & DevOps',
    desc: 'Zero-trust infrastructure on GCP, Cloudflare, and Supabase. Terraform, WireGuard, CI/CD pipelines. Sovereign, India-resident infrastructure with no foreign dependencies.',
    audience: 'both',
  },
  {
    num: '04',
    title: 'Custom Software & SaaS',
    desc: 'Full-stack applications built with React, Vite, FastAPI, Hono, and Next.js. From inventory management to financial engines — shipped on Cloudflare Pages or your own infra.',
    audience: 'client',
  },
]

export default function Services() {
  return (
    <section id="services" style={{ background: 'var(--bg)', padding: '8rem 3rem', borderTop: '1px solid var(--line)' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: '4rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--line)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 7rem)',
          lineHeight: 1, color: 'var(--white)',
        }}>SERVICES</h2>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'var(--muted)', letterSpacing: '0.3em',
        }}>What I Build</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
            style={{
              padding: '2.5rem', border: '1px solid var(--line)',
              transition: 'border-color 0.3s, background 0.3s',
              cursor: 'default',
            }}
            whileHover={{ borderColor: 'rgba(200,146,42,0.2)', background: 'rgba(200,146,42,0.02)' }}
          >
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '3rem',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(200,146,42,0.3)',
              lineHeight: 1, marginBottom: '0.8rem',
            }}>
              {s.num}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.8rem',
              color: 'var(--white)', marginBottom: '0.8rem',
            }}>
              {s.title}
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300,
            }}>
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
