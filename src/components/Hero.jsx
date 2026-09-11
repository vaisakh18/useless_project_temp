export default function Hero({ onCta }) {
  return (
    <section className="hero view-container">
      <div className="hero-content">

        {/* Staggered entrance — each child has a CSS animation-delay via inline style */}
        <div className="hero-tag hero-stagger" style={{ '--stagger': 0 }}>
          <span className="hero-tag-dot" />
          Powered by Questionable Science™
        </div>

        <h1 className="hero-heading hero-stagger" style={{ '--stagger': 1 }}>
          AI Breakup
          <br />
          <span className="hero-heading-accent">Predictor</span>
        </h1>

        <p className="hero-tagline hero-stagger" style={{ '--stagger': 2 }}>
          Using <em>absolutely no science</em> to predict your relationship's future.
        </p>

        {/* Floating animated preview card */}
        <div className="hero-preview-card hero-stagger hero-float" style={{ '--stagger': 4 }}>
          {/* Passive scan line inside the preview card */}
          <div className="hero-scan-line" aria-hidden="true" />

          <div className="hero-preview-header">
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
          </div>
        </div>

        <button
          className="btn btn--primary btn--lg hero-cta-btn hero-stagger"
          style={{ '--stagger': 3 }}
          onClick={onCta}
        >
          Predict My Relationship
          <span className="btn-arrow" aria-hidden="true">→</span>
        </button>

        <p className="hero-disclaimer hero-stagger" style={{ '--stagger': 5 }}>
          100% fake AI &nbsp;•&nbsp; 0% scientific accuracy &nbsp;•&nbsp; For entertainment only
        </p>

      </div>
    </section>
  )
}
