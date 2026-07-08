export function EmergencyCard({ em }) {
  const urgencyColors = { critical: 'var(--danger)', high: 'var(--warning)', medium: 'var(--info)' }
  const urgencyLabel = { critical: 'Critical', high: 'High', medium: 'Medium' }

  return (
    <div className="emergency-card">
      <div className="em-header-row">
        <span className="em-time">⏱️ Posted {em.postedAt}</span>
        <span className="em-hospital-name">🏥 {em.hospital}, {em.city}</span>
      </div>
      <div className="em-needs-grid">
        <div className="em-need-box" style={{ borderColor: 'rgba(230,57,70,0.3)', background: 'rgba(230,57,70,0.05)' }}>
          <span className="enb-label">Blood Needed</span>
          <span className="enb-value" style={{ color: 'var(--danger)', fontSize: '1.4rem' }}>{em.blood}</span>
        </div>
        <div className="em-need-box">
          <span className="enb-label">Units Required</span>
          <span className="enb-value">{em.units}</span>
        </div>
        <div className="em-need-box">
          <span className="enb-label">Urgency</span>
          <span className="enb-value" style={{ color: urgencyColors[em.urgency] }}>{urgencyLabel[em.urgency]}</span>
        </div>
      </div>
      <div className="em-notes-box">
        <span className="em-notes-quote">"</span>
        <p className="em-notes-text">{em.notes}</p>
      </div>
      <div className="em-actions">
        <a href={`tel:${em.contact.replace(/\s/g, '')}`} className="btn btn-primary btn-sm w-full font-bold">
          📞 Respond Now
        </a>
      </div>
    </div>
  )
}

export function HospitalCard({ h }) {
  const levelClass = (level) => {
    const l = level.toLowerCase()
    if (l === 'critical' || l === 'none') return 'level-danger'
    if (l === 'low') return 'level-warning'
    if (l === 'medium') return 'level-info'
    return 'level-success'
  }

  return (
    <div className="hospital-card">
      <div className="h-head">
        <div className="h-icon-wrap">
          <span className="h-icon">{h.icon || '🏥'}</span>
        </div>
        <div className="h-title-block">
          <h3 className="h-name">{h.name}</h3>
          <span className="h-dist">📍 {h.distance} away</span>
        </div>
        <div className="h-badge-wrap">
          {h.emergency
            ? <span className="badge badge-red">🚨 Emergency</span>
            : <span className="badge badge-green">✓ Regular</span>}
        </div>
      </div>
      <div className="h-info-row">
        <div className="h-info-box">
          <span className="h-info-icon">🗺️</span>
          <span className="h-info-text">{h.address}</span>
        </div>
        <div className="h-info-box">
          <span className="h-info-icon">📞</span>
          <span className="h-info-text">{h.contact}</span>
        </div>
      </div>
      <div className="h-section-divider"></div>
      <div className="h-blood-title">Available Blood Groups</div>
      <div className="hosp-blood-grid">
        {Object.entries(h.blood).map(([group, level]) => (
          <div key={group} className={`hosp-blood-box ${levelClass(level)}`}>
            <div className="hbb-group">{group}</div>
            <div className="hbb-level">{level}</div>
          </div>
        ))}
      </div>
      <div className="hospital-actions">
        <a href={`tel:${h.contact.replace(/\s/g, '')}`} className="btn btn-primary btn-sm flex-1">📞 Call Hospital</a>
        <a href={`https://maps.google.com/?q=${encodeURIComponent(h.name + ' ' + h.address)}`}
          target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">🗺️ Directions</a>
      </div>
    </div>
  )
}
