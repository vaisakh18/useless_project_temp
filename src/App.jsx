import { useState, useCallback, useRef, useEffect } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import ContextsSection from './components/ContextsSection.jsx'
import ContactSection from './components/ContactSection.jsx'
import UploadModeSelector from './components/UploadModeSelector.jsx'
import PhotoUpload from './components/PhotoUpload.jsx'
import IndividualPhotoUpload from './components/IndividualPhotoUpload.jsx'
import ImageDetectionScreen from './components/ImageDetectionScreen.jsx'
import AnalysisLoader from './components/AnalysisLoader.jsx'
import ResultDashboard from './components/ResultDashboard.jsx'
import Footer from './components/Footer.jsx'
import FullReportPage from './components/FullReportPage.jsx'
import AnimatedBackground from './components/AnimatedBackground.jsx'

/*
  Phase state machine (landing excluded):
  modeSelect → upload → detecting → analyzing → result

  'contextSelect' phase removed — context is now set by AI detection.
*/
export default function App() {
  const [phase, setPhase]           = useState('landing')
  const [uploadMode, setUploadMode] = useState(null)
  const [context, setContext]       = useState('human')

  const [imageObjectUrl, setImageObjectUrl] = useState(null)
  const [imageFile, setImageFile]           = useState(null)
  const [relationshipLabel, setRelationshipLabel] = useState('')

  const [personA, setPersonA] = useState({ file: null, url: null, name: '' })
  const [personB, setPersonB] = useState({ file: null, url: null, name: '' })

  const [prediction, setPrediction] = useState(null)

  const phaseKeyRef = useRef(0)
  const nextPhase = useCallback((name) => {
    phaseKeyRef.current += 1
    setPhase(name)
    if (name !== 'landing') window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // ── Image management ─────────────────────────────────────────
  const setImage = useCallback((file, url) => {
    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl)
    setImageFile(file); setImageObjectUrl(url)
  }, [imageObjectUrl])

  const clearImage = useCallback(() => {
    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl)
    setImageFile(null); setImageObjectUrl(null)
  }, [imageObjectUrl])

  const setPersonImage = useCallback((person, file, url) => {
    if (person === 'A') { if (personA.url) URL.revokeObjectURL(personA.url); setPersonA(prev => ({ ...prev, file, url })) }
    else                { if (personB.url) URL.revokeObjectURL(personB.url); setPersonB(prev => ({ ...prev, file, url })) }
  }, [personA.url, personB.url])

  const clearPersonImage = useCallback((person) => {
    if (person === 'A') { if (personA.url) URL.revokeObjectURL(personA.url); setPersonA(prev => ({ ...prev, file: null, url: null })) }
    else                { if (personB.url) URL.revokeObjectURL(personB.url); setPersonB(prev => ({ ...prev, file: null, url: null })) }
  }, [personA.url, personB.url])

  const setPersonName = useCallback((person, name) => {
    if (person === 'A') setPersonA(prev => ({ ...prev, name }))
    else                setPersonB(prev => ({ ...prev, name }))
  }, [])

  // ── Navigation ───────────────────────────────────────────────
  const goToLanding    = useCallback(() => nextPhase('landing'),    [nextPhase])
  const goToModeSelect = useCallback(() => nextPhase('modeSelect'), [nextPhase])
  const selectMode = useCallback((mode) => {
    // Always start with a clean slate when a mode is selected
    clearImage()
    if (personA.url) URL.revokeObjectURL(personA.url)
    if (personB.url) URL.revokeObjectURL(personB.url)
    setPersonA({ file: null, url: null, name: '' })
    setPersonB({ file: null, url: null, name: '' })
    setRelationshipLabel('')
    setUploadMode(mode)
    nextPhase('upload')
  }, [clearImage, personA.url, personB.url, nextPhase])

  // After upload, go straight to AI detection (no manual context select)
  const goToDetecting  = useCallback(() => nextPhase('detecting'), [nextPhase])

  // Called by ImageDetectionScreen when AI detection succeeds
  const onDetectionComplete = useCallback((detectedContext) => {
    setContext(detectedContext)
    nextPhase('analyzing')
  }, [nextPhase])

  // Retry from detection → back to upload with everything cleared
  const retryFromDetection = useCallback(() => {
    clearImage()
    if (personA.url) URL.revokeObjectURL(personA.url)
    if (personB.url) URL.revokeObjectURL(personB.url)
    setPersonA(prev => ({ ...prev, file: null, url: null }))
    setPersonB(prev => ({ ...prev, file: null, url: null }))
    nextPhase('upload')
  }, [clearImage, personA.url, personB.url, nextPhase])

  const onAnalysisComplete = useCallback((result) => {
    setPrediction(result); nextPhase('result')
  }, [nextPhase])

  const analyzeAgain = useCallback(() => {
    setPrediction(null); nextPhase('detecting')
  }, [nextPhase])

  const goToReport   = useCallback(() => nextPhase('report'),  [nextPhase])
  const backFromReport = useCallback(() => {
    // Go back to result — DON'T increment phaseKey so prediction stays intact
    setPhase('result')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const uploadAnother = useCallback(() => {
    clearImage()
    if (personA.url) URL.revokeObjectURL(personA.url)
    if (personB.url) URL.revokeObjectURL(personB.url)
    setPersonA({ file: null, url: null, name: '' })
    setPersonB({ file: null, url: null, name: '' })
    setRelationshipLabel('')
    setPrediction(null)
    setContext('human')
    setUploadMode(null)
    nextPhase('modeSelect')
  }, [clearImage, personA.url, personB.url, nextPhase])

  const primaryImageUrl = uploadMode === 'individual'
    ? (personA.url ?? personB.url) : imageObjectUrl

  const isLandingPage = phase === 'landing'
  const key = phaseKeyRef.current

  // Scroll-reveal on landing page
  useEffect(() => {
    if (!isLandingPage) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    const tid = setTimeout(() => document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el)), 50)
    return () => { clearTimeout(tid); observer.disconnect() }
  }, [isLandingPage, key])

  return (
    <div className="app-root">
      <AnimatedBackground />

      <Header
        onHome={goToLanding}
        onTryIt={isLandingPage ? goToModeSelect : undefined}
        isLandingPage={isLandingPage}
      />

      {/* ── LANDING ─────────────────────────────────────────── */}
      {isLandingPage && (
        <main className="landing-main">
          <Hero key={key} onCta={goToModeSelect} />
          <Features />
          <HowItWorks />
          <ContextsSection />
          <ContactSection />
        </main>
      )}

      {/* ── APP FLOW ─────────────────────────────────────────── */}
      {!isLandingPage && (
        <main className="main-content">

          {phase === 'modeSelect' && (
            <UploadModeSelector key={key} onSelect={selectMode} />
          )}

          {phase === 'upload' && uploadMode === 'couple' && (
            <PhotoUpload
              key={key}
              imageObjectUrl={imageObjectUrl}
              imageFile={imageFile}
              relationshipLabel={relationshipLabel}
              onRelationshipLabelChange={setRelationshipLabel}
              onImageSelected={setImage}
              onRemoveImage={clearImage}
              onAnalyze={goToDetecting}
            />
          )}

          {phase === 'upload' && uploadMode === 'individual' && (
            <IndividualPhotoUpload
              key={key}
              personA={personA}
              personB={personB}
              onPersonImage={setPersonImage}
              onClearPersonImage={clearPersonImage}
              onPersonName={setPersonName}
              onAnalyze={goToDetecting}
            />
          )}

          {/* ── NEW: AI image detection replaces manual context select ── */}
          {phase === 'detecting' && (
            <ImageDetectionScreen
              key={key}
              uploadMode={uploadMode}
              imageObjectUrl={imageObjectUrl}
              personA={personA}
              personB={personB}
              onDetectionComplete={onDetectionComplete}
              onRetry={retryFromDetection}
            />
          )}

          {phase === 'analyzing' && (
            <AnalysisLoader
              key={key}
              context={context}
              uploadMode={uploadMode}
              imageObjectUrl={primaryImageUrl}
              personA={personA}
              personB={personB}
              onComplete={onAnalysisComplete}
            />
          )}

          {phase === 'result' && prediction && (
            <ResultDashboard
              key={key}
              prediction={prediction}
              imageObjectUrl={primaryImageUrl}
              uploadMode={uploadMode}
              personA={personA}
              personB={personB}
              onAnalyzeAgain={analyzeAgain}
              onUploadAnother={uploadAnother}
              onViewReport={goToReport}
            />
          )}

          {phase === 'report' && prediction && (
            <FullReportPage
              key="report"
              prediction={prediction}
              context={context}
              uploadMode={uploadMode}
              imageObjectUrl={primaryImageUrl}
              personA={personA}
              personB={personB}
              onBack={backFromReport}
            />
          )}

        </main>
      )}

      <Footer />
    </div>
  )
}
