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
  { niche: 'Thomas Robinson', result: 'Exceptional quality and professionalism across video and web design. Demonstrated genuine care with fast turnaround and zero stress.' },
  { niche: 'Marty P', result: 'Captured beautiful moments with heartfelt detail and breathtaking drone footage. Professional approach combined with genuine investment in the vision.' },
  { niche: 'Shawn Abrams', result: 'Consistently delivers top-quality work across all services with smooth professionalism. Complete trust and recommendation without hesitation.' },
  { niche: 'Ashley Brown', result: 'Created a promotional video that captured the brand beautifully and exceeded expectations. Exceptional communication at every step built real partnership trust.' },
  { niche: 'Cornell Mack', result: 'Wedding day captured perfectly with professional, comfortable direction. Drone footage was a game-changer that elevated the final product.' },
  { niche: 'Melissa', result: 'Captured every detail with beautiful, thorough photography for events. True skill in storytelling through images with professional excellence.' },
  { niche: 'Dallas Frazier', result: 'Promotional video perfectly captured business essence and continues driving real attention. Genuine commitment to vision with lasting, measurable results.' },
  { niche: 'Queen Gregory', result: 'Delivered a timeless brand video that authentically captured the story. Excellent communication, schedule adherence, and vision realization.' },
  { niche: 'Roneisha Mack', result: 'Captured every special moment with stunning detail and cinematic drone footage. Went above and beyond expectations with professional excellence throughout.' },
  { niche: 'Danielle Jennings', result: 'Friendly, on-time service across multiple projects with hands-on personal attention. Genuinely helped grow business and earned enthusiastic referrals.' },
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
    if (heroCurrentEl) heroCurrentEl.textContent = String(idx + 1).padStart(2, '0');
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

/* ════════════════════════════════════════════════
   SCROLL-DRIVEN CAMERA ANIMATION
   Frames live in /frames/frame_0001.jpg … frame_NNNN.jpg
   Run: python3 -m http.server 8080 (can't load from file://)
   ════════════════════════════════════════════════ */

(function () {
  const FRAME_COUNT = 97;
  const FRAME_DIR   = 'frames/';

  const canvas      = document.getElementById('camCanvas');
  const heroSection = document.getElementById('hero');
  const loader      = document.getElementById('camLoader');
  const loaderFill  = document.getElementById('camLoaderFill');

  if (!canvas || !heroSection) return;

  const ctx    = canvas.getContext('2d');
  const frames = new Array(FRAME_COUNT);
  let loadedCount  = 0;
  let currentFrame = -1;
  let ticking      = false;
  let allLoaded    = false;


  /* ── Canvas resize (Retina-aware) ── */
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    if (currentFrame >= 0) drawFrame(currentFrame);
  }
  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  /* ── Cover-fit drawing ── */
  function drawFrame(index) {
    const img = frames[index];
    if (!img || !img.complete || !img.naturalWidth) return;

    const dpr = window.devicePixelRatio || 1;
    const cw  = canvas.width;
    const ch  = canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    const imgRatio    = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;
    let drawW, drawH, drawX, drawY;

    if (window.innerWidth > 768) {
      /* Desktop: cover-fit — fills edge-to-edge */
      if (canvasRatio > imgRatio) {
        drawW = cw;           drawH = cw / imgRatio;
      } else {
        drawH = ch;           drawW = ch * imgRatio;
      }
    } else {
      /* Mobile: slightly zoomed contain — keeps camera centred */
      const zoom = 1.15;
      if (canvasRatio > imgRatio) {
        drawH = ch * zoom;    drawW = drawH * imgRatio;
      } else {
        drawW = cw * zoom;    drawH = drawW / imgRatio;
      }
    }
    drawX = (cw - drawW) / 2;
    drawY = (ch - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }


  /* ── Main scroll handler ── */
  window.addEventListener('scroll', () => {
    if (!allLoaded || ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect       = heroSection.getBoundingClientRect();
      const scrollable = heroSection.offsetHeight - window.innerHeight;
      const progress   = Math.min(1, Math.max(0, -rect.top / scrollable));
      const frameIdx   = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));

      if (frameIdx !== currentFrame) {
        currentFrame = frameIdx;
        drawFrame(frameIdx);
      }

      ticking = false;
    });
  }, { passive: true });

  /* ── Loader hide ── */
  function onAllLoaded() {
    allLoaded = true;
    if (loader) {
      loader.classList.add('is-hidden');
      setTimeout(() => { loader.style.display = 'none'; }, 650);
    }
    currentFrame = 0;
    drawFrame(0);
  }

  /* ── Fallback: hide loader after 5s even if frames fail ── */
  setTimeout(() => {
    if (!allLoaded) {
      allLoaded = true;
      if (loader) {
        loader.classList.add('is-hidden');
        setTimeout(() => { loader.style.display = 'none'; }, 650);
      }
    }
  }, 5000);

  /* ── Preload all frames ── */
  for (let i = 1; i <= FRAME_COUNT; i++) {
    const img = new Image();
    const pad = String(i).padStart(4, '0');
    img.src    = FRAME_DIR + 'frame_' + pad + '.jpg';
    img.onload = img.onerror = () => {
      loadedCount++;
      if (loaderFill) loaderFill.style.width = (loadedCount / FRAME_COUNT * 100) + '%';
      if (loadedCount === FRAME_COUNT) onAllLoaded();
    };
    frames[i - 1] = img;
  }
})();

/* ════════════════════════════════════════════════
   TESTIMONIAL CAROUSEL — auto-advances every 6s
   ════════════════════════════════════════════════ */
(function () {
  const outer  = document.getElementById('tCarOuter');
  const track  = document.getElementById('tCarTrack');
  const dotsEl = document.getElementById('tCarDots');
  const btnPrev = document.getElementById('tCarPrev');
  const btnNext = document.getElementById('tCarNext');

  if (!track) return;

  const CARD_W   = 360;
  const GAP      = 20;
  const STEP     = CARD_W + GAP;
  const INTERVAL = 6000;

  /* Clone cards for seamless infinite loop */
  const originals  = Array.from(track.children);
  const totalCards = originals.length;
  originals.forEach(c => track.appendChild(c.cloneNode(true)));

  let idx        = 0;
  let timer      = null;
  let busy       = false;
  let touchStartX = 0;

  /* ── Build dots ── */
  originals.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'tcar-dot' + (i === 0 ? ' is-active' : '');
    d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    d.addEventListener('click', () => { stop(); jumpTo(i); start(); });
    dotsEl.appendChild(d);
  });

  function updateDots(i) {
    document.querySelectorAll('.tcar-dot')
      .forEach((d, n) => d.classList.toggle('is-active', n === i % totalCards));
  }

  /* ── Move track ── */
  function moveTo(i, animate) {
    track.style.transition = animate
      ? 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'none';
    track.style.transform = `translateX(${-i * STEP}px)`;
    idx = i;
    updateDots(i);
  }

  /* Snap back when clones are exhausted */
  track.addEventListener('transitionend', () => {
    if (idx >= totalCards) {
      moveTo(idx - totalCards, false);
    }
    if (idx < 0) {
      moveTo(idx + totalCards, false);
    }
    busy = false;
  });

  function next() {
    if (busy) return;
    busy = true;
    moveTo(idx + 1, true);
  }

  function prev() {
    if (busy) return;
    busy = true;
    if (idx <= 0) {
      moveTo(totalCards, false);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        moveTo(totalCards - 1, true);
      }));
    } else {
      moveTo(idx - 1, true);
    }
  }

  function jumpTo(i) {
    busy = false;
    moveTo(i, true);
  }

  /* ── Auto-timer ── */
  function start() { timer = setInterval(next, INTERVAL); }
  function stop()  { clearInterval(timer); }

  /* ── Pause on hover ── */
  outer.addEventListener('mouseenter', stop);
  outer.addEventListener('mouseleave', start);

  /* ── Arrow buttons ── */
  btnPrev.addEventListener('click', () => { stop(); prev(); start(); });
  btnNext.addEventListener('click', () => { stop(); next(); start(); });

  /* ── Touch / swipe ── */
  outer.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  outer.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return;
    stop();
    dx < 0 ? next() : prev();
    start();
  }, { passive: true });

  /* ── Keyboard ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { stop(); prev(); start(); }
    if (e.key === 'ArrowRight') { stop(); next(); start(); }
  });

  start();
})();

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
