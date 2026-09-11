import { useState, useCallback, useRef } from 'react'
import ResultCard from './ResultCard.jsx'

const SHARE_TEXT = (p) =>
  `💔 love404 results:\n\nVerdict: ${p.verdict}\nBreakup Probability: ${p.breakupProbability}%\nRelationship Strength: ${p.relationshipStrength}%\n\n"${p.funnyReason}"\n\n⚠️ 100% fake AI — for entertainment only.`

export default function ResultDashboard({
  prediction,
  imageObjectUrl,
  onAnalyzeAgain,
  onUploadAnother,
}) {
  const [toastMessage, setToastMessage] = useState(null)
  const verdictCardRef = useRef(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3200)
  }

  const handleShare = useCallback(async () => {
    const text = SHARE_TEXT(prediction)
    if (navigator.share) {
      try { await navigator.share({ title: '💔 love404 Results', text }) }
      catch { copyToClipboard(text) }
    } else {
      copyToClipboard(text)
    }
  }, [prediction])

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => showToast('Copied! Go emotionally damage your friends. 💀'))
      .catch(() => showToast('Could not copy. Some relationships cannot be saved.'))
  }

  // Spotlight cursor effect on verdict card
  const handleVerdictMouseMove = useCallback((e) => {
    const card = verdictCardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`)
  }, [])

  const handleVerdictMouseLeave = useCallback(() => {
    const card = verdictCardRef.current
    if (!card) return
    card.style.setProperty('--spotlight-x', '-9999px')
    card.style.setProperty('--spotlight-y', '-9999px')
  }, [])

  // Extreme score modifiers
  const isImminent = prediction.breakupProbability >= 85
  const isSurprisinglyStable = prediction.breakupProbability <= 20

  return (
    <section className="result-section view-container">

      {/* Toast */}
      {toastMessage && (
        <div className="toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="result-header result-stagger" style={{ '--stagger': 0 }}>
        <h2 className="result-title">THE RESULTS ARE IN.</h2>
        <p className="result-subtitle">
          We regret to inform you that our algorithm has opinions.
        </p>
      </div>

      {/* Verdict + image row */}
      <div className="result-verdict-row result-stagger" style={{ '--stagger': 1 }}>
        {imageObjectUrl && (
          <div className="result-photo-wrap">
            <img src={imageObjectUrl} alt="Analyzed couple" className="result-photo" />
          </div>
        )}

        <div
          ref={verdictCardRef}
          className={`result-verdict-card spotlight-card verdict-pop ${isImminent ? 'verdict--imminent' : ''} ${isSurprisinglyStable ? 'verdict--stable' : ''}`}
          onMouseMove={handleVerdictMouseMove}
          onMouseLeave={handleVerdictMouseLeave}
        >
          {/* Animated accent glow for extreme results */}
          {isImminent && <div className="verdict-glow verdict-glow--danger" aria-hidden="true" />}
          {isSurprisinglyStable && <div className="verdict-glow verdict-glow--stable" aria-hidden="true" />}

          <span className="result-verdict-label">PRIMARY VERDICT</span>
          <p className="result-verdict-text">{prediction.verdict}</p>
          <div className="result-verdict-divider" />
          {/* Funny reason animated quote */}
          <p className="result-funny-reason funny-reason-reveal">
            <span className="funny-reason-quote" aria-hidden="true">"</span>
            {prediction.funnyReason}
            <span className="funny-reason-quote" aria-hidden="true">"</span>
          </p>
        </div>
      </div>

      {/* 3×2 Metrics grid — staggered per card */}
      <div className="result-grid">
        {prediction.metrics.map((metric, i) => (
          <ResultCard key={metric.key} metric={metric} animationDelay={i * 120} />
        ))}
      </div>

      {/* Action toolbar */}
      <div className="result-actions result-stagger" style={{ '--stagger': 3 }}>
        <button className="btn btn--ghost btn--rotate-icon" onClick={onAnalyzeAgain}>
          <span className="btn-rotate-icon">🔄</span> Analyze Again
        </button>
        <button className="btn btn--ghost" onClick={onUploadAnother}>
          📷 Upload Another Photo
        </button>
        <button className="btn btn--primary btn--share" onClick={handleShare}>
          <span className="btn-share-icon">📤</span> Share Result
        </button>
      </div>

      {/* Disclaimer */}
      <div className="result-disclaimer result-stagger" style={{ '--stagger': 4 }}>
        <span className="disclaimer-icon">⚠️</span>
        This prediction is 100% fake and generated for entertainment purposes only.
        Please do not make real relationship decisions based on this app. We beg you.
      </div>
    </section>
  )
}
