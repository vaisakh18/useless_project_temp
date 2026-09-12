import { useState, useEffect, useRef } from 'react'

// Colour thresholds — matches the health of the score
function getRingColor(score) {
  if (score >= 70) return '#22C55E'         // green — healthy
  if (score >= 45) return '#EAB308'         // yellow — moderate
  if (score >= 25) return '#F97316'         // orange — concerning
  return '#F43F5E'                          // rose — critical
}

function getScoreLabel(score) {
  if (score >= 70) return 'Healthy'
  if (score >= 45) return 'Shaky'
  if (score >= 25) return 'At Risk'
  return 'Critical'
}

// Animated count-up
function useCountUp(target, duration = 1400, enabled = false) {
  const [val, setVal] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!enabled) { setVal(0); return }
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target))
      if (p < 1) frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration, enabled])

  return val
}

export default function OverallScore({ score, imageObjectUrl }) {
  const [visible, setVisible] = useState(false)
  const displayScore = useCountUp(score, 1600, visible)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  // SVG ring maths
  const SIZE    = 120
  const STROKE  = 8
  const R       = (SIZE - STROKE) / 2
  const CIRC    = 2 * Math.PI * R
  const filled  = visible ? (displayScore / 100) * CIRC : 0
  const color   = getRingColor(score)
  const label   = getScoreLabel(score)

  return (
    <div className="overall-score-wrap result-stagger" style={{ '--stagger': 0 }}>
      {/* Photo + ring overlay */}
      <div className="overall-score-ring-wrap">
        {/* Background photo */}
        {imageObjectUrl && (
          <img
            src={imageObjectUrl}
            alt="Analyzed couple"
            className="overall-score-photo"
          />
        )}

        {/* SVG ring — sits on top of the photo */}
        <svg
          className="overall-score-svg"
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={STROKE}
          />
          {/* Filled arc — rotated so it starts at 12 o'clock */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${CIRC}`}
            strokeDashoffset={`${CIRC - filled}`}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)',
              filter: `drop-shadow(0 0 6px ${color}88)`,
            }}
          />
        </svg>

        {/* Score number centered in the ring */}
        <div className="overall-score-number-wrap">
          <span className="overall-score-number" style={{ color }}>
            {displayScore}
          </span>
          <span className="overall-score-unit">/ 100</span>
        </div>
      </div>

      {/* Label + caption below the ring */}
      <div className="overall-score-meta">
        <span className="overall-score-label" style={{ color }}>
          {label}
        </span>
        <span className="overall-score-caption">Overall Score</span>
      </div>
    </div>
  )
}
