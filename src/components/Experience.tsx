import { motion } from 'framer-motion'
import experience from '../data/experience'

export default function Experience() {
  return (
    <section id="experience" style={{ background: 'var(--bg)', padding: '8rem 3rem' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: '4rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--line)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 7rem)',
          lineHeight: 1, color: 'var(--white)',
        }}>EXPERIENCE</h2>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'var(--muted)', letterSpacing: '0.3em',
        }}>05 / 06</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {experience.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
            className="exp-item"
            style={{
              padding: '2.5rem', border: '1px solid var(--line)',
              transition: 'border-color 0.3s',
            }}
            whileHover={{ borderColor: 'rgba(200,146,42,0.2)' }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              color: 'var(--amber)', letterSpacing: '0.2em',
              textTransform: 'uppercase', marginBottom: '0.5rem',
            }}>
              {exp.company}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '1.8rem',
              color: 'var(--white)', marginBottom: '0.5rem',
            }}>
              {exp.role}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '1.5rem',
            }}>
              {exp.period}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300,
            }}>
              {exp.desc}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
