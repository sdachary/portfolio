import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '../data/types'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'projects.json')
      .then(r => r.json())
      .then(setProjects)
      .catch(() => {})
  }, [])

  if (projects.length === 0) return null

  return (
    <section id="projects" className="section section-alt" style={{ overflow: 'hidden' }}>
      <div className="section-header">
        <h2 className="section-title">PROJECTS</h2>
        <span className="section-number">04 / 06</span>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="projects-grid"
      >
        {projects.map((p, i) => {
          const idx = String(i + 1).padStart(2, '0')
          const statusClass = `status-${p.status_key || 'local'}`
          const tags = (p.tags || []).slice(0, 5)

          return (
            <motion.div
              key={p.slug || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
              className="project-card"
            >
              <div>
                <div className="project-num">{idx}</div>
                <div className={`status-badge ${statusClass}`}>
                  {p.status}
                </div>
                <h3 className="project-name">{p.name}</h3>
                <p className="project-desc">{p.description}</p>
              </div>
              <div>
                {tags.length > 0 && (
                  <div className="card-tags">
                    {tags.map(t => (
                      <span key={t} className="card-tag">{t}</span>
                    ))}
                  </div>
                )}
                {(p.live_url || p.github_url) && (
                  <a href={p.live_url || p.github_url || ''} target="_blank" rel="noreferrer" className="project-link" style={{ marginTop: '1.2rem' }}>
                    {p.live_url ? 'Visit Live →' : 'View Source →'}
                  </a>
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
