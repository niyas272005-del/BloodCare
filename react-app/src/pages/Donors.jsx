import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BC_DONORS } from '../data.js'
import { DonorCard } from '../components/DonorModal.jsx'
import DonorModal from '../components/DonorModal.jsx'
import Footer from '../components/Footer.jsx'

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

function useCounter(target, trigger) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!trigger) return
    const step = target / (2000 / 16)
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

export default function Donors() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [filterBlood, setFilterBlood] = useState(searchParams.get('blood') || '')
  const [filterCity, setFilterCity] = useState(searchParams.get('city') || '')
  const [filterAvail, setFilterAvail] = useState('')
  const [activeChip, setActiveChip] = useState(searchParams.get('blood') || '')
  const [selectedDonor, setSelectedDonor] = useState(null)
  const [isGrid, setIsGrid] = useState(true)
  const statsRef = useRef(null)
  const statsTriggered = useCounterObserver(statsRef)
  const totalDonors = useCounter(BC_DONORS.length, statsTriggered)
  const availDonors = useCounter(BC_DONORS.filter(d => d.available).length, statsTriggered)
  const totalDonations = useCounter(BC_DONORS.reduce((a, d) => a + d.donations, 0), statsTriggered)
  useReveal()

  const cities = [...new Set(BC_DONORS.map(d => d.city))].sort()
  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']

  const filtered = BC_DONORS.filter(d => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.city.toLowerCase().includes(search.toLowerCase())) return false
    if (filterBlood && d.blood !== filterBlood) return false
    if (filterCity && d.city !== filterCity) return false
    if (filterAvail === 'available' && !d.available) return false
    if (filterAvail === 'unavailable' && d.available) return false
    return true
  })

  const clearFilters = () => {
    setSearch(''); setFilterBlood(''); setFilterCity(''); setFilterAvail(''); setActiveChip('')
  }

  const handleChip = (bg) => { setActiveChip(bg); setFilterBlood(bg) }
  const handleBloodChange = (e) => { setFilterBlood(e.target.value); setActiveChip(e.target.value) }

  useEffect(() => { document.title = 'Find Donors – BloodCare' }, [])

  // Top donor by donations
  const topDonor = [...BC_DONORS].sort((a, b) => b.donations - a.donations)[0]

  return (
    <>
      {/* PAGE HEADER */}
      <div className="page-header" style={{ background: 'linear-gradient(135deg,#0d0516,#140520)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(230,57,70,0.2),transparent 70%)', top: -200, right: -100 }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,107,107,0.12),transparent 70%)', bottom: -80, left: 100 }} />
        <div className="page-header-content reveal" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag">Blood Donors</span>
          <h1 className="section-title" style={{ color: '#fff' }}>Find a <span>Donor</span></h1>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,0.75)' }}>Search from <strong style={{ color: 'var(--accent)' }}>{BC_DONORS.length}</strong> verified donors. Real-time availability, verified contacts.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius)', padding: '12px 24px', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{BC_DONORS.filter(d => d.available).length}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Available Now</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius)', padding: '12px 24px', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{cities.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Cities Covered</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius)', padding: '12px 24px', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{bloodGroups.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Blood Groups</div>
            </div>
          </div>
        </div>
      </div>

      {/* ANIMATED STATS ROW */}
      <section className="section section-alt" style={{ padding: '40px 5%' }}>
        <div ref={statsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 20 }} className="reveal">
          {[
            { icon: '👥', count: totalDonors, label: 'Total Donors', color: 'var(--primary)' },
            { icon: '✅', count: availDonors, label: 'Available Now', color: 'var(--success)' },
            { icon: '💉', count: totalDonations, label: 'Total Donations', color: 'var(--info)' },
            { icon: '🏙️', count: cities.length, label: 'Cities', color: 'var(--warning)' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 20px', textAlign: 'center', boxShadow: 'var(--glass-shadow)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: s.color }}>{s.count.toLocaleString()}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-2)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SEARCH & FILTER */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: 20 }}>
        <div className="search-filter-box glass-card reveal">
          <div className="search-filter-grid">
            <div className="input-group" style={{ flex: 2 }}>
              <label className="input-label" htmlFor="searchName">Search Donor</label>
              <div className="input-with-icon">
                <span className="input-icon">🔍</span>
                <input type="text" className="input-field" id="searchName" placeholder="Name or city…"
                  value={search} onChange={e => setSearch(e.target.value)} aria-label="Search donors by name or city" />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="filterBlood">Blood Group</label>
              <div className="input-with-icon">
                <span className="input-icon">🩸</span>
                <select className="input-field" id="filterBlood" value={filterBlood} onChange={handleBloodChange} aria-label="Filter by blood group">
                  <option value="">All Groups</option>
                  {bloodGroups.map(bg => <option key={bg}>{bg}</option>)}
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="filterCity">City</label>
              <div className="input-with-icon">
                <span className="input-icon">📍</span>
                <select className="input-field" id="filterCity" value={filterCity} onChange={e => setFilterCity(e.target.value)} aria-label="Filter by city">
                  <option value="">All Cities</option>
                  {cities.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="filterAvail">Availability</label>
              <select className="input-field" id="filterAvail" value={filterAvail} onChange={e => setFilterAvail(e.target.value)} aria-label="Filter by availability">
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={clearFilters} style={{ alignSelf: 'flex-end', height: 50 }}>Clear</button>
          </div>
          <div className="qsearch-chips" style={{ marginTop: 16 }} role="group" aria-label="Quick blood group filter">
            <span className={`chip${activeChip === '' ? ' active' : ''}`} onClick={() => handleChip('')}>All</span>
            {bloodGroups.map(bg => (
              <span key={bg} className={`chip${activeChip === bg ? ' active' : ''}`} onClick={() => handleChip(bg)}>{bg}</span>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS INFO */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="results-info flex-between">
          <p className="text-muted">Showing <strong>{filtered.length}</strong> donor{filtered.length !== 1 ? 's' : ''}
            {filterBlood && <span> with blood group <strong style={{ color: 'var(--primary)' }}>{filterBlood}</strong></span>}
            {filterCity && <span> in <strong style={{ color: 'var(--primary)' }}>{filterCity}</strong></span>}
          </p>
          <div className="flex gap-8">
            <button className={`btn-icon view-toggle${isGrid ? ' active' : ''}`} onClick={() => setIsGrid(true)} title="Grid view" aria-label="Grid view">⊞</button>
            <button className={`btn-icon view-toggle${!isGrid ? ' active' : ''}`} onClick={() => setIsGrid(false)} title="List view" aria-label="List view">☰</button>
          </div>
        </div>
      </section>

      {/* DONOR GRID */}
      <section className="section" style={{ paddingTop: 24 }}>
        {filtered.length > 0 ? (
          <div className="grid grid-auto" aria-live="polite" aria-label="Donor search results">
            {filtered.map(d => <DonorCard key={d.id} donor={d} onClick={setSelectedDonor} />)}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No donors found</h3>
            <p className="text-muted">Try adjusting your filters or search term.</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </section>

      {/* FEATURED TOP DONOR */}
      <section className="section section-alt">
        <div className="section-header reveal">
          <span className="section-tag">Spotlight</span>
          <h2 className="section-title">Our Top <span>Donor Hero</span></h2>
          <p className="section-sub">Celebrating the most dedicated member of our BloodCare community this month.</p>
        </div>
        <div className="reveal" style={{ maxWidth: 700, margin: '0 auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 40, boxShadow: 'var(--glass-shadow)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(230,57,70,0.12),transparent 70%)', top: -100, right: -100 }} />
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#e63946,#c1121f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: '#fff', flexShrink: 0, boxShadow: '0 0 30px rgba(230,57,70,0.4)' }}>{topDonor.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{topDonor.name}</h3>
                <span className="badge badge-red">👑 Top Donor</span>
                {topDonor.available && <span className="badge badge-green">✓ Available</span>}
              </div>
              <p className="text-muted text-sm" style={{ marginBottom: 16 }}>📍 {topDonor.city} • Blood Group: <strong style={{ color: 'var(--primary)' }}>{topDonor.blood}</strong></p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[
                  { val: topDonor.donations, lbl: 'Donations' },
                  { val: topDonor.donations * 3, lbl: 'Lives Saved' },
                  { val: topDonor.badges.length, lbl: 'Badges Earned' },
                ].map(s => (
                  <div key={s.lbl} style={{ textAlign: 'center', background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '12px 20px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>{s.val}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            {topDonor.badges.map(b => (
              <span key={b} style={{ background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.2)', color: 'var(--primary)', padding: '6px 14px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 600 }}>🏅 {b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="section-header reveal">
          <span className="section-tag">Process</span>
          <h2 className="section-title">How to <span>Find & Contact</span> a Donor</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }} className="reveal">
          {[
            { step: '01', icon: '🔍', title: 'Search', desc: 'Use filters to find donors by blood group, city, or availability.' },
            { step: '02', icon: '👤', title: 'View Profile', desc: 'Click on a donor card to see their full profile, donation history, and badges.' },
            { step: '03', icon: '📞', title: 'Contact', desc: 'Call or message the donor directly through our verified contact system.' },
            { step: '04', icon: '🩸', title: 'Donate', desc: 'Meet at the hospital or donation center and save a life together.' },
          ].map(s => (
            <div key={s.step} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28, textAlign: 'center', boxShadow: 'var(--glass-shadow)', transition: 'all var(--transition)', position: 'relative' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.1em', opacity: 0.5, marginBottom: 12 }}>STEP {s.step}</div>
              <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>{s.icon}</div>
              <h4 style={{ fontWeight: 700, marginBottom: 8 }}>{s.title}</h4>
              <p style={{ fontSize: '0.87rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REGISTER CTA */}
      <section className="section cta-section">
        <div className="cta-content glass-card text-center reveal">
          <div className="cta-icon">🩸</div>
          <h2 className="section-title" style={{ marginBottom: 12 }}>Can't find your blood group?</h2>
          <p className="section-sub" style={{ marginBottom: 28 }}>Register as a donor and be the one who saves lives in your community. It only takes 2 minutes.</p>
          <div className="flex-center gap-16 flex-wrap">
            <Link to="/register" className="btn btn-primary btn-lg">Register as a Donor</Link>
            <Link to="/emergency" className="btn btn-glass btn-lg">View Emergency Requests</Link>
          </div>
        </div>
      </section>

      <Footer />
      {selectedDonor && <DonorModal donorId={selectedDonor} onClose={() => setSelectedDonor(null)} />}
    </>
  )
}
