import { useState } from 'react'
import {
  getReportTitle,
  buildPlainTextReport,
  downloadTextReport,
  copyReportToClipboard,
} from '../utils/reportGenerator.js'

const safeArr = (v) => (Array.isArray(v) ? v : [])

const SEV_COLORS = {
  Low: '#22C55E', Moderate: '#EAB308', High: '#F97316', Critical: '#F43F5E',
}

function MetricRow({ metric }) {
  const color = SEV_COLORS[metric.severity] ?? '#A1A1AA'
  return (
    <div className="rp-metric-row">
      <span className="rp-metric-emoji">{metric.emoji}</span>
      <span className="rp-metric-label">{metric.label}</span>
      <div className="rp-metric-bar-track">
        <div className="rp-metric-bar-fill"
          style={{ width: `${metric.score}%`, background: `linear-gradient(90deg,${color}55,${color})` }} />
      </div>
      <span className="rp-metric-score">{metric.score}%</span>
      <span className="rp-metric-sev" style={{ color }}>{metric.severity}</span>
    </div>
  )
}

function ReportSection({ title, children, delay = 0 }) {
  return (
    <div className="rp-section" style={{ animationDelay: `${delay}ms` }}>
      <h3 className="rp-section-title">{title}</h3>
      {children}
    </div>
  )
}

export default function FullReportPage({
  prediction,
  context,
  uploadMode,
  imageObjectUrl,
  personA,
  personB,
  onBack,
}) {
  const [toast, setToast]         = useState(null)
  const [copying, setCopying]     = useState(false)
  const [downloading, setDownloading] = useState(false)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  if (!prediction) {
    return (
      <section className="rp-no-data view-container">
        <span className="rp-no-data-icon">📋</span>
        <h2 className="rp-no-data-title">NO REPORT AVAILABLE</h2>
        <p className="rp-no-data-sub">
          Complete an analysis first. Our report department needs something to work with.
        </p>
        <button className="btn btn--primary" onClick={onBack}>← Back</button>
      </section>
    )
  }

  const isHuman      = context === 'human'
  const reportTitle  = getReportTitle(context)
  const metrics      = safeArr(prediction.metrics)
  const redFlags     = safeArr(prediction.redFlags)
  const greenFlags   = safeArr(prediction.greenFlags)
  const whoQs        = safeArr(prediction.whoMoreLikelyQuestions)
  const primaryImage = uploadMode === 'individual' ? (personA?.url ?? imageObjectUrl) : imageObjectUrl
  const secondImage  = uploadMode === 'individual' ? (personB?.url ?? null) : null
  const subjectNameA = personA?.name || (isHuman ? 'Person A' : 'Subject A')
  const subjectNameB = personB?.name || (isHuman ? 'Person B' : 'Subject B')

  const handleCopy = async () => {
    setCopying(true)
    try {
      await copyReportToClipboard(prediction, context, uploadMode, personA, personB)
      showToast('Report copied! Go emotionally damage your friends. 💀')
    } catch {
      showToast('Could not copy. Try downloading instead.')
    } finally {
      setCopying(false)
    }
  }

  const handleDownload = () => {
    setDownloading(true)
    try {
      downloadTextReport(prediction, context, uploadMode, personA, personB)
      showToast('Downloading report…')
    } catch (err) {
      showToast('Download failed. Please try again.')
      console.error(err)
    } finally {
      setTimeout(() => setDownloading(false), 1000)
    }
  }

  const handlePrint = () => window.print()

  const handleShare = async () => {
    const text = buildPlainTextReport(prediction, context, uploadMode, personA, personB)
    if (navigator.share) {
      try {
        await navigator.share({ title: `love404 — ${reportTitle}`, text })
        return
      } catch { /* fall through */ }
    }
    try {
      await navigator.clipboard.writeText(text)
      showToast('Report copied! Share the questionable science.')
    } catch {
      showToast('Could not copy. Please try downloading.')
    }
  }

  return (
    <section className="rp-page view-container" id="full-report-page">

      {/* Toast */}
      {toast && (
        <div className="toast" role="status" aria-live="polite">{toast}</div>
      )}

      {/* ── Top bar ───────────────────────────────────────── */}
      <div className="rp-topbar">
        <button className="btn btn--ghost rp-back-btn" onClick={onBack}>
          ← Back to Results
        </button>
        <div className="rp-actions">
          <button className="btn btn--ghost rp-action-btn" onClick={handleCopy} disabled={copying}>
            {copying ? '⏳' : '📋'} Copy
          </button>
          <button className="btn btn--ghost rp-action-btn" onClick={handleDownload} disabled={downloading}>
            {downloading ? '⏳' : '⬇️'} Download
          </button>
          <button className="btn btn--ghost rp-action-btn rp-print-btn" onClick={handlePrint}>
            🖨️ Print
          </button>
          <button className="btn btn--primary rp-action-btn" onClick={handleShare}>
            📤 Share
          </button>
        </div>
      </div>

      {/* ── Report header ─────────────────────────────────── */}
      <div className="rp-header">
        <div className="rp-header-badge">
          <span className="rp-header-badge-dot" />
          OFFICIAL REPORT
        </div>
        <h1 className="rp-title">{reportTitle}</h1>
        <p className="rp-subtitle">
          Generated by love404 &nbsp;·&nbsp; 100% Fake AI &nbsp;·&nbsp; 0% Scientific Accuracy
        </p>
        <p className="rp-date">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          &nbsp;·&nbsp; Context: {context.toUpperCase()}
        </p>
      </div>

      <div className="rp-body">

        {/* ── Photos ──────────────────────────────────────── */}
        {(primaryImage || secondImage) && (
          <ReportSection title={uploadMode === 'individual' ? '📸 SUBJECTS' : '📸 UPLOADED PHOTO'} delay={50}>
            <div className="rp-photos">
              {uploadMode === 'individual' ? (
                <>
                  <div className="rp-photo-slot">
                    <img src={primaryImage} alt={subjectNameA} className="rp-photo-img" />
                    <span className="rp-photo-label">{subjectNameA}</span>
                  </div>
                  <div className="rp-photo-vs" aria-hidden="true">vs</div>
                  <div className="rp-photo-slot">
                    {secondImage
                      ? <img src={secondImage} alt={subjectNameB} className="rp-photo-img" />
                      : <div className="rp-photo-placeholder">No photo</div>}
                    <span className="rp-photo-label">{subjectNameB}</span>
                  </div>
                </>
              ) : (
                <div className="rp-photo-slot rp-photo-slot--full">
                  <img src={primaryImage} alt="Analyzed" className="rp-photo-img rp-photo-img--wide" />
                </div>
              )}
            </div>
          </ReportSection>
        )}

        {/* ── Verdict ─────────────────────────────────────── */}
        <ReportSection title="🏆 VERDICT" delay={100}>
          <p className="rp-verdict">{prediction.verdict}</p>
          <p className="rp-funny-reason">"{prediction.funnyReason}"</p>
          <div className="rp-overall-row">
            <span className="rp-overall-label">Overall Score</span>
            <span className="rp-overall-value">
              {prediction.overallScore}
              <span className="rp-overall-unit">/100</span>
            </span>
          </div>
          {isHuman && (
            <div className="rp-human-pills">
              <span className="rp-pill rp-pill--rose">💔 Breakup: {prediction.breakupProbability ?? '?'}%</span>
              <span className="rp-pill rp-pill--green">❤️ Strength: {prediction.relationshipStrength ?? '?'}%</span>
            </div>
          )}
        </ReportSection>

        {/* ── Metrics ─────────────────────────────────────── */}
        {metrics.length > 0 && (
          <ReportSection title="📊 DETAILED SCORES" delay={160}>
            <div className="rp-metrics-list">
              {metrics.map(m => <MetricRow key={m.key} metric={m} />)}
            </div>
          </ReportSection>
        )}

        {/* ── Analysis notes ──────────────────────────────── */}
        {metrics.length > 0 && (
          <ReportSection title="📝 ANALYSIS NOTES" delay={220}>
            <ul className="rp-notes-list">
              {metrics.map(m => (
                <li key={m.key} className="rp-note-item">
                  <span>{m.emoji}</span>
                  <span>{m.joke}</span>
                </li>
              ))}
            </ul>
          </ReportSection>
        )}

        {/* ── Weather ─────────────────────────────────────── */}
        {prediction.weather && (
          <ReportSection title="🌤️ CONTEXT WEATHER" delay={280}>
            <div className="rp-weather">
              <span className="rp-weather-icon">{prediction.weather.icon}</span>
              <div>
                <p className="rp-weather-label">{prediction.weather.label}</p>
                <p className="rp-weather-sub">{prediction.weather.sub}</p>
              </div>
            </div>
          </ReportSection>
        )}

        {/* ── Flags ───────────────────────────────────────── */}
        {(redFlags.length > 0 || greenFlags.length > 0) && (
          <div className="rp-flags-grid" style={{ animationDelay: '340ms' }}>
            <ReportSection title="🚩 RED FLAGS" delay={340}>
              <ul className="rp-flags-list">
                {redFlags.map((f, i) => <li key={i} className="rp-flag rp-flag--red">{f}</li>)}
              </ul>
            </ReportSection>
            <ReportSection title="💚 GREEN FLAGS" delay={380}>
              <ul className="rp-flags-list">
                {greenFlags.map((f, i) => <li key={i} className="rp-flag rp-flag--green">{f}</li>)}
              </ul>
            </ReportSection>
          </div>
        )}

        {/* ── Expert advice ───────────────────────────────── */}
        {prediction.advice && (
          <ReportSection title="💡 EXPERT ADVICE" delay={420}>
            <p className="rp-advice">"{prediction.advice}"</p>
          </ReportSection>
        )}

        {/* ── Who is more likely ──────────────────────────── */}
        {isHuman && whoQs.length > 0 && (
          <ReportSection title="👀 WHO IS MORE LIKELY TO…" delay={460}>
            <ul className="rp-notes-list">
              {whoQs.slice(0, 5).map((q, i) => (
                <li key={i} className="rp-note-item">
                  <span>•</span>
                  <span>{q.q}</span>
                </li>
              ))}
            </ul>
          </ReportSection>
        )}

        {/* ── Profile ─────────────────────────────────────── */}
        {prediction.profile && (
          <ReportSection title="🪪 OFFICIAL PROFILE" delay={500}>
            <div className="rp-profile">
              <p className="rp-profile-name">{prediction.profile.name}</p>
              <p className="rp-profile-type">{prediction.profile.type}</p>
              <p className="rp-profile-status">{prediction.profile.status}</p>
              {safeArr(prediction.profile.strengths).length > 0 && (
                <div className="rp-profile-tags">
                  {safeArr(prediction.profile.strengths).map((s, i) => (
                    <span key={i} className="rp-profile-tag rp-profile-tag--strength">✓ {s}</span>
                  ))}
                  {safeArr(prediction.profile.weaknesses).map((w, i) => (
                    <span key={i} className="rp-profile-tag rp-profile-tag--weakness">✗ {w}</span>
                  ))}
                </div>
              )}
              <p className="rp-profile-cert">🏅 {prediction.profile.certification}</p>
            </div>
          </ReportSection>
        )}

        {/* ── Footer meta ─────────────────────────────────── */}
        <div className="rp-meta" style={{ animationDelay: '540ms' }}>
          <div className="rp-meta-row"><span>AI USED</span><span>Absolutely none.</span></div>
          <div className="rp-meta-row"><span>SCIENTIFIC ACCURACY</span><span>0%</span></div>
          <div className="rp-meta-row"><span>CONTEXT DETECTION</span><span>Real AI (COCO-SSD + MobileNet)</span></div>
          <div className="rp-meta-row"><span>RESULTS GENERATION</span><span>Pure randomness</span></div>
          <div className="rp-meta-row"><span>CERTIFIED BY</span><span>International Institute of Absolutely Nothing</span></div>
        </div>

        <div className="rp-disclaimer">
          ⚠️ This report is 100% fake and generated for entertainment purposes only.
          Please do not make real life decisions based on this. We beg you.
        </div>

      </div>

      {/* ── Bottom action bar ─────────────────────────────── */}
      <div className="rp-bottom-bar">
        <button className="btn btn--ghost" onClick={onBack}>← Back to Results</button>
        <div className="rp-actions">
          <button className="btn btn--ghost rp-action-btn" onClick={handleCopy} disabled={copying}>
            {copying ? '⏳' : '📋'} Copy Report
          </button>
          <button className="btn btn--ghost rp-action-btn" onClick={handleDownload} disabled={downloading}>
            {downloading ? '⏳' : '⬇️'} Download .txt
          </button>
          <button className="btn btn--primary rp-action-btn" onClick={handleShare}>
            📤 Share
          </button>
        </div>
      </div>

    </section>
  )
}
