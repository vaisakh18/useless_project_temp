import { useState, useEffect, useRef } from 'react'
import { getContextResult } from '../utils/contextEngine.js'
import { getContent } from '../utils/contextContent.js'

const TOTAL_DURATION = 5200
const STEP_INTERVAL  = 650

export default function AnalysisLoader({
  context = 'human',
  uploadMode,
  imageObjectUrl,
  personA,
  personB,
  onComplete,
}) {
  const content = getContent(context)
  const steps   = content.loaderSteps
  const terminalLines = content.terminalLines

  const [progress,       setProgress]       = useState(0)
  const [stepIndex,      setStepIndex]       = useState(0)
  const [msgVisible,     setMsgVisible]      = useState(true)
  const [visibleTerminal, setVisibleTerminal] = useState([])
  const [showComplete,   setShowComplete]    = useState(false)
  const [displayedStep,  setDisplayedStep]   = useState(steps[0])
  const completedRef = useRef(false)

  // Animated message swap
  useEffect(() => {
    setMsgVisible(false)
    const t = setTimeout(() => {
      setDisplayedStep(steps[stepIndex % steps.length])
      setMsgVisible(true)
    }, 200)
    return () => clearTimeout(t)
  }, [stepIndex, steps])

  // Terminal lines appear one by one
  useEffect(() => {
    setVisibleTerminal([])
    terminalLines.forEach((line, i) => {
      setTimeout(() => setVisibleTerminal(prev => [...prev, line]), 400 + i * 900)
    })
  }, [context]) // re-run when context changes

  useEffect(() => {
    completedRef.current = false
    setProgress(0)
    setStepIndex(0)
    setShowComplete(false)

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (100 / (TOTAL_DURATION / 50))
        return next >= 100 ? 100 : next
      })
    }, 50)

    const stepInterval = setInterval(() => {
      setStepIndex(prev => prev + 1)
    }, STEP_INTERVAL)

    const completeTimer = setTimeout(() => {
      if (completedRef.current) return
      completedRef.current = true
      clearInterval(progressInterval)
      clearInterval(stepInterval)
      setProgress(100)
      setShowComplete(true)
      const result = getContextResult(context)
      setTimeout(() => onComplete(result), 900)
    }, TOTAL_DURATION)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
      clearTimeout(completeTimer)
    }
  }, [onComplete, context])

  // What to show in the orb
  const orbImage = imageObjectUrl ?? (personA?.url ?? personB?.url ?? null)

  // For individual mode, show both thumbs side-by-side if available
  const showDual = uploadMode === 'individual' && personA?.url && personB?.url

  return (
    <section className="loader-section view-container">

      {/* Central orb / dual thumbnails */}
      {showDual ? (
        <div className="loader-dual-wrap">
          <div className="loader-dual-orb">
            <div className="orb-ring orb-ring--1" aria-hidden="true" />
            <div className="orb-ring orb-ring--2" aria-hidden="true" />
            <div className="orb-core orb-core--dual" aria-hidden="true">
              <img src={personA.url} alt="" className="orb-thumb orb-thumb--half" />
              <img src={personB.url} alt="" className="orb-thumb orb-thumb--half" />
              <div className="scanner-beam" aria-hidden="true" />
            </div>
          </div>
          {(personA.name || personB.name) && (
            <div className="loader-dual-names">
              <span>{personA.name || 'Person A'}</span>
              <span className="loader-dual-vs">vs</span>
              <span>{personB.name || 'Person B'}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="orb-wrap">
          <div className="orb-ring orb-ring--1" aria-hidden="true" />
          <div className="orb-ring orb-ring--2" aria-hidden="true" />
          <div className="orb-ring orb-ring--3" aria-hidden="true" />
          <div className="orb-core" aria-hidden="true">
            {orbImage ? (
              <>
                <img src={orbImage} alt="" className="orb-thumb" />
                <div className="scanner-beam" aria-hidden="true" />
              </>
            ) : (
              <span className="orb-icon" aria-hidden="true">💔</span>
            )}
          </div>
        </div>
      )}

      {showComplete && (
        <div className="loader-complete-badge">✓ ANALYSIS COMPLETE</div>
      )}

      <h2 className="loader-title">Analyzing{context !== 'human' ? ` your ${context}` : ' your relationship'}…</h2>

      <div
        className={`loader-status ${msgVisible ? 'loader-status--visible' : 'loader-status--hidden'}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="loader-status-dot" />
        <span className="loader-status-main">{displayedStep?.main}</span>
      </div>

      <div className={`loader-status-sub ${msgVisible ? 'loader-status--visible' : 'loader-status--hidden'}`}>
        {displayedStep?.sub}
      </div>

      <div
        className="loader-progress-track"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="loader-progress-fill" style={{ width: `${progress}%` }}>
          <div className="loader-progress-shimmer" />
        </div>
      </div>
      <div className="loader-progress-label">{Math.round(progress)}%</div>

      <div className="loader-terminal" aria-hidden="true">
        {visibleTerminal.map((line, i) => (
          <div key={i} className="loader-terminal-line">{line}</div>
        ))}
      </div>

      <p className="loader-footnote">No actual AI was harmed during this analysis.</p>
    </section>
  )
}
