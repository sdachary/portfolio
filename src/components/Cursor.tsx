import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const pos = useRef({ mx: -100, my: -100 })
  const ring = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e: MouseEvent) => {
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
    }
    document.addEventListener('mousemove', onMove)

    const el = cursorRef.current!
    const ringEl = ringRef.current!

    function animate() {
      el.style.left = pos.current.mx + 'px'
      el.style.top = pos.current.my + 'px'
      ring.current.x += (pos.current.mx - ring.current.x) * 0.12
      ring.current.y += (pos.current.my - ring.current.y) * 0.12
      ringEl.style.left = ring.current.x + 'px'
      ringEl.style.top = ring.current.y + 'px'
      requestAnimationFrame(animate)
    }
    animate()

    const expand = () => {
      el.style.transform = 'translate(-50%, -50%) scale(2)'
      ringEl.style.transform = 'translate(-50%, -50%) scale(1.5)'
      ringEl.style.borderColor = 'rgba(200,146,42,0.7)'
    }
    const shrink = () => {
      el.style.transform = 'translate(-50%, -50%) scale(1)'
      ringEl.style.transform = 'translate(-50%, -50%) scale(1)'
      ringEl.style.borderColor = 'rgba(200,146,42,0.4)'
    }

    const interactives = document.querySelectorAll<HTMLElement>('a, button, .skill-card, .project-frame, .exp-item')
    interactives.forEach(el => { el.addEventListener('mouseenter', expand); el.addEventListener('mouseleave', shrink) })

    return () => {
      document.removeEventListener('mousemove', onMove)
      interactives.forEach(el => { el.removeEventListener('mouseenter', expand); el.removeEventListener('mouseleave', shrink) })
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} id="cursor" />
      <div ref={ringRef} id="cursor-ring" />
      <style>{`
        #cursor, #cursor-ring {
          display: none;
        }
        @media (hover: hover) and (pointer: fine) {
          #cursor {
            display: block;
            position: fixed;
            width: 10px; height: 10px;
            background: var(--amber);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
            mix-blend-mode: difference;
            transition: transform 0.15s;
          }
          #cursor-ring {
            display: block;
            position: fixed;
            width: 36px; height: 36px;
            border: 1px solid rgba(200,146,42,0.4);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  )
}
