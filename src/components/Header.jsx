import { useState, useEffect, useRef, useCallback } from 'react'

const NAV_ITEMS = [
  { id: 'features',     label: 'Features' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'contexts',     label: 'Contexts' },
  { id: 'contact',      label: 'Contact' },
]

// ── Animated SVG Logo ────────────────────────────────────────
function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <svg className="logo-svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <filter id="logoGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path className="logo-heart-left"
          d="M14 22 C14 22 4 15 4 9 C4 6 6 4 9 4 C11.5 4 13 6 14 7.5"
          stroke="url(#logoGrad)" strokeWidth="2.2" strokeLinecap="round"
          fill="none" filter="url(#logoGlow)" />
        <path className="logo-heart-right"
          d="M14 22 C14 22 24 15 24 9 C24 6 22 4 19 4 C16.5 4 15 6 14 7.5"
          stroke="url(#logoGrad)" strokeWidth="2.2" strokeLinecap="round"
          fill="none" filter="url(#logoGlow)" />
        <path className="logo-crack"
          d="M14 8 L12.5 13 L15 14.5 L13 20"
          stroke="url(#logoGrad)" strokeWidth="1.4" strokeLinecap="round"
          strokeLinejoin="round" fill="none" opacity="0.9" />
        <circle className="logo-ring" cx="14" cy="13" r="10"
          stroke="url(#logoGrad)" strokeWidth="1" fill="none" opacity="0" />
      </svg>
    </span>
  )
}

// ── Scroll helper ────────────────────────────────────────────
function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Header({ onHome, onTryIt, isLandingPage = true }) {
  const [scrolled,       setScrolled]       = useState(false)
  const [activeSection,  setActiveSection]  = useState('')
  const [menuOpen,       setMenuOpen]       = useState(false)
  const observerRef = useRef(null)

  // Scroll shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // IntersectionObserver — track which section is in view
  useEffect(() => {
    if (!isLandingPage) return

    const sectionIds = NAV_ITEMS.map(n => n.id)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0,
      }
    )

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    observerRef.current = observer
    return () => observer.disconnect()
  }, [isLandingPage])

  const handleNavClick = useCallback((id) => {
    setMenuOpen(false)
    if (isLandingPage) {
      scrollToSection(id)
    }
  }, [isLandingPage])

  const handleLogoClick = useCallback(() => {
    if (onHome) {
      onHome()
    } else if (isLandingPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [onHome, isLandingPage])

  const handleTryIt = useCallback(() => {
    setMenuOpen(false)
    if (onTryIt) {
      onTryIt()
    }
  }, [onTryIt])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      {/* Accent line */}
      <div className="header-accent-line" aria-hidden="true" />

      <div className="header-inner">

        {/* Brand / Logo */}
        <button
          className="header-brand-wrap header-brand-btn"
          onClick={handleLogoClick}
          aria-label="love404 — go to home"
        >
          <LogoMark />
          <span className="header-brand">
            <span className="header-brand-text">
              love<span className="header-brand-accent">404</span>
            </span>
          </span>
          <span className="header-version-pill">v2.0</span>
        </button>

        {/* Desktop nav — only shown on landing page */}
        {isLandingPage && (
          <nav className="header-nav" aria-label="Page navigation">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                className={`header-nav-btn ${activeSection === id ? 'header-nav-btn--active' : ''}`}
                onClick={() => handleNavClick(id)}
              >
                {label}
              </button>
            ))}
          </nav>
        )}

        {/* Right cluster */}
        <div className="header-right">
          <span className="header-live-pill" aria-hidden="true">
            <span className="header-live-dot" />
            LIVE
          </span>
          <span className="header-badge">FAKE AI™</span>

          {onTryIt && (
            <button className="btn btn--primary header-cta-btn" onClick={handleTryIt}>
              Try It Free →
            </button>
          )}

          {/* Mobile hamburger — only on landing */}
          {isLandingPage && (
            <button
              className={`header-hamburger ${menuOpen ? 'header-hamburger--open' : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && isLandingPage && (
        <nav className="header-mobile-menu" aria-label="Mobile navigation">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              className={`header-mobile-nav-btn ${activeSection === id ? 'header-mobile-nav-btn--active' : ''}`}
              onClick={() => handleNavClick(id)}
            >
              {label}
            </button>
          ))}
          {onTryIt && (
            <button className="header-mobile-nav-btn header-mobile-cta" onClick={handleTryIt}>
              🔬 Try It Free →
            </button>
          )}
        </nav>
      )}
    </header>
  )
}
