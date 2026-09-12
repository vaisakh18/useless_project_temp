import { useState, useEffect, useRef, useCallback } from 'react'

const SEVERITY_CLASS = {
  Low:      'badge--low',
  Moderate: 'badge--moderate',
  High:     'badge--high',
  Critical: 'badge--critical',
}

// Left-border accent colour per severity
const SEVERITY_BORDER = {
  Low:      '#22C55E',
  Moderate: '#EAB308',
  High:     '#F97316',
  Critical: '#F43F5E',
}

// Glow colour for the number flash on completion
const SEVERITY_GLOW = {
  Low:      'rgba(34,197,94,0.45)',
  Moderate: 'rgba(234,179,8,0.45)',
  High:     'rgba(249,115,22,0.45)',
  Critical: 'rgba(244,63,94,0.45)',
}

// Different count-up speeds so numbers finish at staggered times
const DURATION_BY_KEY = {
  relationshipStrength: 1400,
  breakupProbability:   1100,
  dramaPotential:        900,
  ghostingRisk:         1250,
  vibeCompatibility:    1050,
  communicationScore:   1350,
}

function useCountUp(target, duration = 1200, enabled = false, onDone) {
  const [current, setCurrent] = useState(0)
  const frameRef = useRef(null)
  const doneRef  = useRef(false)

  useEffect(() => {
    if (!enabled) { setCurrent(0); doneRef.current = false; return }
    let startTime = null
    doneRef.current = false

    const step = (ts) => {
      if (!startTime) startTime = ts
      const elapsed  = ts - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step)
      } else if (!doneRef.current) {
        doneRef.current = true
        onDone?.()
      }
    }
    frameRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration, enabled, onDone])

  return current
}

export default function ResultCard({ metric, animationDelay = 0 }) {
  const [visible,    setVisible]    = useState(false)
  const [scoreGlow,  setScoreGlow]  = useState(false)
  const cardRef = useRef(null)
  const tiltRef = useRef({ x: 0, y: 0 })

  const duration     = DURATION_BY_KEY[metric.key] ?? 1200
  const borderColor  = SEVERITY_BORDER[metric.severity]
  const glowColor    = SEVERITY_GLOW[metric.severity]

  // Flash glow when count-up finishes
  const onCountDone = useCallback(() => {
    setScoreGlow(true)
    setTimeout(() => setScoreGlow(false), 600)
  }, [])

  const displayScore = useCountUp(metric.score, duration, visible, onCountDone)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animationDelay)
    return () => clearTimeout(t)
  }, [animationDelay])

  // ── 3-D tilt on hover ──────────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()

    // Spotlight
    const sx = e.clientX - rect.left
    const sy = e.clientY - rect.top
    card.style.setProperty('--spotlight-x', `${sx}px`)
    card.style.setProperty('--spotlight-y', `${sy}px`)

    // Tilt — map cursor position to ±9deg for a satisfying pop
    const cx  = rect.left + rect.width  / 2
    const cy  = rect.top  + rect.height / 2
    const tx  = ((e.clientX - cx) / (rect.width  / 2)) *  9
    const ty  = ((e.clientY - cy) / (rect.height / 2)) * -9
    tiltRef.current = { x: tx, y: ty }
    card.style.transform = `perspective(500px) rotateY(${tx}deg) rotateX(${ty}deg) translateY(-6px) scale(1.03)`
    card.style.boxShadow = `inset 0 1px 1px 0 rgba(255,255,255,0.14), 0 20px 48px -8px ${borderColor}40, 0 4px 16px rgba(0,0,0,0.5)`
    card.style.borderColor = `${borderColor}55`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--spotlight-x', '-9999px')
    card.style.setProperty('--spotlight-y', '-9999px')
    card.style.transform = ''
    card.style.boxShadow = ''
    card.style.borderColor = ''
  }, [])

  return (
    <div
      ref={cardRef}
      className={`result-card ${visible ? 'result-card--visible' : ''}`}
      style={{
        '--card-border-color': borderColor,
        transition: visible
          ? 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease'
          : undefined,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Severity left-border accent */}
      <div className="result-card-accent" style={{ background: borderColor }} aria-hidden="true" />

      <div className="result-card-header">
        <span className="result-card-emoji" aria-hidden="true">{metric.emoji}</span>
        <span className="result-card-label">{metric.label}</span>
        <span className={`badge ${SEVERITY_CLASS[metric.severity]}`}>
          {metric.severity}
        </span>
      </div>

      {/* Score — flashes a glow when count-up finishes */}
      <div
        className="result-card-score"
        style={scoreGlow ? { textShadow: `0 0 18px ${glowColor}` } : undefined}
      >
        {displayScore}
        <span className="result-card-score-unit">%</span>
      </div>

      <div className="result-card-bar-track">
        <div
          className="result-card-bar-fill"
          style={{
            width: visible ? `${metric.score}%` : '0%',
            transitionDelay: `${animationDelay + 200}ms`,
            background: `linear-gradient(90deg, ${borderColor}99, ${borderColor})`,
          }}
        >
          <div className="result-card-bar-shimmer" />
        </div>
      </div>

      <p className="result-card-joke">{metric.joke}</p>
    </div>
  )
}
