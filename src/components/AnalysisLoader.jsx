import { useState, useEffect, useRef } from 'react'
import { generatePrediction } from '../utils/predictionEngine.js'

const STEPS = [
  { main: 'Scanning emotional bandwidth...', sub: 'Emotional bandwidth: questionable' },
  { main: 'Analyzing micro-expressions and eye contact...', sub: 'Eye contact detected. Suspicious.' },
  { main: 'Measuring vibe synchronization...', sub: 'Vibes: present. Barely.' },
  { main: 'Checking relationship WiFi stability...', sub: 'Signal found. Barely.' },
  { main: "Checking who replies 'K'...", sub: 'K detected.' },
  { main: 'Calculating unnecessary drama quotients...', sub: 'This may take a while.' },
  { main: 'Consulting absolutely nobody...', sub: 'Scientific accuracy: 0%' },
  { main: 'Preparing result...', sub: 'Drama levels: concerning' },
]

const TERMINAL_LINES = [
  '> loading relationship_model...',
  '> checking vibe_matrix...',
  '> analyzing drama_index...',
  '> consulting absolutely nobody...',
  '> result preparation complete.',
]

const TOTAL_DURATION = 5200
const STEP_INTERVAL = 650

export default function AnalysisLoader({ imageObjectUrl, onComplete }) {
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [msgVisible, setMsgVisible] = useState(true)
  const [terminalLines, setTerminalLines] = useState([])
  const [showComplete, setShowComplete] = useState(false)
  const completedRef = useRef(false)

  // Animated message transition: fade out → swap → fade in
  const [displayedStep, setDisplayedStep] = useState(STEPS[0])

  useEffect(() => {
    setMsgVisible(false)
    const t = setTimeout(() => {
      setDisplayedStep(STEPS[stepIndex])
      setMsgVisible(true)
    }, 200)
    return () => clearTimeout(t)
  }, [stepIndex])

  // Terminal lines appear one by one, staggered
  useEffect(() => {
    setTerminalLines([])
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line])
      }, 400 + i * 900)
    })
  }, [])

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
      setStepIndex(prev => (prev + 1) % STEPS.length)
    }, STEP_INTERVAL)

    const completeTimer = setTimeout(() => {
      if (completedRef.current) return
      completedRef.current = true
      clearInterval(progressInterval)
      clearInterval(stepInterval)
      setProgress(100)
      setShowComplete(true)
      const result = generatePrediction()
      // Show "ANALYSIS COMPLETE" beat, then reveal results
      setTimeout(() => onComplete(result), 900)
    }, TOTAL_DURATION)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <section className="loader-section view-container">

      {/* Central orb with rotating rings */}
      <div className="orb-wrap">
        {/* Rings */}
        <div className="orb-ring orb-ring--1" aria-hidden="true" />
        <div className="orb-ring orb-ring--2" aria-hidden="true" />
        <div className="orb-ring orb-ring--3" aria-hidden="true" />
        {/* Core orb */}
        <div className="orb-core" aria-hidden="true">
          {imageObjectUrl ? (
            <>
              <img src={imageObjectUrl} alt="" className="orb-thumb" />
              <div className="scanner-beam" aria-hidden="true" />
            </>
          ) : (
            <span className="orb-icon" aria-hidden="true">💔</span>
          )}
        </div>
      </div>

      {/* Completion overlay */}
      {showComplete && (
        <div className="loader-complete-badge">
          ✓ ANALYSIS COMPLETE
        </div>
      )}

      <h2 className="loader-title">Analyzing your relationship…</h2>

      {/* Animated message transition */}
      <div
        className={`loader-status ${msgVisible ? 'loader-status--visible' : 'loader-status--hidden'}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="loader-status-dot" />
        <span className="loader-status-main">{displayedStep.main}</span>
      </div>

      <div className={`loader-status-sub ${msgVisible ? 'loader-status--visible' : 'loader-status--hidden'}`}>
        {displayedStep.sub}
      </div>

      {/* Progress bar with shimmer */}
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

      {/* Terminal */}
      <div className="loader-terminal" aria-hidden="true">
        {terminalLines.map((line, i) => (
          <div key={i} className="loader-terminal-line">{line}</div>
        ))}
      </div>

      <p className="loader-footnote">No actual AI was harmed during this analysis.</p>
    </section>
  )
}
