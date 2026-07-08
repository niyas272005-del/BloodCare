import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="navbar-brand" style={{ fontSize: '1.4rem', marginBottom: 12 }}>
            <div className="brand-icon" style={{ width: 32, height: 32, fontSize: '1rem' }}>❤️</div> BloodCare
          </div>
          <p className="text-muted text-sm" style={{ maxWidth: 260, lineHeight: 1.7 }}>
            India's most trusted blood donor platform. Connecting donors with patients since 2020.
          </p>
        </div>
        <div className="footer-links">
          <h4>Platform</h4>
          <Link to="/donors">Find Donors</Link>
          <Link to="/hospitals">Hospitals</Link>
          <Link to="/emergency">Emergency</Link>
          <Link to="/register">Register</Link>
        </div>
        <div className="footer-links">
          <h4>Community</h4>
          <Link to="/community">Stories</Link>
          <Link to="/education">Learn</Link>
          <Link to="/education">FAQ</Link>
        </div>
        <div className="footer-links">
          <h4>Connect</h4>
          <a href="#">Contact Us</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="text-muted text-sm">© 2025 BloodCare. Made with ❤️ to save lives.</p>
      </div>
    </footer>
  )
}
