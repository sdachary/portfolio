import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '#about', label: 'Origin' },
  { href: '#dual', label: 'Identity' },
  { href: '#skills', label: 'Stack' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const about = document.getElementById('about')
      if (!about) return
      setVisible(about.getBoundingClientRect().top < window.innerHeight * 0.8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0,
            zIndex: 1000, padding: '1.5rem 3rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'linear-gradient(to bottom, rgba(8,8,8,0.9) 0%, transparent 100%)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--amber)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            SDA ✦ Portfolio
          </div>
          <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none' }}>
            {links.map(l => (
              <li key={l.href}>
                <a href={l.href} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                  color: 'var(--muted)', textDecoration: 'none',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  transition: 'color 0.3s',
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--white)'}
                  onMouseLeave={e => e.target.style.color = 'var(--muted)'}
                >{l.label}</a>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
