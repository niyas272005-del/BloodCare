import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BC_DONORS, BC_EMERGENCIES, BC_HOSPITALS } from '../data.js'
import { DonorCard } from '../components/DonorModal.jsx'
import DonorModal from '../components/DonorModal.jsx'
import { EmergencyCard, HospitalCard } from '../components/Cards.jsx'
import Footer from '../components/Footer.jsx'

function useCounter(target, trigger) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!trigger) return
    const duration = 2000
    const step = target / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= target) { setValue(target); clearInterval(timer) }
      else setValue(Math.floor(current))
    }, 16)
    return () => clearInterval(timer)
  }, [target, trigger])
  return value
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function useCounterObserver(ref) {
  const [triggered, setTriggered] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect() } }, { threshold: 0.5 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return triggered
}

function StatCard({ icon, target, label, progressWidth }) {
  const ref = useRef(null)
  const triggered = useCounterObserver(ref)
  const count = useCounter(target, triggered)
  return (
    <div className="stat-card neu-card" ref={ref}>
      <div className="stat-icon">{icon}</div>
      <h3 className="stat-num">{count.toLocaleString()}</h3>
      <p className="stat-label">{label}</p>
      <div className="progress-bar"><div className="progress-fill" style={{ width: progressWidth }}></div></div>
    </div>
  )
}

export default function Home() {
  const [particles, setParticles] = useState([])
  const [selectedDonor, setSelectedDonor] = useState(null)
  const [qsBlood, setQsBlood] = useState('')
  const [qsCity, setQsCity] = useState('')
  const [activeChip, setActiveChip] = useState('O+')
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const heroTriggered = useCounterObserver(heroRef)
  const livesSaved = useCounter(12400, heroTriggered)
  const activeDonors = useCounter(8500, heroTriggered)
  const hospitals = useCounter(320, heroTriggered)
  useReveal()

  useEffect(() => {
    const ps = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: Math.random() * 10 + 4,
      left: Math.random() * 100,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.4 + 0.1,
    }))
    setParticles(ps)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (qsBlood) params.set('blood', qsBlood)
    if (qsCity) params.set('city', qsCity)
    navigate(`/donors?${params.toString()}`)
  }

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
  const featuredDonors = BC_DONORS.filter(d => d.available).slice(0, 6)

  return (
    <>
      {/* HERO */}
      <section className="hero-section" id="home">
        <div className="particles" id="particles" aria-hidden="true">
          {particles.map(p => (
            <div key={p.id} className="particle" style={{
              width: p.size, height: p.size, left: `${p.left}%`,
              animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`, opacity: p.opacity
            }} />
          ))}
        </div>
        <div className="hero-bg-orb orb-1" aria-hidden="true"></div>
        <div className="hero-bg-orb orb-2" aria-hidden="true"></div>
        <div className="hero-content">
          <div className="hero-text reveal">
            <div className="hero-tag">
              <span className="status-dot emergency"></span>
              <span>Live Donors Available</span>
            </div>
            <h1 className="hero-title">Donate Blood,<br /><span>Save a Life</span><br />Today</h1>
            <p className="hero-desc">Every drop counts. Connect with verified blood donors in your city within minutes. Join India's fastest-growing blood donation network.</p>
            <div className="hero-actions">
              <Link to="/donors" className="btn btn-primary btn-lg">🩸 Find Donor Now</Link>
              <Link to="/register" className="btn btn-outline btn-lg">Become a Donor</Link>
            </div>
            <div className="hero-stats" ref={heroRef}>
              <div className="hero-stat">
                <span className="hero-stat-num">{livesSaved.toLocaleString()}</span>
                <span className="hero-stat-label">Lives Saved</span>
              </div>
              <div className="hero-stat-divider" aria-hidden="true"></div>
              <div className="hero-stat">
                <span className="hero-stat-num">{activeDonors.toLocaleString()}</span>
                <span className="hero-stat-label">Active Donors</span>
              </div>
              <div className="hero-stat-divider" aria-hidden="true"></div>
              <div className="hero-stat">
                <span className="hero-stat-num">{hospitals.toLocaleString()}</span>
                <span className="hero-stat-label">Hospitals</span>
              </div>
            </div>
          </div>
          <div className="hero-illustration reveal-right">
            <div className="hero-card-float glass-card">
              <div className="blood-badge blood-badge-lg">O+</div>
              <div>
                <p className="font-semibold" style={{ fontSize: '0.9rem' }}>Rahul Kumar</p>
                <p className="text-muted text-sm">Mumbai • Available</p>
              </div>
              <span className="badge badge-green">✓ Ready</span>
            </div>
            <div className="hero-ring">
              <div className="hero-ring-inner">
                <div style={{ fontSize: '4rem' }}>🩸</div>
                <p className="font-bold text-primary" style={{ fontSize: '1.1rem' }}>BloodCare</p>
              </div>
            </div>
            <div className="hero-card-float hero-card-float-2 glass-card">
              <span style={{ fontSize: '1.5rem' }}>🚨</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>Emergency Request</p>
                <p className="text-muted" style={{ fontSize: '0.78rem' }}>B+ needed • AIIMS Delhi</p>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator" aria-hidden="true"><div className="scroll-dot"></div></div>
      </section>

      {/* QUICK SEARCH */}
      <section className="section quick-search-section">
        <div className="section-header reveal">
          <span className="section-tag">Smart Search</span>
          <h2 className="section-title">Find a Donor <span>Instantly</span></h2>
          <p className="section-sub">Search from thousands of verified donors by blood group, city, and availability.</p>
        </div>
        <div className="quick-search-box reveal glass-card">
          <div className="qsearch-grid">
            <div className="input-group">
              <label className="input-label" htmlFor="qs-blood">Blood Group</label>
              <div className="input-with-icon">
                <span className="input-icon">🩸</span>
                <select className="input-field" id="qs-blood" value={qsBlood} onChange={e => { setQsBlood(e.target.value); if (e.target.value) setActiveChip(e.target.value) }}>
                  <option value="">Any Group</option>
                  {bloodGroups.map(bg => <option key={bg}>{bg}</option>)}
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="qs-city">City</label>
              <div className="input-with-icon">
                <span className="input-icon">📍</span>
                <input type="text" className="input-field" id="qs-city" placeholder="Enter your city" value={qsCity} onChange={e => setQsCity(e.target.value)} />
              </div>
            </div>
            <button type="button" className="btn btn-primary qsearch-btn" style={{ height: 50, alignSelf: 'flex-end' }} onClick={handleSearch}>
              🔍 Search Donors
            </button>
          </div>
          <div className="qsearch-chips" role="group" aria-label="Quick blood group filter">
            {bloodGroups.map(bg => (
              <span key={bg} className={`chip${activeChip === bg ? ' active' : ''}`}
                onClick={() => { setActiveChip(bg); setQsBlood(bg) }}>{bg}</span>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="section section-alt stats-section" id="impact">
        <div className="section-header reveal">
          <span className="section-tag">Our Impact</span>
          <h2 className="section-title">Numbers That <span>Matter</span></h2>
        </div>
        <div className="grid grid-4 reveal">
          <StatCard icon="❤️" target={12400} label="Lives Saved" progressWidth="82%" />
          <StatCard icon="👤" target={8500} label="Active Donors" progressWidth="70%" />
          <StatCard icon="🏥" target={320} label="Hospitals Connected" progressWidth="55%" />
          <StatCard icon="📅" target={45000} label="Total Donations" progressWidth="90%" />
        </div>
      </section>

      {/* EMERGENCY REQUESTS */}
      <section className="section" id="emergency-home">
        <div className="section-header reveal">
          <span className="section-tag" style={{ background: 'rgba(230,57,70,0.15)', color: 'var(--danger)' }}>🚨 Emergency</span>
          <h2 className="section-title">Active Emergency <span>Requests</span></h2>
          <p className="section-sub">Critical patients need blood right now. Respond immediately and save a life.</p>
        </div>
        <div className="grid grid-3 reveal">
          {BC_EMERGENCIES.slice(0, 3).map(em => <EmergencyCard key={em.id} em={em} />)}
        </div>
        <div className="text-center" style={{ marginTop: 40 }}>
          <Link to="/emergency" className="btn btn-outline">View All Emergency Requests →</Link>
        </div>
      </section>

      {/* FEATURED DONORS */}
      <section className="section section-alt" id="donors-home">
        <div className="section-header reveal">
          <span className="section-tag">Top Donors</span>
          <h2 className="section-title">Our <span>Heroes</span></h2>
          <p className="section-sub">Meet the incredible people saving lives in your community.</p>
        </div>
        <div className="grid grid-auto reveal">
          {featuredDonors.map(d => <DonorCard key={d.id} donor={d} onClick={setSelectedDonor} />)}
        </div>
        <div className="text-center" style={{ marginTop: 40 }}>
          <Link to="/donors" className="btn btn-primary">Explore All Donors →</Link>
        </div>
      </section>

      {/* HOSPITALS PREVIEW */}
      <section className="section" id="hospitals-home">
        <div className="section-header reveal">
          <span className="section-tag">Blood Banks</span>
          <h2 className="section-title">Nearby <span>Hospitals</span></h2>
          <p className="section-sub">Find blood banks and hospitals with real-time blood availability.</p>
        </div>
        <div className="grid grid-3 reveal">
          {BC_HOSPITALS.slice(0, 3).map(h => <HospitalCard key={h.id} h={h} />)}
        </div>
        <div className="text-center" style={{ marginTop: 40 }}>
          <Link to="/hospitals" className="btn btn-outline">View All Hospitals →</Link>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="section section-alt" id="achievements-home">
        <div className="section-header reveal">
          <span className="section-tag">Gamification</span>
          <h2 className="section-title">Earn <span>Badges</span></h2>
          <p className="section-sub">Every donation earns you recognition. Unlock badges, climb the leaderboard.</p>
        </div>
        <div className="grid grid-4 reveal">
          {[
            { icon: '🥇', title: 'Life Saver', desc: 'Donated 10+ times', progress: '100%' },
            { icon: '🏆', title: 'Champion', desc: 'Donated 25+ times', progress: '65%' },
            { icon: '⭐', title: 'Star Donor', desc: '5-star community rating', progress: '80%' },
            { icon: '🚀', title: 'First Responder', desc: 'Responded to emergency', progress: '45%' },
          ].map(a => (
            <div key={a.title} className="achievement-card glass-card text-center">
              <div className="achievement-icon">{a.icon}</div>
              <h3 className="font-bold" style={{ margin: '12px 0 6px' }}>{a.title}</h3>
              <p className="text-muted text-sm">{a.desc}</p>
              <div className="progress-bar" style={{ marginTop: 14 }}><div className="progress-fill" style={{ width: a.progress }}></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOOD COMPATIBILITY TABLE */}
      <section className="section" id="education-home">
        <div className="section-header reveal">
          <span className="section-tag">Education</span>
          <h2 className="section-title">Blood Compatibility <span>Guide</span></h2>
          <p className="section-sub">Understand who can donate to whom. Knowledge saves lives.</p>
        </div>
        <div className="compat-table-wrap reveal">
          <div className="table-container">
            <table className="compat-table" aria-label="Blood compatibility chart">
              <thead>
                <tr><th>Blood Group</th><th>Can Donate To</th><th>Can Receive From</th></tr>
              </thead>
              <tbody>
                {[
                  { group: 'O-', donateTo: 'Everyone 🌍', receiveFrom: 'O-' },
                  { group: 'O+', donateTo: 'O+, A+, B+, AB+', receiveFrom: 'O+, O-' },
                  { group: 'A-', donateTo: 'A-, A+, AB-, AB+', receiveFrom: 'A-, O-' },
                  { group: 'A+', donateTo: 'A+, AB+', receiveFrom: 'A+, A-, O+, O-' },
                  { group: 'B-', donateTo: 'B-, B+, AB-, AB+', receiveFrom: 'B-, O-' },
                  { group: 'B+', donateTo: 'B+, AB+', receiveFrom: 'B+, B-, O+, O-' },
                  { group: 'AB-', donateTo: 'AB-, AB+', receiveFrom: 'AB-, A-, B-, O-' },
                  { group: 'AB+', donateTo: 'AB+ only', receiveFrom: 'Receives From All 🌍' },
                ].map(row => (
                  <tr key={row.group}>
                    <td><span className="blood-badge" style={{ width: 36, height: 36, fontSize: '0.78rem', display: 'inline-flex' }}>{row.group}</span></td>
                    <td>{row.donateTo}</td>
                    <td>{row.receiveFrom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-center" style={{ marginTop: 40 }}>
          <Link to="/education" className="btn btn-outline">Full Education Center →</Link>
        </div>
      </section>

      {/* COMMUNITY PREVIEW */}
      <section className="section section-alt" id="community-home">
        <div className="section-header reveal">
          <span className="section-tag">Community</span>
          <h2 className="section-title">Join the <span>Movement</span></h2>
          <p className="section-sub">Share stories, join campaigns, and inspire others to donate blood.</p>
        </div>
        <div className="grid grid-3 reveal">
          {[
            { initials: 'RK', name: 'Rahul Kumar', sub: '15 donations · Mumbai', badge: 'Hero', badgeClass: 'badge-green', text: '"I\'ve been donating blood for 5 years. The feeling of knowing I\'ve saved lives is indescribable. Join BloodCare today!"', likes: 142, comments: 28, gradient: '' },
            { initials: 'PA', name: 'Priya Anand', sub: '8 donations · Delhi', badge: 'Active', badgeClass: 'badge-blue', text: '"My father needed AB- blood urgently. BloodCare connected us to a donor in under 10 minutes. This platform saved his life."', likes: 98, comments: 14, gradient: 'linear-gradient(135deg,#667eea,#764ba2)' },
            { initials: 'AS', name: 'Arjun Sharma', sub: '22 donations · Bangalore', badge: 'Champion', badgeClass: 'badge-red', text: '"Being a regular donor is the most fulfilling thing I do. BloodCare makes it effortless to track my impact and stay connected."', likes: 201, comments: 45, gradient: 'linear-gradient(135deg,#f093fb,#f5576c)' },
          ].map(s => (
            <div key={s.name} className="story-card glass-card">
              <div className="story-header">
                <div className="avatar avatar-md" style={s.gradient ? { background: s.gradient } : {}}>{s.initials}</div>
                <div><p className="font-semibold">{s.name}</p><p className="text-muted text-sm">{s.sub}</p></div>
                <span className={`badge ${s.badgeClass} ml-auto`}>{s.badge}</span>
              </div>
              <p className="story-text">{s.text}</p>
              <div className="story-footer">
                <button className="btn-glass btn btn-sm">❤️ {s.likes}</button>
                <button className="btn-glass btn btn-sm">💬 {s.comments}</button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center" style={{ marginTop: 40 }}>
          <Link to="/community" className="btn btn-primary">Join Our Community →</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="cta-content reveal glass-card text-center">
          <div className="cta-icon" aria-hidden="true">🩸</div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Ready to <span>Save Lives?</span></h2>
          <p className="section-sub" style={{ marginBottom: 32 }}>Register as a donor today. Your single donation can save up to 3 lives. It takes only 30 minutes.</p>
          <div className="flex-center gap-16 flex-wrap">
            <Link to="/register" className="btn btn-primary btn-lg">Register as Donor</Link>
            <Link to="/donors" className="btn btn-glass btn-lg">Find a Donor</Link>
          </div>
        </div>
      </section>

      <Footer />

      {selectedDonor && <DonorModal donorId={selectedDonor} onClose={() => setSelectedDonor(null)} />}
    </>
  )
}
