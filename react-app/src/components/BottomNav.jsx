import { Link, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const { pathname } = useLocation()
  const isActive = (p) => p === '/' ? pathname === '/' : pathname.startsWith(p)

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <Link to="/" className={`bottom-nav-item${isActive('/') ? ' active' : ''}`}>
        <span className="icon">🏠</span>Home
      </Link>
      <Link to="/donors" className={`bottom-nav-item${isActive('/donors') ? ' active' : ''}`}>
        <span className="icon">🩸</span>Donors
      </Link>
      <Link to="/emergency" className={`bottom-nav-item${isActive('/emergency') ? ' active' : ''}`}>
        <span className="icon">🚨</span>Emergency
      </Link>
      <Link to="/hospitals" className={`bottom-nav-item${isActive('/hospitals') ? ' active' : ''}`}>
        <span className="icon">🏥</span>Hospitals
      </Link>
      <Link to="/community" className={`bottom-nav-item${isActive('/community') ? ' active' : ''}`}>
        <span className="icon">👥</span>Community
      </Link>
    </nav>
  )
}
