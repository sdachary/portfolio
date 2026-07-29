import { motion } from 'framer-motion'
import type { DualCardData } from '../data/types'

const day: DualCardData = {
  eyebrow: 'By Day',
  title: 'Senior<br>Data Analyst',
  items: [
    'Scalable data pipelines on GCP & BigQuery',
    'Power BI & Tableau dashboards for C-suite decisions',
    'Python automation reducing manual work by 60%+',
    'Statistical modelling on complex financial datasets',
    'Cross-functional collaboration driving data-driven decisions',
    'Training & mentoring junior analysts',
  ],
}

const night: DualCardData = {
  eyebrow: 'By Night',
  title: 'AI Architect<br>& Builder',
  items: [
    'Multi-agent AI orchestration via MCP Hub',
    'One-click cloud provisioning with Zero Trust architecture',
    'Full-stack products: React, Vite, FastAPI, Cloudflare Workers',
    'Financial settlement engines & BI dashboards',
    'Sovereign India-resident infrastructure roadmap',
    'Career intelligence tools powered by Claude API',
  ],
}

const ease = [0.32, 0.72, 0, 1] as const

function Card({ data, side, accent }: { data: DualCardData; side: 'left' | 'right'; accent: string }) {
  const borderColor = accent === 'var(--accent)' ? 'rgba(200,146,42,0.3)' : 'rgba(184,76,42,0.3)'
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: side === 'left' ? 0 : 0.2, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="dual-badge" style={{ color: accent, borderColor }}>
        {data.eyebrow}
      </div>
      <h2
        dangerouslySetInnerHTML={{ __html: data.title }}
        className="dual-title"
      />
      <ul className="dual-list">
        {data.items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease }}
            className="dual-item"
          >
            <span className="dual-arrow" style={{ color: accent }}>→</span>
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function DualIdentity() {
  return (
    <section id="dual" className="section section-alt section-divider-both dual-pin-section">
      <div className="section-header">
        <motion.h2
          initial={{ opacity: 0, letterSpacing: '0.3em' }}
          whileInView={{ opacity: 1, letterSpacing: '-0.02em' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="section-title"
        >The Two Modes</motion.h2>
      </div>
      <div className="dual-pin">
        <div className="dual-grid">
          <Card data={day} side="left" accent="var(--accent)" />
          <div className="dual-vr" />
          <Card data={night} side="right" accent="var(--accent2)" />
        </div>
      </div>
    </section>
  )
}
