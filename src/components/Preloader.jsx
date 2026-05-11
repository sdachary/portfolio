import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader({ children }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'fixed', inset: 0, zIndex: 99999,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: '#080808',
              cursor: 'none',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                color: 'var(--amber)',
                letterSpacing: '0.02em',
                lineHeight: 1,
                textAlign: 'center',
              }}
            >
              S DEEPAK ACHARY
            </motion.div>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 60 }}
              transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
              style={{
                height: 1,
                background: 'var(--amber)',
                marginTop: '1.5rem',
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                color: 'rgba(200,146,42,0.5)',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                marginTop: '1rem',
              }}
            >
              Data &bull; AI &bull; Systems
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.5); transform-origin: top; }
          50% { opacity: 1; transform: scaleY(1); transform-origin: top; }
        }

        @media (max-width: 768px) {
          #about, #experience, #skills, #dual, #contact {
            padding: 4rem 1.5rem !important;
          }
          #about {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          #hero {
            padding: 0 1.5rem 3rem !important;
          }
          #hero > div:first-child {
            max-width: 100% !important;
          }
          #projects {
            padding: 4rem 0 3rem !important;
          }
          #projects > div:first-child {
            padding: 0 1.5rem 2rem !important;
          }
          nav {
            padding: 1rem 1.5rem !important;
          }
          nav ul {
            gap: 1rem !important;
          }
          #skills > div:first-child,
          #experience > div:first-child {
            padding-bottom: 1rem !important;
          }
          #dual > div:last-child {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          #dual > div:last-child > div:nth-child(2) {
            display: none !important;
          }
          #contact > div a {
            padding: 0.5rem 0 !important;
            font-size: 0.6rem !important;
          }
        }

        @media (max-width: 480px) {
          nav ul {
            gap: 0.5rem !important;
          }
          nav a {
            font-size: 0.55rem !important;
          }
          nav > div {
            font-size: 0.6rem !important;
          }
        }
      `}</style>
    </>
  )
}
