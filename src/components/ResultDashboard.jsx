import { useState, useCallback, useRef } from 'react'
import ResultCard from './ResultCard.jsx'
import OverallScore from './OverallScore.jsx'
import MainMeter from './MainMeter.jsx'
import ProfileCard from './ProfileCard.jsx'
import ContextWeather from './ContextWeather.jsx'
import WhoIsMoreLikely from './WhoIsMoreLikely.jsx'
import RedFlags from './RedFlags.jsx'
import GreenFlags from './GreenFlags.jsx'
import ExpertAdvice from './ExpertAdvice.jsx'
import FullReportModal from './FullReportModal.jsx'
import { getContent } from '../utils/contextContent.js'

// ── Share text builder (context-aware) ────────────────────────
function buildShareText(p, context) {
  const content = getContent(context)
  if (context === 'human') {
    return [
      `💔 love404 results:`,
      ``,
      `Verdict: ${p.verdict}`,
      `Overall Score: ${p.overallScore}/100`,
      `Breakup Probability: ${p.breakupProbability ?? '?'}%`,
      `Relationship Strength: ${p.relationshipStrength ?? '?'}%`,
      ``,
      `"${p.funnyReason}"`,
      ``,
      `⚠️ 100% fake AI — for entertainment only.`,
    ].join('\n')
  }
  const topMetrics = p.metrics.slice(0, 3).map(m => `${m.emoji} ${m.label}: ${m.score}%`).join('\n')
  return [
    `💔 love404 — ${content.heading}`,
    ``,
    `Verdict: ${p.verdict}`,
    `Overall Score: ${p.overallScore}/100`,
    ``,
    topMetrics,
    ``,
    `"${p.funnyReason}"`,
    ``,
    `⚠️ 100% fake AI — for entertainment only.`,
  ].join('\n')
}

export default function ResultDashboard({
  prediction,
  imageObjectUrl,
  uploadMode,
  personA,
  personB,
  onAnalyzeAgain,
  onUploadAnother,
}) {
  const [toastMessage, setToastMessage] = useState(null)
  const [showModal, setShowModal]       = useState(false)
  const verdictCardRef = useRef(null)

  const context   = prediction.context ?? 'human'
  const content   = getContent(context)
  const isHuman   = prediction.isHuman ?? context === 'human'

  // ── Toast ────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3200)
  }

  // ── Share ────────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    const text = buildShareText(prediction, context)
    if (navigator.share) {
      try { await navigator.share({ title: '💔 love404 Results', text }) }
      catch { copyToClipboard(text) }
    } else {
      copyToClipboard(text)
    }
  }, [prediction, context])

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => showToast('Copied! Go emotionally damage your friends. 💀'))
      .catch(() => {
        // Last-resort textarea fallback
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity  = '0'
        document.body.appendChild(ta)
        ta.select()
        try { document.execCommand('copy'); showToast('Copied! Go emotionally damage your friends. 💀') }
        catch { showToast('Could not copy. Some relationships cannot be saved.') }
        document.body.removeChild(ta)
      })
  }

  // ── Spotlight on verdict card ────────────────────────────────
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

  // ── Verdict card style flags ─────────────────────────────────
  const { verdictCategory = 'complicated' } = prediction
  const isImminent = verdictCategory === 'imminent'
  const isStable   = verdictCategory === 'stable'

  // ── Person names for individual mode ────────────────────────
  const nameA = personA?.name || 'Person 1'
  const nameB = personB?.name || 'Person 2'

  return (
    <section className="result-section view-container">

      {/* Toast */}
      {toastMessage && (
        <div className="toast" role="status" aria-live="polite">{toastMessage}</div>
      )}

      {/* Full Report Modal */}
      {showModal && (
        <FullReportModal
          prediction={prediction}
          context={context}
          uploadMode={uploadMode}
          imageObjectUrl={imageObjectUrl}
          personA={personA}
          personB={personB}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="result-header result-stagger" style={{ '--stagger': 0 }}>
        <h2 className="result-title">{content.heading}</h2>
        <p className="result-subtitle">{content.subheading}</p>
      </div>

      {/* ── Top row: overall score ring + verdict card ────────── */}
      <div className="result-top-row result-stagger" style={{ '--stagger': 1 }}>

        <OverallScore score={prediction.overallScore} imageObjectUrl={imageObjectUrl} />

        <div
          ref={verdictCardRef}
          className={`result-verdict-card spotlight-card verdict-pop
            ${isImminent ? 'verdict--imminent' : ''}
            ${isStable   ? 'verdict--stable'   : ''}`}
          onMouseMove={handleVerdictMouseMove}
          onMouseLeave={handleVerdictMouseLeave}
        >
          {isImminent && <div className="verdict-glow verdict-glow--danger" aria-hidden="true" />}
          {isStable   && <div className="verdict-glow verdict-glow--stable" aria-hidden="true" />}

          <span className="result-verdict-label">PRIMARY VERDICT</span>
          <p className="result-verdict-text">{prediction.verdict}</p>
          <div className="result-verdict-divider" />
          <p className="result-funny-reason funny-reason-reveal">
            <span className="funny-reason-quote" aria-hidden="true">"</span>
            {prediction.funnyReason}
            <span className="funny-reason-quote" aria-hidden="true">"</span>
          </p>
        </div>
      </div>

      {/* ── Main meter + weather side by side ─────────────────── */}
      <div className="result-meter-row result-stagger" style={{ '--stagger': 2 }}>
        <MainMeter
          value={prediction.mainMetricValue ?? 50}
          label={prediction.mainMetricLabel ?? 'Score'}
          emoji={content.mainMetricEmoji ?? '📊'}
          isHuman={isHuman}
        />
        <ContextWeather weather={prediction.weather} context={context} />
      </div>

      {/* ── 3×2 Metric cards ──────────────────────────────────── */}
      <div className="result-grid">
        {prediction.metrics.map((metric, i) => (
          <ResultCard key={metric.key} metric={metric} animationDelay={i * 120} />
        ))}
      </div>

      {/* ── Red + Green flags ────────────────────────────────── */}
      <div className="result-flags-row result-stagger" style={{ '--stagger': 3 }}>
        <RedFlags   flags={prediction.redFlags}   />
        <GreenFlags flags={prediction.greenFlags} />
      </div>

      {/* ── Expert advice ────────────────────────────────────── */}
      <ExpertAdvice initialAdvice={prediction.advice} context={context} />

      {/* ── Who is more likely (human only) ─────────────────── */}
      {isHuman && prediction.whoMoreLikelyQuestions?.length > 0 && (
        <WhoIsMoreLikely
          questions={prediction.whoMoreLikelyQuestions}
          personAName={nameA}
          personBName={nameB}
        />
      )}

      {/* ── Profile card (CV) ────────────────────────────────── */}
      <ProfileCard profile={prediction.profile} cvTitle={content.cvTitle} />

      {/* ── Action toolbar ───────────────────────────────────── */}
      <div className="result-actions result-stagger" style={{ '--stagger': 4 }}>
        <button className="btn btn--ghost btn--rotate-icon" onClick={onAnalyzeAgain}>
          <span className="btn-rotate-icon">🔄</span> Analyze Again
        </button>
        <button className="btn btn--ghost" onClick={onUploadAnother}>
          📷 Upload Another
        </button>
        <button className="btn btn--ghost" onClick={() => setShowModal(true)}>
          📄 Full Report
        </button>
        <button className="btn btn--primary btn--share" onClick={handleShare}>
          <span className="btn-share-icon">📤</span> Share
        </button>
      </div>

      {/* ── Disclaimer ───────────────────────────────────────── */}
      <div className="result-disclaimer result-stagger" style={{ '--stagger': 4 }}>
        <span className="disclaimer-icon">⚠️</span>
        This prediction is 100% fake and generated for entertainment purposes only.
        {!isHuman && ` Nothing here can actually determine ${context} compatibility.`}
        &nbsp;Please do not make life decisions based on this app. We beg you.
      </div>
    </section>
  )
}
