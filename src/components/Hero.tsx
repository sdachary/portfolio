import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg" />
      <div className="hero-estamp">EST. 2016</div>

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-location"
        >
          S Deepak Achary — Hyderabad, India
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="hero-headline"
        >
          DATA<br />TELLS <em>STORIES.</em><br />I BUILD<br />SYSTEMS.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="hero-tagline"
        >
          Senior Data Analyst &nbsp;✦&nbsp; AI Architect &nbsp;✦&nbsp; Solopreneur Builder
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="hero-actions"
        >
          <a href="/portfolio/resume.pdf" target="_blank" rel="noreferrer" className="hero-cta">
            ↓ Download Resume
          </a>
          <a href="#work" className="hero-link">
            Work With Me →
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="hero-scroll"
      >
        <span className="hero-scroll-label">Scroll to explore</span>
        <div className="hero-scroll-line" />
      </motion.div>
    </section>
  )
}
