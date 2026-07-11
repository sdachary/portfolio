import { useState } from 'react'
import { motion } from 'framer-motion'

const links = [
  { href: 'mailto:deepakachary246@gmail.com', label: '✉ deepakachary246@gmail.com' },
  { href: 'https://www.linkedin.com/in/sdeepakachary/', label: '⟶ LinkedIn' },
  { href: 'https://x.com/sdeepakachary', label: '⟶ Twitter/X' },
  { href: 'https://github.com/sdachary', label: '⟶ GitHub' },
]

export default function Contact() {
  const year = new Date().getFullYear()
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      const res = await fetch('https://formspree.io/f/xjgzzkrl', {
        method: 'POST', body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) { setStatus('success'); form.reset() }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <section id="contact" className="section section-alt section-divider" style={{ position: 'relative' }}>
      <div className="contact-bg-text">DEEPAK</div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100 }}>
        <div className="section-eyebrow" style={{ color: 'var(--accent)', '--muted': 'var(--accent)' } as React.CSSProperties}>
          <span style={{ width: 40, height: 1, background: 'var(--accent)' }} />
          Let's Connect
        </div>

        <div className="contact-grid">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="contact-headline"
            >
              READY<br />TO BUILD<br />TOGETHER?
            </motion.h2>

            <div className="contact-links">
              {links.map((l, i) => (
                <motion.a
                  key={i}
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="contact-link"
                >
                  {l.label}
                </motion.a>
              ))}
            </div>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="contact-form"
          >
            <div className="contact-form-label">
              Or send a message directly
            </div>
            <div className="contact-form-fields">
              <input name="name" placeholder="Your Name" aria-label="Your Name" required className="contact-input" />
              <input name="email" type="email" placeholder="Your Email" aria-label="Your Email" required className="contact-input" />
              <textarea name="message" placeholder="Tell me about your project, idea, or opportunity..." aria-label="Your Message" required rows={5} className="contact-input" style={{ resize: 'vertical', minHeight: 100 }} />
              <button type="submit" disabled={status === 'sending'} className="contact-btn">
                {status === 'sending' ? 'Sending...' : 'Send Message →'}
              </button>
              {status === 'success' && (
                <p className="contact-success">✓ Message sent! I'll get back to you soon.</p>
              )}
              {status === 'error' && (
                <p className="contact-error">✗ Something went wrong. Try emailing me directly at deepakachary246@gmail.com</p>
              )}
            </div>
          </motion.form>
        </div>

        <div className="contact-footer">
          <div className="contact-footer-text">© {year} S Deepak Achary. All rights reserved.</div>
          <div className="contact-footer-text">Hyderabad, India &nbsp;✦&nbsp; Built with intent.</div>
        </div>
      </div>
    </section>
  )
}
