import { motion, type Variants } from 'framer-motion'
import experience from '../data/experience'

const ease = [0.32, 0.72, 0, 1] as const

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } },
}

export default function Experience() {
  return (
    <section id="experience" className="section section-divider">
      <div className="section-header">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="section-title"
        >Experience</motion.h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="card-grid card-grid-2"
      >
        {experience.map((exp, i) => (
          <motion.div
            key={i}
            variants={item}
            className="card"
          >
            <div className="card-company">{exp.company}</div>
            <div className="card-role">{exp.role}</div>
            <div className="card-period">{exp.period}</div>
            <div className="card-desc">{exp.desc}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
