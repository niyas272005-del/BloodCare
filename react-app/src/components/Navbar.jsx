import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem('bc-theme') || 'light')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('bc-theme', theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation"
        style={{ boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.15)' : 'var(--glass-shadow)' }}>
        <Link to="/" className="navbar-brand">
          <div className="brand-icon" aria-hidden="true">❤️</div>
          BloodCare
        </Link>
        <ul className="nav-links" role="menubar">
          <li><Link to="/" className={isActive('/') ? 'active' : ''} role="menuitem">Home</Link></li>
          <li><Link to="/donors" className={isActive('/donors') ? 'active' : ''} role="menuitem">Donors</Link></li>
          <li><Link to="/hospitals" className={isActive('/hospitals') ? 'active' : ''} role="menuitem">Hospitals</Link></li>
          <li><Link to="/community" className={isActive('/community') ? 'active' : ''} role="menuitem">Community</Link></li>
          <li><Link to="/emergency" className={isActive('/emergency') ? 'active' : ''} role="menuitem">Emergency</Link></li>
          <li><Link to="/education" className={isActive('/education') ? 'active' : ''} role="menuitem">Learn</Link></li>
        </ul>
        <div className="nav-actions">
          <button className="btn-icon" id="themeToggle" onClick={toggleTheme} aria-label="Toggle dark mode" title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link to="/register" className="btn btn-primary btn-sm">Become Donor</Link>
          <button className="hamburger" id="hamburger" onClick={() => setMobileOpen(o => !o)}
            aria-label="Open menu" aria-expanded={mobileOpen}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`} id="mobileNav" role="navigation">
        <Link to="/" className={isActive('/') ? 'active' : ''}>🏠 Home</Link>
        <Link to="/donors" className={isActive('/donors') ? 'active' : ''}>🩸 Donors</Link>
        <Link to="/hospitals" className={isActive('/hospitals') ? 'active' : ''}>🏥 Hospitals</Link>
        <Link to="/community" className={isActive('/community') ? 'active' : ''}>👥 Community</Link>
        <Link to="/emergency" className={isActive('/emergency') ? 'active' : ''}>🚨 Emergency</Link>
        <Link to="/education" className={isActive('/education') ? 'active' : ''}>📚 Learn</Link>
        <Link to="/register" className="btn btn-primary" style={{ textAlign: 'center', marginTop: '8px' }}>Become a Donor</Link>
      </div>
    </>
  )
}
