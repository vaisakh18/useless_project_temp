import { useState, useEffect } from 'react'

export default function ContextWeather({ weather, context }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  const heading = context === 'human' ? 'RELATIONSHIP WEATHER' : 'CONTEXT WEATHER'

  return (
    <div className={`weather-card result-stagger ${visible ? 'weather-card--visible' : ''}`} style={{ '--stagger': 3 }}>
      <span className="weather-eyebrow">{heading}</span>

      <div className="weather-body">
        <span className="weather-icon" aria-hidden="true">{weather.icon}</span>
        <div className="weather-text">
          <p className="weather-label">{weather.label}</p>
          <p className="weather-sub">{weather.sub}</p>
        </div>
      </div>
    </div>
  )
}
