import { useState } from 'react'

function SocialIcon({ href, label, children }) {
  return (
    <a
      className="contact-social-btn"
      href={href}
      aria-label={label}
      onClick={e => e.preventDefault()}
    >
      {children}
      {label}
    </a>
  )
}

export default function ContactSection() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
      setTimeout(() => { setSent(false); setForm({ name: '', email: '', message: '' }) }, 4000)
    }, 1200)
  }

  return (
    <section id="contact" className="landing-section landing-section--alt">
      <div className="landing-section-inner">
        <div className="section-header">
          <span className="section-eyebrow">Get in touch</span>
          <h2 className="section-title">Contact</h2>
          <p className="section-sub">
            Got feedback? Found a bug? Emotionally damaged by your results?<br />
            Built for entertainment. Powered by questionable decisions.
          </p>
        </div>

        <div className="contact-layout">
          {/* Info column */}
          <div className="contact-info-col">
            <div className="contact-detail-list">
              <div className="contact-detail-row">
                <span className="contact-detail-icon">✉️</span>
                <div>
                  <p className="contact-detail-label">Email</p>
                  <p className="contact-detail-value">hello@love404.fake</p>
                </div>
              </div>
              <div className="contact-detail-row">
                <span className="contact-detail-icon">🏢</span>
                <div>
                  <p className="contact-detail-label">Location</p>
                  <p className="contact-detail-value">The Cloud™ — no physical office</p>
                </div>
              </div>
              <div className="contact-detail-row">
                <span className="contact-detail-icon">⏰</span>
                <div>
                  <p className="contact-detail-label">Response Time</p>
                  <p className="contact-detail-value">Never. This is a hackathon app.</p>
                </div>
              </div>
            </div>

            <div className="contact-social-links">
              <SocialIcon href="#" label="GitHub">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              </SocialIcon>
              <SocialIcon href="#" label="Twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </SocialIcon>
              <SocialIcon href="#" label="LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </SocialIcon>
            </div>
          </div>

          {/* Form column */}
          <div className="contact-form-col">
            {sent ? (
              <div className="contact-sent-state">
                <span className="contact-sent-icon">🎉</span>
                <p className="contact-sent-title">Message received!</p>
                <p className="contact-sent-sub">
                  Our algorithm has processed your feelings.<br />No actual humans were notified.
                </p>
              </div>
            ) : (
              <form className="contact-form-inner" onSubmit={handleSubmit} noValidate>
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label className="contact-label-text" htmlFor="cs-name">Name</label>
                    <input id="cs-name" type="text" className="contact-input-field"
                      placeholder="Your name"
                      value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} />
                  </div>
                  <div className="contact-field">
                    <label className="contact-label-text" htmlFor="cs-email">Email</label>
                    <input id="cs-email" type="email" className="contact-input-field"
                      placeholder="your@email.com"
                      value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))} />
                  </div>
                </div>
                <div className="contact-field">
                  <label className="contact-label-text" htmlFor="cs-msg">Message</label>
                  <textarea id="cs-msg" className="contact-input-field contact-textarea-field"
                    placeholder="Your thoughts, feedback, breakup story, or emotional damage report…"
                    rows={4}
                    value={form.message} onChange={e => setForm(s => ({ ...s, message: e.target.value }))} />
                </div>
                <div className="contact-form-actions">
                  <p className="contact-privacy-text">🔒 No data is sent anywhere. Purely decorative.</p>
                  <button type="submit" className="btn btn--primary" disabled={loading}>
                    {loading ? 'Sending…' : 'Send Message →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
