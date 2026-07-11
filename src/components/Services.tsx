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
    desc: 'Zero-trust infrastructure on GCP, Cloudflare, and Supabase. Terraform, WireGuard, CI/CD pipelines. Sovereign, India-resident infrastructure with no foreign dependencies.',
  },
  {
    num: '04', audience: 'client',
    title: 'Custom Software & SaaS',
    desc: 'Full-stack applications built with React, Vite, FastAPI, Hono, and Next.js. From inventory management to financial engines — shipped on Cloudflare Pages or your own infra.',
  },
]

export default function Services() {
  return (
    <section id="services" className="section section-divider">
      <div className="section-header">
        <h2 className="section-title">SERVICES</h2>
        <span className="section-number">What I Build</span>
      </div>

      <div className="card-grid card-grid-2">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
            className="card"
          >
            <div className="card-outlined-num">{s.num}</div>
            <h3 className="card-title">{s.title}</h3>
            <p className="card-desc">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
