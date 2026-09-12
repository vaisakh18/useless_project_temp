import { useState, useEffect, useRef } from 'react'

const BREAKUP_LABELS = [
  { max: 20,  label: 'Basically Unbreakable',      color: '#22C55E' },
  { max: 40,  label: 'Minor Turbulence',            color: '#84CC16' },
  { max: 60,  label: 'Proceed With Snacks',         color: '#EAB308' },
  { max: 80,  label: 'Things Are Getting Suspicious', color: '#F97316' },
  { max: 100, label: 'GET THE FRIENDS INVOLVED',    color: '#F43F5E' },
]

const GENERIC_LABELS = [
  { max: 20,  label: 'Barely There',     color: '#71717A' },
  { max: 40,  label: 'Getting There',    color: '#84CC16' },
  { max: 60,  label: 'Notably Present',  color: '#EAB308' },
  { max: 80,  label: 'Quite Intense',    color: '#F97316' },
  { max: 100, label: 'Off the Charts',   color: '#F43F5E' },
]

function getLabel(value, isHuman) {
  const table = isHuman ? BREAKUP_LABELS : GENERIC_LABELS
  return table.find(t => value <= t.max) ?? table[table.length - 1]
}

function useCountUp(target, duration = 1600, enabled = false) {
  const [val, setVal] = useState(0)
  const frameRef = useRef(null)
  useEffect(() => {
    if (!enabled) { setVal(0); return }
    let start = null
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration, enabled])
  return val
}

export default function MainMeter({ value, label, emoji, isHuman = false }) {
  const [visible, setVisible] = useState(false)
  const display = useCountUp(value, 1800, visible)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150)
    return () => clearTimeout(t)
  }, [])

  const { label: statusLabel, color } = getLabel(display, isHuman)

  // SVG arc params
  const SIZE   = 180
  const STROKE = 12
  const R      = (SIZE - STROKE) / 2
  const CIRC   = 2 * Math.PI * R
  // Only draw 270° of the circle (3/4), starting from 135° (bottom-left)
  const ARC_FRAC   = 0.75
  const arcLength  = CIRC * ARC_FRAC
  const filled     = visible ? (display / 100) * arcLength : 0
  const dashOffset = arcLength - filled

  return (
    <div className="main-meter result-stagger" style={{ '--stagger': 2 }}>
      <div className="main-meter-label-top">
        <span className="main-meter-emoji" aria-hidden="true">{emoji}</span>
        <span className="main-meter-title">{label}</span>
      </div>

      <div className="main-meter-svg-wrap" role="meter" aria-valuenow={display} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
          {/* Track arc */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={STROKE}
            strokeDasharray={`${arcLength} ${CIRC}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            style={{ transform: 'rotate(135deg)', transformOrigin: '50% 50%' }}
          />
          {/* Filled arc */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeDasharray={`${arcLength} ${CIRC}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              transform: 'rotate(135deg)',
              transformOrigin: '50% 50%',
              transition: 'stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1), stroke 0.4s ease',
              filter: `drop-shadow(0 0 8px ${color}99)`,
            }}
          />
        </svg>

        {/* Centre readout */}
        <div className="main-meter-center">
          <span className="main-meter-value" style={{ color }}>{display}</span>
          <span className="main-meter-unit">%</span>
        </div>
      </div>

      <div className="main-meter-status" style={{ color }}>
        {statusLabel}
      </div>

      {isHuman && (
        <p className="main-meter-footnote">Completely fictional calculation.</p>
      )}
    </div>
  )
}
