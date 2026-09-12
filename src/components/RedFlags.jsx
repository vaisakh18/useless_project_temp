import { useState, useEffect } from 'react'

export default function RedFlags({ flags }) {
  const [visible, setVisible] = useState([])

  useEffect(() => {
    flags.forEach((_, i) => {
      setTimeout(() => setVisible(prev => [...prev, i]), i * 120)
    })
  }, [flags])

  return (
    <div className="flags-section">
      <span className="flags-eyebrow flags-eyebrow--red">🚩 RED FLAGS</span>
      <ul className="flags-list">
        {flags.map((flag, i) => (
          <li
            key={i}
            className={`flags-item flags-item--red ${visible.includes(i) ? 'flags-item--visible' : ''}`}
          >
            {flag}
          </li>
        ))}
      </ul>
    </div>
  )
}
