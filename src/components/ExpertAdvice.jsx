import { useState } from 'react'
import { getContent } from '../utils/contextContent.js'

export default function ExpertAdvice({ initialAdvice, context }) {
  const [current, setCurrent] = useState(initialAdvice)
  const [animating, setAnimating] = useState(false)

  const nextTip = () => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      const pool    = getContent(context).advice
      const choices = pool.filter(a => a !== current)
      setCurrent(choices[Math.floor(Math.random() * choices.length)] ?? pool[0])
      setAnimating(false)
    }, 280)
  }

  return (
    <div className="advice-card result-stagger" style={{ '--stagger': 4 }}>
      <span className="advice-eyebrow">💡 ADVICE FROM OUR EXPERTS</span>
      <p className={`advice-text ${animating ? 'advice-text--out' : 'advice-text--in'}`}>
        "{current}"
      </p>
      <button className="btn btn--ghost btn--sm advice-btn" onClick={nextTip}>
        🎲 Give Me Another Terrible Tip
      </button>
    </div>
  )
}
