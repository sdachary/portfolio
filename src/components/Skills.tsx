import { motion, type Variants } from 'framer-motion'
import skills from '../data/skills'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Skills() {
  return (
    <section id="skills" style={{ background: 'var(--bg)', padding: '8rem 3rem' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: '4rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--line)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 7rem)',
          lineHeight: 1, color: 'var(--white)',
        }}>TECH STACK</h2>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'var(--muted)', letterSpacing: '0.3em',
        }}>03 / 06</span>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
        }}
      >
        {skills.map((s, i) => (
          <motion.div
            key={i}
            variants={item}
            className="skill-card"
            style={{
              padding: '1.5rem',
              border: '1px solid var(--line)',
              background: 'rgba(240,236,228,0.02)',
              cursor: 'default',
            }}
            whileHover={{
              borderColor: 'rgba(200,146,42,0.3)',
              background: 'rgba(200,146,42,0.04)',
              y: -4,
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
              color: 'var(--amber)', letterSpacing: '0.3em',
              textTransform: 'uppercase', marginBottom: '0.8rem',
            }}>
              {s.category}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.9rem',
              color: 'var(--white)', fontWeight: 500,
            }}>
              {s.name}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
