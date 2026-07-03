import { motion } from 'framer-motion'
import type { WorkTrack } from '../data/types'

const tracks: WorkTrack[] = [
  {
    role: 'Hire Me',
    subtitle: 'Senior Data Analyst',
    target: 'Employers',
    desc: '9 years of analytics experience. Python, SQL, GCP, Power BI. Built pipelines processing 100K+ records daily. I lead teams, drive data culture, and ship decisions — not just dashboards.',
    cta: 'View Resume \u2192',
    href: '#contact',
    accent: 'var(--amber)',
  },
  {
    role: 'Commission Me',
    subtitle: 'AI Architect & Full-Stack Builder',
    target: 'Clients',
    desc: 'Need a SaaS prototype? An AI agent? A custom dashboard? I design, build, and deploy production-grade systems solo. No agency overhead. Just clean architecture and fast delivery.',
    cta: 'Start a Project \u2192',
    href: '#contact',
    accent: 'var(--rust)',
  },
]

function Card({ data, side, accent }: { data: WorkTrack; side: 'left' | 'right'; accent: string }) {
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
        border: '1px solid', color: accent,
        borderColor: accent === 'var(--amber)' ? 'rgba(200,146,42,0.3)' : 'rgba(184,76,42,0.3)',
      }}>
        For {data.target}
      </div>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 4vw, 4.5rem)',
        lineHeight: 1, marginBottom: '0.3rem', color: 'var(--white)',
      }}>
        {data.role}
      </h2>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
        color: accent, marginBottom: '2rem', letterSpacing: '0.1em',
      }}>
        {data.subtitle}
      </div>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '1rem',
        color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300,
        marginBottom: '2.5rem',
      }}>
        {data.desc}
      </p>
      <a href={data.href} style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
        color: accent, textDecoration: 'none',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        borderBottom: '1px solid',
        borderColor: accent === 'var(--amber)' ? 'rgba(200,146,42,0.3)' : 'rgba(184,76,42,0.3)',
        paddingBottom: '0.3rem',
        transition: 'gap 0.3s, border-color 0.3s',
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      }}
        onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.gap = '1rem'; e.currentTarget.style.borderColor = accent }}
        onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.gap = '0.5rem'; e.currentTarget.style.borderColor = 'rgba(200,146,42,0.3)' }}
      >
        {data.cta}
      </a>
    </motion.div>
  )
}

export default function WorkWithMe() {
  return (
    <section id="work" style={{
      background: 'var(--bg2)', padding: '8rem 3rem',
      borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        color: 'var(--muted)', letterSpacing: '0.3em', textTransform: 'uppercase',
        marginBottom: '5rem', display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <span style={{ width: 40, height: 1, background: 'var(--muted)' }} />
        How I Can Help
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1px 1fr',
        gap: '4rem', alignItems: 'start',
      }}>
        <Card data={tracks[0]} side="left" accent="var(--amber)" />
        <div style={{ background: 'var(--line)', height: '100%', minHeight: 300 }} />
        <Card data={tracks[1]} side="right" accent="var(--rust)" />
      </div>
    </section>
  )
}
