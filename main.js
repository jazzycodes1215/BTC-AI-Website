/* BTM V3 — main.js */

/* ── Nav scroll state ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Hamburger ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('is-open');
  mobileMenu.classList.toggle('is-open', open);
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
  });
});

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.querySelectorAll('[data-reveal]')]
      .filter(el => !el.classList.contains('is-visible'));
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('is-visible'), Math.max(0, idx) * 100);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ── Counter animation ── */
function countUp(el, target, duration, prefix) {
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.floor(target * ease);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + target;
  };
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = parseInt(entry.target.getAttribute('data-count'), 10);
    const prefix = entry.target.getAttribute('data-prefix') || '';
    countUp(entry.target, target, 1600, prefix);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.7 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('is-open');

    document.querySelectorAll('.faq-item.is-open').forEach(open => {
      open.classList.remove('is-open');
      open.querySelector('.faq-a').style.maxHeight = '0';
    });

    if (!isOpen) {
      item.classList.add('is-open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* ── Smooth scroll (80px nav offset) ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Form submission ── */
const form   = document.getElementById('auditForm');
const submit = document.getElementById('submitBtn');
if (form && submit) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    submit.textContent = "Request received — we'll be in touch within 24 hrs ✓";
    submit.style.background = '#103c25';
    submit.disabled = true;
    setTimeout(() => {
      submit.textContent = 'Book My Free Growth Audit →';
      submit.style.background = '';
      submit.disabled = false;
      form.reset();
    }, 5000);
  });
}

/* ════════════════════════════════════════════════
   HERO — Project Slider + Progress Bar
   ════════════════════════════════════════════════ */

const slides = [
  { niche: 'Pool & Spa Service',  result: '12 Customers to 31 — in 90 Days'        },
  { niche: 'HVAC & Plumbing',     result: '9 Leads / Week — Without Paying Angi'   },
  { niche: 'Roofing & Exterior',  result: '$15K Jobs — Closed Before the First Call'},
  { niche: 'Commercial Cleaning', result: '1 Video. 3 New Contracts in 60 Days.'    },
  { niche: 'Lawn & Landscaping',  result: '0 Online Presence. 22 Leads in 30 Days.' },
];

const heroNicheEl   = document.getElementById('heroNiche');
const heroResultEl  = document.getElementById('heroResult');
const heroCurrentEl = document.getElementById('heroCurrent');
const heroDots      = document.querySelectorAll('.hdot');
const heroBarFill   = document.getElementById('heroBarFill');

let activeSlide = 0;
let sliding     = false;
const SLIDE_DUR = 5000;
let slideStart  = performance.now();

function goToSlide(idx) {
  if (sliding) return;
  sliding = true;
  heroResultEl.classList.remove('is-visible');

  setTimeout(() => {
    const s = slides[idx];
    activeSlide = idx;
    heroNicheEl.textContent  = s.niche;
    heroResultEl.textContent = s.result;
    heroResultEl.classList.add('is-visible');
    heroCurrentEl.textContent = String(idx + 1).padStart(2, '0');
    heroDots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    slideStart = performance.now();
    sliding    = false;
  }, 320);
}

heroDots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

function tickSlider(now) {
  requestAnimationFrame(tickSlider);
  const pct = Math.min((now - slideStart) / SLIDE_DUR, 1);
  if (heroBarFill) heroBarFill.style.width = (pct * 100) + '%';
  if (pct >= 1) goToSlide((activeSlide + 1) % slides.length);
}

requestAnimationFrame(tickSlider);
goToSlide(0);

/* ════════════════════════════════════════════════
   TEAM SLIDER
   ════════════════════════════════════════════════ */

const teamSlides    = document.querySelectorAll('.team-slide');
const teamDots      = document.querySelectorAll('.tdot');
const teamCurrentEl = document.getElementById('teamCurrent');
const teamBarFill   = document.getElementById('teamBarFill');

let activeTeam     = 0;
let teamSliding    = false;
const TEAM_DUR     = 6000;
let teamSlideStart = performance.now();

function goToTeamSlide(idx) {
  if (teamSliding) return;
  teamSliding = true;
  teamSlides[activeTeam].classList.remove('is-active');

  setTimeout(() => {
    activeTeam = idx;
    teamSlides[activeTeam].classList.add('is-active');
    if (teamCurrentEl) teamCurrentEl.textContent = String(idx + 1).padStart(2, '0');
    teamDots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    teamSlideStart = performance.now();
    teamSliding    = false;
  }, 320);
}

teamDots.forEach((dot, i) => dot.addEventListener('click', () => goToTeamSlide(i)));

function tickTeamSlider(now) {
  requestAnimationFrame(tickTeamSlider);
  const pct = Math.min((now - teamSlideStart) / TEAM_DUR, 1);
  if (teamBarFill) teamBarFill.style.width = (pct * 100) + '%';
  if (pct >= 1) goToTeamSlide((activeTeam + 1) % teamSlides.length);
}

requestAnimationFrame(tickTeamSlider);

/* ── 3-D tilt on pricing cards (desktop only) ── */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.pricing-card').forEach(card => {
    const isFeat = card.classList.contains('pricing-card-feat');
    const hoverY  = isFeat ? -11 : -2;

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const rotY =  ((e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2)) * 8;
      const rotX = -((e.clientY - rect.top   - rect.height / 2) / (rect.height / 2)) * 5;
      card.style.transform =
        `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${hoverY}px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
