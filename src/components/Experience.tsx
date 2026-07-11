import { motion } from 'framer-motion'
import experience from '../data/experience'

const ease = [0.32, 0.72, 0, 1] as const

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="section-header">
        <h2 className="section-title">Experience</h2>
      </div>

      <div className="card-grid card-grid-2">
        {experience.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease }}
            className="card"
          >
            <div className="card-company">{exp.company}</div>
            <div className="card-role">{exp.role}</div>
            <div className="card-period">{exp.period}</div>
            <div className="card-desc">{exp.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
