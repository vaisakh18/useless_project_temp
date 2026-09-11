import { useState, useCallback, useRef } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import PhotoUpload from './components/PhotoUpload.jsx'
import AnalysisLoader from './components/AnalysisLoader.jsx'
import ResultDashboard from './components/ResultDashboard.jsx'
import Footer from './components/Footer.jsx'
import AnimatedBackground from './components/AnimatedBackground.jsx'

// State machine: landing → upload → analyzing → result
export default function App() {
  const [phase, setPhase] = useState('landing')
  const [imageObjectUrl, setImageObjectUrl] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [prediction, setPrediction] = useState(null)
  // phaseKey forces a full re-mount (re-animation) on every phase change
  const phaseKeyRef = useRef(0)

  const nextPhase = (name) => {
    phaseKeyRef.current += 1
    setPhase(name)
  }

  const setImage = useCallback((file, url) => {
    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl)
    setImageFile(file)
    setImageObjectUrl(url)
  }, [imageObjectUrl])

  const clearImage = useCallback(() => {
    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl)
    setImageFile(null)
    setImageObjectUrl(null)
  }, [imageObjectUrl])

  const goToUpload = () => nextPhase('upload')
  const startAnalysis = () => nextPhase('analyzing')

  const onAnalysisComplete = (result) => {
    setPrediction(result)
    nextPhase('result')
  }

  const analyzeAgain = () => nextPhase('analyzing')

  const uploadAnother = () => {
    clearImage()
    setPrediction(null)
    nextPhase('upload')
  }

  const key = phaseKeyRef.current

  return (
    <div className="app-root">
      <AnimatedBackground />
      <Header />

      <main className="main-content">
        {phase === 'landing' && (
          <Hero key={key} onCta={goToUpload} />
        )}
        {phase === 'upload' && (
          <PhotoUpload
            key={key}
            imageObjectUrl={imageObjectUrl}
            imageFile={imageFile}
            onImageSelected={setImage}
            onAnalyze={startAnalysis}
          />
        )}
        {phase === 'analyzing' && (
          <AnalysisLoader
            key={key}
            imageObjectUrl={imageObjectUrl}
            onComplete={onAnalysisComplete}
          />
        )}
        {phase === 'result' && prediction && (
          <ResultDashboard
            key={key}
            prediction={prediction}
            imageObjectUrl={imageObjectUrl}
            onAnalyzeAgain={analyzeAgain}
            onUploadAnother={uploadAnother}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}
