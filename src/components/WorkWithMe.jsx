import { motion } from 'framer-motion'

const tracks = [
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
        {tracks.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i === 0 ? 0 : 0.2, ease: 'easeOut' }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              letterSpacing: '0.3em', textTransform: 'uppercase',
              marginBottom: '1.2rem', padding: '0.3rem 0.8rem', display: 'inline-block',
              border: '1px solid', color: t.accent,
              borderColor: t.accent === 'var(--amber)' ? 'rgba(200,146,42,0.3)' : 'rgba(184,76,42,0.3)',
            }}>
              For {t.target}
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 4vw, 4.5rem)',
              lineHeight: 1, marginBottom: '0.3rem', color: 'var(--white)',
            }}>
              {t.role}
            </h2>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
              color: t.accent, marginBottom: '2rem', letterSpacing: '0.1em',
            }}>
              {t.subtitle}
            </div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1rem',
              color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300,
              marginBottom: '2.5rem',
              overflowWrap: 'break-word', wordBreak: 'break-word',
              maxWidth: '100%',
            }}>
              {t.desc}
            </p>
            <a href={t.href} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              color: t.accent, textDecoration: 'none',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              borderBottom: '1px solid',
              borderColor: t.accent === 'var(--amber)' ? 'rgba(200,146,42,0.3)' : 'rgba(184,76,42,0.3)',
              paddingBottom: '0.3rem',
              transition: 'gap 0.3s, border-color 0.3s',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            }}
              onMouseEnter={e => { e.target.style.gap = '1rem'; e.target.style.borderColor = t.accent }}
              onMouseLeave={e => { e.target.style.gap = '0.5rem'; e.target.style.borderColor = 'rgba(200,146,42,0.3)' }}
            >
              {t.cta}
            </a>
          </motion.div>
        ))}
        <div style={{ background: 'var(--line)', height: '100%', minHeight: 300 }} />
      </div>
    </section>
  )
}
