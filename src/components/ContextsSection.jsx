export default function ContextsSection() {
  const contexts = [
    { emoji: '👤', label: 'Humans',   desc: 'Breakup probability, relationship strength, drama potential, ghosting risk.' },
    { emoji: '🐶', label: 'Animals',  desc: 'Chaos level, snack motivation, nap compatibility, loyalty scores.' },
    { emoji: '🍎', label: 'Fruits',   desc: 'Juiciness, sweetness, ripeness, shelf-life energy.' },
    { emoji: '🍕', label: 'Food',     desc: 'Flavor, spice, crunch, messiness, comfort level.' },
    { emoji: '🐾', label: 'Pets',     desc: 'Cuteness, attention-seeking, nap potential, chaos index.' },
    { emoji: '🌿', label: 'Nature',   desc: 'Calmness, beauty, drama, seasonal mood.' },
    { emoji: '🚗', label: 'Vehicles', desc: 'Speed, road rage, parking ability, fuel energy.' },
    { emoji: '🪴', label: 'Plants',   desc: 'Growth energy, water dependency, leaf drama.' },
    { emoji: '📦', label: 'Objects',  desc: 'Main character energy, usefulness, confusion index.' },
    { emoji: '❓', label: 'Unknown',  desc: 'The algorithm has no idea. Neither do we. Results still generated.' },
  ]

  return (
    <section id="contexts" className="landing-section">
      <div className="landing-section-inner">
        <div className="section-header">
          <span className="section-eyebrow">What we analyze (kind of)</span>
          <h2 className="section-title">WE ANALYZE… KIND OF.</h2>
          <p className="section-sub">
            Upload almost anything. We'll find something questionable to say about it.
          </p>
        </div>

        <div className="contexts-grid">
          {contexts.map((c, i) => (
            <div key={i} className="context-item section-reveal" style={{ '--reveal-delay': `${i * 60}ms` }}>
              <span className="context-item-emoji" aria-hidden="true">{c.emoji}</span>
              <div className="context-item-text">
                <p className="context-item-label">{c.label}</p>
                <p className="context-item-desc">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
