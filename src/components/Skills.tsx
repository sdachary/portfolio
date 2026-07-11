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
    <section id="skills" className="section">
      <div className="section-header">
        <h2 className="section-title">TECH STACK</h2>
        <span className="section-number">03 / 06</span>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="skills-grid"
      >
        {skills.map((s, i) => (
          <motion.div key={i} variants={item} className="skill-card">
            <div className="skill-category">{s.category}</div>
            <div className="skill-name">{s.name}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
