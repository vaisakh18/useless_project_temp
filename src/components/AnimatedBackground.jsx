import { useEffect, useRef } from 'react'

// Heart shapes: full heart, broken heart, and a subtle sparkle
const SYMBOLS = ['♥', '💔', '♡', '✦', '♥', '♡', '♥']

// Generate a random float between min and max
const r = (min, max) => Math.random() * (max - min) + min

// Create one particle config
function makeParticle(id) {
  return {
    id,
    symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    left: r(0, 100),          // % from left
    size: r(10, 28),          // px font size
    opacity: r(0.04, 0.18),   // very faint — keeps design clean
    duration: r(14, 36),      // seconds to float up
    delay: r(0, 30),          // stagger start
    drift: r(-60, 60),        // horizontal drift (px) over the animation
    // Alternate between rose and purple tints
    color: Math.random() > 0.5 ? '#F43F5E' : '#A855F7',
    // Slight rotation wobble
    rotateStart: r(-25, 25),
    rotateEnd: r(-25, 25),
  }
}

const PARTICLE_COUNT = 28

export default function AnimatedBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => makeParticle(i))

    particles.forEach((p) => {
      const el = document.createElement('span')
      el.textContent = p.symbol
      el.setAttribute('aria-hidden', 'true')

      el.style.cssText = `
        position: absolute;
        left: ${p.left}%;
        bottom: -60px;
        font-size: ${p.size}px;
        color: ${p.color};
        opacity: ${p.opacity};
        pointer-events: none;
        user-select: none;
        will-change: transform, opacity;
        animation: bg-float ${p.duration}s ${p.delay}s linear infinite;
        --drift: ${p.drift}px;
        --rot-start: ${p.rotateStart}deg;
        --rot-end: ${p.rotateEnd}deg;
      `

      container.appendChild(el)
    })

    return () => {
      // Clean up all spawned elements on unmount
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="animated-bg"
      aria-hidden="true"
    />
  )
}
