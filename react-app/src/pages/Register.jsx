import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { showToast } from '../components/Toast.jsx'
import Footer from '../components/Footer.jsx'

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      }),
      { threshold: 0.05 }
    )
    const id = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible)').forEach(el => observer.observe(el))
    }, 30)
    return () => { clearTimeout(id); observer.disconnect() }
  }, [])
}

export default function Register() {
  const [selectedBG, setSelectedBG] = useState('')
  const [registered, setRegistered] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState({
    fname: '', lname: '', email: '', phone: '',
    age: '', gender: '', city: '', lastdonation: '',
    avail: 'available', consent: false
  })

  useReveal()
  useEffect(() => { document.title = 'Register as Donor – BloodCare' }, [])

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.fname || !form.phone || !form.city || !selectedBG || !form.consent) {
      showToast('Please fill in all required fields and select a blood group.', 'error'); return
    }
    setTimeout(() => {
      setRegistered(true)
      showToast('🎉 Registration successful! Welcome to BloodCare!', 'success', 5000)
    }, 600)
  }

  const benefits = [
    { icon: '🩸', text: 'Save up to 3 lives per donation' },
    { icon: '🏆', text: 'Earn badges and recognition' },
    { icon: '📱', text: 'Get notified for nearby requests' },
    { icon: '🏥', text: 'Priority access at partner hospitals' },
    { icon: '👥', text: 'Join a community of 8,500+ donors' },
    { icon: '📊', text: 'Track your donation impact over time' },
  ]

  const steps = [
    { n: 1, label: 'Personal Info' },
    { n: 2, label: 'Blood & Health' },
    { n: 3, label: 'Confirm' },
  ]

  return (
    <main className="register-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh', paddingTop: 'var(--nav-h)' }}>

      {/* LEFT PANEL */}
      <div style={{ background: 'linear-gradient(135deg,#0d0d1a,#1a0a14)', padding: '60px 5%', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', width: 400, height: 400, background: 'radial-gradient(circle,rgba(230,57,70,0.25),transparent 70%)', top: -100, left: -100, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, background: 'radial-gradient(circle,rgba(255,107,107,0.15),transparent 70%)', bottom: -80, right: -80, borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 1, animation: 'slideInLeft 0.7s ease both' }}>
          <div style={{ fontSize: '3rem', marginBottom: 20, animation: 'heartbeat 1.5s infinite' }}>❤️</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
            Become a{' '}
            <span style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Blood Donor
            </span>{' '}
            Hero
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 36, fontSize: '0.95rem' }}>
            Your single donation can save up to 3 lives. It takes just 30 minutes. Register now and be part of India's largest blood donor network.
          </p>

          {/* Benefits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
            {benefits.map(b => (
              <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(230,57,70,0.2)', border: '1px solid rgba(230,57,70,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{b.icon}</div>
                {b.text}
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { val: '8,500+', lbl: 'Active Donors' },
              { val: '12,400', lbl: 'Lives Saved' },
              { val: '30 min', lbl: 'Per Donation' },
            ].map(s => (
              <div key={s.lbl} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius)', padding: '14px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent)' }}>{s.val}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ background: 'var(--bg)', padding: '60px 5%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', animation: 'slideInRight 0.7s ease both' }}>
        <div style={{ width: '100%', maxWidth: 500 }}>
          {!registered ? (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 800, marginBottom: 6 }}>Create Donor Profile</h2>
              <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: 32 }}>
                Already a member?{' '}
                <Link to="/donors" style={{ color: 'var(--primary)', fontWeight: 600 }}>Find donors →</Link>
              </p>

              {/* STEP INDICATOR */}
              <div style={{ display: 'flex', gap: 0, marginBottom: 32, alignItems: 'center' }}>
                {steps.map((s, i) => (
                  <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: currentStep >= s.n ? 'var(--primary)' : 'var(--surface-2)', border: `2px solid ${currentStep >= s.n ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: currentStep >= s.n ? '#fff' : 'var(--text-2)', transition: 'all var(--transition)', boxShadow: currentStep >= s.n ? '0 0 12px var(--primary-glow)' : 'none' }}>
                        {currentStep > s.n ? '✓' : s.n}
                      </div>
                      <span style={{ fontSize: '0.68rem', color: currentStep >= s.n ? 'var(--primary)' : 'var(--text-2)', fontWeight: 600, whiteSpace: 'nowrap' }}>{s.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: currentStep > s.n ? 'var(--primary)' : 'var(--border)', transition: 'background var(--transition)', margin: '-14px 8px 0' }} />
                    )}
                  </div>
                ))}
              </div>

              <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={handleSubmit} noValidate>

                {/* STEP 1 — Personal Info */}
                <div style={{ display: currentStep === 1 ? 'flex' : 'none', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="input-group">
                      <label className="input-label" htmlFor="reg-fname">First Name *</label>
                      <input type="text" className="input-field" id="reg-fname" placeholder="Rahul" required
                        value={form.fname} onChange={e => setForm(f => ({ ...f, fname: e.target.value }))} />
                    </div>
                    <div className="input-group">
                      <label className="input-label" htmlFor="reg-lname">Last Name *</label>
                      <input type="text" className="input-field" id="reg-lname" placeholder="Kumar" required
                        value={form.lname} onChange={e => setForm(f => ({ ...f, lname: e.target.value }))} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="reg-email">Email Address *</label>
                    <div className="input-with-icon">
                      <span className="input-icon">📧</span>
                      <input type="email" className="input-field" id="reg-email" placeholder="you@example.com" required
                        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="reg-phone">Phone Number *</label>
                    <div className="input-with-icon">
                      <span className="input-icon">📞</span>
                      <input type="tel" className="input-field" id="reg-phone" placeholder="+91 98765 43210" required
                        value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="input-group">
                      <label className="input-label" htmlFor="reg-age">Age *</label>
                      <input type="number" className="input-field" id="reg-age" placeholder="25" min="18" max="65" required
                        value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
                    </div>
                    <div className="input-group">
                      <label className="input-label" htmlFor="reg-gender">Gender</label>
                      <select className="input-field" id="reg-gender" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                        <option value="">Select</option>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="reg-city">City *</label>
                    <div className="input-with-icon">
                      <span className="input-icon">📍</span>
                      <input type="text" className="input-field" id="reg-city" placeholder="Mumbai" required
                        value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary btn-lg w-full" style={{ marginTop: 4 }}
                    onClick={() => {
                      if (!form.fname || !form.phone || !form.city) { showToast('Please fill in all required fields.', 'error'); return }
                      setCurrentStep(2)
                    }}>
                    Continue →
                  </button>
                </div>

                {/* STEP 2 — Blood & Health */}
                <div style={{ display: currentStep === 2 ? 'flex' : 'none', flexDirection: 'column', gap: 16 }}>
                  <div className="input-group">
                    <label className="input-label">Blood Group *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                      {bloodGroups.map(bg => (
                        <div key={bg} onClick={() => setSelectedBG(bg)}
                          style={{ padding: '14px 8px', border: `2px solid ${selectedBG === bg ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', textAlign: 'center', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', transition: 'all var(--transition)', background: selectedBG === bg ? 'rgba(230,57,70,0.1)' : 'transparent', color: selectedBG === bg ? 'var(--primary)' : 'inherit', transform: selectedBG === bg ? 'scale(1.05)' : 'scale(1)', boxShadow: selectedBG === bg ? '0 0 12px var(--primary-glow)' : 'none' }}>
                          {bg}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="reg-lastdonation">Last Donation Date</label>
                    <input type="date" className="input-field" id="reg-lastdonation"
                      value={form.lastdonation} onChange={e => setForm(f => ({ ...f, lastdonation: e.target.value }))} />
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="reg-avail">Availability Status</label>
                    <select className="input-field" id="reg-avail" value={form.avail} onChange={e => setForm(f => ({ ...f, avail: e.target.value }))}>
                      <option value="available">✅ Available to Donate</option>
                      <option value="unavailable">⏸️ Not Available Currently</option>
                    </select>
                  </div>
                  {/* Health Checklist */}
                  <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: 20 }}>
                    <p style={{ fontWeight: 600, marginBottom: 12, fontSize: '0.9rem' }}>✅ I confirm that I meet the following requirements:</p>
                    {['I am between 18–65 years of age', 'I weigh at least 50 kg', 'I am in good general health', 'I have not donated blood in the last 3 months'].map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: '0.85rem', color: 'var(--text-2)' }}>
                        <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓</span> {item}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setCurrentStep(1)}>← Back</button>
                    <button type="button" className="btn btn-primary" style={{ flex: 2 }}
                      onClick={() => {
                        if (!selectedBG) { showToast('Please select your blood group.', 'error'); return }
                        setCurrentStep(3)
                      }}>
                      Continue →
                    </button>
                  </div>
                </div>

                {/* STEP 3 — Review & Confirm */}
                <div style={{ display: currentStep === 3 ? 'flex' : 'none', flexDirection: 'column', gap: 16 }}>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                    <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>📋 Review Your Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.88rem' }}>
                      {[
                        { lbl: 'Full Name', val: `${form.fname} ${form.lname}` || '—' },
                        { lbl: 'Email', val: form.email || '—' },
                        { lbl: 'Phone', val: form.phone || '—' },
                        { lbl: 'Age', val: form.age || '—' },
                        { lbl: 'City', val: form.city || '—' },
                        { lbl: 'Blood Group', val: selectedBG || '—' },
                      ].map(info => (
                        <div key={info.lbl} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-2)', marginBottom: 2 }}>{info.lbl}</div>
                          <div style={{ fontWeight: 600, color: info.lbl === 'Blood Group' ? 'var(--primary)' : 'inherit' }}>{info.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.88rem', color: 'var(--text-2)', cursor: 'pointer', lineHeight: 1.6 }}>
                    <input type="checkbox" id="reg-consent" style={{ marginTop: 3, accentColor: 'var(--primary)', width: 16, height: 16, flexShrink: 0 }}
                      checked={form.consent} onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))} required />
                    <span>I confirm the information provided is accurate and consent to being contacted by patients in need of blood donation. I am in good health and eligible to donate.</span>
                  </label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setCurrentStep(2)}>← Back</button>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 2, height: 54 }}>🩸 Register as Donor</button>
                  </div>
                  <p className="text-center text-muted text-sm">
                    By registering, you agree to our{' '}
                    <a href="#" style={{ color: 'var(--primary)' }}>Terms of Service</a> and{' '}
                    <a href="#" style={{ color: 'var(--primary)' }}>Privacy Policy</a>.
                  </p>
                </div>
              </form>
            </>
          ) : (
            /* SUCCESS STATE */
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg,var(--success),#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(34,197,94,0.4)', animation: 'heartbeat 2s infinite' }}>🎉</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>
                You're a <span style={{ color: 'var(--primary)' }}>BloodCare Hero!</span>
              </h2>
              <p className="text-muted" style={{ marginBottom: 8, lineHeight: 1.7 }}>
                Your donor profile has been created successfully.<br />
                You'll be notified when someone in your city needs <strong style={{ color: 'var(--primary)' }}>{selectedBG}</strong> blood.
              </p>
              <p className="text-muted" style={{ marginBottom: 32 }}>Check your email for confirmation and your digital donor card.</p>

              {/* Achievement unlocked */}
              <div style={{ background: 'linear-gradient(135deg,rgba(230,57,70,0.08),rgba(255,107,107,0.06))', border: '1px solid rgba(230,57,70,0.2)', borderRadius: 'var(--radius-lg)', padding: '20px 28px', marginBottom: 32, display: 'inline-block' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>🏅</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Achievement Unlocked!</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>First Registration — Welcome to BloodCare</div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/donors" className="btn btn-primary">Find Other Donors</Link>
                <Link to="/community" className="btn btn-outline">Join Community</Link>
                <Link to="/education" className="btn btn-outline">Learn More</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
