import { useState } from 'react'

const CATEGORIES = [
  { key: 'human',   emoji: '👤', label: 'Humans',        desc: 'Breakup probability & relationship drama' },
  { key: 'animal',  emoji: '🐶', label: 'Animals',       desc: 'Chaos levels & snack motivation' },
  { key: 'fruit',   emoji: '🍎', label: 'Fruits',        desc: 'Juiciness & shelf-life energy' },
  { key: 'food',    emoji: '🍕', label: 'Food',          desc: 'Flavor, spice & messiness index' },
  { key: 'pet',     emoji: '🐾', label: 'Pets',          desc: 'Cuteness & attention-seeking scores' },
  { key: 'nature',  emoji: '🌿', label: 'Nature',        desc: 'Calmness, drama & chaos potential' },
  { key: 'vehicle', emoji: '🚗', label: 'Vehicles',      desc: 'Road rage & parking ability' },
  { key: 'plant',   emoji: '🪴', label: 'Plants',        desc: 'Growth energy & leaf drama' },
  { key: 'object',  emoji: '📦', label: 'Objects',       desc: 'Main character energy & existential vibes' },
  { key: 'unknown', emoji: '❓', label: 'Something Else', desc: 'Our algorithm will figure it out (maybe)' },
]

export default function ContextSelector({ onSelect }) {
  const [selected, setSelected] = useState(null)
  const [guessing, setGuessing] = useState(false)

  const handleGuess = () => {
    setGuessing(true)
    // Pretend to think for 1.2s then pick randomly from the interesting ones
    const interesting = CATEGORIES.filter(c => c.key !== 'unknown')
    const picked = interesting[Math.floor(Math.random() * interesting.length)]
    setTimeout(() => {
      setSelected(picked.key)
      setGuessing(false)
    }, 1200)
  }

  const handleConfirm = () => {
    if (selected) onSelect(selected)
  }

  return (
    <section className="context-section view-container">
      <div className="context-header">
        <div className="context-tag">
          <span className="context-tag-dot" />
          Step 2 of 2
        </div>
        <h2 className="context-title">What are we looking at?</h2>
        <p className="context-subtitle">
          Help our algorithm pretend to understand your photo.
          <br />
          <span className="context-subtitle-muted">Context confidence: questionable.</span>
        </p>
      </div>

      <div className="context-grid">
        {CATEGORIES.map(({ key, emoji, label, desc }) => (
          <button
            key={key}
            className={`context-card ${selected === key ? 'context-card--selected' : ''}`}
            onClick={() => setSelected(key)}
            aria-pressed={selected === key}
            aria-label={label}
          >
            <span className="context-card-emoji" aria-hidden="true">{emoji}</span>
            <span className="context-card-label">{label}</span>
            <span className="context-card-desc">{desc}</span>
            {selected === key && (
              <span className="context-card-check" aria-hidden="true">✓</span>
            )}
          </button>
        ))}
      </div>

      <div className="context-actions">
        <button
          className="btn btn--ghost"
          onClick={handleGuess}
          disabled={guessing}
          aria-label="Let the algorithm guess the category"
        >
          {guessing ? '🤔 Thinking…' : '🎲 Let the Algorithm Guess'}
        </button>

        <button
          className="btn btn--primary"
          onClick={handleConfirm}
          disabled={!selected}
          aria-disabled={!selected}
        >
          Analyze This →
        </button>
      </div>

      {guessing && (
        <p className="context-guessing-text" aria-live="polite">
          Scanning photo with questionable AI confidence…
        </p>
      )}
    </section>
  )
}
