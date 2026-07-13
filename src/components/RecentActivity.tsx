import { motion } from 'framer-motion'
import activity from '../data/activity'

const ease = [0.32, 0.72, 0, 1] as const

const statusLabel = { active: 'Active', completed: 'Done', blocked: 'Blocked' }

const statusClass: Record<string, string> = {
  active: 'status-progress',
  completed: 'status-live',
  blocked: 'status-local',
}

export default function RecentActivity() {
  if (activity.length === 0) return null
  return (
    <section id="activity" className="section section-alt section-divider">
      <div className="section-header">
        <h2 className="section-title">Recent Activity</h2>
      </div>

      <div className="activity-wrap">
        <div className="activity-rail" />
        {activity.map((item, i) => (
          <motion.div
            key={`${item.phase}-${item.project}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.04, ease }}
            className="activity-row"
          >
            <div className="activity-dot" />
            <time className="activity-date">{item.date}</time>
            <div className="activity-card">
              <div className="activity-meta">
                <span className="activity-project">{item.project}</span>
                <span className="activity-phase">{item.phase}</span>
                <span className={`status-badge ${statusClass[item.status]}`}>
                  {statusLabel[item.status]}
                </span>
              </div>
              <p className="activity-desc">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
