import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { BC_ELIGIBILITY, BC_FAQS, BC_TIPS } from '../data.js'
import Footer from '../components/Footer.jsx'

const COMPAT_DATA = {
  'O-': { donate: 'Everyone (Universal Donor) 🌍', receive: 'O- only' },
  'O+': { donate: 'O+, A+, B+, AB+', receive: 'O+, O-' },
  'A-': { donate: 'A-, A+, AB-, AB+', receive: 'A-, O-' },
  'A+': { donate: 'A+, AB+', receive: 'A+, A-, O+, O-' },
  'B-': { donate: 'B-, B+, AB-, AB+', receive: 'B-, O-' },
  'B+': { donate: 'B+, AB+', receive: 'B+, B-, O+, O-' },
  'AB-': { donate: 'AB-, AB+', receive: 'AB-, A-, B-, O-' },
  'AB+': { donate: 'AB+ only', receive: 'Everyone (Universal Recipient) 🌍' },
}

const COMPAT_TABLE = [
  { group: 'O-', donateTo: 'Everyone 🌍', receiveFrom: 'O- only', type: 'Universal Donor', typeClass: 'badge-red' },
  { group: 'O+', donateTo: 'O+, A+, B+, AB+', receiveFrom: 'O+, O-', type: 'Common', typeClass: 'badge-green' },
  { group: 'A-', donateTo: 'A-, A+, AB-, AB+', receiveFrom: 'A-, O-', type: 'Rare', typeClass: 'badge-blue' },
  { group: 'A+', donateTo: 'A+, AB+', receiveFrom: 'A+, A-, O+, O-', type: 'Common', typeClass: 'badge-green' },
  { group: 'B-', donateTo: 'B-, B+, AB-, AB+', receiveFrom: 'B-, O-', type: 'Rare', typeClass: 'badge-blue' },
  { group: 'B+', donateTo: 'B+, AB+', receiveFrom: 'B+, B-, O+, O-', type: 'Common', typeClass: 'badge-green' },
  { group: 'AB-', donateTo: 'AB-, AB+', receiveFrom: 'AB-, A-, B-, O-', type: 'Rare', typeClass: 'badge-orange' },
  { group: 'AB+', donateTo: 'AB+ only', receiveFrom: 'Receives From All 🌍', type: 'Universal Recipient', typeClass: 'badge-blue' },
]

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

function EduStatCard({ icon, target, suffix = '', label }) {
  const ref = useRef(null)
  const triggered = useCounterObserver(ref)
  const count = useCounter(target, triggered)
  return (
    <div className="edu-stat-card" ref={ref}>
      <div className="edu-stat-icon">{icon}</div>
      <div className="edu-stat-num">{count.toLocaleString()}{suffix}</div>
      <div className="edu-stat-label">{label}</div>
    </div>
  )
}

export default function Education() {
  const [activeTab, setActiveTab] = useState('compatibility')
  const [selectedBG, setSelectedBG] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  useReveal()

  useEffect(() => { document.title = 'Education Center – BloodCare' }, [])

  const bloodGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']

  const tabs = [
    { id: 'compatibility', label: '🩸 Compatibility' },
    { id: 'eligibility', label: '✅ Eligibility' },
    { id: 'process', label: '📋 Process' },
    { id: 'faq', label: '❓ FAQ' },
    { id: 'tips', label: '💡 Health Tips' },
  ]

  const processSteps = [
    { n: '1', title: '📝 Registration', time: '5 min', desc: 'Fill a short health questionnaire. Provide ID and consent. First-time donors register their profile in the system.' },
    { n: '2', title: '🩺 Health Check', time: '5 min', desc: 'A nurse checks your blood pressure, pulse, temperature, and hemoglobin level. This ensures you are safe to donate.' },
    { n: '3', title: '🩸 Blood Drawing', time: '8-10 min', desc: 'A sterile, single-use needle is inserted. One unit (~450 ml) of blood is collected. The process is virtually painless.' },
    { n: '4', title: '🧪 Sample Testing', time: '1-2 days', desc: 'Your blood is tested for blood group, infections (HIV, Hepatitis B/C, Syphilis). Only safe blood is used for transfusion.' },
    { n: '5', title: '🍪 Recovery', time: '10-15 min', desc: 'Rest, have refreshments. Your body naturally replenishes plasma within 24 hours and red cells within a few weeks.' },
    { n: '✓', title: '🎉 You just saved up to 3 lives!', time: 'Done', desc: 'You can donate whole blood again after 3 months. Track your donation history and earn badges on BloodCare.', highlight: true },
  ]

  const bloodTypeInfo = [
    { group: 'O-', color: '#e63946', rarity: 'Universal Donor', percent: '7%', desc: 'The most valuable blood type. Can donate to anyone!' },
    { group: 'O+', color: '#f4845f', rarity: 'Most Common', percent: '38%', desc: 'Most common type. Compatible with all Rh+ blood groups.' },
    { group: 'A+', color: '#e9c46a', rarity: 'Common', percent: '34%', desc: 'Second most common. Can donate to A+ and AB+ only.' },
    { group: 'B+', color: '#43aa8b', rarity: 'Common', percent: '9%', desc: 'Can donate to B+ and AB+. Can receive from B types and O types.' },
    { group: 'AB+', color: '#4361ee', rarity: 'Universal Recipient', percent: '3%', desc: 'Can receive from all blood types — the universal recipient!' },
    { group: 'AB-', color: '#7209b7', rarity: 'Rarest', percent: '1%', desc: 'Rarest blood type. Very high demand for plasma donation.' },
  ]

  return (
    <>
      {/* PAGE HERO */}
      <div className="edu-hero" style={{ background: 'linear-gradient(135deg,#050a1a,#0a1428)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(230,57,70,0.18),transparent 70%)', top: -150, right: -100 }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(67,170,139,0.12),transparent 70%)', bottom: -80, left: 100 }} />
        <div style={{ padding: 'calc(var(--nav-h) + 60px) 5% 70px', position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 800, margin: '0 auto' }} className="reveal">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.3)', color: '#ff9f9f', padding: '8px 20px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 700, marginBottom: 24 }}>
            📚 Education Center
          </div>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2rem,4vw,3.2rem)', marginBottom: 20 }}>
            Learn About <span>Blood Donation</span>
          </h1>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto 48px' }}>
            Everything you need to know — compatibility, eligibility, process, and more. Knowledge saves lives.
          </p>
          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, maxWidth: 700, margin: '0 auto' }}>
            {[
              { icon: '🩸', num: '8', suffix: ' types', label: 'Blood Groups' },
              { icon: '💉', num: '1', suffix: ' in 7', label: 'Need Transfusion' },
              { icon: '❤️', num: '3', suffix: ' lives', label: 'Per Donation' },
              { icon: '⏱️', num: '30', suffix: ' min', label: 'Total Time' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', padding: '18px 10px', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>{s.num}<span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>{s.suffix}</span></div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BLOOD TYPE OVERVIEW CARDS */}
      <section className="section section-alt">
        <div className="section-header reveal">
          <span className="section-tag">Blood Types</span>
          <h2 className="section-title">Know Your <span>Blood Type</span></h2>
          <p className="section-sub">Each blood type has unique donor and recipient compatibilities. Learn what makes yours special.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }} className="reveal">
          {bloodTypeInfo.map(bt => (
            <div key={bt.group} style={{ background: 'var(--surface)', border: `1px solid ${bt.color}30`, borderTop: `4px solid ${bt.color}`, borderRadius: 'var(--radius)', padding: 24, transition: 'all var(--transition)', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${bt.color}20`, border: `2px solid ${bt.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.95rem', color: bt.color }}>{bt.group}</div>
                <span style={{ background: `${bt.color}15`, color: bt.color, border: `1px solid ${bt.color}30`, padding: '4px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700 }}>{bt.percent}</span>
              </div>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6, color: bt.color }}>{bt.rarity}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{bt.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TABBED CONTENT */}
      <section className="section" style={{ paddingTop: 50 }}>
        {/* TABS */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36, borderBottom: '2px solid var(--border)' }}>
          {tabs.map(t => (
            <div key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding: '12px 24px', fontWeight: 600, fontSize: '0.9rem', color: activeTab === t.id ? 'var(--primary)' : 'var(--text-2)', cursor: 'pointer', borderBottom: activeTab === t.id ? '3px solid var(--primary)' : '3px solid transparent', marginBottom: -2, transition: 'all var(--transition)', borderRadius: '4px 4px 0 0', background: activeTab === t.id ? 'rgba(230,57,70,0.05)' : 'transparent' }}>
              {t.label}
            </div>
          ))}
        </div>

        {/* COMPATIBILITY */}
        {activeTab === 'compatibility' && (
          <div>
            <div style={{ textAlign: 'left', marginBottom: 28 }}>
              <h2 className="section-title" style={{ fontSize: '1.6rem' }}>Interactive <span>Compatibility Checker</span></h2>
              <p className="section-sub" style={{ margin: 0, textAlign: 'left' }}>Select your blood group to see who you can donate to and receive from.</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
              {bloodGroups.map(bg => (
                <button key={bg} onClick={() => setSelectedBG(selectedBG === bg ? null : bg)}
                  style={{ width: 64, height: 64, borderRadius: '50%', background: selectedBG === bg ? 'var(--primary)' : 'var(--surface)', border: `2px solid ${selectedBG === bg ? 'var(--primary)' : 'var(--border)'}`, fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: 'all var(--transition)', color: selectedBG === bg ? '#fff' : 'inherit', transform: selectedBG === bg ? 'scale(1.15)' : 'scale(1)', boxShadow: selectedBG === bg ? '0 0 20px var(--primary-glow)' : 'var(--glass-shadow)' }}>
                  {bg}
                </button>
              ))}
            </div>
            {selectedBG && (
              <div style={{ background: 'linear-gradient(135deg,var(--surface),var(--surface-2))', borderRadius: 'var(--radius-lg)', padding: 32, border: '1px solid var(--border)', marginBottom: 36, boxShadow: 'var(--glass-shadow)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem', color: '#fff', boxShadow: '0 0 24px var(--primary-glow)' }}>{selectedBG}</div>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Blood Group {selectedBG}</h4>
                    <p className="text-muted text-sm">Compatibility information</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div style={{ background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.2)', borderRadius: 'var(--radius)', padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: '1.5rem' }}>➡️</span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Can Donate To</p>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>{COMPAT_DATA[selectedBG].donate}</p>
                  </div>
                  <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius)', padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: '1.5rem' }}>⬅️</span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Can Receive From</p>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--success)' }}>{COMPAT_DATA[selectedBG].receive}</p>
                  </div>
                </div>
                <Link to={`/donors?blood=${encodeURIComponent(selectedBG)}`} className="btn btn-primary btn-sm">🔍 Find {selectedBG} Donors →</Link>
              </div>
            )}
            <div className="table-container" style={{ marginTop: 12, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--glass-shadow)' }}>
                <thead>
                  <tr>
                    {['Blood Group', 'Can Donate To', 'Can Receive From', 'Type'].map(h => (
                      <th key={h} style={{ background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', color: '#fff', padding: '16px 20px', textAlign: 'left', fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPAT_TABLE.map((row, i) => (
                    <tr key={row.group} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)' }}>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                        <div className="blood-badge" style={{ display: 'inline-flex', width: 36, height: 36, fontSize: '0.72rem' }}>{row.group}</div>
                      </td>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-2)' }}>{row.donateTo}</td>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-2)' }}>{row.receiveFrom}</td>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}><span className={`badge ${row.typeClass}`}>{row.type}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ELIGIBILITY */}
        {activeTab === 'eligibility' && (
          <div>
            <div style={{ textAlign: 'left', marginBottom: 28 }}>
              <h2 className="section-title" style={{ fontSize: '1.6rem' }}>Donation <span>Eligibility</span></h2>
              <p className="section-sub" style={{ margin: '0 0 24px', textAlign: 'left' }}>Check if you're eligible to donate blood and help save lives today.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 24, marginBottom: 32 }}>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 8 }}>✅ Eligible If You Are</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {BC_ELIGIBILITY.filter(e => e.ok).map(e => (
                    <div key={e.label} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderLeft: '4px solid var(--success)', borderRadius: 'var(--radius)', padding: '14px 18px', fontSize: '0.9rem', fontWeight: 500 }}>
                      <span style={{ fontSize: '1.3rem' }}>{e.icon}</span><span>{e.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>❌ Not Eligible If You Have</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {BC_ELIGIBILITY.filter(e => !e.ok).map(e => (
                    <div key={e.label} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(230,57,70,0.06)', border: '1px solid rgba(230,57,70,0.2)', borderLeft: '4px solid var(--danger)', borderRadius: 'var(--radius)', padding: '14px 18px', fontSize: '0.9rem', fontWeight: 500 }}>
                      <span style={{ fontSize: '1.3rem' }}>{e.icon}</span><span>{e.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="glass-card" style={{ padding: 28, background: 'rgba(230,57,70,0.04)', border: '1px solid rgba(230,57,70,0.15)' }}>
              <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>⚠️ Important Notes</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Always consult with medical staff at the donation center for your specific situation.',
                  'Certain medications may temporarily disqualify you — inform the staff of any drugs you are taking.',
                  'Travelers to malaria-endemic regions must wait 12 months before donating.',
                  'Hemoglobin level is checked before every donation to ensure donor safety.'].map(note => (
                  <li key={note} className="text-muted" style={{ fontSize: '0.9rem', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--primary)', flexShrink: 0 }}>•</span> {note}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center" style={{ marginTop: 36 }}>
              <Link to="/register" className="btn btn-primary btn-lg">I'm Eligible — Register Now →</Link>
            </div>
          </div>
        )}

        {/* PROCESS */}
        {activeTab === 'process' && (
          <div>
            <div style={{ textAlign: 'left', marginBottom: 36 }}>
              <h2 className="section-title" style={{ fontSize: '1.6rem' }}>Donation <span>Process</span></h2>
              <p className="section-sub" style={{ margin: 0, textAlign: 'left' }}>From registration to recovery — here's everything that happens during a blood donation. Total time: ~30-45 minutes.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
              {processSteps.map((step, i) => (
                <div key={i} style={{ background: step.highlight ? 'linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.04))' : 'var(--surface)', border: `1px solid ${step.highlight ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--glass-shadow)', position: 'relative', overflow: 'hidden', transition: 'all var(--transition)' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: step.highlight ? 'var(--success)' : 'linear-gradient(135deg,var(--primary),var(--primary-dark))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', boxShadow: step.highlight ? '0 4px 12px rgba(34,197,94,0.3)' : '0 4px 12px var(--primary-glow)' }}>{step.n}</div>
                    <span style={{ background: 'var(--surface-2)', color: 'var(--text-2)', padding: '4px 12px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600 }}>{step.time}</span>
                  </div>
                  <h4 style={{ fontWeight: 700, marginBottom: 10, fontSize: '1rem' }}>{step.title}</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-2)', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center" style={{ marginTop: 40 }}>
              <Link to="/register" className="btn btn-primary btn-lg">Ready to Donate? Register Now →</Link>
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div>
            <div style={{ textAlign: 'left', marginBottom: 28 }}>
              <h2 className="section-title" style={{ fontSize: '1.6rem' }}>Frequently Asked <span>Questions</span></h2>
              <p className="section-sub" style={{ margin: '0 0 8px', textAlign: 'left' }}>Got questions? We have answers. Everything you need to know about blood donation.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {BC_FAQS.map((f, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', transition: 'all var(--transition)', boxShadow: openFaq === i ? 'var(--glass-shadow)' : 'none' }}>
                  <div onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', cursor: 'pointer', fontWeight: 600, transition: 'all var(--transition)', background: openFaq === i ? 'rgba(230,57,70,0.04)' : 'transparent', userSelect: 'none' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                      {f.q}
                    </span>
                    <span style={{ transition: 'transform 0.3s', color: 'var(--primary)', fontSize: '1.4rem', fontWeight: 300, flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                  </div>
                  <div style={{ padding: openFaq === i ? '0 24px 20px 64px' : '0 24px', maxHeight: openFaq === i ? 200 : 0, overflow: 'hidden', transition: 'all 0.4s ease', color: 'var(--text-2)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    {f.a}
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-card" style={{ marginTop: 40, padding: 32, textAlign: 'center', background: 'rgba(230,57,70,0.04)', border: '1px solid rgba(230,57,70,0.15)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🤔</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Still have questions?</h3>
              <p className="text-muted" style={{ marginBottom: 20 }}>Our AI assistant BloodBot can answer any blood donation question instantly.</p>
              <Link to="/" className="btn btn-primary">Chat with BloodBot →</Link>
            </div>
          </div>
        )}

        {/* TIPS */}
        {activeTab === 'tips' && (
          <div>
            <div style={{ textAlign: 'left', marginBottom: 28 }}>
              <h2 className="section-title" style={{ fontSize: '1.6rem' }}>Health <span>Tips</span></h2>
              <p className="section-sub" style={{ margin: '0 0 8px', textAlign: 'left' }}>Prepare well and recover faster with these expert-recommended tips.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
              {BC_TIPS.map((t, i) => (
                <div key={t.tip} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--glass-shadow)', transition: 'all var(--transition)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 'var(--radius)', background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>{t.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tip #{i + 1}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.7 }}>{t.tip}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }}>
              {[
                { icon: '📅', title: 'Before Donation', color: '#4361ee', tips: ['Eat iron-rich foods', 'Drink extra water', 'Sleep well'] },
                { icon: '🩸', title: 'During Donation', color: '#e63946', tips: ['Stay relaxed', 'Breathe normally', 'Stay still'] },
                { icon: '✅', title: 'After Donation', color: '#22c55e', tips: ['Rest 15 minutes', 'Drink fluids', 'Avoid heavy lifting'] },
              ].map(phase => (
                <div key={phase.title} style={{ background: 'var(--surface)', border: `1px solid ${phase.color}25`, borderTop: `4px solid ${phase.color}`, borderRadius: 'var(--radius)', padding: 24 }}>
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>{phase.icon}</div>
                  <h4 style={{ fontWeight: 700, color: phase.color, marginBottom: 12 }}>{phase.title}</h4>
                  {phase.tips.map(tip => (
                    <div key={tip} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: '0.88rem', color: 'var(--text-2)' }}>
                      <span style={{ color: phase.color, fontWeight: 700 }}>→</span> {tip}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* IMPACT STATS SECTION */}
      <section className="section section-alt">
        <div className="section-header reveal">
          <span className="section-tag">Why It Matters</span>
          <h2 className="section-title">Blood Donation <span>By the Numbers</span></h2>
          <p className="section-sub">Every statistic represents a real human life. Your donation matters more than you know.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 20 }} className="reveal">
          {[
            { icon: '🩸', num: 4.5, suffix: 'M', label: 'Donations needed daily in India' },
            { icon: '💉', num: 3, suffix: '', label: 'Lives saved per donation' },
            { icon: '⏰', num: 2, suffix: ' sec', label: 'Someone needs blood every 2 seconds' },
            { icon: '🌍', num: 118.4, suffix: 'M', label: 'Blood donations collected globally' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28, textAlign: 'center', boxShadow: 'var(--glass-shadow)', transition: 'all var(--transition)' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>{s.num}{s.suffix}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-2)', marginTop: 6, lineHeight: 1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="cta-content reveal glass-card text-center">
          <div className="cta-icon" aria-hidden="true">🎓</div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Ready to <span>Take Action?</span></h2>
          <p className="section-sub" style={{ marginBottom: 32 }}>Now that you know everything about blood donation, take the next step and become a life-saver today.</p>
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
