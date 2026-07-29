import { motion } from 'framer-motion'
import type { Service } from '../data/types'

const services: Service[] = [
  {
    num: '01', audience: 'employer',
    title: 'Data Analytics & BI',
    desc: 'End-to-end analytics pipelines, interactive dashboards, and statistical models that turn raw data into C-suite decisions. Python, SQL, Power BI, Tableau, GCP BigQuery.',
  },
  {
    num: '02', audience: 'client',
    title: 'AI Infrastructure & Agents',
    desc: 'Multi-agent orchestration with MCP protocol, Claude API integration, n8n automation workflows, and custom AI tools for your business processes.',
  },
  {
    num: '03', audience: 'both',
    title: 'Cloud Architecture & DevOps',
    desc: 'Zero-trust infrastructure on GCP, Cloudflare, and Supabase. Terraform, WireGuard, CI/CD pipelines. Sovereign, India-resident infrastructure.',
  },
  {
    num: '04', audience: 'client',
    title: 'Custom Software & SaaS',
    desc: 'Full-stack applications built with React, Vite, FastAPI, Hono, and Next.js. From inventory management to financial engines — shipped on Cloudflare Pages or your own infra.',
  },
]

const ease = [0.32, 0.72, 0, 1] as const

export default function Services() {
  return (
    <section id="services" className="section section-divider">
      <div className="section-header">
        <motion.h2
          initial={{ opacity: 0, letterSpacing: '0.3em' }}
          whileInView={{ opacity: 1, letterSpacing: '-0.02em' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="section-title"
        >Services</motion.h2>
      </div>

      <div className="card-grid card-grid-asymmetric">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="card"
        >
          <div className="card-outlined-num">{services[0].num}</div>
          <h3 className="card-title">{services[0].title}</h3>
          <p className="card-desc">{services[0].desc}</p>
        </motion.div>

        <div className="card-grid" style={{ gap: '1rem' }}>
          {services.slice(1).map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease }}
              className="card"
            >
              <div className="card-outlined-num">{s.num}</div>
              <h3 className="card-title">{s.title}</h3>
              <p className="card-desc">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
