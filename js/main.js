/* =============================================
   BLOODCARE — SHARED MAIN JS
   ============================================= */

'use strict';

/* ---- LOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader')?.classList.add('hide');
  }, 1800);
});

/* ---- THEME ---- */
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('bc-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
if (themeToggle) {
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  themeToggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('bc-theme', next);
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

/* ---- HAMBURGER / MOBILE NAV ---- */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---- NAVBAR SCROLL EFFECT ---- */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 4px 30px rgba(0,0,0,0.15)'
      : 'var(--glass-shadow)';
  }, { passive: true });
}

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ---- ANIMATED COUNTERS ---- */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ---- PARTICLES ---- */
function initParticles(containerId) {
  const c = document.getElementById(containerId);
  if (!c) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 10 + 4;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 12 + 8}s;
      animation-delay:${Math.random() * 8}s;
      opacity:${Math.random() * 0.4 + 0.1};
    `;
    c.appendChild(p);
  }
}
initParticles('particles');

/* ---- TOAST ---- */
function showToast(message, type = 'success', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type !== 'success' ? type : ''}`;
  toast.innerHTML = `<span style="font-size:1.2rem">${icons[type]||'✅'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = '0.4s ease';
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* ---- MODAL HELPERS ---- */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    const overlay = btn.closest('.modal-overlay');
    if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
  });
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
  });
});

/* ---- DONOR PROFILE MODAL ---- */
function openDonorModal(donorId) {
  const donor = BC_DONORS.find(d => d.id === donorId);
  if (!donor) return;
  const badgeIcons = { 'Life Saver':'🥇','Champion':'🏆','Star Donor':'⭐','First Responder':'🚀','Legend':'👑' };
  document.getElementById('modalAvatar').textContent = donor.initials;
  document.getElementById('modalDonorName').textContent = donor.name;
  const status = donor.available;
  const dot = document.getElementById('modalStatus');
  if (dot) { dot.className = `status-dot ${status ? 'available' : 'unavailable'}`; }
  document.getElementById('modalStatusText').textContent = status ? 'Available to Donate' : 'Currently Unavailable';
  document.getElementById('modalBloodGroup').textContent = donor.blood;
  document.getElementById('modalAge').textContent = donor.age + ' years';
  document.getElementById('modalCity').textContent = donor.city;
  document.getElementById('modalDonations').textContent = donor.donations + ' times';
  document.getElementById('modalLastDonation').textContent = new Date(donor.lastDonation).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'});
  const badgesEl = document.getElementById('modalBadges');
  if (badgesEl) {
    badgesEl.innerHTML = donor.badges.map(b =>
      `<span class="modal-badge-item">${badgeIcons[b]||'🏅'} ${b}</span>`
    ).join('');
  }
  const contactEl = document.getElementById('modalContact');
  if (contactEl) {
    contactEl.innerHTML = `<p class="text-muted text-sm" style="margin-bottom:6px">Contact</p><p class="font-semibold">${donor.phone}</p>`;
  }
  const callBtn = document.getElementById('modalCallBtn');
  if (callBtn) { callBtn.href = `tel:${donor.phone.replace(/\s/g,'')}`; }
  openModal('donorModal');
}

/* ---- CHATBOT ---- */
const chatBtn = document.getElementById('ai-chat-btn');
const chatPanel = document.getElementById('chatPanel');
const closeChat = document.getElementById('closeChat');
const chatSend = document.getElementById('chatSend');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

if (chatBtn && chatPanel) {
  chatBtn.addEventListener('click', () => chatPanel.classList.toggle('open'));
  if (closeChat) closeChat.addEventListener('click', () => chatPanel.classList.remove('open'));
}

function addChatMsg(text, type) {
  if (!chatMessages) return;
  const msg = document.createElement('div');
  msg.className = `chat-msg ${type}`;
  msg.innerHTML = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotReply(input) {
  const lower = input.toLowerCase();
  for (const key of Object.keys(BC_CHAT_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) return BC_CHAT_RESPONSES[key];
  }
  return BC_CHAT_RESPONSES['default'];
}

function sendChat() {
  const val = chatInput?.value.trim();
  if (!val) return;
  addChatMsg(val, 'user');
  chatInput.value = '';
  setTimeout(() => {
    addChatMsg('🤔 Let me check that for you…', 'bot');
    setTimeout(() => {
      const msgs = chatMessages.querySelectorAll('.chat-msg.bot');
      const last = msgs[msgs.length - 1];
      if (last) last.innerHTML = getBotReply(val);
    }, 900);
  }, 300);
}

if (chatSend) chatSend.addEventListener('click', sendChat);
if (chatInput) chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendChat(); });

/* ---- CHIP FILTER ---- */
document.querySelectorAll('.chip[data-bg]').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.closest('.qsearch-chips')?.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const bgSelect = document.getElementById('qs-blood');
    if (bgSelect) bgSelect.value = chip.dataset.bg;
  });
});

/* ---- QUICK SEARCH REDIRECT ---- */
document.getElementById('qsearchBtn')?.addEventListener('click', e => {
  e.preventDefault();
  const bg = document.getElementById('qs-blood')?.value || '';
  const city = document.getElementById('qs-city')?.value || '';
  const avail = document.getElementById('qs-avail')?.value || '';
  const params = new URLSearchParams();
  if (bg) params.set('blood', bg);
  if (city) params.set('city', city);
  if (avail) params.set('avail', avail);
  window.location.href = `donors.html?${params.toString()}`;
});

/* ---- KEYBOARD NAVIGATION ---- */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open'); document.body.style.overflow = '';
    });
    chatPanel?.classList.remove('open');
    mobileNav?.classList.remove('open');
  }
});

/* ---- UTILS ---- */
function createDonorCard(donor) {
  const colors = ['#e63946', '#3b82f6', '#22c55e', '#f59e0b', '#7c3aed', '#ec4899', '#14b8a6', '#f97316'];
  const color = colors[donor.id % colors.length];
  return `
  <div class="donor-card-v2" onclick="openDonorModal(${donor.id})" tabindex="0"
    role="button" aria-label="View profile of ${donor.name}"
    onkeypress="if(event.key==='Enter')openDonorModal(${donor.id})">
    <div class="dc-top">
      <div class="dc-avatar-wrap">
        <div class="avatar avatar-md" style="background:linear-gradient(135deg,${color},${color}aa)">${donor.initials}</div>
        <span class="status-dot ${donor.available ? 'available' : 'unavailable'}"></span>
      </div>
      <div class="dc-head-info">
        <div class="dc-name">${donor.name}</div>
        <div class="dc-city-pill">📍 ${donor.city}</div>
      </div>
      <div class="dc-blood-box-wrap">
        <div class="dc-blood-group-badge">${donor.blood}</div>
      </div>
    </div>
    
    <div class="dc-stats-row">
      <div class="dc-stat-box">
        <span class="dcs-val text-primary">${donor.donations}</span>
        <span class="dcs-lbl">Donations</span>
      </div>
      <div class="dc-stat-box">
        <span class="dcs-val" style="font-size:0.8rem; font-weight:700;">${new Date(donor.lastDonation).toLocaleDateString('en-IN',{month:'short',year:'numeric'})}</span>
        <span class="dcs-lbl">Last Donation</span>
      </div>
    </div>
    
    <div class="dc-actions">
      <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();window.location='tel:${donor.phone.replace(/\s/g,'')}'" aria-label="Call ${donor.name}">📞 Call</button>
      <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openDonorModal(${donor.id})" aria-label="View profile of ${donor.name}">👤 Profile</button>
    </div>
  </div>`;
}

function createEmergencyCard(em) {
  const urgencyColors = { 
    critical: 'var(--danger)', 
    high: 'var(--warning)', 
    medium: 'var(--info)' 
  };
  const urgencyLabel = { critical: 'Critical', high: 'High', medium: 'Medium' };
  
  return `
  <div class="emergency-card">
    <div class="em-header-row">
      <span class="em-time">⏱️ Posted ${em.postedAt}</span>
      <span class="em-hospital-name">🏥 ${em.hospital}, ${em.city}</span>
    </div>
    
    <div class="em-needs-grid">
      <div class="em-need-box" style="border-color: rgba(230, 57, 70, 0.3); background: rgba(230, 57, 70, 0.05);">
        <span class="enb-label">Blood Needed</span>
        <span class="enb-value" style="color: var(--danger); font-size: 1.4rem;">${em.blood}</span>
      </div>
      <div class="em-need-box">
        <span class="enb-label">Units Required</span>
        <span class="enb-value">${em.units}</span>
      </div>
      <div class="em-need-box">
        <span class="enb-label">Urgency</span>
        <span class="enb-value" style="color: ${urgencyColors[em.urgency]}">${urgencyLabel[em.urgency]}</span>
      </div>
    </div>
    
    <div class="em-notes-box">
      <span class="em-notes-quote">“</span>
      <p class="em-notes-text">${em.notes}</p>
    </div>
    
    <div class="em-actions">
      <a href="tel:${em.contact.replace(/\s/g,'')}" class="btn btn-primary btn-sm w-full font-bold">
        📞 Respond Now
      </a>
    </div>
  </div>`;
}

function createHospitalCard(h) {
  const bloodHtml = Object.entries(h.blood).map(([group, level]) => {
    let cls = '';
    const lvl = level.toLowerCase();
    if (lvl === 'critical' || lvl === 'none') cls = 'level-danger';
    else if (lvl === 'low') cls = 'level-warning';
    else if (lvl === 'medium') cls = 'level-info';
    else cls = 'level-success';
    
    return `
      <div class="hosp-blood-box ${cls}">
        <div class="hbb-group">${group}</div>
        <div class="hbb-level">${level}</div>
      </div>`;
  }).join('');
  
  return `
  <div class="hospital-card">
    <div class="h-head">
      <div class="h-icon-wrap">
        <span class="h-icon">${h.icon || '🏥'}</span>
      </div>
      <div class="h-title-block">
        <h3 class="h-name">${h.name}</h3>
        <span class="h-dist">📍 ${h.distance} away</span>
      </div>
      <div class="h-badge-wrap">
        ${h.emergency ? '<span class="badge badge-red">🚨 Emergency</span>' : '<span class="badge badge-green">✓ Regular</span>'}
      </div>
    </div>
    
    <div class="h-info-row">
      <div class="h-info-box">
        <span class="h-info-icon">🗺️</span>
        <span class="h-info-text">${h.address}</span>
      </div>
      <div class="h-info-box">
        <span class="h-info-icon">📞</span>
        <span class="h-info-text">${h.contact}</span>
      </div>
    </div>
    
    <div class="h-section-divider"></div>
    
    <div class="h-blood-title">Available Blood Groups</div>
    <div class="hosp-blood-grid">
      ${bloodHtml}
    </div>
    
    <div class="hospital-actions">
      <a href="tel:${h.contact.replace(/\s/g,'')}" class="btn btn-primary btn-sm flex-1">📞 Call Hospital</a>
      <a href="https://maps.google.com/?q=${encodeURIComponent(h.name+' '+h.address)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">🗺️ Directions</a>
    </div>
  </div>`;
}

window.openDonorModal = openDonorModal;
window.showToast = showToast;
window.createDonorCard = createDonorCard;
window.createEmergencyCard = createEmergencyCard;
window.createHospitalCard = createHospitalCard;
