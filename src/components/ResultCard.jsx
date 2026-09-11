import { useState, useEffect, useRef, useCallback } from 'react'

const SEVERITY_CLASS = {
  Low: 'badge--low',
  Moderate: 'badge--moderate',
  High: 'badge--high',
  Critical: 'badge--critical',
}

// Each metric counts up at a slightly different speed so they don't all finish together
const DURATION_BY_KEY = {
  relationshipStrength: 1400,
  breakupProbability: 1100,
  dramaPotential: 900,
  ghostingRisk: 1250,
  vibeCompatibility: 1050,
  communicationScore: 1350,
}

function useCountUp(target, duration = 1200, enabled = false) {
  const [current, setCurrent] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!enabled) { setCurrent(0); return }
    let startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const elapsed = ts - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration, enabled])

  return current
}

export default function ResultCard({ metric, animationDelay = 0 }) {
  const [visible, setVisible] = useState(false)
  const cardRef = useRef(null)
  const duration = DURATION_BY_KEY[metric.key] ?? 1200
  const displayScore = useCountUp(metric.score, duration, visible)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animationDelay)
    return () => clearTimeout(t)
  }, [animationDelay])

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`)
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--spotlight-x', '-9999px')
    card.style.setProperty('--spotlight-y', '-9999px')
  }, [])

  return (
    <div
      ref={cardRef}
      className={`result-card ${visible ? 'result-card--visible' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="result-card-header">
        <span className="result-card-emoji" aria-hidden="true">{metric.emoji}</span>
        <span className="result-card-label">{metric.label}</span>
        <span className={`badge ${SEVERITY_CLASS[metric.severity]}`}>
          {metric.severity}
        </span>
      </div>

      <div className="result-card-score">
        {displayScore}
        <span className="result-card-score-unit">%</span>
      </div>

      <div className="result-card-bar-track">
        <div
          className="result-card-bar-fill"
          style={{
            width: visible ? `${metric.score}%` : '0%',
            transitionDelay: `${animationDelay + 200}ms`,
          }}
        >
          <div className="result-card-bar-shimmer" />
        </div>
      </div>

      <p className="result-card-joke">{metric.joke}</p>
    </div>
  )
}
