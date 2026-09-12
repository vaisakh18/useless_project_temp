import { useState, useEffect } from 'react'

const TAGLINES = [
  "Using absolutely no science to predict your future.",
  "Powered by questionable algorithms since 2024.",
  "We have opinions. They are fake. They are confident.",
  "Ruining relationships, one upload at a time.",
]

export default function Hero({ onCta }) {
  const [taglineIdx,  setTaglineIdx]  = useState(0)
  const [taglineFade, setTaglineFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineFade(false)
      setTimeout(() => { setTaglineIdx(i => (i + 1) % TAGLINES.length); setTaglineFade(true) }, 350)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="hero" className="hero">
      {/* Ambient orbs */}
      <div className="hero-orb hero-orb--1" aria-hidden="true" />
      <div className="hero-orb hero-orb--2" aria-hidden="true" />
      <div className="hero-orb hero-orb--3" aria-hidden="true" />

      <div className="hero-content">

        {/* Badge */}
        <div className="hero-tag hero-stagger" style={{ '--stagger': 0 }}>
          <span className="hero-tag-dot" />
          Powered by Questionable Science™
          <span className="hero-tag-separator" aria-hidden="true">·</span>
          <span className="hero-tag-version">v2.0</span>
        </div>

        {/* Headline */}
        <h1 className="hero-heading hero-stagger" style={{ '--stagger': 1 }}>
          <span className="hero-heading-line1">AI Breakup</span>
          <br />
          <span className="hero-heading-gradient">Predictor</span>
        </h1>

        {/* Rotating tagline */}
        <p
          className="hero-tagline hero-stagger"
          style={{ '--stagger': 2, opacity: taglineFade ? 1 : 0, transition: 'opacity 350ms ease' }}
          aria-live="polite"
        >
          <em>{TAGLINES[taglineIdx]}</em>
        </p>

        {/* Stat pills */}
        <div className="hero-stats hero-stagger" style={{ '--stagger': 2 }}>
          {[
            { value: '9',    label: 'Contexts' },
            { value: '0%',   label: 'Science' },
            { value: '∞',    label: 'Drama' },
            { value: '100%', label: 'Fake AI' },
          ].map(({ value, label }) => (
            <div key={label} className="hero-stat-pill">
              <span className="hero-stat-value">{value}</span>
              <span className="hero-stat-label">{label}</span>
            </div>
          ))}
        </div>

        {/* Preview card */}
        <div className="hero-preview-card hero-stagger hero-float" style={{ '--stagger': 4 }}>
          <div className="hero-scan-line" aria-hidden="true" />
          <div className="hero-preview-header">
            <div className="hero-preview-header-left">
              <span className="hero-preview-dot hero-preview-dot--red"    aria-hidden="true" />
              <span className="hero-preview-dot hero-preview-dot--yellow" aria-hidden="true" />
              <span className="hero-preview-dot hero-preview-dot--green"  aria-hidden="true" />
            </div>
            <span className="hero-preview-label">FAKE SCAN RESULTS</span>
            <span className="hero-preview-badge">DEMO</span>
          </div>
          <div className="hero-preview-metrics">
            <div className="hero-preview-metric">
              <span className="hero-preview-metric-name">✨ Vibe Compatibility</span>
              <div className="hero-preview-bar-track">
                <div className="hero-preview-bar-fill" style={{ width: '82%' }} />
              </div>
              <span className="hero-preview-metric-value">82%</span>
            </div>
            <div className="hero-preview-metric">
              <span className="hero-preview-metric-name">🎭 Drama Potential</span>
              <div className="hero-preview-bar-track">
                <div className="hero-preview-bar-fill hero-preview-bar-fill--danger" style={{ width: '91%' }} />
              </div>
              <span className="hero-preview-metric-value">91%</span>
            </div>
            <div className="hero-preview-metric">
              <span className="hero-preview-metric-name">💔 Breakup Probability</span>
              <div className="hero-preview-bar-track">
                <div className="hero-preview-bar-fill hero-preview-bar-fill--warning" style={{ width: '57%' }} />
              </div>
              <span className="hero-preview-metric-value">57%</span>
            </div>
          </div>
          <div className="hero-preview-verdict">
            <span className="hero-preview-verdict-label">Status:</span>
            <span className="hero-preview-verdict-value">🫠 It's Complicated</span>
            <span className="hero-preview-verdict-badge">FAKE</span>
          </div>
        </div>

        {/* Primary CTA */}
        <button
          className="btn btn--primary btn--lg hero-cta-btn hero-stagger"
          style={{ '--stagger': 3 }}
          onClick={onCta}
        >
          <span className="hero-cta-icon" aria-hidden="true">🔬</span>
          Predict My Relationship
          <span className="btn-arrow" aria-hidden="true">→</span>
        </button>

        {/* Scroll hint */}
        <p className="hero-scroll-hint hero-stagger" style={{ '--stagger': 5 }}>
          ↓ &nbsp; Scroll to explore &nbsp; · &nbsp; 100% fake AI &nbsp; · &nbsp; No data stored
        </p>

      </div>
    </section>
  )
}
