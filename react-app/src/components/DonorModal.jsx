import { useState } from 'react'
import { BC_DONORS } from '../data.js'
import { showToast } from './Toast.jsx'

const BADGE_ICONS = { 'Life Saver': '🥇', 'Champion': '🏆', 'Star Donor': '⭐', 'First Responder': '🚀', 'Legend': '👑' }
const COLORS = ['#e63946', '#3b82f6', '#22c55e', '#f59e0b', '#7c3aed', '#ec4899', '#14b8a6', '#f97316']

export function DonorCard({ donor, onClick }) {
  const color = COLORS[donor.id % COLORS.length]
  return (
    <div
      className="donor-card-v2"
      onClick={() => onClick(donor.id)}
      tabIndex={0}
      role="button"
      aria-label={`View profile of ${donor.name}`}
      onKeyDown={e => e.key === 'Enter' && onClick(donor.id)}
    >
      <div className="dc-top">
        <div className="dc-avatar-wrap">
          <div className="avatar avatar-md" style={{ background: `linear-gradient(135deg,${color},${color}aa)` }}>{donor.initials}</div>
          <span className={`status-dot ${donor.available ? 'available' : 'unavailable'}`}></span>
        </div>
        <div className="dc-head-info">
          <div className="dc-name">{donor.name}</div>
          <div className="dc-city-pill">📍 {donor.city}</div>
        </div>
        <div className="dc-blood-box-wrap">
          <div className="dc-blood-group-badge">{donor.blood}</div>
        </div>
      </div>
      <div className="dc-stats-row">
        <div className="dc-stat-box">
          <span className="dcs-val text-primary">{donor.donations}</span>
          <span className="dcs-lbl">Donations</span>
        </div>
        <div className="dc-stat-box">
          <span className="dcs-val" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
            {new Date(donor.lastDonation).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </span>
          <span className="dcs-lbl">Last Donation</span>
        </div>
      </div>
      <div className="dc-actions">
        <button
          className="btn btn-primary btn-sm"
          onClick={e => { e.stopPropagation(); window.location = `tel:${donor.phone.replace(/\s/g, '')}` }}
          aria-label={`Call ${donor.name}`}
        >📞 Call</button>
        <button
          className="btn btn-outline btn-sm"
          onClick={e => { e.stopPropagation(); onClick(donor.id) }}
          aria-label={`View profile of ${donor.name}`}
        >👤 Profile</button>
      </div>
    </div>
  )
}

export default function DonorModal({ donorId, onClose }) {
  const donor = BC_DONORS.find(d => d.id === donorId)
  if (!donor) return null

  return (
    <div className="modal-overlay open" id="donorModal" role="dialog" aria-modal="true" aria-labelledby="modalDonorName"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" id="donorModalContent">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        <div className="modal-header">
          <div className="flex gap-16 align-items-center">
            <div className="avatar avatar-xl">{donor.initials}</div>
            <div>
              <h2 id="modalDonorName" style={{ fontSize: '1.4rem', fontWeight: 800 }}>{donor.name}</h2>
              <div className="flex gap-8 align-items-center" style={{ marginTop: 6 }}>
                <span className={`status-dot ${donor.available ? 'available' : 'unavailable'}`}></span>
                <span className="text-muted text-sm">{donor.available ? 'Available to Donate' : 'Currently Unavailable'}</span>
              </div>
            </div>
            <div className="blood-badge blood-badge-lg" style={{ marginLeft: 'auto' }}>{donor.blood}</div>
          </div>
        </div>
        <div className="modal-body">
          <div className="grid grid-2" style={{ gap: 16, marginBottom: 20 }}>
            <div className="modal-info-card"><p className="text-muted text-sm">Age</p><p className="font-semibold">{donor.age} years</p></div>
            <div className="modal-info-card"><p className="text-muted text-sm">City</p><p className="font-semibold">{donor.city}</p></div>
            <div className="modal-info-card"><p className="text-muted text-sm">Total Donations</p><p className="font-semibold text-primary">{donor.donations} times</p></div>
            <div className="modal-info-card"><p className="text-muted text-sm">Last Donation</p><p className="font-semibold">{new Date(donor.lastDonation).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
          </div>
          <div className="modal-badges" style={{ marginBottom: 20 }}>
            {donor.badges.map(b => (
              <span key={b} className="modal-badge-item">{BADGE_ICONS[b] || '🏅'} {b}</span>
            ))}
          </div>
          <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: 16 }}>
            <p className="text-muted text-sm" style={{ marginBottom: 6 }}>Contact</p>
            <p className="font-semibold">{donor.phone}</p>
          </div>
        </div>
        <div className="modal-footer">
          <a href={`tel:${donor.phone.replace(/\s/g, '')}`} className="btn btn-primary w-full">📞 Contact Donor</a>
        </div>
      </div>
    </div>
  )
}
