import { useState } from 'react'

export default function WhoIsMoreLikely({ questions, personAName, personBName }) {
  const [answers, setAnswers]   = useState({})
  const [revealed, setRevealed] = useState({})

  const nameA = personAName || 'Person 1'
  const nameB = personBName || 'Person 2'

  const pickAnswer = (idx) => {
    if (revealed[idx]) return
    const winner = Math.random() > 0.5 ? nameA : nameB
    setAnswers(prev => ({ ...prev, [idx]: winner }))
    setRevealed(prev => ({ ...prev, [idx]: true }))
  }

  // Pick 5 random questions from the pool
  const [picked] = useState(() =>
    [...questions].sort(() => Math.random() - 0.5).slice(0, 5)
  )

  return (
    <div className="likely-section result-stagger" style={{ '--stagger': 4 }}>
      <div className="likely-header">
        <span className="likely-eyebrow">👀 WHO IS MORE LIKELY TO…</span>
        <p className="likely-sub">Click each card to reveal the verdict.</p>
      </div>

      <div className="likely-grid">
        {picked.map((item, i) => {
          const isRevealed = !!revealed[i]
          const answer     = answers[i]
          const isA        = answer === nameA

          return (
            <button
              key={i}
              className={`likely-card ${isRevealed ? 'likely-card--revealed' : ''}`}
              onClick={() => pickAnswer(i)}
              aria-label={isRevealed ? `Answer: ${answer}` : 'Click to reveal'}
            >
              <p className="likely-question">{item.q}</p>

              {isRevealed ? (
                <div className="likely-answer">
                  <div className="likely-answer-inner">
                    <span className={`likely-winner ${isA ? 'likely-winner--a' : 'likely-winner--b'}`}>
                      {answer}
                    </span>
                    <span className="likely-winner-note">
                      Scientific analysis complete.
                    </span>
                  </div>
                </div>
              ) : (
                <span className="likely-tap-hint">Tap to reveal</span>
              )}
            </button>
          )
        })}
      </div>

      <p className="likely-disclaimer">
        Winner selected using highly questionable randomness.
      </p>
    </div>
  )
}
