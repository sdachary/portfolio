import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '#about', label: 'Origin' },
  { href: '#dual', label: 'Identity' },
  { href: '#services', label: 'Services' },
  { href: '#skills', label: 'Stack' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#work', label: 'Work' },
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="nav-wrap"
        >
          <nav className="navbar">
            <div className="navbar-brand">SDA</div>
            <ul className="navbar-links">
              {links.map(l => (
                <li key={l.href}>
                  <a href={l.href} className="navbar-link">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
