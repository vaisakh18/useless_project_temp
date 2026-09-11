import { useState, useRef, useCallback } from 'react'

const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const ACCEPTED_EXT = '.jpg, .jpeg, .png'

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function PhotoUpload({ imageObjectUrl, imageFile, onImageSelected, onAnalyze }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  // imageKey increments each time a new image is accepted — forces re-animation
  const [imageKey, setImageKey] = useState(0)
  const fileInputRef = useRef(null)

  const validateAndAccept = useCallback((file) => {
    setError(null)
    if (!file) return
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Nice try, but we only accept JPG or PNG files. PDFs of your relationship timeline don't count.")
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(`That photo is ${formatBytes(file.size)}. Our algorithm can't handle files over 10MB — much like some people can't handle commitment.`)
      return
    }
    const url = URL.createObjectURL(file)
    onImageSelected(file, url)
    setImageKey(k => k + 1)
  }, [onImageSelected])

  const handleFileChange = (e) => {
    validateAndAccept(e.target.files?.[0])
    e.target.value = ''
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    validateAndAccept(e.dataTransfer.files?.[0])
  }, [validateAndAccept])

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false) }
  const handleZoneClick = () => { if (!imageObjectUrl) fileInputRef.current?.click() }
  const handleChangePhoto = (e) => { e.stopPropagation(); fileInputRef.current?.click() }

  return (
    <section className="upload-section view-container">

      <div className="upload-header upload-stagger" style={{ '--stagger': 0 }}>
        <h2 className="upload-title">Upload a Couple Photo</h2>
        <p className="upload-subtitle">
          We'll run our highly sophisticated (fake) algorithms on it.
        </p>
      </div>

      <div
        className={`dropzone upload-stagger ${isDragging ? 'dropzone--dragging' : ''} ${imageObjectUrl ? 'dropzone--has-image' : ''}`}
        style={{ '--stagger': 1 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleZoneClick}
        role="button"
        tabIndex={0}
        aria-label="Upload photo area"
        onKeyDown={(e) => e.key === 'Enter' && handleZoneClick()}
      >
        {imageObjectUrl ? (
          <div key={imageKey} className="dropzone-preview dropzone-preview--animate">
            <img
              src={imageObjectUrl}
              alt="Uploaded couple"
              className="dropzone-preview-img"
            />
            <div className="dropzone-preview-overlay">
              {/* "Photo accepted" badge that appears briefly */}
              <div className="dropzone-accepted-badge">
                <span>✓</span> PHOTO ACCEPTED
              </div>
              <div className="dropzone-preview-info">
                <span className="dropzone-preview-filename">{imageFile?.name}</span>
                <span className="dropzone-preview-filesize">{formatBytes(imageFile?.size ?? 0)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="dropzone-empty">
            <div className="dropzone-icon dropzone-icon--pulse">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="dropzone-primary-text">
              {isDragging ? "Drop it like it's hot 🔥" : 'Drag & drop a photo here'}
            </p>
            <p className="dropzone-secondary-text">
              or <span className="dropzone-browse-link">click to browse</span>
            </p>
            <p className="dropzone-hint">{ACCEPTED_EXT} &nbsp;•&nbsp; Max {MAX_SIZE_MB}MB</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      {error && (
        <div className="upload-error upload-stagger" style={{ '--stagger': 2 }} role="alert">
          <span className="upload-error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="upload-actions upload-stagger" style={{ '--stagger': 2 }}>
        {imageObjectUrl && (
          <button className="btn btn--ghost" onClick={handleChangePhoto}>
            📷 Change Photo
          </button>
        )}
        <button
          className="btn btn--primary"
          onClick={onAnalyze}
          disabled={!imageObjectUrl}
          aria-disabled={!imageObjectUrl}
        >
          🔬 Analyze Relationship
        </button>
      </div>
    </section>
  )
}
