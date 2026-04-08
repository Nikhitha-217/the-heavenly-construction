/* ============================================================
   THE HEAVENLY GROUP — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Scroll-shrink navbar ──────────────────────────────── */
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ── Active nav link highlight ─────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });

  /* ── Intersection Observer — scroll reveal ─────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => revealObserver.observe(el));

  /* ── Animated counters ─────────────────────────────────── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      el.textContent = (Number.isInteger(target) ? Math.floor(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = true;
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  /* ── Portfolio filter ──────────────────────────────────── */
  window.filterProjects = function (cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.port-card').forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
    });
  };

  /* ── Estimator live cost calculator ───────────────────── */
  function calcEstimate() {
    const area    = parseFloat(document.getElementById('est-area')?.value) || 0;
    const pkg     = document.getElementById('est-package')?.value || 'signature';
    const floors  = parseFloat(document.getElementById('est-floors')?.value) || 1;
    const rates   = { essential: 1799, signature: 2199, royal: 2799 };
    const rate    = rates[pkg] || 2199;
    const total   = area * floors * rate;
    const el      = document.getElementById('live-estimate');
    if (el && area > 0) {
      el.textContent = '₹' + total.toLocaleString('en-IN');
      document.getElementById('est-result-block')?.classList.remove('hidden');
    }
  }
  ['est-area','est-package','est-floors'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calcEstimate);
  });

  /* ── FAQ accordion ─────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Testimonial touch-swipe ───────────────────────────── */
  const track = document.querySelector('.test-track');
  if (track) {
    let startX = 0;
    track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        const cards = track.querySelectorAll('.test-card');
        const visible = Math.floor(track.offsetWidth / cards[0].offsetWidth);
        /* simple nudge — could be extended */
        track.scrollBy({ left: diff > 0 ? 300 : -300, behavior: 'smooth' });
      }
    });
  }

  /* ── Form submit handler ───────────────────────────────── */
  const estForm = document.getElementById('estimatorForm');
  if (estForm) {
    estForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = estForm.querySelector('button[type=submit]');
      btn.textContent = '✓ Request Sent!';
      btn.style.background = '#2ecc71';
      btn.style.color = '#fff';
      setTimeout(() => { estForm.reset(); btn.textContent = 'Submit Request'; btn.style = ''; }, 3500);
    });
  }

});
