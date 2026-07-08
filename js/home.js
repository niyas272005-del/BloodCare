/* =============================================
   HOME PAGE JS
   ============================================= */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* Featured donors */
  const featuredEl = document.getElementById('featuredDonors');
  if (featuredEl) {
    const featured = BC_DONORS.filter(d => d.available).slice(0, 6);
    featuredEl.innerHTML = featured.map(createDonorCard).join('');
  }

  /* Emergency requests */
  const emergencyEl = document.getElementById('emergencyList');
  if (emergencyEl) {
    emergencyEl.innerHTML = BC_EMERGENCIES.slice(0, 3).map(createEmergencyCard).join('');
  }

  /* Hospitals */
  const hospitalEl = document.getElementById('hospitalList');
  if (hospitalEl) {
    hospitalEl.innerHTML = BC_HOSPITALS.slice(0, 3).map(createHospitalCard).join('');
  }

  /* Close donor modal */
  document.getElementById('closeDonorModal')?.addEventListener('click', () => closeModal('donorModal'));

});
