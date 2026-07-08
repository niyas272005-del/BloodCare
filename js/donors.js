'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('donorGrid');
  const noResults = document.getElementById('noResults');
  const countEl = document.getElementById('resultCount');
  const totalEl = document.getElementById('totalDonorCount');
  const searchName = document.getElementById('searchName');
  const filterBlood = document.getElementById('filterBlood');
  const filterCity = document.getElementById('filterCity');
  const filterAvail = document.getElementById('filterAvail');

  if (totalEl) totalEl.textContent = BC_DONORS.length;

  // Populate city filter
  if (filterCity) {
    const cities = [...new Set(BC_DONORS.map(d => d.city))].sort();
    cities.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      filterCity.appendChild(opt);
    });
  }

  // Parse URL params
  const params = new URLSearchParams(window.location.search);
  if (params.get('blood') && filterBlood) filterBlood.value = params.get('blood');
  if (params.get('city') && filterCity) filterCity.value = params.get('city');
  if (params.get('avail')) {
    if (filterAvail) filterAvail.value = params.get('avail') === 'Available Now' ? 'available' : '';
  }

  function renderDonors() {
    const name = searchName?.value.toLowerCase() || '';
    const blood = filterBlood?.value || '';
    const city = filterCity?.value || '';
    const avail = filterAvail?.value || '';

    const filtered = BC_DONORS.filter(d => {
      if (name && !d.name.toLowerCase().includes(name) && !d.city.toLowerCase().includes(name)) return false;
      if (blood && d.blood !== blood) return false;
      if (city && d.city !== city) return false;
      if (avail === 'available' && !d.available) return false;
      if (avail === 'unavailable' && d.available) return false;
      return true;
    });

    if (countEl) countEl.textContent = filtered.length;

    if (filtered.length === 0) {
      if (grid) grid.innerHTML = '';
      if (noResults) noResults.style.display = 'block';
    } else {
      if (noResults) noResults.style.display = 'none';
      if (grid) {
        grid.innerHTML = filtered.map(createDonorCard).join('');
        // Re-observe new cards
        grid.querySelectorAll('.donor-card-v2').forEach((card, i) => {
          card.style.animationDelay = `${i * 0.06}s`;
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = `opacity 0.4s ease ${i*0.06}s, transform 0.4s ease ${i*0.06}s`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        });
      }
    }
  }

  // Blood group chips
  document.querySelectorAll('.chip[data-bg]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip[data-bg]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (filterBlood) filterBlood.value = chip.dataset.bg;
      renderDonors();
    });
  });

  // Set "All" chip active initially
  const allChip = document.querySelector('.chip[data-bg=""]');
  if (allChip) allChip.classList.add('active');

  // Event listeners
  searchName?.addEventListener('input', renderDonors);
  filterBlood?.addEventListener('change', () => {
    document.querySelectorAll('.chip[data-bg]').forEach(c => c.classList.remove('active'));
    const match = document.querySelector(`.chip[data-bg="${filterBlood.value}"]`);
    if (match) match.classList.add('active');
    renderDonors();
  });
  filterCity?.addEventListener('change', renderDonors);
  filterAvail?.addEventListener('change', renderDonors);

  document.getElementById('clearFilters')?.addEventListener('click', clearAllFilters);

  // View toggle
  document.getElementById('gridView')?.addEventListener('click', () => {
    grid?.classList.remove('list-view');
    document.getElementById('gridView')?.classList.add('active');
    document.getElementById('listView')?.classList.remove('active');
  });
  document.getElementById('listView')?.addEventListener('click', () => {
    grid?.classList.add('list-view');
    document.getElementById('listView')?.classList.add('active');
    document.getElementById('gridView')?.classList.remove('active');
  });

  document.getElementById('closeDonorModal')?.addEventListener('click', () => closeModal('donorModal'));

  renderDonors();
});

function clearAllFilters() {
  document.getElementById('searchName').value = '';
  document.getElementById('filterBlood').value = '';
  document.getElementById('filterCity').value = '';
  document.getElementById('filterAvail').value = '';
  document.querySelectorAll('.chip[data-bg]').forEach(c => c.classList.remove('active'));
  document.querySelector('.chip[data-bg=""]')?.classList.add('active');
  // trigger re-render
  document.getElementById('searchName').dispatchEvent(new Event('input'));
}
window.clearAllFilters = clearAllFilters;
