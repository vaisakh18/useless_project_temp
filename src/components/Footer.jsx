function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-separator" aria-hidden="true" />

      <div className="footer-inner">

        {/* ── Brand column ─────────────────────────────── */}
        <div className="footer-col footer-col--brand">
          <div className="footer-brand">
            <span className="footer-brand-heart" aria-hidden="true">💔</span>
            <span className="footer-brand-name">
              love<span className="footer-brand-accent">404</span>
            </span>
          </div>
          <p className="footer-tagline">
            Using absolutely no science to predict your relationship's future.
            Built for a hackathon with questionable intentions.
          </p>
          <div className="footer-badges">
            <span className="footer-pill">FAKE AI™</span>
            <span className="footer-pill footer-pill--green">0% Scientific</span>
            <span className="footer-pill footer-pill--purple">100% Fun</span>
          </div>
          {/* Social icons */}
          <div className="footer-socials">
            <a className="footer-social-icon" href="#" aria-label="GitHub" onClick={e => e.preventDefault()}><GithubIcon /></a>
            <a className="footer-social-icon" href="#" aria-label="Twitter" onClick={e => e.preventDefault()}><TwitterIcon /></a>
            <a className="footer-social-icon" href="#" aria-label="LinkedIn" onClick={e => e.preventDefault()}><LinkedinIcon /></a>
          </div>
        </div>

        {/* ── Product column ───────────────────────────── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Product</h4>
          <ul className="footer-links">
            <li><span className="footer-link">📸 Couple Analysis</span></li>
            <li><span className="footer-link">👤 Individual Upload</span></li>
            <li><span className="footer-link">🌐 9 Context Modes</span></li>
            <li><span className="footer-link">📄 Full Reports</span></li>
            <li><span className="footer-link">📤 Share Results</span></li>
          </ul>
        </div>

        {/* ── Contexts column ──────────────────────────── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contexts</h4>
          <ul className="footer-links">
            <li><span className="footer-link">👤 Humans</span></li>
            <li><span className="footer-link">🐶 Animals</span></li>
            <li><span className="footer-link">🍎 Fruits &amp; Food</span></li>
            <li><span className="footer-link">🐾 Pets</span></li>
            <li><span className="footer-link">🌿 Nature &amp; More</span></li>
          </ul>
        </div>

        {/* ── Contact column ───────────────────────────── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contact</h4>
          <ul className="footer-links">
            <li>
              <span className="footer-link footer-link--with-icon">
                <span aria-hidden="true">✉️</span>
                hello@love404.fake
              </span>
            </li>
            <li>
              <span className="footer-link footer-link--with-icon footer-link--muted">
                <span aria-hidden="true">🏢</span>
                The Cloud™
              </span>
            </li>
            <li>
              <span className="footer-link footer-link--with-icon footer-link--muted">
                <span aria-hidden="true">⏰</span>
                Response: never
              </span>
            </li>
          </ul>
          <div className="footer-contact-note">
            <p>Found a bug? Have feedback?</p>
            <p>We probably won't fix it, but we'd love to hear about it.</p>
          </div>
        </div>

        {/* ── Legal column ─────────────────────────────── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Legal (ish)</h4>
          <ul className="footer-links">
            <li><span className="footer-link footer-link--muted">No data collected</span></li>
            <li><span className="footer-link footer-link--muted">No backend exists</span></li>
            <li><span className="footer-link footer-link--muted">No AI was used</span></li>
            <li><span className="footer-link footer-link--muted">No cookies set</span></li>
            <li><span className="footer-link footer-link--muted">Please don't sue us</span></li>
          </ul>
        </div>
      </div>

      {/* ── Newsletter teaser ──────────────────────────────── */}
      <div className="footer-newsletter">
        <div className="footer-newsletter-inner">
          <div className="footer-newsletter-text">
            <p className="footer-newsletter-title">Stay updated on absolutely nothing</p>
            <p className="footer-newsletter-sub">Subscribe to our newsletter. We will never email you. This is purely decorative.</p>
          </div>
          <div className="footer-newsletter-form">
            <input
              type="email"
              className="footer-newsletter-input"
              placeholder="your@email.com"
              aria-label="Newsletter email"
              readOnly
              onClick={e => e.target.blur()}
            />
            <button
              className="btn btn--primary btn--sm footer-newsletter-btn"
              onClick={(e) => { e.preventDefault(); e.target.textContent = '✓ Subscribed (not really)'; setTimeout(() => { e.target.textContent = 'Subscribe' }, 3000) }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────── */}
      <div className="footer-bottom">
        <p className="footer-copy">
          © {year} love404 &nbsp;·&nbsp; Built with questionable algorithms and zero relationship expertise
        </p>
        <div className="footer-bottom-right">
          <span className="footer-hackathon-badge">🏆 Hackathon Project</span>
          <span className="footer-disclaimer-inline">⚠️ 100% fake AI</span>
        </div>
      </div>
    </footer>
  )
}
