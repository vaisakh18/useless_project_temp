export default function Features() {
  const items = [
    {
      emoji: '📸',
      title: 'Multi-Mode Upload',
      body: 'Upload a single couple photo or two individual photos with optional names. Supports JPG, PNG, and WEBP up to 10MB. Everything stays in your browser.',
    },
    {
      emoji: '🎭',
      title: 'Fake AI Analysis',
      body: 'Our algorithm is extremely confident about absolutely nothing. Watch 5 seconds of convincing fake analysis — scanning emotional bandwidth, measuring vibe synchronization.',
    },
    {
      emoji: '📊',
      title: 'Ridiculous Metrics',
      body: 'Get completely unnecessary scores: Breakup Probability, Drama Potential, Ghosting Risk, Vibe Compatibility, and more — all beautifully animated and totally meaningless.',
    },
    {
      emoji: '🌐',
      title: 'Context-Aware Results',
      body: '9 analysis modes: Humans, Animals, Fruits, Food, Pets, Nature, Vehicles, Plants, and Unknown. Every category gets unique metrics, verdicts, and jokes.',
    },
    {
      emoji: '🚩',
      title: 'Red & Green Flags',
      body: 'Discover problems that may or may not exist. Find evidence that everything might actually be fine. All generated randomly with zero actual insight.',
    },
    {
      emoji: '📤',
      title: 'Share the Damage',
      body: 'Share your results via native share, copy to clipboard, or download a full official report as a .txt file. Emotionally damage your friends responsibly.',
    },
  ]

  return (
    <section id="features" className="landing-section">
      <div className="landing-section-inner">
        <div className="section-header">
          <span className="section-eyebrow">What you get</span>
          <h2 className="section-title">Features</h2>
          <p className="section-sub">
            Everything you need to pretend you're using AI. Nothing you need to actually predict anything.
          </p>
        </div>

        <div className="features-grid">
          {items.map((item, i) => (
            <div key={i} className="feature-card section-reveal">
              <span className="feature-emoji" aria-hidden="true">{item.emoji}</span>
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-body">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
