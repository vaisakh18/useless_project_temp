export default function UploadModeSelector({ onSelect }) {
  return (
    <section className="mode-section view-container">
      <div className="mode-header">
        <div className="mode-tag">
          <span className="mode-tag-dot" />
          Step 1 of 2
        </div>
        <h2 className="mode-title">How do you want to upload?</h2>
        <p className="mode-subtitle">
          Choose your upload style. Both options end in equally questionable analysis.
        </p>
      </div>

      <div className="mode-cards">
        {/* Option 1 — Couple photo */}
        <button
          className="mode-card"
          onClick={() => onSelect('couple')}
          aria-label="Upload one photo containing both subjects"
        >
          <div className="mode-card-icon-wrap">
            <span className="mode-card-icon" aria-hidden="true">📸</span>
          </div>
          <div className="mode-card-body">
            <h3 className="mode-card-title">Couple Photo</h3>
            <p className="mode-card-desc">
              Upload one photo containing both subjects. Quick, easy, equally unscientific.
            </p>
            <ul className="mode-card-features">
              <li>✓ One upload</li>
              <li>✓ Full relationship analysis</li>
              <li>✓ Instant drama detection</li>
            </ul>
          </div>
          <span className="mode-card-cta">
            Upload Couple Photo
            <span className="mode-card-arrow" aria-hidden="true">→</span>
          </span>
        </button>

        {/* Option 2 — Two separate photos */}
        <button
          className="mode-card"
          onClick={() => onSelect('individual')}
          aria-label="Upload each person separately"
        >
          <div className="mode-card-icon-wrap">
            <span className="mode-card-icon" aria-hidden="true">👤</span>
            <span className="mode-card-icon-plus" aria-hidden="true">+</span>
            <span className="mode-card-icon" aria-hidden="true">👤</span>
          </div>
          <div className="mode-card-body">
            <h3 className="mode-card-title">Two Separate Photos</h3>
            <p className="mode-card-desc">
              Upload each person individually. For when you have opinions about who is to blame.
            </p>
            <ul className="mode-card-features">
              <li>✓ Individual analysis</li>
              <li>✓ Custom names</li>
              <li>✓ "Who is more likely to…" game</li>
            </ul>
          </div>
          <span className="mode-card-cta">
            Upload Two Photos
            <span className="mode-card-arrow" aria-hidden="true">→</span>
          </span>
        </button>
      </div>

      <p className="mode-disclaimer">
        ⚠️ Neither option involves real AI. Both options involve maximum fake drama.
      </p>
    </section>
  )
}
