import { motion } from 'framer-motion'

const paragraphs = [
  <>Started as an <strong>HR professional</strong>. Pivoted hard into data. Taught myself Python at nights, SQL on weekends. Shipped my first analytics dashboard before anyone asked me to.</>,
  <>Spent 9 years turning <strong>raw, messy data</strong> into decisions that moved businesses — from financial investment algorithms to retail sales intelligence. Building systems that scale.</>,
  <>But the day job wasn't enough. So I built an <strong>entire ecosystem from scratch</strong> — AI agents, cloud provisioners, financial engines, compute marketplaces. A second brain that thinks so I don't have to.</>,
  <>The mission: <strong>sovereign, India-resident infrastructure</strong>. No foreign dependencies. No vendor lock-in. Just systems that last.</>,
]

export default function About() {
  return (
    <section id="about" className="section about-grid">
      <div className="about-sticky">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="about-big-number"
        >
          9
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="about-big-label"
        >
          Years of Impact
        </motion.div>
      </div>

      <div className="about-body">
        <div className="section-eyebrow">Origin Story</div>

        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
            className="about-text"
          >{p}</motion.p>
        ))}
      </div>
    </section>
  )
}
