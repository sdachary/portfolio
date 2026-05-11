import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function Hero() {
  const canvasRef = useRef(null)
  const RAF = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, particles = []
    const mouse = { x: -1000, y: -1000 }

    class Particle {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * W
        this.y = Math.random() * H
        this.size = Math.random() * 1.5 + 0.3
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.opacity = Math.random() * 0.5 + 0.1
        this.color = Math.random() > 0.8 ? '#c8922a' : '#f0ece4'
      }
      update() {
        this.x += this.vx; this.y += this.vy
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset()
      }
      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    function drawAtmosphere(t) {
      const grad = ctx.createRadialGradient(
        W * 0.3 + Math.sin(t * 0.0003) * 100,
        H * 0.4 + Math.cos(t * 0.0002) * 80,
        0, W * 0.3, H * 0.4, W * 0.6
      )
      grad.addColorStop(0, 'rgba(200,146,42,0.06)')
      grad.addColorStop(0.5, 'rgba(184,76,42,0.03)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      ctx.strokeStyle = 'rgba(240,236,228,0.025)'
      ctx.lineWidth = 1
      const gridSize = 80
      const offsetX = (t * 0.02) % gridSize
      const offsetY = (t * 0.015) % gridSize
      for (let x = -gridSize + offsetX; x < W + gridSize; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = -gridSize + offsetY; y < H + gridSize; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }
    }

    function resize() {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }

    function initParticles() {
      particles = []
      for (let i = 0; i < 120; i++) particles.push(new Particle())
    }

    function animate(t) {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#080808'
      ctx.fillRect(0, 0, W, H)
      drawAtmosphere(t)

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.save()
            ctx.globalAlpha = (1 - d / 100) * 0.08
            ctx.strokeStyle = '#c8922a'
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }

      particles.forEach(p => { p.update(); p.draw() })
      RAF.current = requestAnimationFrame(animate)
    }

    resize()
    initParticles()
    animate()
    window.addEventListener('resize', () => { resize(); initParticles() })

    return () => {
      cancelAnimationFrame(RAF.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section id="hero" style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      padding: '0 3rem 5rem',
    }}>
      <canvas ref={canvasRef} id="hero-canvas" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(8,8,8,0.7) 0%, rgba(8,8,8,0.2) 50%, rgba(8,8,8,0.8) 100%)',
        zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', top: '2rem', right: '3rem',
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        color: 'var(--amber)', letterSpacing: '0.3em', zIndex: 2,
        border: '1px solid rgba(200,146,42,0.3)', padding: '0.4rem 0.8rem',
      }}>EST. 2016</div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            color: 'var(--amber)', letterSpacing: '0.3em',
            textTransform: 'uppercase', marginBottom: '1.2rem',
          }}
        >
          S Deepak Achary — Hyderabad, India
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 10vw, 11rem)',
            lineHeight: 0.92, color: 'var(--white)', letterSpacing: '0.01em',
          }}
        >
          DATA<br />TELLS <span style={{ color: 'var(--amber)' }}>STORIES.</span><br />I BUILD<br />SYSTEMS.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{
            marginTop: '2rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
            color: 'var(--muted)', letterSpacing: '0.2em', textTransform: 'uppercase',
          }}
        >
          Senior Data Analyst &nbsp;✦&nbsp; AI Architect &nbsp;✦&nbsp; Solopreneur Builder
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        style={{
          position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll to explore</span>
        <div style={{
          width: 1, height: 50,
          background: 'linear-gradient(to bottom, var(--amber), transparent)',
          animation: 'scrollPulse 2s ease-in-out infinite',
        }} />
      </motion.div>
    </section>
  )
}
