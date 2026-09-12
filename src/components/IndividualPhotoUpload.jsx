import { useState, useRef, useCallback } from 'react'

const MAX_SIZE_BYTES = 10 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ACCEPTED_EXT   = '.jpg, .jpeg, .png, .webp'

function formatBytes(bytes) {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function SingleUpload({ label, person, data, onImage, onClear, onName }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError]           = useState(null)
  const [imgKey, setImgKey]         = useState(0)
  const inputRef = useRef(null)

  const validate = useCallback((file) => {
    setError(null)
    if (!file) return
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("That file isn't an image. Our questionable algorithm needs an actual picture.")
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(`That file is too large (${formatBytes(file.size)}). Max 10MB.`)
      return
    }
    const url = URL.createObjectURL(file)
    onImage(person, file, url)
    setImgKey(k => k + 1)
  }, [onImage, person])

  const handleChange   = (e) => { validate(e.target.files?.[0]); e.target.value = '' }
  const handleDrop     = useCallback((e) => { e.preventDefault(); setIsDragging(false); validate(e.dataTransfer.files?.[0]) }, [validate])
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave= (e) => { e.preventDefault(); setIsDragging(false) }
  const handleClick    = () => { if (!data.url) inputRef.current?.click() }
  const handleChange_  = (e) => { e.stopPropagation(); inputRef.current?.click() }

  return (
    <div className="individual-slot">
      <div className="individual-slot-header">
        <span className="individual-slot-label">{label}</span>
        {data.url && (
          <button
            className="individual-slot-remove"
            onClick={() => onClear(person)}
            aria-label={`Remove ${label} photo`}
          >
            ✕
          </button>
        )}
      </div>

      {/* Name input */}
      <input
        type="text"
        className="upload-field-input upload-field-input--sm"
        placeholder={`Nickname (e.g. ${person === 'A' ? 'Apple 1' : 'Apple 2'})`}
        value={data.name}
        onChange={(e) => onName(person, e.target.value)}
        maxLength={30}
        aria-label={`${label} nickname`}
      />

      {/* Drop zone */}
      <div
        className={`dropzone dropzone--compact ${isDragging ? 'dropzone--dragging' : ''} ${data.url ? 'dropzone--has-image' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label} photo`}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        {data.url ? (
          <div key={imgKey} className="dropzone-preview dropzone-preview--animate">
            <img src={data.url} alt={`${label} photo`} className="dropzone-preview-img dropzone-preview-img--compact" />
            <div className="dropzone-preview-overlay">
              <div className="dropzone-accepted-badge"><span>✓</span> ACCEPTED</div>
              <div className="dropzone-preview-info">
                <span className="dropzone-preview-filename">{data.file?.name}</span>
                <span className="dropzone-preview-filesize">{formatBytes(data.file?.size ?? 0)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="dropzone-empty dropzone-empty--compact">
            <div className="dropzone-icon dropzone-icon--pulse">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="dropzone-primary-text dropzone-primary-text--sm">
              {isDragging ? 'Drop here 🔥' : 'Drop or click to upload'}
            </p>
            <p className="dropzone-hint">{ACCEPTED_EXT} • Max 10MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleChange}
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      {data.url && (
        <button className="btn btn--ghost btn--xs" onClick={handleChange_}>
          📷 Change
        </button>
      )}

      {error && (
        <div className="upload-error upload-error--sm" role="alert">
          <span>⚠️</span> {error}
        </div>
      )}
    </div>
  )
}

export default function IndividualPhotoUpload({
  personA, personB,
  onPersonImage, onClearPersonImage, onPersonName,
  onAnalyze,
}) {
  const bothReady = !!(personA.url && personB.url)

  return (
    <section className="upload-section view-container">
      <div className="upload-header upload-stagger" style={{ '--stagger': 0 }}>
        <h2 className="upload-title">Upload two subjects.</h2>
        <p className="upload-subtitle">
          One photo per subject. Can be people, animals, food, vehicles — anything.
          Our AI figures out what they are. Names are optional.
        </p>
      </div>

      <div className="individual-grid upload-stagger" style={{ '--stagger': 1 }}>
        <SingleUpload
          label="Subject A"
          person="A"
          data={personA}
          onImage={onPersonImage}
          onClear={onClearPersonImage}
          onName={onPersonName}
        />
        <div className="individual-grid-divider" aria-hidden="true">
          <span>vs</span>
        </div>
        <SingleUpload
          label="Subject B"
          person="B"
          data={personB}
          onImage={onPersonImage}
          onClear={onClearPersonImage}
          onName={onPersonName}
        />
      </div>

      {!bothReady && (
        <p className="upload-stagger individual-hint" style={{ '--stagger': 2 }}>
          Both photos required to proceed. Names are optional.
        </p>
      )}

      <div className="upload-actions upload-stagger" style={{ '--stagger': 3 }}>
        <button
          className="btn btn--primary"
          onClick={onAnalyze}
          disabled={!bothReady}
          aria-disabled={!bothReady}
        >
          🔬 Analyze Both →
        </button>
      </div>
    </section>
  )
}
