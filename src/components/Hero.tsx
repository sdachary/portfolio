import { motion } from 'framer-motion'

const ease = [0.32, 0.72, 0, 1] as const

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg" />

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease }}
          className="hero-location"
        >
          S Deepak Achary — Hyderabad, India
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          className="hero-headline"
        >
          DATA TELLS <em>STORIES.</em>
          <br />I BUILD SYSTEMS.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease }}
          className="hero-tagline"
        >
          Senior Data Analyst &nbsp;✦&nbsp; AI Architect &nbsp;✦&nbsp; Solopreneur Builder
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease }}
          className="hero-actions"
        >
          <a href="/portfolio/resume.pdf" target="_blank" rel="noreferrer" className="hero-cta">
            Download Resume
            <span className="hero-cta-icon">↓</span>
          </a>
          <a href="#work" className="hero-link">Work With Me →</a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1, ease }}
        className="hero-scroll"
      >
        <span className="hero-scroll-label">Scroll</span>
        <div className="hero-scroll-line" />
      </motion.div>
    </section>
  )
}
