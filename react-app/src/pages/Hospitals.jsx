import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { BC_HOSPITALS } from '../data.js'
import { HospitalCard } from '../components/Cards.jsx'
import Footer from '../components/Footer.jsx'
import { showToast } from '../components/Toast.jsx'

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
    const step = target / (1800 / 16)
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
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTriggered(true); obs.disconnect() }
    }, { threshold: 0.4 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return triggered
}

export default function Hospitals() {
  const [searchQ, setSearchQ] = useState('')
  const [bloodFilter, setBloodFilter] = useState('')
  const [emergencyOnly, setEmergencyOnly] = useState(false)
  const statsRef = useRef(null)
  const triggered = useCounterObserver(statsRef)
  const partnerCount = useCounter(320, triggered)
  const emergencyCount = useCounter(48, triggered)
  const citiesCount = useCounter(28, triggered)
  useReveal()

  useEffect(() => { document.title = 'Hospitals & Blood Banks – BloodCare' }, [])

  const filtered = BC_HOSPITALS.filter(h => {
    if (searchQ && !h.name.toLowerCase().includes(searchQ.toLowerCase()) && !h.address.toLowerCase().includes(searchQ.toLowerCase())) return false
    if (bloodFilter && !Object.keys(h.blood).includes(bloodFilter)) return false
    if (emergencyOnly && !h.emergency) return false
    return true
  })

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  return (
    <>
      {/* PAGE HERO */}
      <div className="page-header" style={{ background: 'linear-gradient(135deg,#050d1a,#0a1a2d)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.2),transparent 70%)', top: -200, right: -100 }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(230,57,70,0.12),transparent 70%)', bottom: -80, left: 100 }} />
        <div className="reveal" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 800, margin: '0 auto', padding: 'calc(var(--nav-h) + 60px) 5% 70px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd', padding: '8px 20px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 700, marginBottom: 24 }}>
            🏥 Blood Banks & Partner Hospitals
          </div>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2rem,4vw,3.2rem)', marginBottom: 20 }}>
            Hospitals & <span>Blood Banks</span>
          </h1>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 36 }}>
            Real-time blood availability at <strong style={{ color: 'var(--accent)' }}>320+</strong> partner hospitals across India. Find the nearest blood bank instantly.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#hospital-list" className="btn btn-primary btn-lg">🔍 Find Nearby Hospital</a>
            <a href="#partner-cta" className="btn btn-glass btn-lg">Partner With Us</a>
          </div>
        </div>
      </div>

      {/* ANIMATED STATS ROW */}
      <section className="section section-alt" style={{ padding: '40px 5%' }}>
        <div ref={statsRef} className="hosp-stat-row reveal">
          {[
            { num: partnerCount, suffix: '+', label: '🏥 Partner Hospitals', color: 'var(--info)' },
            { num: emergencyCount, suffix: '', label: '🚨 Emergency Centers', color: 'var(--danger)' },
            { num: citiesCount, suffix: '+', label: '🏙️ Cities Covered', color: 'var(--success)' },
          ].map((s, i) => (
            <div key={i} className="hosp-stat">
              <span className="hosp-stat-num" style={{ color: s.color }}>{s.num}{s.suffix}</span>
              <div className="hosp-stat-label">{s.label}</div>
            </div>
          ))}
          <div className="hosp-stat">
            <span className="hosp-stat-num" style={{ color: 'var(--warning)' }}>24/7</span>
            <div className="hosp-stat-label">⏰ Always Available</div>
          </div>
        </div>
      </section>

      {/* HOW TO FIND */}
      <section className="section">
        <div className="section-header reveal">
          <span className="section-tag">How It Works</span>
          <h2 className="section-title">Find Blood in <span>3 Easy Steps</span></h2>
          <p className="section-sub">Locating available blood at a nearby hospital has never been easier.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }} className="reveal">
          {[
            { step: '01', icon: '🔍', title: 'Search Hospital', desc: 'Search by hospital name, city, or filter by blood group availability.' },
            { step: '02', icon: '📊', title: 'Check Availability', desc: 'See real-time blood stock levels — High, Medium, Low, or Critical.' },
            { step: '03', icon: '📞', title: 'Call & Confirm', desc: 'Call the hospital directly to confirm availability and reserve a slot.' },
          ].map(s => (
            <div key={s.step} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28, textAlign: 'center', boxShadow: 'var(--glass-shadow)', transition: 'all var(--transition)', position: 'relative' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ position: 'absolute', top: 16, right: 16, fontSize: '0.7rem', fontWeight: 900, color: 'var(--info)', opacity: 0.5, letterSpacing: '0.1em' }}>STEP {s.step}</div>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(59,130,246,0.08)', border: '2px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 18px' }}>{s.icon}</div>
              <h4 style={{ fontWeight: 700, marginBottom: 10 }}>{s.title}</h4>
              <p style={{ fontSize: '0.87rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FILTERS & HOSPITAL GRID */}
      <section id="hospital-list" className="section" style={{ paddingTop: 0 }}>
        <div className="section-header reveal">
          <span className="section-tag">All Hospitals</span>
          <h2 className="section-title">Find Your Nearest <span>Blood Bank</span></h2>
          <p className="section-sub">Filter by blood group availability or search by name and location.</p>
        </div>

        {/* FILTERS */}
        <div className="hosp-filters reveal">
          <div className="input-with-icon hosp-search">
            <span className="input-icon">🔍</span>
            <input type="text" className="input-field" id="hospSearch" placeholder="Search hospital or city…"
              value={searchQ} onChange={e => setSearchQ(e.target.value)} aria-label="Search hospitals" />
          </div>
          <select className="input-field" id="hospBlood" style={{ width: 'auto', minWidth: 150 }}
            value={bloodFilter} onChange={e => setBloodFilter(e.target.value)} aria-label="Filter by blood group">
            <option value="">All Blood Groups</option>
            {bloodGroups.map(bg => <option key={bg}>{bg}</option>)}
          </select>
          <label className="emergency-only-label" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
            <input type="checkbox" id="emergencyOnly" checked={emergencyOnly} onChange={e => setEmergencyOnly(e.target.checked)} style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
            🚨 Emergency Only
          </label>
        </div>

        {/* LEGEND */}
        <div className="legend-row reveal">
          {[
            { color: 'var(--success)', label: 'High Availability' },
            { color: 'var(--warning)', label: 'Medium / Low' },
            { color: 'var(--danger)', label: 'Critical / None' },
          ].map(l => (
            <div key={l.label} className="legend-item">
              <div className="legend-dot" style={{ background: l.color }} />{l.label}
            </div>
          ))}
          <div className="legend-item">
            <span className="badge badge-red">🚨 Emergency</span> 24/7 Emergency Center
          </div>
        </div>

        {/* RESULTS COUNT */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 24px' }}>
          <p className="text-muted">Showing <strong>{filtered.length}</strong> of <strong>{BC_HOSPITALS.length}</strong> hospitals</p>
          {(searchQ || bloodFilter || emergencyOnly) && (
            <button className="btn btn-outline btn-sm" onClick={() => { setSearchQ(''); setBloodFilter(''); setEmergencyOnly(false) }}>Clear Filters</button>
          )}
        </div>

        {/* HOSPITAL GRID */}
        {filtered.length > 0 ? (
          <div className="grid grid-3 reveal">
            {filtered.map(h => <HospitalCard key={h.id} h={h} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏥</div>
            <h3 style={{ marginBottom: 8 }}>No hospitals found</h3>
            <p className="text-muted" style={{ marginBottom: 20 }}>Try a different search term or blood group.</p>
            <button className="btn btn-primary" onClick={() => { setSearchQ(''); setBloodFilter(''); setEmergencyOnly(false) }}>Clear Filters</button>
          </div>
        )}
      </section>

      {/* BLOOD AVAILABILITY GUIDE */}
      <section className="section section-alt">
        <div className="section-header reveal">
          <span className="section-tag">Understanding Availability</span>
          <h2 className="section-title">What Do Availability <span>Levels Mean?</span></h2>
          <p className="section-sub">Our real-time system shows exactly how much blood is available at each hospital.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }} className="reveal">
          {[
            { level: 'High', icon: '🟢', color: 'var(--success)', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', desc: 'Sufficient stock. Transfusions can be performed without delay.' },
            { level: 'Medium', icon: '🟡', color: '#eab308', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.25)', desc: 'Adequate stock but may be running low. Call ahead to confirm.' },
            { level: 'Low', icon: '🟠', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', desc: 'Stock is limited. Urgent donors may be needed soon.' },
            { level: 'Critical', icon: '🔴', color: 'var(--danger)', bg: 'rgba(230,57,70,0.08)', border: 'rgba(230,57,70,0.25)', desc: 'Emergency shortage. Immediate donors required. Please respond.' },
          ].map(l => (
            <div key={l.level} style={{ background: l.bg, border: `1px solid ${l.border}`, borderRadius: 'var(--radius-lg)', padding: 24, transition: 'all var(--transition)' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>{l.icon}</div>
              <div style={{ fontWeight: 800, color: l.color, fontSize: '1.05rem', marginBottom: 8 }}>{l.level}</div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{l.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNER CTA */}
      <section id="partner-cta" className="section cta-section">
        <div className="cta-content reveal glass-card text-center">
          <div className="cta-icon" aria-hidden="true">🏥</div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Is Your Hospital <span>Listed?</span></h2>
          <p className="section-sub" style={{ marginBottom: 32 }}>Partner with BloodCare to connect with thousands of verified donors in real-time. Join our growing network today.</p>
          <div className="flex-center gap-16 flex-wrap">
            <button className="btn btn-primary btn-lg" onClick={() => showToast('Partnership request sent! We will contact you within 24 hours. 🏥', 'success', 5000)}>
              Partner With Us
            </button>
            <Link to="/emergency" className="btn btn-glass btn-lg">View Emergency Requests</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
