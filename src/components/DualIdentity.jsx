import { motion } from 'framer-motion'

const day = {
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

const night = {
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

function Card({ data, side, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: side === 'left' ? 0 : 0.2, ease: 'easeOut' }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
        letterSpacing: '0.3em', textTransform: 'uppercase',
        marginBottom: '1.2rem', padding: '0.3rem 0.8rem', display: 'inline-block',
        border: '1px solid', color: accent, borderColor: accent.replace(')', ',0.3)').replace('rgb', 'rgba'),
      }}>
        {data.eyebrow}
      </div>
      <h2
        dangerouslySetInnerHTML={{ __html: data.title }}
        style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 4vw, 4.5rem)',
          lineHeight: 1, marginBottom: '2rem', color: 'var(--white)',
        }}
      />
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {data.items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
              color: 'var(--muted)', letterSpacing: '0.05em',
              display: 'flex', alignItems: 'flex-start', gap: '0.8rem', lineHeight: 1.5,
            }}
          >
            <span style={{ color: accent, flexShrink: 0, marginTop: '0.1em' }}>→</span>
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function DualIdentity() {
  return (
    <section id="dual" style={{
      background: 'var(--bg2)', padding: '8rem 3rem',
      borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        color: 'var(--muted)', letterSpacing: '0.3em', textTransform: 'uppercase',
        marginBottom: '5rem', display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <span style={{ width: 40, height: 1, background: 'var(--muted)' }} />
        The Two Modes
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1px 1fr',
        gap: '4rem', alignItems: 'start',
      }}>
        <Card data={day} side="left" accent="var(--amber)" />
        <div style={{ background: 'var(--line)', height: '100%', minHeight: 400 }} />
        <Card data={night} side="right" accent="var(--rust)" />
      </div>
    </section>
  )
}
