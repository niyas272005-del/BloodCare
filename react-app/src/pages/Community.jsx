import { useState, useEffect, useRef } from 'react'
import { BC_STORIES, BC_CAMPAIGNS, BC_LEADERBOARD, BC_ACHIEVEMENTS } from '../data.js'
import DonorModal from '../components/DonorModal.jsx'
import { showToast } from '../components/Toast.jsx'
import Footer from '../components/Footer.jsx'
import { Link } from 'react-router-dom'

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b']

/* Scroll-reveal — re-runs whenever activeTab changes */
function useReveal(deps = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    // Small delay so newly rendered tab content is in the DOM
    const id = setTimeout(() => {
      document
        .querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)')
        .forEach((el) => observer.observe(el))
    }, 50)
    return () => {
      clearTimeout(id)
      observer.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
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
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect() } },
      { threshold: 0.4 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return triggered
}

/* Badge colour helper */
function badgeClass(badge) {
  if (badge === 'Hero' || badge === 'Champion') return 'badge-red'
  if (badge === 'New') return 'badge-blue'
  return 'badge-green'
}

/* ─── STORIES TAB ────────────────────────────────────────── */
function StoriesTab({ likes, onLike, storyText, setStoryText }) {
  return (
    <div>
      {/* Post box */}
      <div className="post-box">
        <textarea
          rows={3}
          placeholder="Share your blood donation story and inspire others… 🩸"
          value={storyText}
          onChange={(e) => setStoryText(e.target.value)}
        />
        <div className="post-actions">
          <button className="btn btn-glass btn-sm">📷 Add Photo</button>
          <button
            className="btn btn-primary btn-sm"
            id="postStoryBtn"
            onClick={() => {
              showToast('Story shared! Thank you for inspiring others 🌟', 'success')
              setStoryText('')
            }}
          >
            📤 Share Story
          </button>
        </div>
      </div>

      {/* Story cards */}
      <div className="grid grid-3" style={{ marginTop: 8 }}>
        {BC_STORIES.map((s, i) => (
          <div key={s.id} className="story-card glass-card">
            <div className="story-header">
              <div
                className="avatar avatar-md"
                style={{
                  background: `linear-gradient(135deg,${COLORS[i % COLORS.length]},${COLORS[(i + 1) % COLORS.length]})`,
                }}
              >
                {s.initials}
              </div>
              <div>
                <p className="font-semibold">{s.author}</p>
                <p className="text-muted text-sm">
                  {s.donations} donations • {s.city}
                </p>
              </div>
              <span className={`badge ${badgeClass(s.badge)} ml-auto`}>{s.badge}</span>
            </div>
            <p className="story-text">{s.text}</p>
            <div className="story-footer">
              <button className="btn btn-glass btn-sm" onClick={() => onLike(s.id)}>
                ❤️ {likes[s.id]}
              </button>
              <button className="btn btn-glass btn-sm">💬 {s.comments}</button>
              <button className="btn btn-glass btn-sm">📤 Share</button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center" style={{ marginTop: 32 }}>
        <button
          className="btn btn-outline"
          onClick={() => showToast('Loading more stories…', 'success', 2000)}
        >
          Load More Stories
        </button>
      </div>
    </div>
  )
}

/* ─── CAMPAIGNS TAB ──────────────────────────────────────── */
function CampaignsTab() {
  return (
    <div>
      <div className="grid grid-3">
        {BC_CAMPAIGNS.map((c) => {
          const pct = Math.round((c.collected / c.goal) * 100)
          return (
            <div key={c.id} className="campaign-card">
              <div className="campaign-banner">{c.icon}</div>
              <div className="campaign-body">
                <div className="campaign-title">{c.title}</div>
                <div className="campaign-desc">{c.description}</div>
                <div style={{ margin: '16px 0' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      color: 'var(--text-2)',
                      marginBottom: 8,
                    }}
                  >
                    <span>🩸 {c.collected.toLocaleString()} units collected</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: 8,
                      fontSize: '0.78rem',
                      color: 'var(--text-2)',
                    }}
                  >
                    <span>Goal: {c.goal.toLocaleString()} units</span>
                    <span>📅 {c.date}</span>
                  </div>
                </div>
                <button
                  className="btn btn-primary w-full btn-sm"
                  onClick={() => showToast(`You joined "${c.title}"! 🎉`, 'success')}
                >
                  Join Campaign
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Start campaign CTA */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: 36,
          marginTop: 40,
          textAlign: 'center',
          boxShadow: 'var(--glass-shadow)',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎯</div>
        <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Start Your Own Campaign</h3>
        <p className="text-muted" style={{ marginBottom: 20 }}>
          Organize a blood drive in your city, company, or college. We'll help you reach thousands of donors.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => showToast('Campaign creation feature coming soon! 🚀', 'success', 3000)}
        >
          Create a Campaign →
        </button>
      </div>
    </div>
  )
}

/* ─── LEADERBOARD TAB ────────────────────────────────────── */
function LeaderboardTab({ onViewDonor }) {
  const MEDALS = ['🥇', '🥈', '🥉']
  const MEDAL_BG = [
    'linear-gradient(135deg,#FFD700,#FFA500)',
    'linear-gradient(135deg,#C0C0C0,#A8A8A8)',
    'linear-gradient(135deg,#CD7F32,#A0522D)',
  ]

  return (
    <div className="grid grid-2" style={{ gap: 32 }}>
      {/* Leaderboard table */}
      <div className="leaderboard-card">
        <div className="leaderboard-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>🏆 Top Donors This Month</h3>
          <p style={{ fontSize: '0.82rem', opacity: 0.8, marginTop: 4 }}>Ranked by total donations</p>
        </div>

        {BC_LEADERBOARD.map((l) => (
          <div key={l.rank} className="leaderboard-row">
            {/* Rank badge */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: l.rank <= 3 ? '1.1rem' : '0.85rem',
                flexShrink: 0,
                background: l.rank <= 3 ? MEDAL_BG[l.rank - 1] : 'var(--surface-2)',
                color: l.rank <= 3 ? '#fff' : 'var(--text-2)',
              }}
            >
              {l.rank <= 3 ? MEDALS[l.rank - 1] : l.rank}
            </div>

            {/* Avatar */}
            <div
              className="avatar avatar-sm"
              style={{ background: 'linear-gradient(135deg,#e63946,#c1121f)' }}
            >
              {l.initials}
            </div>

            {/* Name & city */}
            <div style={{ flex: 1 }}>
              <p className="font-semibold" style={{ fontSize: '0.9rem' }}>{l.name}</p>
              <p className="text-muted" style={{ fontSize: '0.78rem' }}>
                {l.city} • {l.blood}
              </p>
            </div>

            {/* Donations */}
            <div style={{ textAlign: 'right' }}>
              <p className="font-bold text-primary" style={{ fontSize: '1.1rem' }}>{l.donations}</p>
              <p className="text-muted" style={{ fontSize: '0.72rem' }}>donations</p>
            </div>
          </div>
        ))}

        <div
          style={{
            borderTop: '1px solid var(--border)',
            margin: '0 24px',
            padding: '20px 0',
            textAlign: 'center',
          }}
        >
          <p className="text-muted text-sm" style={{ marginBottom: 12 }}>
            Want to see your name here?
          </p>
          <Link to="/register" className="btn btn-primary btn-sm">
            Start Donating →
          </Link>
        </div>
      </div>

      {/* Featured donor */}
      <div className="featured-donor glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 20 }}>
          ⭐ Featured Donor of the Month
        </div>
        <div
          className="avatar avatar-xl"
          style={{ background: 'linear-gradient(135deg,#e63946,#c1121f)', margin: '0 auto 16px' }}
        >
          VS
        </div>
        <h3 style={{ fontSize: '1.3rem', marginBottom: 4 }}>Vikram Singh</h3>
        <p className="text-muted text-sm" style={{ marginBottom: 14 }}>📍 Hyderabad • O-</p>
        <div className="flex-center gap-8" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
          <span className="badge badge-red">👑 Legend</span>
          <span className="badge badge-green">✓ Available</span>
        </div>
        <p className="text-muted text-sm" style={{ marginBottom: 20, lineHeight: 1.7, fontStyle: 'italic', maxWidth: 340 }}>
          "30 donations and counting. Every drop saves a life. This is my superpower and I'm proud of it."
        </p>
        <div className="grid grid-3 w-full" style={{ gap: 10, marginBottom: 20 }}>
          {[{ val: 30, lbl: 'Donations' }, { val: 90, lbl: 'Lives Saved' }, { val: '4.9⭐', lbl: 'Rating' }].map((s) => (
            <div
              key={s.lbl}
              style={{
                textAlign: 'center',
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 8px',
              }}
            >
              <div className="font-bold text-primary" style={{ fontSize: '1.1rem' }}>{s.val}</div>
              <div className="text-muted" style={{ fontSize: '0.72rem' }}>{s.lbl}</div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary w-full" onClick={onViewDonor}>
          View Full Profile
        </button>
      </div>
    </div>
  )
}

/* ─── ACHIEVEMENTS TAB ───────────────────────────────────── */
function AchievementsTab() {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 8 }}>
          Unlock Badges by Donating More
        </h3>
        <p className="text-muted">Each milestone you reach unlocks a new badge. How many can you earn?</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 20,
        }}
      >
        {BC_ACHIEVEMENTS.map((a, i) => {
          const hasReq = a.req !== null && a.req !== undefined
          /* Fake progress so it looks realistic */
          const fakeProgress = hasReq ? [0, 30, 60, 0, 15, 0, 40, 5][i % 8] : 100

          return (
            <div key={a.title} className="ach-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="ach-icon">{a.icon}</div>
              <div className="ach-title">{a.title}</div>
              <div className="ach-desc">{a.desc}</div>

              {hasReq ? (
                <>
                  <div className="progress-bar" style={{ marginTop: 14, width: '100%' }}>
                    <div className="progress-fill" style={{ width: `${fakeProgress}%` }} />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-2)', marginTop: 6 }}>
                    {fakeProgress}% unlocked
                  </div>
                </>
              ) : (
                <div
                  style={{
                    marginTop: 12,
                    fontSize: '0.78rem',
                    color: 'var(--success)',
                    fontWeight: 700,
                    background: 'rgba(34,197,94,0.1)',
                    border: '1px solid rgba(34,197,94,0.25)',
                    borderRadius: 50,
                    padding: '4px 14px',
                  }}
                >
                  ✓ Unlocked
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: 36,
          marginTop: 40,
          textAlign: 'center',
          boxShadow: 'var(--glass-shadow)',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏆</div>
        <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Start Earning Badges Today</h3>
        <p className="text-muted" style={{ marginBottom: 20 }}>
          Register as a donor to start tracking your donations and unlocking exclusive achievements.
        </p>
        <Link to="/register" className="btn btn-primary">
          Register &amp; Start Earning →
        </Link>
      </div>
    </div>
  )
}

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
export default function Community() {
  const [activeTab, setActiveTab] = useState('stories')
  const [selectedDonor, setSelectedDonor] = useState(null)
  const [likes, setLikes] = useState(() =>
    Object.fromEntries(BC_STORIES.map((s) => [s.id, s.likes]))
  )
  const [storyText, setStoryText] = useState('')

  const statsRef = useRef(null)
  const triggered = useCounterObserver(statsRef)
  const memberCount = useCounter(8500, triggered)
  const storyCount = useCounter(2400, triggered)
  const campaignCount = useCounter(48, triggered)

  /* Re-run reveal whenever tab changes */
  useReveal([activeTab])

  useEffect(() => { document.title = 'Community – BloodCare' }, [])

  const handleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: prev[id] + 1 }))
    showToast('You liked this story! ❤️', 'success', 2000)
  }

  const tabs = [
    { id: 'stories',      label: '💬 Stories' },
    { id: 'campaigns',    label: '🎯 Campaigns' },
    { id: 'leaderboard',  label: '🏆 Leaderboard' },
    { id: 'achievements', label: '🎖️ Achievements' },
  ]

  const whyJoin = [
    { icon: '💬', title: 'Share Your Story',   desc: 'Inspire thousands of potential donors by sharing your blood donation journey.' },
    { icon: '🎯', title: 'Join Campaigns',       desc: 'Participate in city-wide blood drives and track collective impact in real time.' },
    { icon: '🏆', title: 'Climb the Leaderboard', desc: 'Earn recognition for your contributions and reach the top of our donor leaderboard.' },
    { icon: '🎖️', title: 'Unlock Achievements', desc: 'Earn exclusive badges for milestones like first donation, 10 donations, and more.' },
  ]

  return (
    <>
      {/* ── PAGE HERO ──────────────────────────────────── */}
      <div
        className="page-header"
        style={{ background: 'linear-gradient(135deg,#0a0514,#14051a)', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(102,126,234,0.2),transparent 70%)', top: -200, right: -100 }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(240,147,251,0.12),transparent 70%)', bottom: -80, left: 50 }} />
        <div className="page-header-content reveal" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(102,126,234,0.15)', border: '1px solid rgba(102,126,234,0.3)', color: '#a5b4fc', padding: '8px 20px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 700, marginBottom: 24 }}>
            🌟 Community Hub
          </div>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2rem,4vw,3.2rem)', marginBottom: 20 }}>
            Join the <span>Movement</span>
          </h1>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 36 }}>
            Connect with donors, share your story, and inspire thousands to save lives. Together we are stronger.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => { setActiveTab('stories'); document.getElementById('comm-tabs')?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              Share Your Story
            </button>
            <button
              className="btn btn-glass btn-lg"
              onClick={() => { setActiveTab('campaigns'); document.getElementById('comm-tabs')?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              View Campaigns
            </button>
          </div>
        </div>
      </div>

      {/* ── STATS ROW ──────────────────────────────────── */}
      <section className="section section-alt" style={{ padding: '40px 5%' }}>
        <div
          ref={statsRef}
          className="reveal"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 20 }}
        >
          {[
            { icon: '👥', count: memberCount, suffix: '+', label: 'Community Members', color: '#667eea' },
            { icon: '💬', count: storyCount,  suffix: '+', label: 'Stories Shared',     color: '#f093fb' },
            { icon: '🎯', count: campaignCount, suffix: '', label: 'Active Campaigns',  color: '#4facfe' },
            { icon: '🏅', count: BC_ACHIEVEMENTS.length, suffix: '', label: 'Badges Available', color: '#43e97b' },
          ].map((s, i) => (
            <div
              key={i}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 20px', textAlign: 'center', boxShadow: 'var(--glass-shadow)' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: s.color }}>{s.count.toLocaleString()}{s.suffix}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-2)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY JOIN ───────────────────────────────────── */}
      <section className="section">
        <div className="section-header reveal">
          <span className="section-tag">Why Join?</span>
          <h2 className="section-title">Be Part of <span>Something Bigger</span></h2>
          <p className="section-sub">BloodCare Community is where donors connect, celebrate, and inspire each other.</p>
        </div>
        <div
          className="reveal"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}
        >
          {whyJoin.map((item, i) => (
            <div
              key={item.title}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28, textAlign: 'center', boxShadow: 'var(--glass-shadow)', transition: 'all var(--transition)', cursor: 'default' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = COLORS[i % COLORS.length] + '80' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <div style={{ width: 60, height: 60, borderRadius: 'var(--radius)', background: `${COLORS[i % COLORS.length]}15`, border: `1px solid ${COLORS[i % COLORS.length]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 18px' }}>
                {item.icon}
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: 10 }}>{item.title}</h4>
              <p style={{ fontSize: '0.87rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TAB SECTION ────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        {/* Tab bar */}
        <div id="comm-tabs" className="community-tabs">
          {tabs.map((t) => (
            <div
              key={t.id}
              className={`comm-tab${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
              role="tab"
              aria-selected={activeTab === t.id}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveTab(t.id)}
            >
              {t.label}
            </div>
          ))}
        </div>

        {/* Tab content — NO reveal wrapper so content is always visible */}
        <div style={{ marginTop: 8 }}>
          {activeTab === 'stories' && (
            <StoriesTab
              likes={likes}
              onLike={handleLike}
              storyText={storyText}
              setStoryText={setStoryText}
            />
          )}
          {activeTab === 'campaigns' && <CampaignsTab />}
          {activeTab === 'leaderboard' && <LeaderboardTab onViewDonor={() => setSelectedDonor(5)} />}
          {activeTab === 'achievements' && <AchievementsTab />}
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────── */}
      <section className="section section-alt">
        <div className="section-header reveal">
          <span className="section-tag">Testimonials</span>
          <h2 className="section-title">What Our <span>Community Says</span></h2>
          <p className="section-sub">Real stories from real heroes. Every voice in this community has saved a life.</p>
        </div>
        <div
          className="reveal"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}
        >
          {[
            { name: 'Dr. Kavitha R.',  role: 'Emergency Physician, Apollo Hospital', text: '"BloodCare has transformed how we handle blood shortage emergencies. We can now find donors within minutes instead of hours."', avatar: 'KR', color: '#4361ee' },
            { name: 'Mohammed Ali',    role: 'Regular Donor, 18 donations',          text: '"The gamification features keep me motivated. Seeing my rank on the leaderboard makes every donation feel like an achievement."', avatar: 'MA', color: '#22c55e' },
            { name: 'Sunita Verma',    role: 'Mother, Blood recipient',              text: '"My son needed O- blood urgently. BloodCare found a match in 8 minutes. I owe my son\'s life to this incredible community."', avatar: 'SV', color: '#f59e0b' },
          ].map((t) => (
            <div
              key={t.name}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28, boxShadow: 'var(--glass-shadow)', transition: 'all var(--transition)' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ fontSize: '2.2rem', color: 'var(--primary)', marginBottom: 12, lineHeight: 1 }}>"</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>{t.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {t.avatar}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="section cta-section">
        <div className="cta-content reveal glass-card text-center">
          <div className="cta-icon" aria-hidden="true">🌟</div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Ready to <span>Join the Community?</span></h2>
          <p className="section-sub" style={{ marginBottom: 32 }}>
            Register as a donor, share your story, and become part of India's largest blood donation community.
          </p>
          <div className="flex-center gap-16 flex-wrap">
            <Link to="/register" className="btn btn-primary btn-lg">Register as Donor</Link>
            <Link to="/donors"   className="btn btn-glass btn-lg">Find a Donor</Link>
          </div>
        </div>
      </section>

      <Footer />
      {selectedDonor && <DonorModal donorId={selectedDonor} onClose={() => setSelectedDonor(null)} />}
    </>
  )
}
