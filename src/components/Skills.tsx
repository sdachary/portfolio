import { motion, type Variants } from 'framer-motion'
import skills from '../data/skills'

const ease = [0.32, 0.72, 0, 1] as const

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease } },
}

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="section-header">
        <h2 className="section-title">Tech Stack</h2>
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
