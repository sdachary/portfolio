import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '../data/types'

const ease = [0.32, 0.72, 0, 1] as const

function isFeatured(p: Project) {
  return p.status_key === 'live' || p.status_key === 'open-source'
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'projects.json')
      .then(r => r.json())
      .then(setProjects)
      .catch(() => console.error('Failed to load projects'))
  }, [])

  if (projects.length === 0) return null

  const sorted = [...projects].sort((a, b) => {
    if (isFeatured(a) && !isFeatured(b)) return -1
    if (!isFeatured(a) && isFeatured(b)) return 1
    return 0
  })

  return (
    <section id="projects" className="section section-alt" style={{ overflow: 'hidden' }}>
      <div className="section-header">
        <h2 className="section-title">Projects</h2>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="projects-bento"
      >
        {sorted.map((p, i) => {
          const featured = isFeatured(p)
          const statusClass = `status-${p.status_key || 'local'}`
          const tags = (p.tags || []).slice(0, 5)

          return (
            <motion.div
              key={p.slug || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04, ease }}
              className={`project-card${featured ? ' featured' : ''}`}
            >
              <div>
                <div className={`status-badge ${statusClass}`}>{p.status}</div>
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
                  <a href={p.live_url || p.github_url || ''} target="_blank" rel="noreferrer" className="project-link" style={{ marginTop: '1rem' }}>
                    {p.live_url ? 'Visit Live' : 'View Source'} →
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
