import { useState, useEffect, useRef, useCallback } from 'react'
import {
  loadModel,
  loadMobileNet,
  analyzeImage,
  validateCoupleImage,
  validateSubjectsForIndividualMode,
  isModelLoaded,
  getContextEmoji,
  getContextDisplayLabel,
  getSubjectLabel,
} from '../utils/imageAnalyzer.js'

// ── Status step sequence ─────────────────────────────────────
const MODEL_STEPS = [
  'Initializing image recognition models…',
  'Loading COCO-SSD neural network…',
  'Loading MobileNet classifier…',
  'Both models ready.',
]

const DETECTION_STEPS = [
  'Scanning image…',
  'Detecting objects and people…',
  'Determining context…',
  'Calculating confidence…',
]

const CONTEXT_EMOJIS = {
  human: '👥', animal: '🐾', fruit: '🍎', food: '🍕',
  pet: '🐶', nature: '🌿', vehicle: '🚗', plant: '🪴',
  object: '📦', unknown: '❓',
}

const CONTEXT_LABELS = {
  human: 'Human', animal: 'Animal', fruit: 'Fruit', food: 'Food',
  pet: 'Pet', nature: 'Nature', vehicle: 'Vehicle', plant: 'Plant',
  object: 'Object', unknown: 'Unknown',
}

// ── Reusable image-to-HTMLImageElement loader ─────────────────
function loadHtmlImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => resolve(img)
    img.onerror = reject
    img.src     = src
  })
}

// ── Detection result display ──────────────────────────────────
function DetectionBadge({ analysis }) {
  const emoji    = CONTEXT_EMOJIS[analysis.context] ?? '🔮'
  const ctxLabel = CONTEXT_LABELS[analysis.context] ?? analysis.context
  const pct      = Math.round(analysis.confidence * 100)
  const method   = analysis.detectionMethod === 'mobilenet' ? 'MobileNet classifier' : 'COCO-SSD detector'

  return (
    <div className="detection-badge">
      <div className="detection-badge-header">
        <span className="detection-badge-title">IMAGE UNDERSTANDING</span>
        <span className="detection-badge-real">REAL AI</span>
      </div>
      <div className="detection-badge-body">
        <div className="detection-badge-row">
          <span className="detection-badge-label">Detected</span>
          <span className="detection-badge-value">
            {emoji} {analysis.peopleCount > 0
              ? `${analysis.peopleCount} ${analysis.peopleCount === 1 ? 'Person' : 'People'}`
              : (analysis.label
                  ? analysis.label.charAt(0).toUpperCase() + analysis.label.slice(1)
                  : ctxLabel)
            }
          </span>
        </div>
        <div className="detection-badge-row">
          <span className="detection-badge-label">Context</span>
          <span className="detection-badge-value">{ctxLabel}</span>
        </div>
        <div className="detection-badge-row">
          <span className="detection-badge-label">Confidence</span>
          <div className="detection-conf-wrap">
            <div className="detection-conf-bar">
              <div className="detection-conf-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="detection-conf-pct">{pct}%</span>
          </div>
        </div>
        <div className="detection-badge-row">
          <span className="detection-badge-label">Model</span>
          <span className="detection-badge-value detection-badge-method">{method}</span>
        </div>
      </div>
      <p className="detection-badge-note">
        Context detection runs locally in your browser. Your image is never transmitted.
      </p>
    </div>
  )
}

// ── Error state ───────────────────────────────────────────────
function DetectionError({ errorType, message, contextA, contextB, displayA, displayB, onRetry }) {
  const icons = {
    too_few:          '❌',
    too_many:         '👥',
    no_people:        '❌',
    no_person:        '❌',
    too_many_people:  '👥',
    model_fail:       '⚠️',
    unknown_context:  '🤔',
    context_mismatch: '⚠️',
  }

  const titles = {
    too_few:          'TWO PEOPLE REQUIRED',
    too_many:         'TOO MANY PEOPLE',
    no_people:        'NO SUBJECTS DETECTED',
    no_person:        'PERSON NOT FOUND',
    too_many_people:  'MULTIPLE PEOPLE IN SUBJECT',
    model_fail:       'AI MODEL UNAVAILABLE',
    unknown_context:  'CONTEXT UNCLEAR',
    context_mismatch: 'CONTEXT MISMATCH',
  }

  return (
    <div className="detection-error">
      <span className="detection-error-icon">{icons[errorType] ?? '❌'}</span>
      <h3 className="detection-error-title">{titles[errorType] ?? 'DETECTION FAILED'}</h3>
      <p className="detection-error-msg">{message}</p>

      {errorType === 'context_mismatch' && contextA && contextB && (
        <div className="detection-mismatch-detail">
          <div className="detection-mismatch-row">
            <span className="detection-mismatch-label">Subject A</span>
            <span className="detection-mismatch-value">{displayA}</span>
          </div>
          <div className="detection-mismatch-row">
            <span className="detection-mismatch-label">Subject B</span>
            <span className="detection-mismatch-value">{displayB}</span>
          </div>
        </div>
      )}

      <button className="btn btn--primary" onClick={onRetry}>
        Upload Different Photos
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function ImageDetectionScreen({
  uploadMode,
  imageObjectUrl,
  personA,
  personB,
  onDetectionComplete,  // (context, detectionSummary) => void
  onRetry,              // () => void — goes back to upload
}) {
  const [phase,      setPhase]      = useState('init')   // init | detecting | validating | done | error | model_fail
  const [statusText, setStatusText] = useState(MODEL_STEPS[0])
  const [analysis,   setAnalysis]   = useState(null)
  const [analysisA,  setAnalysisA]  = useState(null)
  const [analysisB,  setAnalysisB]  = useState(null)
  const [errorInfo,  setErrorInfo]  = useState(null)
  const [debugInfo,  setDebugInfo]  = useState(null)  // populated after detection for debug panel
  const runRef = useRef(false)

  const cycleStatus = (steps, intervalMs = 800) => {
    return new Promise(resolve => {
      let i = 0
      const id = setInterval(() => {
        i++
        if (i < steps.length) setStatusText(steps[i])
        else { clearInterval(id); resolve() }
      }, intervalMs)
    })
  }

  const runDetection = useCallback(async () => {
    if (runRef.current) return
    runRef.current = true

    try {
      // ── 1. Load models ───────────────────────────────────────
      setPhase('init')
      if (!isModelLoaded()) {
        const initCycle = cycleStatus(MODEL_STEPS, 650)
        // Load BOTH models in parallel via the exported singletons
        await Promise.all([loadModel(), loadMobileNet(), initCycle])
      } else {
        // COCO loaded; ensure MobileNet is also warm
        loadMobileNet().catch(() => {})
      }

      setPhase('detecting')

      // ── 2. Run detection ────────────────────────────────────
      if (uploadMode === 'individual') {
        // ── Analyze Subject A ──────────────────────────────────
        setStatusText('Analyzing Subject A…')
        const imgA = await loadHtmlImage(personA.url)
        const resA = await analyzeImage(imgA)
        setAnalysisA(resA)
        console.log('[love404 AI] SUBJECT A DETECTIONS:', resA.rawDetections)
        console.log('[love404 AI] SUBJECT A CONTEXT:', resA.context, '| PEOPLE:', resA.peopleCount)

        // ── Analyze Subject B ──────────────────────────────────
        setStatusText('Analyzing Subject B…')
        const imgB = await loadHtmlImage(personB.url)
        const resB = await analyzeImage(imgB)
        setAnalysisB(resB)
        console.log('[love404 AI] SUBJECT B DETECTIONS:', resB.rawDetections)
        console.log('[love404 AI] SUBJECT B CONTEXT:', resB.context, '| PEOPLE:', resB.peopleCount)
        console.log('[love404 AI] CONTEXT MATCH:', resA.context === resB.context)

        // ── Validate both subjects ─────────────────────────────
        setPhase('validating')
        setStatusText('Matching contexts…')
        await new Promise(r => setTimeout(r, 500))

        const labelA = getSubjectLabel(resA.context, 0)
        const labelB = getSubjectLabel(resB.context, 1)

        const val = validateSubjectsForIndividualMode(resA, resB, labelA, labelB)

        if (!val.valid) {
          if (val.reason === 'context-mismatch') {
            // Special mismatch error — show both contexts
            setErrorInfo({
              errorType: 'context_mismatch',
              message: val.errorMessage,
              contextA: val.contextA,
              contextB: val.contextB,
              displayA: val.labelA,
              displayB: val.labelB,
            })
          } else {
            setErrorInfo({ errorType: val.errorType, message: val.errorMessage })
          }
          setPhase('error')
          return
        }

        // ── Both valid — build summary analysis ────────────────
        const sharedContext = val.context
        const combinedConfidence = Math.round((resA.confidence + resB.confidence) / 2 * 100) / 100
        const summaryAnalysis = {
          context: sharedContext,
          peopleCount: resA.peopleCount + resB.peopleCount,
          confidence: combinedConfidence,
          label: `${resA.label} + ${resB.label}`,
          detections: [],
          detectionMethod: resA.detectionMethod,
        }

        setAnalysis(summaryAnalysis)
        setDebugInfo({
          model: resA.detectionMethod === 'mobilenet' ? 'MobileNet v2' : 'COCO-SSD',
          rawLabels: [...(resA.rawDetections ?? []), ...(resB.rawDetections ?? [])]
            .map(p => `${p.class} — ${(p.score * 100).toFixed(1)}%`),
          mnLabels: [
            ...(resA.mobilenetPredictions ?? []).map(p => `A: ${p.className} — ${(p.probability * 100).toFixed(1)}%`),
            ...(resB.mobilenetPredictions ?? []).map(p => `B: ${p.className} — ${(p.probability * 100).toFixed(1)}%`),
          ],
          peopleCount: summaryAnalysis.peopleCount,
          context: sharedContext,
          confidence: Math.round(combinedConfidence * 100),
        })

        setPhase('done')
        setTimeout(() => onDetectionComplete(sharedContext, { analysisA: resA, analysisB: resB }), 1200)

      } else {
        // ── Couple / single-image mode ──────────────────────────
        setStatusText(DETECTION_STEPS[0])
        const img = await loadHtmlImage(imageObjectUrl)

        // Run detection and cycle status steps concurrently
        const [res] = await Promise.all([
          analyzeImage(img),
          cycleStatus(DETECTION_STEPS, 600),
        ])
        setAnalysis(res)
        // Populate debug panel
        setDebugInfo({
          model: res.detectionMethod === 'mobilenet' ? 'MobileNet v2' : 'COCO-SSD MobileNetV2',
          rawLabels: res.rawDetections?.map(p => `${p.class} — ${(p.score * 100).toFixed(1)}%`) ?? [],
          mnLabels: res.mobilenetPredictions?.map(p => `${p.className} — ${(p.probability * 100).toFixed(1)}%`) ?? [],
          peopleCount: res.peopleCount,
          context: res.context,
          confidence: Math.round(res.confidence * 100),
        })

        setPhase('validating')
        setStatusText('Validating…')
        await new Promise(r => setTimeout(r, 600))

        const val = validateCoupleImage(res)

        if (!val.valid) {
          setErrorInfo({ errorType: val.errorType, message: val.errorMessage })
          setPhase('error')
          return
        }

        // Route to the detected context (human, animal, fruit, food, vehicle, object, unknown…)
        const detectedContext = val.routeToContext ?? res.context ?? 'unknown'
        setPhase('done')
        setTimeout(() => onDetectionComplete(detectedContext, { analysis: res }), 1200)
      }

    } catch (err) {
      console.error('Image detection failed:', err)
      setPhase('model_fail')
      setErrorInfo({
        errorType: 'model_fail',
        message: "We couldn't initialize the image recognition system. Please try refreshing the page.",
      })
    }
  }, [uploadMode, imageObjectUrl, personA, personB, onDetectionComplete])

  useEffect(() => { runDetection() }, [runDetection])

  // ── Preview image(s) ────────────────────────────────────────
  const previewUrl = uploadMode === 'individual' ? (personA?.url ?? null) : imageObjectUrl

  const isError = phase === 'error' || phase === 'model_fail'
  const isDone  = phase === 'done'

  return (
    <section className="detect-section view-container">

      {/* Header */}
      <div className="detect-header">
        <div className="detect-tag">
          <span className="detect-tag-dot detect-tag-dot--real" />
          REAL AI IMAGE ANALYSIS
        </div>
        <h2 className="detect-title">
          {isError ? 'Detection Complete' : isDone ? 'Image Understood ✓' : 'AI is looking at the evidence…'}
        </h2>
        <p className="detect-sub">
          {isError
            ? 'We found a problem with this image.'
            : isDone
              ? 'Context identified. Preparing your completely fake prediction.'
              : 'Running image recognition in your browser. Your image stays here.'}
        </p>
      </div>

      <div className="detect-body">
        {/* Preview thumbnail(s) */}
        <div className="detect-previews">
          {uploadMode === 'individual' && personA?.url && personB?.url ? (
            <>
              <div className="detect-thumb-wrap">
                <img src={personA.url} alt={personA.name || 'Person A'} className="detect-thumb" />
                <span className="detect-thumb-label">{personA.name || 'Person A'}</span>
              </div>
              <span className="detect-vs" aria-hidden="true">vs</span>
              <div className="detect-thumb-wrap">
                <img src={personB.url} alt={personB.name || 'Person B'} className="detect-thumb" />
                <span className="detect-thumb-label">{personB.name || 'Person B'}</span>
              </div>
            </>
          ) : previewUrl ? (
            <div className="detect-thumb-wrap detect-thumb-wrap--single">
              <img src={previewUrl} alt="Uploaded image" className="detect-thumb detect-thumb--large" />
              {/* Scanning overlay animation */}
              {!isError && !isDone && (
                <div className="detect-scan-overlay" aria-hidden="true">
                  <div className="detect-scan-line" />
                  <div className="detect-corner detect-corner--tl" />
                  <div className="detect-corner detect-corner--tr" />
                  <div className="detect-corner detect-corner--bl" />
                  <div className="detect-corner detect-corner--br" />
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Status / results */}
        <div className="detect-status-col">
          {!isError && !isDone && (
            <div className="detect-status-live">
              <span className="detect-status-dot" />
              <span className="detect-status-text">{statusText}</span>
            </div>
          )}

          {/* Detection result card */}
          {analysis && !isError && (
            <DetectionBadge analysis={analysis} />
          )}

          {/* Individual mode partial results — shows context for each subject */}
          {uploadMode === 'individual' && analysisA && !isError && !isDone && (
            <div className="detect-individual-status">
              <span className="detect-person-check detect-person-check--ok">
                ✓ Subject A: {getContextEmoji(analysisA.context)} {getContextDisplayLabel(analysisA.context)} detected
                {analysisA.label ? ` (${analysisA.label})` : ''}
              </span>
              {analysisB
                ? <span className="detect-person-check detect-person-check--ok">
                    ✓ Subject B: {getContextEmoji(analysisB.context)} {getContextDisplayLabel(analysisB.context)} detected
                    {analysisB.label ? ` (${analysisB.label})` : ''}
                  </span>
                : <span className="detect-person-check">… Analyzing Subject B</span>
              }
              {analysisA && analysisB && (
                <span className={`detect-person-check ${analysisA.context === analysisB.context ? 'detect-person-check--ok' : 'detect-person-check--warn'}`}>
                  {analysisA.context === analysisB.context
                    ? `✓ Contexts match — ${getContextDisplayLabel(analysisA.context)}`
                    : `⚠️ Context mismatch: ${getContextDisplayLabel(analysisA.context)} vs ${getContextDisplayLabel(analysisB.context)}`
                  }
                </span>
              )}
            </div>
          )}

          {/* Success state */}
          {isDone && analysis && (
            <div className="detect-success">
              <span className="detect-success-icon">✓</span>
              <div>
                <p className="detect-success-title">
                  {analysis.peopleCount >= 2
                    ? `${analysis.peopleCount} People Detected`
                    : analysis.context === 'unknown'
                      ? 'Content Detected (Unknown Type)'
                      : analysis.label
                        ? `${analysis.label.charAt(0).toUpperCase()}${analysis.label.slice(1)} Detected`
                        : `${CONTEXT_LABELS[analysis.context] ?? 'Content'} Detected`}
                </p>
                <p className="detect-success-sub">
                  Generating your {CONTEXT_LABELS[analysis.context] ?? ''} report…
                </p>
              </div>
            </div>
          )}

          {isError && errorInfo && (
            <DetectionError
              errorType={errorInfo.errorType}
              message={errorInfo.message}
              contextA={errorInfo.contextA}
              contextB={errorInfo.contextB}
              displayA={errorInfo.displayA}
              displayB={errorInfo.displayB}
              onRetry={onRetry}
            />
          )}

          {/* Distinction note */}
          {!isError && (
            <div className="detect-distinction">
              <div className="detect-distinction-row">
                <span className="detect-distinction-real">🔬 Image recognition: REAL</span>
              </div>
              <div className="detect-distinction-row">
                <span className="detect-distinction-fake">🎭 Relationship prediction: COMPLETELY MADE UP</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── DEBUG PANEL — remove after testing ────────────── */}
      {debugInfo && (
        <details className="debug-panel">
          <summary className="debug-panel-summary">🔍 AI Detection Debug</summary>
          <div className="debug-panel-body">
            <div className="debug-row"><span>Model used</span><span>{debugInfo.model}</span></div>
            <div className="debug-row"><span>People count</span><span>{debugInfo.peopleCount}</span></div>
            <div className="debug-row"><span>Final context</span><span>{debugInfo.context}</span></div>
            <div className="debug-row"><span>Confidence</span><span>{debugInfo.confidence}%</span></div>
            {debugInfo.rawLabels.length > 0 && (
              <div className="debug-section">
                <p className="debug-section-title">COCO-SSD raw detections</p>
                {debugInfo.rawLabels.map((l, i) => <p key={i} className="debug-item">{l}</p>)}
              </div>
            )}
            {debugInfo.mnLabels.length > 0 && (
              <div className="debug-section">
                <p className="debug-section-title">MobileNet top results</p>
                {debugInfo.mnLabels.map((l, i) => <p key={i} className="debug-item">{l}</p>)}
              </div>
            )}
            {debugInfo.rawLabels.length === 0 && debugInfo.mnLabels.length === 0 && (
              <p className="debug-item debug-item--warn">No detections above threshold.</p>
            )}
          </div>
        </details>
      )}
    </section>
  )
}
