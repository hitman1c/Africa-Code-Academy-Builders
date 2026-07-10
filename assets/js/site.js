// site-wide interactions: signup modal, accessibility helpers
document.addEventListener('DOMContentLoaded', () => {
  const openBtns = [
    document.getElementById('openSignupBtn'),
    document.getElementById('openSignupBtnNav'),
    document.getElementById('openSignupBtnCTA')
  ].filter(Boolean);

  const backdrop = document.getElementById('signupBackdrop');
  const modal = document.getElementById('signupModal');
  const closeBtn = document.getElementById('closeSignup');
  const cancelBtn = document.getElementById('cancelSignup');
  const signupForm = document.getElementById('signupForm');

  function openModal() {
    if (backdrop) backdrop.hidden = false;
    if (modal) modal.hidden = false;
    // trap focus: focus first input
    const first = modal.querySelector('input, textarea, button');
    if (first) first.focus();
  }

  function closeModal() {
    if (backdrop) backdrop.hidden = true;
    if (modal) modal.hidden = true;
  }

  openBtns.forEach(b => b.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Handle signup submission
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName')?.value.trim();
      const email = document.getElementById('signupEmail')?.value.trim().toLowerCase();
      const goal = document.getElementById('signupGoal')?.value.trim();
      const password = document.getElementById('signupPassword')?.value || '';
      const confirm = document.getElementById('signupPasswordConfirm')?.value || '';

      if (!name || !email || !goal || !password) {
        alert('Please complete all fields.');
        return;
      }
      if (password !== confirm) {
        alert('Passwords do not match.');
        return;
      }

      // Save account locally (demo only) — for production use an API
      try {
        const key = 'acaAccounts';
        const raw = localStorage.getItem(key);
        const accounts = raw ? JSON.parse(raw) : [];
        // prevent duplicate email
        const exists = accounts.find(a => a.email === email);
        if (exists) {
          alert('An account with that email already exists. Please login.');
          closeModal();
          window.location.href = 'login.html';
          return;
        }
        accounts.push({ name, email, goal, password, createdAt: Date.now() });
        localStorage.setItem(key, JSON.stringify(accounts));
        // flag for login page to show success + prefill
        localStorage.setItem('newAccountEmail', email);
        // redirect to login
        window.location.href = 'login.html';
      } catch (err) {
        console.error('Signup storage error', err);
        alert('Unable to create account locally.');
      }
    });
  }

  // --- Testimonials slider ---
  const testimonials = Array.from(document.querySelectorAll('.testimonial-card'));
  const dots = Array.from(document.querySelectorAll('.testimonial-dots .dot'));
  let testimonialIndex = testimonials.findIndex(t => t.classList.contains('active')) || 0;

  function showTestimonial(i) {
    testimonialIndex = (i + testimonials.length) % testimonials.length;
    testimonials.forEach((t, idx) => t.classList.toggle('active', idx === testimonialIndex));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === testimonialIndex));
  }
  function nextTestimonial() { showTestimonial(testimonialIndex + 1); }
  function prevTestimonial() { showTestimonial(testimonialIndex - 1); }
  // expose globally for inline handlers
  window.nextTestimonial = nextTestimonial;
  window.prevTestimonial = prevTestimonial;
  window.showTestimonial = showTestimonial;

  // auto-advance testimonials
  let testimonialTimer = setInterval(() => nextTestimonial(), 7000);
  document.querySelectorAll('.testimonials-slider, .testimonial-controls').forEach(el => {
    el.addEventListener('mouseenter', () => clearInterval(testimonialTimer));
    el.addEventListener('mouseleave', () => testimonialTimer = setInterval(() => nextTestimonial(), 7000));
  });

  // --- Animate progress fills when in view ---
  const animatedFills = document.querySelectorAll('.progress-fill.animated');
  const counters = document.querySelectorAll('.counter');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.classList.contains('progress-fill')) {
        const style = el.getAttribute('style') || '';
        const match = style.match(/max-width:\s*(\d+)%/i);
        const target = match ? match[1] + '%' : el.dataset.target || '100%';
        el.style.width = target;
      }
      if (el.classList.contains('counter')) {
        const target = parseInt(el.dataset.target || el.getAttribute('data-target') || '0', 10);
        let current = 0;
        const step = Math.ceil(target / 60);
        const intv = setInterval(() => {
          current += step;
          if (current >= target) { el.textContent = target; clearInterval(intv); }
          else el.textContent = current;
        }, 16);
      }
      if (el.classList.contains('progress-ring-fill')) {
        // animate circular progress
        const fill = el;
        const percent = parseInt(fill.getAttribute('data-percent') || '72', 10);
        const r = parseFloat(fill.getAttribute('r') || '110');
        const circumference = 2 * Math.PI * r;
        fill.style.strokeDasharray = `${circumference}`;
        const offset = circumference * (1 - percent / 100);
        fill.style.strokeDashoffset = offset;
      }
      observer.unobserve(el);
    });
  }, { threshold: 0.25 });

  animatedFills.forEach(f => observer.observe(f));
  counters.forEach(c => observer.observe(c));
  const ringFill = document.querySelector('.progress-ring-fill');
  if (ringFill) observer.observe(ringFill);

  // --- Schedule filter controls ---
  const filterAll = document.getElementById('filterAll');
  const filterLive = document.getElementById('filterLive');
  const filterUpcoming = document.getElementById('filterUpcoming');
  const timelineItems = Array.from(document.querySelectorAll('.timeline-item'));

  function setFilter(mode) {
    timelineItems.forEach(item => {
      if (mode === 'all') item.hidden = false;
      else if (mode === 'live') item.hidden = !item.querySelector('.timeline-marker.live');
      else if (mode === 'upcoming') item.hidden = !item.querySelector('.timeline-marker.upcoming');
    });
    [filterAll, filterLive, filterUpcoming].forEach(b => b && b.setAttribute('aria-pressed', 'false'));
    if (mode === 'all') filterAll?.setAttribute('aria-pressed', 'true');
    if (mode === 'live') filterLive?.setAttribute('aria-pressed', 'true');
    if (mode === 'upcoming') filterUpcoming?.setAttribute('aria-pressed', 'true');
  }
  filterAll?.addEventListener('click', () => setFilter('all'));
  filterLive?.addEventListener('click', () => setFilter('live'));
  filterUpcoming?.addEventListener('click', () => setFilter('upcoming'));

  // start with auto-filter that shows live first
  setFilter('all');

  // Smooth scrolling for quick links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || href === '#!') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
