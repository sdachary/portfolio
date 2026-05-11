import { motion } from 'framer-motion'

const links = [
  { href: 'mailto:deepakachary246@gmail.com', label: '✉ deepakachary246@gmail.com' },
  { href: 'https://www.linkedin.com/in/sdeepakachary/', label: '⟶ LinkedIn' },
  { href: 'https://x.com/sdeepakachary', label: '⟶ Twitter/X' },
  { href: 'https://github.com/sdachary', label: '⟶ GitHub' },
]

export default function Contact() {
  const year = new Date().getFullYear()

  return (
    <section id="contact" style={{
      background: 'var(--bg2)', padding: '8rem 3rem 4rem',
      position: 'relative', borderTop: '1px solid var(--line)',
    }}>
      <div style={{
        position: 'absolute', bottom: 0, left: '-2%',
        fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem, 15vw, 18rem)',
        color: 'transparent', WebkitTextStroke: '1px rgba(240,236,228,0.04)',
        whiteSpace: 'nowrap', userSelect: 'none', lineHeight: 0.9, zIndex: 0,
      }}>
        DEEPAK
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 700 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'var(--amber)', letterSpacing: '0.3em', textTransform: 'uppercase',
          marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem',
        }}>
          <span style={{ width: 40, height: 1, background: 'var(--amber)' }} />
          Let's Connect
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 7vw, 8rem)',
            lineHeight: 0.95, color: 'var(--white)', marginBottom: '3rem',
          }}
        >
          READY<br />TO BUILD<br />TOGETHER?
        </motion.h2>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '6rem' }}>
          {links.map((l, i) => (
            <motion.a
              key={i}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                color: 'var(--muted)', textDecoration: 'none',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                borderBottom: '1px solid var(--line)', paddingBottom: '0.4rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'color 0.3s, border-color 0.3s',
              }}
              onMouseEnter={e => { e.target.style.color = 'var(--amber)'; e.target.style.borderColor = 'var(--amber)' }}
              onMouseLeave={e => { e.target.style.color = 'var(--muted)'; e.target.style.borderColor = 'var(--line)' }}
            >
              {l.label}
            </motion.a>
          ))}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: '2rem', borderTop: '1px solid var(--line)',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: 'var(--muted)', letterSpacing: '0.15em',
          }}>
            © {year} S Deepak Achary. All rights reserved.
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: 'var(--muted)', letterSpacing: '0.1em',
          }}>
            Hyderabad, India &nbsp;✦&nbsp; Built with intent.
          </div>
        </div>
      </div>
    </section>
  )
}
