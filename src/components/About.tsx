import { motion } from 'framer-motion'

const paragraphs: string[] = [
  'Started as an <strong>HR professional</strong>. Pivoted hard into data. Taught myself Python at nights, SQL on weekends. Shipped my first analytics dashboard before anyone asked me to.',
  'Spent 9 years turning <strong>raw, messy data</strong> into decisions that moved businesses — from financial investment algorithms to retail sales intelligence. Building systems that scale.',
  'But the day job wasn\'t enough. So I built an <strong>entire ecosystem from scratch</strong> — AI agents, cloud provisioners, financial engines, compute marketplaces. A second brain that thinks so I don\'t have to.',
  'The mission: <strong>sovereign, India-resident infrastructure</strong>. No foreign dependencies. No vendor lock-in. Just systems that last.',
]

export default function About() {
  return (
    <section id="about" style={{
      background: 'var(--bg)', padding: '8rem 3rem',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start',
    }}>
      <div style={{ position: 'sticky', top: '30vh' }}>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(6rem, 12vw, 14rem)',
            color: 'transparent', WebkitTextStroke: '1px rgba(200,146,42,0.2)',
            lineHeight: 1, userSelect: 'none',
          }}
        >
          9
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'var(--amber)', letterSpacing: '0.3em', textTransform: 'uppercase',
            marginTop: '1rem',
          }}
        >
          Years of Impact
        </motion.div>
      </div>

      <div style={{ paddingTop: '4rem' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'var(--muted)', letterSpacing: '0.3em', textTransform: 'uppercase',
          marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem',
        }}>
          <span style={{ width: 40, height: 1, background: 'var(--muted)' }} />
          Origin Story
        </div>

        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
            dangerouslySetInnerHTML={{ __html: p }}
            style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
              fontWeight: 300, lineHeight: 1.6, color: 'var(--white)',
              marginBottom: '2.5rem',
            }}
          />
        ))}
      </div>
    </section>
  )
}
