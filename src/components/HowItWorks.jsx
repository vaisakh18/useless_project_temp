export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      emoji: '📸',
      title: 'Upload a Photo',
      body: "Drop in a photo of whatever you want us to completely misunderstand. JPG, PNG, WEBP — we'll pretend to scan all of them.",
    },
    {
      step: '02',
      emoji: '🤖',
      title: 'Fake AI Analysis',
      body: "Our extremely sophisticated algorithm performs 5 seconds of absolutely unnecessary calculations. Zero actual intelligence involved.",
    },
    {
      step: '03',
      emoji: '📊',
      title: 'Get Your Results',
      body: 'Receive a full dashboard: overall score, 6 detailed metrics, a primary verdict, red flags, green flags, expert advice, and a contextual weather report.',
    },
    {
      step: '04',
      emoji: '📤',
      title: 'Share the Damage',
      body: "Download your official report or share it via native share. Emotionally damage your friends responsibly.",
    },
  ]

  return (
    <section id="how-it-works" className="landing-section landing-section--alt">
      <div className="landing-section-inner">
        <div className="section-header">
          <span className="section-eyebrow">The process</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-sub">
            Four scientifically questionable steps.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} className="step-card section-reveal" style={{ '--reveal-delay': `${i * 100}ms` }}>
              <div className="step-number-wrap">
                <span className="step-number">{s.step}</span>
                <div className="step-connector" aria-hidden="true" />
              </div>
              <div className="step-body">
                <span className="step-emoji" aria-hidden="true">{s.emoji}</span>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
