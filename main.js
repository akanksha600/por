/* =============================================
   AKANKSHA OMANE PORTFOLIO - MAIN JS
   ============================================= */

// ======= RGB PARTICLE CANVAS =======
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLORS = ['#00f5ff', '#ff00ff', '#00ff88', '#ffff00', '#ff6600', '#0066ff'];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 300 + 200;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife ||
        this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

// Connect nearby particles with RGB lines
function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.15;
        ctx.strokeStyle = particles[i].color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ======= CUSTOM CURSOR =======
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animateCursor() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  cursorTrail.style.left = tx + 'px';
  cursorTrail.style.top = ty + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// RGB Cursor Color Shift
let hue = 0;
setInterval(() => {
  hue = (hue + 2) % 360;
  const col = `hsl(${hue}, 100%, 60%)`;
  cursor.style.background = col;
  cursor.style.boxShadow = `0 0 15px ${col}, 0 0 30px ${col}`;
  cursorTrail.style.borderColor = col;
}, 30);

document.querySelectorAll('a, button, .gallery-item, .achievement-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursorTrail.style.width = '50px';
    cursorTrail.style.height = '50px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    cursorTrail.style.width = '30px';
    cursorTrail.style.height = '30px';
  });
});

// ======= TYPING ANIMATION =======
const typingEl = document.getElementById('typingText');
const roles = [
  'B.Tech Student 💻',
  'AI Enthusiast 🤖',
  'Problem Solver 🧩',
  'Web Developer 🌐',
  'Innovator 🚀',
  'Design Thinker 🎨'
];
let roleIdx = 0, charIdx = 0, isDeleting = false;

function typeRole() {
  const current = roles[roleIdx];
  if (!isDeleting) {
    typingEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeRole, isDeleting ? 60 : 100);
}
typeRole();

// ======= NAVBAR =======
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 300);
  highlightNav();
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 80;
  sections.forEach(sec => {
    const top = sec.offsetTop, height = sec.offsetHeight, id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.style.color = scrollY >= top && scrollY < top + height
        ? 'var(--accent)' : '';
    }
  });
}

// ======= DARK / LIGHT MODE =======
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
  // Flash effect
  document.body.style.transition = 'all 0.5s ease';
});

// ======= SCROLL REVEAL =======
const reveals = document.querySelectorAll('.glass-card, .section-header, .tech-badge, .achievement-card, .project-card, .gallery-item, .contact-card');

reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

reveals.forEach(el => observer.observe(el));

// ======= SKILL BARS =======
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-card').forEach(card => skillObserver.observe(card));

// ======= ACHIEVEMENTS FILTER =======
const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
const cards = document.querySelectorAll('.achievement-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    cards.forEach(card => {
      const cat = card.dataset.category;
      const show = filter === 'all' || cat === filter;
      card.style.display = show ? 'block' : 'none';
      if (show) {
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeInUp 0.4s ease forwards';
      }
    });
  });
});

// ======= GALLERY FILTER =======
const galFilterBtns = document.querySelectorAll('.filter-btn[data-gfilter]');
const galItems = document.querySelectorAll('.gallery-item');

galFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    galFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.gfilter;
    galItems.forEach(item => {
      const cat = item.dataset.gcategory;
      item.style.display = (filter === 'all' || cat === filter) ? 'block' : 'none';
    });
  });
});

// ======= LIGHTBOX =======
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

function openLightbox(src, caption) {
  if (!src || src === '') return;
  lightboxImg.src = src;
  lightboxCaption.textContent = caption || '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

// Close lightbox on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// Expose globally
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

// ======= CONTACT FORM =======
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    formNote.textContent = '';
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
      formNote.textContent = '✅ Message sent! I\'ll get back to you soon.';
      formNote.style.color = '#00ff88';
      contactForm.reset();
      setTimeout(() => { formNote.textContent = ''; }, 5000);
    }, 1500);
  });
}

// ======= BACK TO TOP =======
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ======= RGB GLOW ON SCROLL =======
// Animate nav border with RGB on scroll
let scrollHue = 0;
window.addEventListener('scroll', () => {
  scrollHue = (scrollHue + 0.5) % 360;
  navbar.style.borderBottomColor = `hsla(${scrollHue}, 100%, 60%, 0.25)`;
});

// ======= STAR FIELD / MOUSE PARALLAX =======
document.addEventListener('mousemove', (e) => {
  const rings = document.querySelectorAll('.rgb-ring');
  const xPct = (e.clientX / window.innerWidth - 0.5) * 20;
  const yPct = (e.clientY / window.innerHeight - 0.5) * 20;
  rings.forEach((ring, i) => {
    const factor = (i + 1) * 0.3;
    ring.style.transform = `translate(calc(-50% + ${xPct * factor}px), calc(-50% + ${yPct * factor}px))`;
  });
});

// ======= ADD KEYFRAMES DYNAMICALLY =======
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);

// ======= CONSOLE EASTER EGG =======
console.log('%c 🚀 Akanksha Omane Portfolio ', 'background: linear-gradient(135deg, #00f5ff, #ff00ff); color: #050508; font-size: 18px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
console.log('%c Built with ❤️ | B.Tech 1st Year Student ', 'color: #00f5ff; font-size: 12px;');
