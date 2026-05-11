import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

const AUTOPLAY_MS = 4000

function getState(idx, current, total) {
  const wrap = ((idx - current) % total + total) % total
  if (wrap === 0) return 'active'
  if (wrap === 1) return 'next'
  if (wrap === 2) return 'next2'
  if (wrap === total - 1) return 'prev'
  if (wrap === total - 2) return 'prev2'
  return 'hidden'
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)
  const stageRef = useRef(null)

  useEffect(() => {
    fetch('/projects.json')
      .then(r => r.json())
      .then(setProjects)
      .catch(() => {})
  }, [])

  const total = projects.length

  const goTo = useCallback((idx) => {
    setCurrent((idx + total) % total)
    clearTimeout(timerRef.current)
  }, [total])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (total === 0) return
    timerRef.current = setTimeout(() => {
      setCurrent(c => (c + 1) % total)
    }, AUTOPLAY_MS)
    return () => clearTimeout(timerRef.current)
  }, [current, total])

  useEffect(() => {
    const onKey = (e) => {
      const rect = document.getElementById('projects')?.getBoundingClientRect()
      if (!rect || rect.top > window.innerHeight || rect.bottom < 0) return
      if (e.key === 'ArrowRight') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let touchStartX = 0
    const onTouch = (e) => { touchStartX = e.touches[0].clientX }
    const onEnd = (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX
      if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    }
    stage.addEventListener('touchstart', onTouch, { passive: true })
    stage.addEventListener('touchend', onEnd)
    return () => {
      stage.removeEventListener('touchstart', onTouch)
      stage.removeEventListener('touchend', onEnd)
    }
  }, [next, prev])

  if (total === 0) return null

  return (
    <section id="projects" style={{ background: 'var(--bg2)', padding: '8rem 0 6rem', overflow: 'hidden' }}>
      <div style={{
        padding: '0 3rem 3rem', borderBottom: '1px solid var(--line)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 7rem)',
          lineHeight: 1, color: 'var(--white)',
        }}>PROJECTS</h2>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'var(--muted)', letterSpacing: '0.3em',
        }}>04 / 06</span>
      </div>

      <motion.div
        ref={stageRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'relative', padding: '4rem 0 2rem', perspective: 1200,
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', minHeight: 520,
        }}>
          {projects.map((p, i) => {
            const state = getState(i, current, total)
            const idx = String(i + 1).padStart(2, '0')
            const nameHtml = p.name.replace(' — ', '<br>')
            const tags = (p.tags || []).slice(0, 5)
            const statusClass = `status-${p.status_key || 'local'}`

            return (
              <div
                key={p.slug || i}
                className="project-frame"
                data-state={state}
                onClick={() => { if (state !== 'active') goTo(i) }}
                style={{
                  position: 'absolute',
                  width: 'min(520px, 78vw)',
                  minHeight: 460,
                  border: '1px solid var(--line)',
                  padding: '3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'rgba(13,13,13,0.95)',
                  transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.7s ease',
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                  cursor: 'pointer',
                  zIndex: state === 'active' ? 10 : state === 'hidden' ? 0 : 5,
                  pointerEvents: state === 'hidden' ? 'none' : 'auto',
                  ...(state === 'active' ? {
                    transform: 'translateX(0) scale(1) rotateY(0deg)',
                    opacity: 1,
                    borderColor: 'rgba(200,146,42,0.3)',
                    boxShadow: '0 0 80px rgba(200,146,42,0.08), 0 40px 80px rgba(0,0,0,0.6)',
                  } : state === 'prev' ? {
                    transform: 'translateX(-62%) scale(0.82) rotateY(12deg)',
                    opacity: 0.38,
                    borderColor: 'var(--line)',
                    boxShadow: 'none',
                  } : state === 'prev2' ? {
                    transform: 'translateX(-110%) scale(0.68) rotateY(18deg)',
                    opacity: 0.15,
                    borderColor: 'var(--line)',
                    boxShadow: 'none',
                  } : state === 'next' ? {
                    transform: 'translateX(62%) scale(0.82) rotateY(-12deg)',
                    opacity: 0.38,
                    borderColor: 'var(--line)',
                    boxShadow: 'none',
                  } : state === 'next2' ? {
                    transform: 'translateX(110%) scale(0.68) rotateY(-18deg)',
                    opacity: 0.15,
                    borderColor: 'var(--line)',
                    boxShadow: 'none',
                  } : {
                    transform: 'translateX(0) scale(0.5)',
                    opacity: 0,
                    boxShadow: 'none',
                  }),
                }}
              >
                <div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '4.5rem',
                    color: 'transparent',
                    WebkitTextStroke: state === 'active' ? '1px rgba(200,146,42,0.4)' : '1px rgba(200,146,42,0.18)',
                    lineHeight: 1, marginBottom: '0.8rem',
                    transition: '-webkit-text-stroke-color 0.4s',
                  }}>
                    {idx}
                  </div>
                  <div className={`project-status ${statusClass}`} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                    letterSpacing: '0.3em', textTransform: 'uppercase',
                    padding: '0.3rem 0.7rem', display: 'inline-block',
                    marginBottom: '1.2rem',
                    color: p.status_key === 'live' ? '#4ade80' : p.status_key === 'progress' ? 'var(--amber)' : p.status_key === 'open-source' ? 'var(--muted)' : '#7dd3fc',
                    border: `1px solid ${p.status_key === 'live' ? 'rgba(74,222,128,0.3)' : p.status_key === 'progress' ? 'rgba(200,146,42,0.3)' : p.status_key === 'open-source' ? 'var(--line)' : 'rgba(125,211,252,0.3)'}`,
                  }}>
                    {p.status}
                  </div>
                  <h3 dangerouslySetInnerHTML={{ __html: nameHtml }} style={{
                    fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 3rem)',
                    lineHeight: 1, color: 'var(--white)', marginBottom: '1rem',
                  }} />
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                    color: 'var(--muted)', lineHeight: 1.65,
                    flexGrow: 1, marginBottom: '1.5rem',
                  }}>
                    {p.description}
                  </p>
                </div>
                <div>
                  {tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: 0 }}>
                      {tags.map(t => (
                        <span key={t} className="tag" style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
                          color: 'var(--muted)',
                          border: state === 'active' ? '1px solid rgba(200,146,42,0.2)' : '1px solid var(--line)',
                          padding: '0.22rem 0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                          transition: 'all 0.3s',
                        }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {(p.live_url || p.github_url) && (
                    <a href={p.live_url || p.github_url} target="_blank" rel="noreferrer"
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                        color: 'var(--amber)', textDecoration: 'none',
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        marginTop: '1.2rem',
                        borderBottom: '1px solid rgba(200,146,42,0.3)',
                        paddingBottom: '0.3rem',
                        transition: 'gap 0.3s, border-color 0.3s',
                      }}
                      onMouseEnter={e => { e.target.style.gap = '1rem'; e.target.style.borderColor = 'var(--amber)' }}
                      onMouseLeave={e => { e.target.style.gap = '0.5rem'; e.target.style.borderColor = 'rgba(200,146,42,0.3)' }}
                    >
                      {p.live_url ? 'Visit Live →' : 'View Source →'}
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Controls */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '2rem', padding: '2.5rem 0 0',
      }}>
        <button onClick={prev} aria-label="Previous project" style={{
          width: 48, height: 48, border: '1px solid var(--line)',
          background: 'transparent', color: 'var(--muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '1.1rem', fontFamily: 'var(--font-mono)',
          flexShrink: 0, transition: 'all 0.3s',
        }}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--amber)'; e.target.style.color = 'var(--amber)'; e.target.style.background = 'rgba(200,146,42,0.05)' }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--line)'; e.target.style.color = 'var(--muted)'; e.target.style.background = 'transparent' }}
        >&#8592;</button>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {projects.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Go to project ${i + 1}`} style={{
              width: i === current ? 24 : 6, height: 6,
              background: i === current ? 'var(--amber)' : 'var(--line)',
              borderRadius: i === current ? '3px' : '50%',
              cursor: 'pointer', border: 'none',
              transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
            }} />
          ))}
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'var(--muted)', letterSpacing: '0.2em',
          minWidth: 60, textAlign: 'center',
        }}>
          {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>

        <button onClick={next} aria-label="Next project" style={{
          width: 48, height: 48, border: '1px solid var(--line)',
          background: 'transparent', color: 'var(--muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '1.1rem', fontFamily: 'var(--font-mono)',
          flexShrink: 0, transition: 'all 0.3s',
        }}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--amber)'; e.target.style.color = 'var(--amber)'; e.target.style.background = 'rgba(200,146,42,0.05)' }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--line)'; e.target.style.color = 'var(--muted)'; e.target.style.background = 'transparent' }}
        >&#8594;</button>
      </div>

      {/* Progress bar */}
      <div style={{
        margin: '1.5rem 3rem 0', height: 1,
        background: 'var(--line)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          background: 'var(--amber)',
          transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
          width: `${((current + 1) / total) * 100}%`,
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
          color: 'rgba(138,130,120,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase',
        }}>
          ← → Keys or swipe to navigate &nbsp;✦&nbsp; Click side cards to jump
        </span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .project-frame[data-state="prev"] { transform: translateX(-72%) scale(0.78) rotateY(8deg) !important; }
          .project-frame[data-state="next"] { transform: translateX(72%) scale(0.78) rotateY(-8deg) !important; }
          .project-frame[data-state="prev2"],
          .project-frame[data-state="next2"] { opacity: 0 !important; }
        }
      `}</style>
    </section>
  )
}
