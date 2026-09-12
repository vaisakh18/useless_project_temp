import { useState } from 'react'

export default function ProfileCard({ profile, cvTitle }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="profile-card result-stagger" style={{ '--stagger': 3 }}>
      <div className="profile-card-header">
        <div>
          <span className="profile-card-eyebrow">{cvTitle ?? 'OFFICIAL PROFILE'}</span>
          <h3 className="profile-card-name">{profile.name}</h3>
          <span className="profile-card-type">{profile.type}</span>
        </div>
        <button
          className="profile-card-toggle"
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
          aria-label="Toggle full profile"
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      <div className="profile-card-status">
        <span className="profile-status-dot" aria-hidden="true" />
        <span className="profile-status-text">{profile.status}</span>
      </div>

      {expanded && (
        <div className="profile-card-body">
          <div className="profile-section">
            <h4 className="profile-section-title">Strengths</h4>
            <ul className="profile-list">
              {profile.strengths.map((s, i) => (
                <li key={i} className="profile-list-item profile-list-item--strength">
                  <span aria-hidden="true">✓</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="profile-section">
            <h4 className="profile-section-title">Weaknesses</h4>
            <ul className="profile-list">
              {profile.weaknesses.map((w, i) => (
                <li key={i} className="profile-list-item profile-list-item--weakness">
                  <span aria-hidden="true">✕</span> {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="profile-cert">
            <span className="profile-cert-icon" aria-hidden="true">🏅</span>
            <span className="profile-cert-text">{profile.certification}</span>
          </div>
        </div>
      )}
    </div>
  )
}
