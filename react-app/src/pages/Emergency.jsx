import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { BC_EMERGENCIES } from '../data.js'
import { EmergencyCard } from '../components/Cards.jsx'
import { showToast } from '../components/Toast.jsx'
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
    const step = target / (1500 / 16)
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

export default function Emergency() {
  const [urgencyFilter, setUrgencyFilter] = useState('')
  const [bloodFilter, setBloodFilter] = useState('')
  const [form, setForm] = useState({ patient: '', blood: '', hospital: '', city: '', units: '', urgency: '', contact: '', notes: '' })
  const statsRef = useRef(null)
  const triggered = useCounterObserver(statsRef)
  const criticalCount = useCounter(BC_EMERGENCIES.filter(e => e.urgency === 'critical').length, triggered)
  const highCount = useCounter(BC_EMERGENCIES.filter(e => e.urgency === 'high').length, triggered)
  const mediumCount = useCounter(BC_EMERGENCIES.filter(e => e.urgency === 'medium').length, triggered)
  const totalCount = useCounter(BC_EMERGENCIES.length, triggered)
  useReveal()

  useEffect(() => { document.title = 'Emergency Requests – BloodCare' }, [])

  const filtered = BC_EMERGENCIES.filter(e => {
    if (urgencyFilter && e.urgency !== urgencyFilter) return false
    if (bloodFilter && e.blood !== bloodFilter) return false
    return true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    showToast('🚨 Emergency request posted! Nearby donors are being alerted.', 'success', 5000)
    setForm({ patient: '', blood: '', hospital: '', city: '', units: '', urgency: '', contact: '', notes: '' })
  }

  const bloodGroups = ['O-', 'B+', 'AB-', 'A+', 'O+', 'A-', 'B-', 'AB+']

  return (
    <>
      {/* PAGE HERO */}
      <div className="page-header" style={{ background: 'linear-gradient(135deg,#1a0505,#2d0a0a)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(230,57,70,0.25),transparent 70%)', top: -200, right: -100 }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,100,100,0.1),transparent 70%)', bottom: -100, left: 50 }} />
        <div className="reveal" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 800, margin: '0 auto', padding: 'calc(var(--nav-h) + 60px) 5% 70px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(230,57,70,0.2)', border: '1px solid rgba(230,57,70,0.4)', color: '#ff9f9f', padding: '8px 20px', borderRadius: 50, fontSize: '0.9rem', fontWeight: 700, marginBottom: 24 }}>
            <span className="status-dot emergency" /> LIVE EMERGENCY CENTER
          </div>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2rem,4vw,3.2rem)', marginBottom: 20 }}>
            Emergency Blood <span>Requests</span>
          </h1>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 36 }}>
            Critical patients need blood right now. Your response can save a life in the next few minutes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#emergency-form" className="btn btn-primary btn-lg">🚨 Post Emergency Request</a>
            <a href="#emergency-list" className="btn btn-glass btn-lg">View All Requests</a>
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <section className="section section-alt" style={{ padding: '40px 5%' }}>
        <div ref={statsRef} className="em-stat-row reveal">
          {[
            { count: criticalCount, label: '🔴 Critical', color: 'var(--danger)', bg: 'rgba(230,57,70,0.08)', border: 'rgba(230,57,70,0.2)' },
            { count: highCount, label: '🟠 High Priority', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
            { count: mediumCount, label: '🟡 Medium', color: '#eab308', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.2)' },
            { count: totalCount, label: 'Total Requests', color: 'var(--info)', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)' },
          ].map((s, i) => (
            <div key={i} className="em-stat" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <span className="em-stat-num" style={{ color: s.color }}>{s.count}</span>
              <div className="em-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="section-header reveal">
          <span className="section-tag">How It Works</span>
          <h2 className="section-title">Respond to an <span>Emergency</span></h2>
          <p className="section-sub">Three simple steps to save a life right now.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }} className="reveal">
          {[
            { step: '01', icon: '👁️', title: 'See the Request', desc: 'Browse active emergency requests filtered by blood group and urgency level.' },
            { step: '02', icon: '📞', title: 'Call Immediately', desc: 'Tap "Respond Now" to directly call the hospital and confirm your availability.' },
            { step: '03', icon: '🩸', title: 'Save a Life', desc: 'Arrive at the hospital and donate blood. You will have saved up to 3 lives.' },
          ].map(s => (
            <div key={s.step} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28, textAlign: 'center', boxShadow: 'var(--glass-shadow)', transition: 'all var(--transition)', position: 'relative' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ position: 'absolute', top: 16, right: 16, fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', opacity: 0.4, letterSpacing: '0.1em' }}>STEP {s.step}</div>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(230,57,70,0.1)', border: '2px solid rgba(230,57,70,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 18px' }}>{s.icon}</div>
              <h4 style={{ fontWeight: 700, marginBottom: 10 }}>{s.title}</h4>
              <p style={{ fontSize: '0.87rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FILTERS */}
      <section id="emergency-list" className="section" style={{ paddingTop: 0 }}>
        <div className="section-header reveal" style={{ marginBottom: 24 }}>
          <span className="section-tag" style={{ background: 'rgba(230,57,70,0.15)', color: 'var(--danger)' }}>🚨 Live Requests</span>
          <h2 className="section-title">Active Emergency <span>Requests</span></h2>
          <p className="section-sub">Critical patients need blood right now. Respond immediately and save a life.</p>
        </div>
        <div className="em-filters reveal">
          {[
            { label: 'All Requests', val: '' },
            { label: '🔴 Critical', val: 'critical' },
            { label: '🟠 High', val: 'high' },
            { label: '🟡 Medium', val: 'medium' },
          ].map(c => (
            <span key={c.val} className={`chip${urgencyFilter === c.val ? ' active' : ''}`}
              onClick={() => setUrgencyFilter(c.val)}>{c.label}</span>
          ))}
          <span style={{ width: 1, height: 24, background: 'var(--border)', display: 'inline-block', margin: '0 4px', verticalAlign: 'middle' }} />
          <span className={`chip${bloodFilter === '' ? ' active' : ''}`} onClick={() => setBloodFilter('')}>All Blood Groups</span>
          {bloodGroups.map(bg => (
            <span key={bg} className={`chip${bloodFilter === bg ? ' active' : ''}`}
              onClick={() => setBloodFilter(bg)}>{bg}</span>
          ))}
        </div>

        {/* CARDS */}
        {filtered.length > 0 ? (
          <div className="grid grid-3 reveal" style={{ marginTop: 28 }}>
            {filtered.map(em => <EmergencyCard key={em.id} em={em} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
            <h3 style={{ marginBottom: 8 }}>No requests match this filter</h3>
            <p className="text-muted">Try selecting a different blood group or urgency level.</p>
            <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => { setUrgencyFilter(''); setBloodFilter('') }}>Clear Filters</button>
          </div>
        )}
      </section>

      {/* POST REQUEST FORM */}
      <section id="emergency-form" className="section section-alt">
        <div className="section-header reveal">
          <span className="section-tag">Need Blood?</span>
          <h2 className="section-title">Post an <span>Emergency Request</span></h2>
          <p className="section-sub">Fill in the details and our network will immediately alert matching donors in your area.</p>
        </div>
        <div className="reveal" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '40px 36px', border: '1px solid var(--border)', boxShadow: 'var(--glass-shadow)', maxWidth: 640, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(230,57,70,0.1),transparent 70%)', top: -60, right: -60 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>📋</div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1.2rem' }}>Emergency Request Form</h3>
              <p className="text-muted text-sm">Donors in your area will be alerted instantly</p>
            </div>
          </div>
          <form id="emergencyForm" onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="input-group">
                <label className="input-label" htmlFor="req-patient">Patient Name *</label>
                <input type="text" className="input-field" id="req-patient" placeholder="Patient's name" required
                  value={form.patient} onChange={e => setForm(f => ({ ...f, patient: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="req-blood">Blood Group Needed *</label>
                <select className="input-field" id="req-blood" required value={form.blood} onChange={e => setForm(f => ({ ...f, blood: e.target.value }))}>
                  <option value="">Select group</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg}>{bg}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="req-hospital">Hospital Name *</label>
                <input type="text" className="input-field" id="req-hospital" placeholder="Hospital name" required
                  value={form.hospital} onChange={e => setForm(f => ({ ...f, hospital: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="req-city">City *</label>
                <input type="text" className="input-field" id="req-city" placeholder="City" required
                  value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="req-units">Units Needed *</label>
                <input type="number" className="input-field" id="req-units" placeholder="e.g. 2" min="1" max="10" required
                  value={form.units} onChange={e => setForm(f => ({ ...f, units: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="req-urgency">Urgency Level *</label>
                <select className="input-field" id="req-urgency" required value={form.urgency} onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))}>
                  <option value="">Select urgency</option>
                  <option value="critical">🔴 Critical</option>
                  <option value="high">🟠 High</option>
                  <option value="medium">🟡 Medium</option>
                </select>
              </div>
              <div className="input-group" style={{ gridColumn: '1/-1' }}>
                <label className="input-label" htmlFor="req-contact">Contact Number *</label>
                <div className="input-with-icon">
                  <span className="input-icon">📞</span>
                  <input type="tel" className="input-field" id="req-contact" placeholder="+91 XXXXX XXXXX" required
                    value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
                </div>
              </div>
              <div className="input-group" style={{ gridColumn: '1/-1' }}>
                <label className="input-label" htmlFor="req-notes">Additional Notes</label>
                <textarea className="input-field" id="req-notes" rows="3" placeholder="Any additional information…" style={{ resize: 'vertical' }}
                  value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}></textarea>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 20, height: 54, fontSize: '1rem', fontWeight: 700 }}>
              🚨 Post Emergency Request
            </button>
            <p className="text-center text-muted text-sm" style={{ marginTop: 12 }}>Your request will be visible to all nearby donors immediately.</p>
          </form>
        </div>
      </section>

      {/* SAFETY TIPS */}
      <section className="section">
        <div className="section-header reveal">
          <span className="section-tag">Safety First</span>
          <h2 className="section-title">Before You <span>Respond</span></h2>
          <p className="section-sub">Important guidelines to follow when responding to emergency requests.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }} className="reveal">
          {[
            { icon: '✅', title: 'Confirm Eligibility', desc: 'Make sure you meet basic donation requirements: age 18-65, weight ≥50kg, good health.', color: 'var(--success)' },
            { icon: '⏰', title: 'Be Prompt', desc: 'Emergency requests are time-critical. Respond and arrive as quickly as safely possible.', color: 'var(--warning)' },
            { icon: '📞', title: 'Confirm First', desc: 'Always call the hospital before leaving to confirm the request is still active.', color: 'var(--info)' },
            { icon: '🏥', title: 'Go to Hospital', desc: 'Donation must happen at the hospital. Never transfer blood outside a medical facility.', color: 'var(--danger)' },
          ].map(tip => (
            <div key={tip.title} style={{ background: 'var(--surface)', border: `1px solid ${tip.color}25`, borderLeft: `4px solid ${tip.color}`, borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--glass-shadow)' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{tip.icon}</div>
              <h4 style={{ fontWeight: 700, color: tip.color, marginBottom: 8 }}>{tip.title}</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="cta-content reveal glass-card text-center">
          <div className="cta-icon" aria-hidden="true">❤️</div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Be a <span>First Responder</span></h2>
          <p className="section-sub" style={{ marginBottom: 32 }}>Register as a donor today and get notified instantly when someone in your city needs your blood group.</p>
          <div className="flex-center gap-16 flex-wrap">
            <Link to="/register" className="btn btn-primary btn-lg">Register as Donor</Link>
            <Link to="/donors" className="btn btn-glass btn-lg">Find a Donor</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
