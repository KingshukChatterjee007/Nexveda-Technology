/* ==========================================================================
   LENIS BUTTERY SMOOTH SCROLL ENGINE
   ========================================================================== */
if (window.Lenis) {
  window._lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2
  });

  function raf(time) {
    window._lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* ==========================================================================
   MAGNETIC BUTTONS PHYSICS CHEAT CODE
   ========================================================================== */
document.querySelectorAll('.btn, .btn-primary-pill, .btn-nav-primary, .float-btn, .est-option-btn').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0) scale(1.03)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const progressBar = document.getElementById('scrollProgress');
const scrollTopBtn = document.getElementById('scrollTop');
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');
const testimonials = document.querySelectorAll('.testimonial');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
const counters = document.querySelectorAll('[data-count]');
const revealElements = document.querySelectorAll('.reveal');
const contactForm = document.getElementById('contactForm');
const formMessage = document.querySelector('.form-message');
const themeToggle = document.getElementById('themeToggle');

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
const savedTheme = localStorage.getItem('nexveda_theme');
if (savedTheme === 'light') {
  body.classList.add('light-theme');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    localStorage.setItem('nexveda_theme', isLight ? 'light' : 'dark');
  });
}

/* ==========================================================================
   DYNAMIC GLOWING LIGHT BEAMS & DENSE IRIDESCENT STREAM CANVAS (HERO BACKGROUND)
   ========================================================================== */
const heroCanvas = document.getElementById('heroCanvas');
if (heroCanvas) {
  const ctx = heroCanvas.getContext('2d');
  let width, height;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let isHeroVisible = true;
  let animFrameId = null;

  function resizeCanvas() {
    width = heroCanvas.width = heroCanvas.offsetWidth || window.innerWidth;
    height = heroCanvas.height = heroCanvas.offsetHeight || window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  window.addEventListener('mousemove', (e) => {
    if (!isHeroVisible) return;
    const rect = heroCanvas.getBoundingClientRect();
    targetMouseX = e.clientX - rect.left;
    targetMouseY = e.clientY - rect.top;
  }, { passive: true });

  // High-tech iridescent light stream colors
  const colorPalette = [
    { start: 'rgba(56, 189, 248, ', end: 'rgba(37, 99, 235, ' },    // Cyan to Electric Blue
    { start: 'rgba(14, 165, 233, ', end: 'rgba(29, 78, 216, ' },   // Sky Blue to Royal Blue
    { start: 'rgba(59, 130, 246, ', end: 'rgba(99, 102, 241, ' },   // Royal Blue to Indigo
    { start: 'rgba(52, 211, 153, ', end: 'rgba(6, 182, 212, ' },    // Emerald Mint to Cyan
    { start: 'rgba(56, 189, 248, ', end: 'rgba(14, 165, 233, ' },   // Light Cyan Accent
    { start: 'rgba(255, 255, 255, ', end: 'rgba(56, 189, 248, ' }   // Pure White Highlight
  ];

  // Create 100 stream fibers for silky 60 FPS performance
  const fiberCount = 100;
  const fibers = [];

  for (let i = 0; i < fiberCount; i++) {
    const isGlowBeam = i % 10 === 0;
    const isUltraThin = i % 3 === 0;

    fibers.push({
      bandOffset: (Math.random() - 0.35) * 800,
      progress: Math.random(),
      length: isGlowBeam ? Math.random() * 950 + 750 : Math.random() * 550 + 320,
      width: isGlowBeam ? Math.random() * 14 + 6 : (isUltraThin ? Math.random() * 1 + 0.5 : Math.random() * 3.5 + 1.5),
      speed: Math.random() * 0.0022 + 0.0007,
      opacity: isGlowBeam ? Math.random() * 0.24 + 0.1 : Math.random() * 0.65 + 0.22,
      colors: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      waveFreq: Math.random() * 0.004 + 0.002,
      waveAmp: Math.random() * 18 + 6,
      phase: Math.random() * Math.PI * 2
    });
  }

  // Floating embers / particle sparks flowing along the stream
  const sparkCount = 45;
  const sparks = [];
  for (let i = 0; i < sparkCount; i++) {
    sparks.push({
      x: Math.random() * (width || window.innerWidth),
      y: Math.random() * (height || window.innerHeight),
      vx: -(Math.random() * 1.2 + 0.4),
      vy: Math.random() * 1.2 + 0.4,
      radius: Math.random() * 2.5 + 0.8,
      alpha: Math.random() * 0.7 + 0.2,
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)].start
    });
  }

  let time = 0;

  function renderBeams() {
    if (!isHeroVisible) {
      animFrameId = null;
      return;
    }

    time += 1;
    ctx.clearRect(0, 0, width, height);

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    const isLight = body.classList.contains('light-theme');
    ctx.globalCompositeOperation = isLight ? 'source-over' : 'lighter';

    // Interactive Mouse Spotlight
    if (!isLight && mouseX > 0 && mouseY > 0) {
      const mouseGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 300);
      mouseGlow.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
      mouseGlow.addColorStop(0.5, 'rgba(37, 99, 235, 0.05)');
      mouseGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = mouseGlow;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 300, 0, Math.PI * 2);
      ctx.fill();
    }

    // Main Diagonal Stream Band coordinates:
    const startX = width * 0.92;
    const startY = -140;
    const endX = -180;
    const endY = height * 1.2;
    const totalDist = Math.hypot(endX - startX, endY - startY);

    const normDx = (endX - startX) / totalDist;
    const normDy = (endY - startY) / totalDist;
    const perpX = -normDy;
    const perpY = normDx;

    const parallaxX = (mouseX / (width || 1) - 0.5) * 45;
    const parallaxY = (mouseY / (height || 1) - 0.5) * 45;

    fibers.forEach((fiber) => {
      fiber.progress += fiber.speed;
      if (fiber.progress > 1.3) {
        fiber.progress = -0.3;
      }

      const currDist = fiber.progress * totalDist;
      const baseX = startX + normDx * currDist + perpX * fiber.bandOffset + parallaxX;
      const baseY = startY + normDy * currDist + perpY * fiber.bandOffset + parallaxY;

      const wave = Math.sin(time * fiber.waveFreq + fiber.phase) * fiber.waveAmp;
      const x1 = baseX + perpX * wave;
      const y1 = baseY + perpY * wave;

      const x2 = x1 + normDx * fiber.length;
      const y2 = y1 + normDy * fiber.length;

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      const alphaMult = isLight ? 0.35 : 1;
      gradient.addColorStop(0, fiber.colors.start + '0)');
      gradient.addColorStop(0.3, fiber.colors.start + (fiber.opacity * alphaMult) + ')');
      gradient.addColorStop(0.7, fiber.colors.end + (fiber.opacity * 0.85 * alphaMult) + ')');
      gradient.addColorStop(1, fiber.colors.end + '0)');

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = fiber.width;
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    // Render Floating Spark Embers
    sparks.forEach((spark) => {
      spark.x += spark.vx;
      spark.y += spark.vy;

      if (spark.x < -20 || spark.y > height + 20) {
        spark.x = Math.random() * width + 100;
        spark.y = Math.random() * (height * 0.6) - 50;
      }

      ctx.beginPath();
      ctx.arc(spark.x + parallaxX * 0.4, spark.y + parallaxY * 0.4, spark.radius, 0, Math.PI * 2);
      ctx.fillStyle = spark.color + (spark.alpha * (isLight ? 0.4 : 1)) + ')';
      ctx.fill();
    });

    animFrameId = requestAnimationFrame(renderBeams);
  }

  // IntersectionObserver to pause canvas animation when off-screen
  const canvasObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isHeroVisible = entry.isIntersecting;
      if (isHeroVisible && !animFrameId) {
        animFrameId = requestAnimationFrame(renderBeams);
      }
    });
  }, { threshold: 0.05 });
  canvasObserver.observe(heroCanvas);
}

/* Nav scroll state with requestAnimationFrame throttling */
let isScrollingTick = false;
window.addEventListener('scroll', () => {
  if (!isScrollingTick) {
    requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progressBar) progressBar.style.width = `${scrollPercent}%`;
      if (scrollTopBtn) scrollTopBtn.classList.toggle('show', scrollTop > 400);
      if (header) header.classList.toggle('scrolled', scrollTop > 12);
      isScrollingTick = false;
    });
    isScrollingTick = true;
  }
}, { passive: true });

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    const startPos = window.pageYOffset || document.documentElement.scrollTop;
    if (startPos === 0) return;
    const duration = Math.min(Math.max(startPos * 0.4, 600), 1200);
    const startTime = performance.now();

    function easeOutQuart(t) {
      const p = t - 1;
      return 1 - p * p * p * p;
    }

    function scrollStep(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      window.scrollTo(0, startPos * (1 - easedProgress));

      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      }
    }

    requestAnimationFrame(scrollStep);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.portfolio-card').forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

let testimonialIndex = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialTrack = document.querySelector('.testimonial-track');
const testimonialDots = document.querySelectorAll('.t-dot');
let autoSlideTimer = null;

function showTestimonial(index) {
  testimonialIndex = index;
  if (testimonialTrack) {
    testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
  }
  testimonialCards.forEach((card, pos) => {
    card.classList.toggle('active', pos === index);
  });
  testimonialDots.forEach((dot, pos) => {
    dot.classList.toggle('active', pos === index);
  });
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideTimer = setInterval(() => {
    const nextIdx = (testimonialIndex + 1) % (testimonialCards.length || 1);
    showTestimonial(nextIdx);
  }, 5000);
}

function stopAutoSlide() {
  if (autoSlideTimer) clearInterval(autoSlideTimer);
}

if (prevBtn && nextBtn && testimonialCards.length > 0) {
  prevBtn.addEventListener('click', () => {
    const nextIdx = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(nextIdx);
    startAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    const nextIdx = (testimonialIndex + 1) % testimonialCards.length;
    showTestimonial(nextIdx);
    startAutoSlide();
  });

  testimonialDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.dataset.index);
      showTestimonial(idx);
      startAutoSlide();
    });
  });

  const showcaseContainer = document.querySelector('.testimonial-showcase');
  if (showcaseContainer) {
    showcaseContainer.addEventListener('mouseenter', stopAutoSlide);
    showcaseContainer.addEventListener('mouseleave', startAutoSlide);
  }

  showTestimonial(0);
  startAutoSlide();
}

const animateCounter = (element) => {
  const target = Number(element.dataset.count);
  const duration = 1200;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    element.textContent = Math.round(target * progress);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = entry.target;
      if (target.dataset.count) {
        animateCounter(target);
        observer.unobserve(target);
      }

      if (target.classList.contains('reveal')) {
        target.classList.add('is-visible');
      }
    }
  });
}, { threshold: 0.18 });

counters.forEach((counter) => observer.observe(counter));
revealElements.forEach((element) => observer.observe(element));

/* ==========================================================================
   INSTANTANEOUS SCROLL APPEARANCE
   ========================================================================== */
// Make all reveal blocks instantaneously visible without scroll lag
document.querySelectorAll('.reveal, .section-heading, .portfolio-card, .service-card, .process-card, .stat-card').forEach((el) => {
  el.style.opacity = '1';
  el.style.transform = 'none';
});

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const message = formData.get('message')?.toString().trim();

    if (!name || !email || !message) {
      formMessage.textContent = 'Please fill out all required fields.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formMessage.textContent = 'Please enter a valid email address.';
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message })
      });

      if (response.ok) {
        const result = await response.json();
        formMessage.textContent = result.message || 'Thanks! Your message has been sent successfully.';
        if (result.success) {
          contactForm.reset();
        }
      } else {
        throw new Error('API unreachable or non-200 status');
      }
    } catch (error) {
      // Direct mailto fallback for static site environments (e.g., GitHub Pages)
      const mailtoUrl = `mailto:nexvedatechnologies@gmail.com?subject=${encodeURIComponent('Inquiry from ' + name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${message}`)}`;
      window.location.href = mailtoUrl;
      formMessage.textContent = 'Opening your mail application to send your inquiry directly...';
    }
  });
}

document.querySelectorAll('.btn').forEach((button) => {
  button.addEventListener('mousemove', (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    button.style.setProperty('--x', `${x}px`);
    button.style.setProperty('--y', `${y}px`);
  });
});

const heroFrameEl = document.querySelector('.hero-frame');
if (heroFrameEl) {
  heroFrameEl.addEventListener('mousemove', (event) => {
    const rect = heroFrameEl.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroFrameEl.style.transform = `perspective(1200px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
  });

  heroFrameEl.addEventListener('mouseleave', () => {
    heroFrameEl.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
}

/* ==========================================================================
   SANCHIT SHARMA BIO POP-UP MODAL (CS ENGINEER & GRAPHIC DESIGNER)
   ========================================================================== */
const sanchitProfileData = {
  name: "SANCHIT SHARMA",
  role: "COMPUTER SCIENCE ENGINEER & GRAPHIC DESIGNER",
  location: "Kullu, Himachal Pradesh",
  phone: "+91 8988113310",
  email: "sanchitsharma217@gmail.com",
  portfolioDriveUrl: "https://drive.google.com/drive/folders/1TXFO2RcOHy6ZZeLkG_eoywY4tv8XvkxY?usp=drive_link",
  avatarUrl: "assets/images/sanchit-sharma.jpg",
  summary: "Detail-oriented Computer Science Engineering Graduate and creative Graphic Designer specializing in visual communication, branding, and high-impact graphic design using Adobe Photoshop. Experienced in crafting high-converting YouTube thumbnails, promotional banners, posters, and social media assets. Combines technical problem-solving with dynamic visual execution to deliver clean, modern, and brand-aligned assets.",
  skillsDesign: ["Adobe Photoshop", "Visual Branding", "YouTube Thumbnail Design", "Banner & Poster Design", "Typography", "Social Media Creatives"],
  skillsTech: ["Computer Science Fundamentals", "Internet Research", "Microsoft Office", "Creative Problem Solving", "Team Collaboration"],
  projects: [
    { title: "YouTube Gaming Media", desc: "Designed customized, high-CTR (click-through rate) thumbnails and channel branding assets tailored for competitive gaming content." },
    { title: "Commercial & Business Branding", desc: "Created high-impact promotional posters, print graphics, and banners for regional travel agencies and local businesses to boost market engagement." },
    { title: "Digital Marketing Content", desc: "Developed cohesive social media marketing campaigns focusing on color psychology, composition, and visual hierarchy." }
  ],
  education: {
    degree: "B.Tech – Computer Science",
    college: "Indo Global College of Engineering",
    graduated: "July 2025",
    cgpa: "7.0 / 10"
  },
  strengths: ["Creative Problem Solving", "Fast Learner", "Attention to Detail", "Adaptability"],
  languages: ["English (Professional)", "Hindi (Native)"]
};

const teamModal = document.getElementById('teamModal');
const teamModalOverlay = document.getElementById('teamModalOverlay');
const teamModalClose = document.getElementById('teamModalClose');
const teamModalContent = document.getElementById('teamModalContent');
const sanchitBioBtn = document.getElementById('sanchitBioBtn');

function openSanchitModal() {
  const data = sanchitProfileData;

  const skillsDesignHtml = data.skillsDesign.map(s => `<span class="modal-chip modal-chip-design">${s}</span>`).join('');
  const skillsTechHtml = data.skillsTech.map(s => `<span class="modal-chip">${s}</span>`).join('');
  
  const projectsHtml = data.projects.map(p => `
    <div class="modal-project-item">
      <h6>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
        ${p.title}
      </h6>
      <p>${p.desc}</p>
    </div>
  `).join('');

  const strengthsHtml = data.strengths.map(s => `
    <span class="modal-chip modal-chip-strength">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      ${s}
    </span>
  `).join('');

  const languagesHtml = data.languages.join(' • ');

  teamModalContent.innerHTML = `
    <div class="modal-header-box">
      <div class="modal-avatar-frame">
        <img src="${data.avatarUrl}" alt="${data.name}" class="modal-avatar-img" />
      </div>
      <div class="modal-header-info">
        <span class="modal-role-badge">${data.role}</span>
        <h2>${data.name}</h2>
        <div class="modal-contact-row">
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${data.location}
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <a href="tel:${data.phone.replace(/[^0-9+]/g,'')}">${data.phone}</a>
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><polyline points="2,4 12,13 22,4"></polyline></svg>
            <a href="mailto:${data.email}">${data.email}</a>
          </span>
        </div>
      </div>
    </div>

    <!-- Live Google Drive Portfolio Showcase Banner -->
    <div class="modal-drive-banner">
      <div class="drive-banner-info">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        <span><strong>Live Design Portfolio:</strong> Explore YouTube Thumbnails, Banners &amp; Photoshop Projects</span>
      </div>
      <a href="${data.portfolioDriveUrl}" target="_blank" rel="noopener" class="btn-drive-link">
        <span>Open Drive Portfolio</span>
      </a>
    </div>

    <div class="modal-section-body">
      <div>
        <div class="modal-block-title">Professional Summary</div>
        <p class="modal-summary-text">${data.summary}</p>
      </div>

      <div class="modal-skills-box">
        <div class="modal-block-title">Technical &amp; Design Skills</div>
        <div class="modal-skills-group">
          <h5>GRAPHIC DESIGN &amp; CREATIVE TOOLS</h5>
          <div class="modal-chips-wrap">${skillsDesignHtml}</div>
        </div>
        <div class="modal-skills-group">
          <h5>TECHNICAL &amp; CORE COMPETENCIES</h5>
          <div class="modal-chips-wrap">${skillsTechHtml}</div>
        </div>
      </div>

      <div>
        <div class="modal-block-title">Key Projects &amp; Creative Portfolio</div>
        ${projectsHtml}
      </div>

      <div>
        <div class="modal-block-title">Education</div>
        <div class="modal-edu-card">
          <div class="modal-edu-info">
            <h6>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
              ${data.education.degree}
            </h6>
            <span>${data.education.college} • Graduated: ${data.education.graduated}</span>
          </div>
          <span class="modal-edu-badge">CGPA: ${data.education.cgpa}</span>
        </div>
      </div>

      <div>
        <div class="modal-block-title">Strengths &amp; Languages</div>
        <div class="modal-chips-wrap" style="margin-bottom:0.8rem;">${strengthsHtml}</div>
        <div class="modal-languages-row">
          <strong>Languages:</strong> ${languagesHtml}
        </div>
      </div>
    </div>
  `;

  if (teamModal) {
    teamModal.classList.add('active');
    teamModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window._lenis) window._lenis.stop();
  }
}

function closeTeamModal() {
  if (teamModal) {
    teamModal.classList.remove('active');
    teamModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (window._lenis) window._lenis.start();
  }
}

if (sanchitBioBtn) {
  sanchitBioBtn.addEventListener('click', openSanchitModal);
}

/* ==========================================================================
   MEET PAVAGADHI BIO POP-UP MODAL (WEB DEVELOPER & ANIMATOR • FOUNDER)
   ========================================================================== */
const meetProfileData = {
  name: "MEET PAVAGADHI",
  role: "WEB DEVELOPER AND ANIMATOR • FOUNDER",
  location: "Gujarat, India",
  phone: "+91 9824999054",
  email: "haneypavagadhi1234@gmail.com",
  resumePdfUrl: "assets/resumes/meet-pavagadhi-resume.pdf",
  avatarUrl: "images/meet-pavagadhi.jpg",
  summary: "Hi, I'm Meet — a developer and designer specializing in 3D animation, game development, web design, and graphic design. With expertise in Blender, Maya, and Adobe Creative Suite, I create engaging visuals, interactive experiences, and high-performance digital products. Passionate about turning ideas into impactful results through creativity, technical precision, and attention to detail.",
  skillsDesign: ["Web Design", "Design Thinking", "Wireframe Creation", "3D Animation (Blender, Maya, 3ds Max, Cinema 4D)", "Graphic Design (Photoshop, Illustrator)", "Video Editing (Premiere Pro, After Effects)"],
  skillsTech: ["Front End Coding (HTML, CSS, JS)", "React & Angular", "Unity & Unreal Engine", "API Integration & WebSockets", "Responsive UX/UI Architecture"],
  experience: [
    { title: "3D Animation Specialist", subtitle: "Freelancer • 2021 - Present", desc: "Created high-quality 3D animations for games, films, and advertisements. Skilled in Maya, Blender, 3ds Max, Cinema 4D, character modeling, rigging, and Unity/Unreal integration." },
    { title: "Web Developer", subtitle: "Freelancer • 2022 - Present", desc: "Designed & developed responsive web platforms using HTML, CSS, JavaScript, React, and Angular for clients including FETC, Parikshaa, Zclick Media, and Gym Systems." },
    { title: "Graphic Design & Video Editing", subtitle: "Z click Media & Freelance • 2021 - 2026", desc: "Crafted marketing materials, social posts, banners, and video edits using Photoshop, Illustrator, Premiere Pro, and After Effects." }
  ],
  education: [
    { degree: "B.Sc. Information & Technology", institution: "Veer Narmad South Gujarat University", years: "2019 - 2022" },
    { degree: "3D Animation Specialization", institution: "Sanju Design Factory", years: "2021 - 2022" },
    { degree: "Game Development Engineering", institution: "Online Platform", years: "2020 - 2022" }
  ],
  strengths: ["Creative & Technical Synergy", "3D Asset Optimization", "Full-Stack Web Engineering", "Problem Solving"],
  languages: ["English (Professional)", "Gujarati (Native)", "Hindi (Fluent)"]
};

const meetBioBtn = document.getElementById('meetBioBtn');

function openMeetModal() {
  const data = meetProfileData;

  const skillsDesignHtml = data.skillsDesign.map(s => `<span class="modal-chip modal-chip-design">${s}</span>`).join('');
  const skillsTechHtml = data.skillsTech.map(s => `<span class="modal-chip">${s}</span>`).join('');
  
  const expHtml = data.experience.map(e => `
    <div class="modal-project-item">
      <h6>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
        ${e.title}
        <span style="font-size:0.75rem; font-weight:600; color:#38bdf8; margin-left:auto;">${e.subtitle}</span>
      </h6>
      <p>${e.desc}</p>
    </div>
  `).join('');

  const eduHtml = data.education.map(ed => `
    <div class="modal-edu-card" style="margin-bottom:0.6rem;">
      <div class="modal-edu-info">
        <h6>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
          ${ed.degree}
        </h6>
        <span>${ed.institution}</span>
      </div>
      <span class="modal-edu-badge">${ed.years}</span>
    </div>
  `).join('');

  const strengthsHtml = data.strengths.map(s => `
    <span class="modal-chip modal-chip-strength">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      ${s}
    </span>
  `).join('');

  const languagesHtml = data.languages.join(' • ');

  teamModalContent.innerHTML = `
    <div class="modal-header-box">
      <div class="modal-avatar-frame">
        <img src="${data.avatarUrl}" alt="${data.name}" class="modal-avatar-img" />
      </div>
      <div class="modal-header-info">
        <span class="modal-role-badge">${data.role}</span>
        <h2>${data.name}</h2>
        <div class="modal-contact-row">
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${data.location}
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <a href="tel:${data.phone.replace(/[^0-9+]/g,'')}">${data.phone}</a>
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><polyline points="2,4 12,13 22,4"></polyline></svg>
            <a href="mailto:${data.email}">${data.email}</a>
          </span>
        </div>
      </div>
    </div>

    <!-- Official PDF Resume Download Banner -->
    <div class="modal-drive-banner">
      <div class="drive-banner-info">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <polyline points="9 15 12 18 15 15"></polyline>
        </svg>
        <span><strong>Official Resume Document:</strong> Download Meet Pavagadhi's complete PDF CV</span>
      </div>
      <a href="${data.resumePdfUrl}" target="_blank" download class="btn-drive-link">
        <span>Download PDF Resume</span>
      </a>
    </div>

    <div class="modal-section-body">
      <div>
        <div class="modal-block-title">Profile &amp; Executive Summary</div>
        <p class="modal-summary-text">${data.summary}</p>
      </div>

      <div class="modal-skills-box">
        <div class="modal-block-title">Core Skills &amp; Technical Capabilities</div>
        <div class="modal-skills-group">
          <h5>WEB &amp; GAME DEVELOPMENT</h5>
          <div class="modal-chips-wrap">${skillsTechHtml}</div>
        </div>
        <div class="modal-skills-group">
          <h5>3D ANIMATION &amp; CREATIVE DESIGN</h5>
          <div class="modal-chips-wrap">${skillsDesignHtml}</div>
        </div>
      </div>

      <div>
        <div class="modal-block-title">Professional Experience</div>
        ${expHtml}
      </div>

      <div>
        <div class="modal-block-title">Education &amp; Specialization</div>
        ${eduHtml}
      </div>

      <div>
        <div class="modal-block-title">Strengths &amp; Languages</div>
        <div class="modal-chips-wrap" style="margin-bottom:0.8rem;">${strengthsHtml}</div>
        <div class="modal-languages-row">
          <strong>Languages:</strong> ${languagesHtml}
        </div>
      </div>
    </div>
  `;

  if (teamModal) {
    teamModal.classList.add('active');
    teamModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window._lenis) window._lenis.stop();
  }
}

if (sanchitBioBtn) {
  sanchitBioBtn.addEventListener('click', openSanchitModal);
}

if (meetBioBtn) {
  meetBioBtn.addEventListener('click', openMeetModal);
}

/* ==========================================================================
   KINGSHUK CHATTERJEE BIO POP-UP MODAL (SOFTWARE DEVELOPER & ML ENGINEER)
   ========================================================================== */
const kingshukProfileData = {
  name: "KINGSHUK CHATTERJEE",
  role: "SOFTWARE DEVELOPER & MACHINE LEARNING ENGINEER",
  location: "Quatre Bornes, Mauritius • KIIT Odisha",
  phone: "+230 58636016",
  email: "kingshuk.chatterjee770@gmail.com",
  resumePdfUrl: "assets/resumes/kingshuk-chatterjee-resume.pdf",
  avatarUrl: "assets/images/kingshuk-chatterjee.jpg",
  summary: "Software Developer & Machine Learning Engineer specializing in full-stack web platforms, Physics-Informed Neural Networks (PINNs), and high-performance AVX2 C++/CUDA GPU systems. Experienced in developing scalable React & Python education platforms, edge AI platforms, and real-time distributed loggers.",
  skillsDesign: ["Figma UX/UI", "System Architecture Design", "Web Infrastructure", "Technical Documentation"],
  skillsTech: ["Python", "JavaScript", "Rust", "C & C++", "SQL", "React.js & Node.js", "Flask & FastAPI", "PyTorch & TensorFlow", "MongoDB & PostgreSQL", "Supabase & Firebase", "AVX2 SIMD & CUDA Kernels", "OpenAI Triton"],
  experience: [
    { title: "Full Stack Developer (Part-time)", subtitle: "Nexveda Technologies • Jan 2026 – Present", desc: "Developed a full-stack education platform using React.js, Python, MongoDB, and PostgreSQL; engineered RESTful APIs for scalable frontend-backend integration." },
    { title: "Frontend Developer (Freelance)", subtitle: "Ionic Design • Apr 2026", desc: "Delivered responsive web interfaces using HTML, CSS, and Python-based tooling." },
    { title: "Network & Systems Intern", subtitle: "Indian Oil Corporation Ltd (IOCL) • Nov 2024 – Jan 2025", desc: "Worked with industrial networking infrastructure and Cisco networking protocols." }
  ],
  projects: [
    { title: "OmniRay : AVX2 Deep RL Active SLAM Engine", desc: "Implemented a custom C++ AVX2 SIMD raycaster with 0.038ms scan times (79x faster than PyMunk) and CNN-MLP PPO agent with 95.1% drift reduction." },
    { title: "Dynamic Gradient PINNs", desc: "Developed a ResSIREN-Fourier PINN with PCGrad achieving 32,700x forward inference speedup over OpenFOAM." },
    { title: "Krishi Sahayak : AI Agricultural Platform", desc: "NIELIT Government-funded platform supporting 50+ active beta users with Flutter, FastAPI, and TFLite edge CNN disease detection." },
    { title: "Sys Logger : Distributed Network Logger", desc: "NIELIT Government-funded distributed system monitoring 100+ active network endpoints in real time with PM2." }
  ],
  education: [
    { degree: "B.Tech in Computer Science & Engineering", institution: "KIIT University, Bhubaneswar, Odisha", years: "2022 – 2026" }
  ],
  strengths: ["High-Performance C++/CUDA", "Deep RL & PINNs", "Full-Stack Web Engineering", "SIMD Optimization"],
  languages: ["English (Professional)", "Hindi (Fluent)"]
};

const kingshukBioBtn = document.getElementById('kingshukBioBtn');

function openKingshukModal() {
  const data = kingshukProfileData;

  const skillsDesignHtml = data.skillsDesign.map(s => `<span class="modal-chip modal-chip-design">${s}</span>`).join('');
  const skillsTechHtml = data.skillsTech.map(s => `<span class="modal-chip">${s}</span>`).join('');
  
  const expHtml = data.experience.map(e => `
    <div class="modal-project-item">
      <h6>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
        ${e.title}
        <span style="font-size:0.75rem; font-weight:600; color:#38bdf8; margin-left:auto;">${e.subtitle}</span>
      </h6>
      <p>${e.desc}</p>
    </div>
  `).join('');

  const projectsHtml = data.projects.map(p => `
    <div class="modal-project-item">
      <h6>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        ${p.title}
      </h6>
      <p>${p.desc}</p>
    </div>
  `).join('');

  const eduHtml = data.education.map(ed => `
    <div class="modal-edu-card" style="margin-bottom:0.6rem;">
      <div class="modal-edu-info">
        <h6>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
          ${ed.degree}
        </h6>
        <span>${ed.institution}</span>
      </div>
      <span class="modal-edu-badge">${ed.years}</span>
    </div>
  `).join('');

  const strengthsHtml = data.strengths.map(s => `
    <span class="modal-chip modal-chip-strength">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      ${s}
    </span>
  `).join('');

  const languagesHtml = data.languages.join(' • ');

  teamModalContent.innerHTML = `
    <div class="modal-header-box">
      <div class="modal-avatar-frame">
        <img src="${data.avatarUrl}" alt="${data.name}" class="modal-avatar-img" />
      </div>
      <div class="modal-header-info">
        <span class="modal-role-badge">${data.role}</span>
        <h2>${data.name}</h2>
        <div class="modal-contact-row">
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${data.location}
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <a href="tel:${data.phone.replace(/[^0-9+]/g,'')}">${data.phone}</a>
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><polyline points="2,4 12,13 22,4"></polyline></svg>
            <a href="mailto:${data.email}">${data.email}</a>
          </span>
        </div>
      </div>
    </div>

    <!-- Official PDF Resume Download Banner -->
    <div class="modal-drive-banner">
      <div class="drive-banner-info">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <polyline points="9 15 12 18 15 15"></polyline>
        </svg>
        <span><strong>Official Resume Document:</strong> Download Kingshuk Chatterjee's complete PDF CV</span>
      </div>
      <a href="${data.resumePdfUrl}" target="_blank" download class="btn-drive-link">
        <span>Download PDF Resume</span>
      </a>
    </div>

    <div class="modal-section-body">
      <div>
        <div class="modal-block-title">Profile &amp; Technical Summary</div>
        <p class="modal-summary-text">${data.summary}</p>
      </div>

      <div class="modal-skills-box">
        <div class="modal-block-title">Technical Skills &amp; AI Frameworks</div>
        <div class="modal-skills-group">
          <h5>FULL STACK &amp; ML SYSTEMS</h5>
          <div class="modal-chips-wrap">${skillsTechHtml}</div>
        </div>
        <div class="modal-skills-group">
          <h5>SYSTEM ARCHITECTURE &amp; UI</h5>
          <div class="modal-chips-wrap">${skillsDesignHtml}</div>
        </div>
      </div>

      <div>
        <div class="modal-block-title">Professional Experience</div>
        ${expHtml}
      </div>

      <div>
        <div class="modal-block-title">Selected High-Performance ML &amp; Systems Projects</div>
        ${projectsHtml}
      </div>

      <div>
        <div class="modal-block-title">Education</div>
        ${eduHtml}
      </div>

      <div>
        <div class="modal-block-title">Core Competencies &amp; Languages</div>
        <div class="modal-chips-wrap" style="margin-bottom:0.8rem;">${strengthsHtml}</div>
        <div class="modal-languages-row">
          <strong>Languages:</strong> ${languagesHtml}
        </div>
      </div>
    </div>
  `;

  if (teamModal) {
    teamModal.classList.add('active');
    teamModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window._lenis) window._lenis.stop();
  }
}

/* ==========================================================================
   AYUSH RANJAN BIO POP-UP MODAL (SOFTWARE ENGINEER & FULL STACK DEVELOPER)
   ========================================================================== */
const ayushProfileData = {
  name: "AYUSH RANJAN",
  role: "SOFTWARE ENGINEER & FULL STACK DEVELOPER",
  location: "Muzaffarpur, Bihar • KIIT Odisha",
  phone: "+91 88252 01016",
  email: "ranjanayush881@gmail.com",
  resumePdfUrl: "assets/resumes/ayush-ranjan-resume.pdf",
  avatarUrl: "assets/images/ayush-ranjan.jpg",
  summary: "Software Engineer specializing in full-stack web platforms, database schema optimization (Supabase, PostgreSQL, MySQL), systems programming (Rust, C), and AI/ML model integration. Experienced in building responsive LLM chat interfaces, real-time distributed monitoring dashboards, and high-accuracy mobile AI applications.",
  skillsDesign: ["UI/UX Strategy", "Figma Design", "Database Architecture", "System Telemetry"],
  skillsTech: ["Python", "Java", "JavaScript", "TypeScript", "C", "Dart", "Rust", "SQL", "React.js", "Node.js", "Flutter", "Next.js", "TensorFlow", "PyTorch", "scikit-learn", "MySQL", "MongoDB", "Supabase", "PostgreSQL", "SQLite", "Docker", "Kubernetes", "Git", "REST APIs", "CI/CD", "Linux"],
  experience: [
    { title: "Tech Intern", subtitle: "Yellow Slice • May 2025 – Dec 2025", desc: "Designed and normalized Supabase database schema for Holivus app, reducing redundant records by 40% and boosting data retrieval speed. Implemented modular UI components in Next.js and Flutter leading to a 30% gain in application performance." },
    { title: "Frontend Developer Intern", subtitle: "Tecosys • Jun 2024 – May 2025", desc: "Engineered a fully responsive LLM-integrated chat interface using React.js. Integrated RESTful APIs with optimized asynchronous data flow, improving response speed by 25%. Directed a 4-member development team." }
  ],
  projects: [
    { title: "Apex OS - Neural-Native Operating System", desc: "Building a research-grade OS in Rust with RL-based CPU scheduling and neural flight control (SAS) for swarm robotics; swarm hive-mind architecture and fail-secure TPM 2.0 hardening." },
    { title: "Sys Logger - Real-Time System Monitoring", desc: "Full-stack distributed systems dashboard providing real-time CPU, RAM, GPU and network telemetry with Flask API, Next.js frontend, Docker containerization, deployed at NIELIT Bhubaneswar." },
    { title: "Krishi-Sahayogi - Smart Farming App", desc: "Full-stack mobile app in Flutter with MobileNetV2 AI model achieving 98.3% accuracy for 50+ crops, weather integration, and live mandi data." }
  ],
  education: [
    { degree: "B.Tech in Computer Science & Engineering", institution: "KIIT University, Bhubaneswar, Odisha", years: "2022 – 2026" }
  ],
  strengths: ["Full-Stack Web Engineering", "Database Optimization", "Systems Programming (Rust/C)", "AI/ML & Mobile Integration"],
  languages: ["English (Professional)", "Hindi (Native/Fluent)"]
};

const ayushBioBtn = document.getElementById('ayushBioBtn');

function openAyushModal() {
  const data = ayushProfileData;

  const skillsDesignHtml = data.skillsDesign.map(s => `<span class="modal-chip modal-chip-design">${s}</span>`).join('');
  const skillsTechHtml = data.skillsTech.map(s => `<span class="modal-chip">${s}</span>`).join('');
  
  const expHtml = data.experience.map(e => `
    <div class="modal-project-item">
      <h6>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
        ${e.title}
        <span style="font-size:0.75rem; font-weight:600; color:#38bdf8; margin-left:auto;">${e.subtitle}</span>
      </h6>
      <p>${e.desc}</p>
    </div>
  `).join('');

  const projectsHtml = data.projects.map(p => `
    <div class="modal-project-item">
      <h6>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        ${p.title}
      </h6>
      <p>${p.desc}</p>
    </div>
  `).join('');

  const eduHtml = data.education.map(ed => `
    <div class="modal-edu-card" style="margin-bottom:0.6rem;">
      <div class="modal-edu-info">
        <h6>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
          ${ed.degree}
        </h6>
        <span>${ed.institution}</span>
      </div>
      <span class="modal-edu-badge">${ed.years}</span>
    </div>
  `).join('');

  const strengthsHtml = data.strengths.map(s => `
    <span class="modal-chip modal-chip-strength">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      ${s}
    </span>
  `).join('');

  const languagesHtml = data.languages.join(' • ');

  teamModalContent.innerHTML = `
    <div class="modal-header-box">
      <div class="modal-avatar-frame">
        <img src="${data.avatarUrl}" alt="${data.name}" class="modal-avatar-img" />
      </div>
      <div class="modal-header-info">
        <span class="modal-role-badge">${data.role}</span>
        <h2>${data.name}</h2>
        <div class="modal-contact-row">
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${data.location}
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <a href="tel:${data.phone.replace(/[^0-9+]/g,'')}">${data.phone}</a>
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><polyline points="2,4 12,13 22,4"></polyline></svg>
            <a href="mailto:${data.email}">${data.email}</a>
          </span>
        </div>
      </div>
    </div>

    <!-- Official PDF Resume Download Banner -->
    <div class="modal-drive-banner">
      <div class="drive-banner-info">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <polyline points="9 15 12 18 15 15"></polyline>
        </svg>
        <span><strong>Official Resume Document:</strong> Download Ayush Ranjan's complete PDF CV</span>
      </div>
      <a href="${data.resumePdfUrl}" target="_blank" download class="btn-drive-link">
        <span>Download PDF Resume</span>
      </a>
    </div>

    <div class="modal-section-body">
      <div>
        <div class="modal-block-title">Profile &amp; Technical Summary</div>
        <p class="modal-summary-text">${data.summary}</p>
      </div>

      <div class="modal-skills-box">
        <div class="modal-block-title">Technical Skills &amp; Frameworks</div>
        <div class="modal-skills-group">
          <h5>LANGUAGES &amp; FULL STACK</h5>
          <div class="modal-chips-wrap">${skillsTechHtml}</div>
        </div>
        <div class="modal-skills-group">
          <h5>SYSTEM ARCHITECTURE &amp; UX</h5>
          <div class="modal-chips-wrap">${skillsDesignHtml}</div>
        </div>
      </div>

      <div>
        <div class="modal-block-title">Professional Experience</div>
        ${expHtml}
      </div>

      <div>
        <div class="modal-block-title">Selected Projects</div>
        ${projectsHtml}
      </div>

      <div>
        <div class="modal-block-title">Education</div>
        ${eduHtml}
      </div>

      <div>
        <div class="modal-block-title">Core Competencies &amp; Languages</div>
        <div class="modal-chips-wrap" style="margin-bottom:0.8rem;">${strengthsHtml}</div>
        <div class="modal-languages-row">
          <strong>Languages:</strong> ${languagesHtml}
        </div>
      </div>
    </div>
  `;

  if (teamModal) {
    teamModal.classList.add('active');
    teamModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window._lenis) window._lenis.stop();
  }
}

if (meetBioBtn) {
  meetBioBtn.addEventListener('click', openMeetModal);
}

if (kingshukBioBtn) {
  kingshukBioBtn.addEventListener('click', openKingshukModal);
}

if (ayushBioBtn) {
  ayushBioBtn.addEventListener('click', openAyushModal);
}

if (teamModalOverlay) teamModalOverlay.addEventListener('click', closeTeamModal);
if (teamModalClose) teamModalClose.addEventListener('click', closeTeamModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && teamModal && teamModal.classList.contains('active')) {
    closeTeamModal();
  }
});

/* ==========================================================================
   INTERACTIVE CUSTOM GLOWING MAGNETIC CURSOR
   ========================================================================== */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
  let mouseX = -100, mouseY = -100;
  let dotX = -100, dotY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function renderCursor() {
    dotX += (mouseX - dotX) * 0.5;
    dotY += (mouseY - dotY) * 0.5;
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  const hoverables = document.querySelectorAll('a, button, input, textarea, select, label, .portfolio-card, .service-card, .process-card, .est-option-btn');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('hovering');
      cursorRing.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('hovering');
      cursorRing.classList.remove('hovering');
    });
  });

  window.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.borderRadius = '50%';
    ripple.style.border = '2px solid #38bdf8';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9999';
    ripple.style.transform = 'translate(-50%, -50%) scale(1)';
    ripple.style.transition = 'transform 0.5s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.5s ease';
    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.style.transform = 'translate(-50%, -50%) scale(5)';
      ripple.style.opacity = '0';
    }, 10);

    setTimeout(() => ripple.remove(), 550);
  });
}

/* ==========================================================================
   INTERACTIVE PROJECT ESTIMATOR CALCULATOR LOGIC
   ========================================================================== */
const projectTypeBtns = document.querySelectorAll('#projectTypeOptions .est-option-btn');
const speedBtns = document.querySelectorAll('#speedOptions .est-speed-btn');
const featureCheckboxes = document.querySelectorAll('.est-feature');
const estimatedPriceEl = document.getElementById('estimatedPrice');
const estimatedDaysEl = document.getElementById('estimatedDays');
const summaryScopeEl = document.getElementById('summaryScope');
const summaryAddonsEl = document.getElementById('summaryAddons');
const applyEstimateBtn = document.getElementById('applyEstimateBtn');

function calculateEstimate() {
  if (!estimatedPriceEl) return;

  let basePrice = 399;
  let baseDays = 5;
  let selectedScope = 'Landing Page';

  const activeTypeBtn = document.querySelector('#projectTypeOptions .est-option-btn.active');
  if (activeTypeBtn) {
    basePrice = parseFloat(activeTypeBtn.dataset.basePrice) || 399;
    baseDays = parseInt(activeTypeBtn.dataset.days, 10) || 5;
    selectedScope = activeTypeBtn.dataset.name || 'Landing Page';
  }

  let speedMultiplier = 1;
  let daysMod = 0;
  const activeSpeedBtn = document.querySelector('#speedOptions .est-speed-btn.active');
  if (activeSpeedBtn) {
    speedMultiplier = parseFloat(activeSpeedBtn.dataset.multiplier) || 1;
    daysMod = parseInt(activeSpeedBtn.dataset.daysMod, 10) || 0;
  }

  let featurePriceTotal = 0;
  let featureDaysTotal = 0;
  let featureCount = 0;
  let activeFeatureNames = [];

  featureCheckboxes.forEach((cb) => {
    if (cb.checked) {
      featurePriceTotal += parseFloat(cb.dataset.price) || 0;
      featureDaysTotal += parseInt(cb.dataset.days, 10) || 0;
      featureCount++;
      activeFeatureNames.push(cb.dataset.name);
    }
  });

  const finalPrice = Math.round((basePrice + featurePriceTotal) * speedMultiplier);
  const minDays = Math.max(3, Math.round(baseDays + featureDaysTotal + daysMod));
  const maxDays = Math.round(minDays * 1.3);

  // Animated Price Counter
  const currentPrice = parseInt(estimatedPriceEl.textContent, 10) || 0;
  const startTime = performance.now();
  const duration = 400;

  function animatePrice(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const interpolated = Math.round(currentPrice + (finalPrice - currentPrice) * progress);
    estimatedPriceEl.textContent = interpolated;
    if (progress < 1) requestAnimationFrame(animatePrice);
  }
  requestAnimationFrame(animatePrice);

  estimatedDaysEl.textContent = `${minDays} - ${maxDays} Business Days`;
  if (summaryScopeEl) summaryScopeEl.textContent = selectedScope;
  if (summaryAddonsEl) summaryAddonsEl.textContent = `${featureCount} Selected`;

  // Return formatted summary text for form auto-fill
  return {
    price: finalPrice,
    days: `${minDays}-${maxDays} Days`,
    scope: selectedScope,
    features: activeFeatureNames.join(', ') || 'None'
  };
}

if (projectTypeBtns.length > 0) {
  projectTypeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectTypeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      calculateEstimate();
    });
  });

  speedBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      speedBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      calculateEstimate();
    });
  });

  featureCheckboxes.forEach((cb) => {
    cb.addEventListener('change', calculateEstimate);
  });

  if (applyEstimateBtn) {
    applyEstimateBtn.addEventListener('click', () => {
      const estimateData = calculateEstimate();
      const messageInput = document.getElementById('messageInput');
      const contactSection = document.getElementById('contact');

      if (messageInput && estimateData) {
        messageInput.value = `Hi Nexveda Team,\n\nI calculated an estimated quote on your website for a [${estimateData.scope}] with the following specs:\n• Active Features: ${estimateData.features}\n• Estimated Investment: $${estimateData.price} USD\n• Estimated Timeline: ${estimateData.days}\n\nI would love to discuss starting this project with you!`;
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (messageInput) messageInput.focus();
        }, 600);
      }
    });
  }

  // Initial calculation
  calculateEstimate();
}

/* ==========================================================================
   3D CARD HOVER PERSPECTIVE TILT
   ========================================================================== */
const tiltCards = document.querySelectorAll('.portfolio-card, .service-card, .process-card-front, .stat-card');
tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ==========================================================================
   PORTFOLIO CASE STUDY POP-UP MODAL LOGIC
   ========================================================================== */
const caseModal = document.getElementById('caseModal');
const caseModalOverlay = document.getElementById('caseModalOverlay');
const caseModalClose = document.getElementById('caseModalClose');
const caseModalContent = document.getElementById('caseModalContent');

const caseStudiesData = {
  'PayPulse Global': {
    category: 'Fintech & Payments',
    title: 'PayPulse Global Enterprise Gateway',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80',
    description: 'PayPulse is a next-generation multi-currency payment platform engineered for cross-border SaaS companies. We architected a microservices backend capable of handling 50k+ transactions per minute with sub-50ms gateway latency.',
    metric: '⚡ 4.2x Faster Checkout Velocity & 99.99% Gateway Uptime',
    tech: ['React', 'TypeScript', 'Node.js', 'Express', 'Redis', 'PostgreSQL', 'Stripe API']
  },
  'InsightFlow Analytics': {
    category: 'Analytics Dashboard',
    title: 'InsightFlow Realtime Telemetry Platform',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    description: 'A data visualizer application providing enterprise devops teams real-time system metrics, automated error alerts, and interactive dashboard charts.',
    metric: '📊 Realtime WebSockets Data Processing for 10M+ Daily Logs',
    tech: ['Next.js', 'React', 'MongoDB', 'Chart.js', 'WebSockets', 'Tailwind']
  },
  'CloudMint SaaS Portal': {
    category: 'SaaS Platform',
    title: 'CloudMint Subscription Management Portal',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
    description: 'Complete user account, onboarding flow, and automated invoice management solution serving over 10,000 active SaaS subscribers.',
    metric: '🚀 10,000+ Active Users & Automated Stripe Webhooks',
    tech: ['Next.js', 'Node.js', 'SQLite', 'Tailwind', 'REST API']
  },
  'Apex Vision Brand Identity': {
    category: 'Branding & Design System',
    title: 'Apex Vision Vector Brand System',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=80',
    description: 'Comprehensive visual branding package including scalable vector icon sets, dark/light design system guidelines, typography scales, and promotional media kit.',
    metric: '🎨 Complete Design System Token Guidelines',
    tech: ['Figma', 'Illustrator', 'Design Tokens', 'CSS Variables']
  },
  'Veloce Fintech Portal': {
    category: 'Fintech & Trading',
    title: 'Veloce High-Frequency Trading Interface',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=900&q=80',
    description: 'High-speed web dashboard for financial traders featuring real-time candle charts, order book feeds, and sub-millisecond websocket updates.',
    metric: '📈 99.99% Live Service Uptime',
    tech: ['React', 'TypeScript', 'WebSockets', 'Canvas API']
  }
};

function openCaseStudy(title) {
  const data = caseStudiesData[title] || {
    category: 'Featured Work',
    title: title,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    description: 'A custom high-performance web development project built by Nexveda Technologies.',
    metric: '⭐ 100/100 Core Web Vitals & Premium Glass UI',
    tech: ['React', 'Node.js', 'HTML5', 'CSS3']
  };

  const techChips = data.tech.map((t) => `<span class="modal-chip modal-chip-design">${t}</span>`).join(' ');

  if (caseModalContent) {
    caseModalContent.innerHTML = `
      <div class="case-modal-inner">
        <span class="summary-badge">${data.category}</span>
        <h2>${data.title}</h2>
        <div class="case-modal-grid">
          <div class="case-media">
            <img src="${data.image}" alt="${data.title}" />
          </div>
          <div class="case-details">
            <p>${data.description}</p>
            <div class="case-meta">
              <div class="meta-block">
                <strong>Impact &amp; Key Metric:</strong>
                <span>${data.metric}</span>
              </div>
              <div class="meta-block">
                <strong>Technologies Used:</strong>
                <div class="tech-chips-row">${techChips}</div>
              </div>
            </div>
            <div class="case-actions">
              <a href="#contact" class="btn btn-primary-pill" onclick="closeCaseModal()">
                <span>Inquire About Similar Build</span>
                <svg class="btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (caseModal) {
    caseModal.classList.add('active');
    caseModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window._lenis) window._lenis.stop();
  }
}

function closeCaseModal() {
  if (caseModal) {
    caseModal.classList.remove('active');
    caseModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (window._lenis) window._lenis.start();
  }
}

// Bind case study links
document.querySelectorAll('.portfolio-card .btn-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const cardTitle = link.closest('.portfolio-card')?.querySelector('h3')?.textContent?.trim();
    if (cardTitle) {
      openCaseStudy(cardTitle);
    }
  });
});

if (caseModalOverlay) caseModalOverlay.addEventListener('click', closeCaseModal);
if (caseModalClose) caseModalClose.addEventListener('click', closeCaseModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && caseModal && caseModal.classList.contains('active')) {
    closeCaseModal();
  }
});

/* ==========================================================================
   INTERACTIVE GLOBAL CONSTELLATION MESH CANVAS BACKGROUND
   ========================================================================== */
const globalCanvas = document.getElementById('globalCanvas');
if (globalCanvas) {
  const gCtx = globalCanvas.getContext('2d');
  let gWidth = 0, gHeight = 0;
  let gMouseX = -1000, gMouseY = -1000;

  function resizeGlobalCanvas() {
    gWidth = globalCanvas.width = window.innerWidth;
    gHeight = globalCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeGlobalCanvas, { passive: true });
  resizeGlobalCanvas();

  window.addEventListener('mousemove', (e) => {
    gMouseX = e.clientX;
    gMouseY = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    gMouseX = -1000;
    gMouseY = -1000;
  });

  // Create Constellation Nodes
  const nodeCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 18000), 75);
  const nodes = [];

  const blueShades = [
    'rgba(56, 189, 248, ',  // Cyan Accent
    'rgba(37, 99, 235, ',   // Electric Blue
    'rgba(96, 165, 250, ',  // Sky Blue
    'rgba(0, 242, 254, '    // Neon Aqua
  ];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * (gWidth || window.innerWidth),
      y: Math.random() * (gHeight || window.innerHeight),
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2.2 + 1,
      baseAlpha: Math.random() * 0.45 + 0.2,
      color: blueShades[Math.floor(Math.random() * blueShades.length)]
    });
  }

  const connectDist = 140;
  const mouseRadius = 200;

  function animateGlobalConstellation() {
    gCtx.clearRect(0, 0, gWidth, gHeight);

    const isLight = document.body.classList.contains('light-theme');
    const alphaMultiplier = isLight ? 0.35 : 1;

    // Update & Draw Nodes
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];

      // Update position
      n1.x += n1.vx;
      n1.y += n1.vy;

      // Bounce off screen boundaries
      if (n1.x < 0 || n1.x > gWidth) n1.vx *= -1;
      if (n1.y < 0 || n1.y > gHeight) n1.vy *= -1;

      // Mouse attraction physics
      const dxMouse = gMouseX - n1.x;
      const dyMouse = gMouseY - n1.y;
      const distMouse = Math.hypot(dxMouse, dyMouse);

      if (distMouse < mouseRadius) {
        const pull = (1 - distMouse / mouseRadius) * 0.035;
        n1.x += dxMouse * pull;
        n1.y += dyMouse * pull;

        // Draw glowing laser line tether to mouse cursor
        const laserAlpha = (1 - distMouse / mouseRadius) * 0.6 * alphaMultiplier;
        gCtx.beginPath();
        gCtx.moveTo(n1.x, n1.y);
        gCtx.lineTo(gMouseX, gMouseY);
        gCtx.strokeStyle = `rgba(0, 242, 254, ${laserAlpha})`;
        gCtx.lineWidth = 1.2;
        gCtx.stroke();
      }

      // Draw node dot
      gCtx.beginPath();
      gCtx.arc(n1.x, n1.y, n1.radius * (distMouse < mouseRadius ? 1.5 : 1), 0, Math.PI * 2);
      gCtx.fillStyle = n1.color + (n1.baseAlpha * alphaMultiplier) + ')';
      gCtx.fill();

      // Connect Node Pairs
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.hypot(dx, dy);

        if (dist < connectDist) {
          const lineAlpha = (1 - dist / connectDist) * 0.28 * alphaMultiplier;
          gCtx.beginPath();
          gCtx.moveTo(n1.x, n1.y);
          gCtx.lineTo(n2.x, n2.y);
          gCtx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
          gCtx.lineWidth = 0.8;
          gCtx.stroke();
        }
      }
    }

    requestAnimationFrame(animateGlobalConstellation);
  }

  requestAnimationFrame(animateGlobalConstellation);
}

/* ==========================================================================
   THREE.JS DENSE PREMIUM 3D SCENE — REFERENCE-MATCHED
   Packed wireframes, glass code cubes, floating symbols, node connections
   ========================================================================== */
const bg3dCanvas = document.getElementById('bg3dCanvas');
if (bg3dCanvas && window.THREE) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 32;

  const renderer = new THREE.WebGLRenderer({ canvas: bg3dCanvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Rich Multi-Point Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const dirLight1 = new THREE.DirectionalLight(0xc084fc, 1.8);
  dirLight1.position.set(25, 25, 20);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
  dirLight2.position.set(-20, -15, -10);
  scene.add(dirLight2);

  const pointLight1 = new THREE.PointLight(0x7c3aed, 2.5, 60);
  pointLight1.position.set(15, 5, 10);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x06b6d4, 1.8, 50);
  pointLight2.position.set(-10, -8, 5);
  scene.add(pointLight2);

  // ── FRESNEL SHADER MATERIALS ──
  const fresnelVS = `
    varying vec3 vNormal;
    varying vec3 vViewPos;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vViewPos = -mv.xyz;
      gl_Position = projectionMatrix * mv;
    }
  `;
  const fresnelFS = `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float baseOpacity;
    varying vec3 vNormal;
    varying vec3 vViewPos;
    void main() {
      vec3 n = normalize(vNormal);
      vec3 v = normalize(vViewPos);
      float fresnel = pow(1.0 - abs(dot(v, n)), 2.8);
      vec3 col = mix(color1, color2, fresnel);
      gl_FragColor = vec4(col, baseOpacity + fresnel * 0.55);
    }
  `;

  function makeFresnel(c1, c2, wire, opacity) {
    return new THREE.ShaderMaterial({
      vertexShader: fresnelVS,
      fragmentShader: fresnelFS,
      uniforms: {
        color1: { value: new THREE.Color(c1) },
        color2: { value: new THREE.Color(c2) },
        baseOpacity: { value: opacity }
      },
      wireframe: wire,
      transparent: true,
      depthWrite: false
    });
  }

  const matWireViolet  = makeFresnel(0x7c3aed, 0x38bdf8, true, 0.40);
  const matWireCyan    = makeFresnel(0x38bdf8, 0xc084fc, true, 0.40);
  const matWirePink    = makeFresnel(0xa855f7, 0x06b6d4, true, 0.35);
  const matGlassViolet = makeFresnel(0x7c3aed, 0x38bdf8, false, 0.15);
  const matGlassCyan   = makeFresnel(0x06b6d4, 0xc084fc, false, 0.12);

  // ── LAYER GROUPS (different parallax speeds) ──
  const layerFar   = new THREE.Group(); // 0.15x scroll
  const layerMid   = new THREE.Group(); // 0.5x scroll
  const layerNear  = new THREE.Group(); // 1.0x scroll
  scene.add(layerFar);
  scene.add(layerMid);
  scene.add(layerNear);

  // ── HYBRID SOLID GLASS CORE + FRESNEL WIREFRAME OVERLAY SYSTEM ──
  const glassCoreMatViolet = new THREE.MeshPhongMaterial({
    color: 0x6d28d9,
    emissive: 0x2e1065,
    specular: 0x38bdf8,
    shininess: 150,
    transparent: true,
    opacity: 0.38,
    side: THREE.DoubleSide
  });

  const glassCoreMatCyan = new THREE.MeshPhongMaterial({
    color: 0x0284c7,
    emissive: 0x075985,
    specular: 0xc084fc,
    shininess: 150,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide
  });

  // Helper to create a voluminous 3D Hybrid Glass Object (Solid Glass + Wireframe Overlay)
  function createHybridGlassMesh(geometry, wireMat, glassMat, scaleOffset = 1.01) {
    const group = new THREE.Group();
    const glassMesh = new THREE.Mesh(geometry, glassMat);
    
    // Create slightly enlarged wireframe overlay
    const wireMesh = new THREE.Mesh(geometry.clone(), wireMat);
    wireMesh.scale.setScalar(scaleOffset);

    group.add(glassMesh);
    group.add(wireMesh);
    return group;
  }

  // ── FLOATING 3D GLASS UI WINDOW CARDS (Matching Reference Image) ──
  function create3DUICardMesh(symbol, isPrimary = true) {
    const cardGroup = new THREE.Group();
    
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');

    // Rounded card fill with gradient border
    ctx.fillStyle = isPrimary ? 'rgba(99, 102, 241, 0.85)' : 'rgba(30, 27, 75, 0.85)';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(0, 0, 256, 180, 24);
    } else {
      ctx.rect(0, 0, 256, 180);
    }
    ctx.fill();

    ctx.strokeStyle = isPrimary ? '#c084fc' : '#38bdf8';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Window Header Bar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(0, 0, 256, 48);

    // Control Dots
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(24, 24, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(44, 24, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(64, 24, 6, 0, Math.PI * 2); ctx.fill();

    // Center Code Logo / Symbol
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 58px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, 128, 118);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;

    const cardMat = new THREE.MeshPhongMaterial({
      map: tex,
      transparent: true,
      opacity: 0.9,
      specular: 0x38bdf8,
      shininess: 150,
      side: THREE.DoubleSide
    });

    const cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.5), cardMat);
    cardGroup.add(cardMesh);
    return cardGroup;
  }

  // 1. Top UI Window Card (near torus knot top-left)
  const uiCard1 = create3DUICardMesh('</>', true);
  uiCard1.position.set(7, 5, 2);
  uiCard1.rotation.set(0.2, 0.4, -0.15);
  layerNear.add(uiCard1);

  // 2. Center UI Window Card (lower middle)
  const uiCard2 = create3DUICardMesh('</>', false);
  uiCard2.position.set(11, -7, 1);
  uiCard2.rotation.set(-0.3, 0.3, 0.1);
  layerNear.add(uiCard2);

  // Background Deep Torus Knot Ribbon (Large looping infinity weave)
  const bgRibbonGeo = new THREE.TorusKnotGeometry(11, 0.85, 180, 20);
  const bgRibbonMat = makeFresnel(0x8b5cf6, 0xec4899, true, 0.22);
  const bgRibbonMesh = new THREE.Mesh(bgRibbonGeo, bgRibbonMat);
  bgRibbonMesh.position.set(12, 0, -14);
  layerFar.add(bgRibbonMesh);

  // ══════════════════════════════════════════════════════════════
  // HERO CLUSTER — Dense Voluminous 3D Glass Objects on RIGHT
  // ══════════════════════════════════════════════════════════════

  // Main Hero Torus Knot (Solid Translucent Glass Core + Fresnel Wireframe Overlay)
  const heroTorusGeo = new THREE.TorusKnotGeometry(5.5, 1.5, 120, 20);
  const heroTorus = createHybridGlassMesh(heroTorusGeo, matWireViolet, glassCoreMatViolet, 1.012);
  heroTorus.position.set(14, 3, 2);
  layerNear.add(heroTorus);

  // Secondary Torus Knot (overlapping fluid geometry)
  const heroTorus2Geo = new THREE.TorusKnotGeometry(4.0, 1.0, 90, 16);
  const heroTorus2 = createHybridGlassMesh(heroTorus2Geo, matWireCyan, glassCoreMatCyan, 1.015);
  heroTorus2.position.set(10, -2, -3);
  heroTorus2.rotation.set(0.5, 0.8, 0);
  layerNear.add(heroTorus2);

  // Large Torus Ring behind them
  const heroRingGeo = new THREE.TorusGeometry(7, 0.6, 16, 80);
  const heroRing = createHybridGlassMesh(heroRingGeo, matWirePink, glassCoreMatViolet, 1.01);
  heroRing.position.set(16, 1, -5);
  heroRing.rotation.set(0.3, 0.5, 0.2);
  layerMid.add(heroRing);

  // Icosahedron (medium, left of torus cluster)
  const heroIcosaGeo = new THREE.IcosahedronGeometry(3.2, 1);
  const heroIcosa = createHybridGlassMesh(heroIcosaGeo, matWireCyan, glassCoreMatCyan, 1.02);
  heroIcosa.position.set(4, -3, -1);
  layerNear.add(heroIcosa);

  // Small Octahedron (top right)
  const heroOcta1Geo = new THREE.OctahedronGeometry(2.0, 0);
  const heroOcta1 = createHybridGlassMesh(heroOcta1Geo, matWireViolet, glassCoreMatViolet, 1.02);
  heroOcta1.position.set(22, 8, -2);
  layerMid.add(heroOcta1);

  // Small Dodecahedron (bottom right)
  const heroDodecaGeo = new THREE.DodecahedronGeometry(2.5, 0);
  const heroDodeca = createHybridGlassMesh(heroDodecaGeo, matWirePink, glassCoreMatViolet, 1.02);
  heroDodeca.position.set(20, -8, -4);
  layerMid.add(heroDodeca);

  // Tetrahedron (scattered)
  const heroTetraGeo = new THREE.TetrahedronGeometry(1.8, 0);
  const heroTetra = createHybridGlassMesh(heroTetraGeo, matWireCyan, glassCoreMatCyan, 1.02);
  heroTetra.position.set(6, 8, -3);
  layerMid.add(heroTetra);

  // Wireframe Glass Sphere (far background)
  const heroSphereGeo = new THREE.SphereGeometry(3.5, 16, 12);
  const heroSphere = createHybridGlassMesh(heroSphereGeo, matWirePink, glassCoreMatViolet, 1.01);
  heroSphere.position.set(22, 0, -10);
  layerFar.add(heroSphere);

  // Extra icosahedron bottom-left
  const heroIcosa2Geo = new THREE.IcosahedronGeometry(2.8, 0);
  const heroIcosa2 = createHybridGlassMesh(heroIcosa2Geo, matWireViolet, glassCoreMatViolet, 1.02);
  heroIcosa2.position.set(-4, -10, -2);
  layerMid.add(heroIcosa2);

  // Extra small octahedrons scattered
  const scatterOcta1Geo = new THREE.OctahedronGeometry(1.2, 0);
  const scatterOcta1 = createHybridGlassMesh(scatterOcta1Geo, matWireCyan, glassCoreMatCyan, 1.02);
  scatterOcta1.position.set(-8, 6, -5);
  layerFar.add(scatterOcta1);

  const scatterOcta2Geo = new THREE.OctahedronGeometry(1.0, 0);
  const scatterOcta2 = createHybridGlassMesh(scatterOcta2Geo, matWireViolet, glassCoreMatViolet, 1.02);
  scatterOcta2.position.set(25, -4, -7);
  layerFar.add(scatterOcta2);

  // ══════════════════════════════════════════════════════════════
  // FLOATING 3D TECH PROCESSOR CHIP (Bottom Right - Reference Matched)
  // ══════════════════════════════════════════════════════════════
  function createTechChipMesh() {
    const chipGroup = new THREE.Group();
    
    // Main Silicon Base Plate
    const baseGeo = new THREE.BoxGeometry(4.5, 3.2, 0.4);
    const baseMat = new THREE.MeshPhongMaterial({
      color: 0x1e1b4b,
      emissive: 0x312e81,
      specular: 0x38bdf8,
      shininess: 120,
      transparent: true,
      opacity: 0.85
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    chipGroup.add(baseMesh);

    // Glowing Inner Die
    const dieGeo = new THREE.BoxGeometry(2.2, 1.6, 0.45);
    const dieMat = new THREE.MeshPhongMaterial({
      color: 0x7c3aed,
      emissive: 0x6d28d9,
      specular: 0x38bdf8,
      shininess: 160
    });
    const dieMesh = new THREE.Mesh(dieGeo, dieMat);
    chipGroup.add(dieMesh);

    // Pin Traces around chip
    for (let p = -1.8; p <= 1.8; p += 0.45) {
      const pinGeo = new THREE.BoxGeometry(0.15, 0.6, 0.1);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const pinTop = new THREE.Mesh(pinGeo, pinMat);
      pinTop.position.set(p, 1.8, 0);
      const pinBot = new THREE.Mesh(pinGeo, pinMat);
      pinBot.position.set(p, -1.8, 0);
      chipGroup.add(pinTop);
      chipGroup.add(pinBot);
    }

    return chipGroup;
  }

  const techChip = createTechChipMesh();
  techChip.position.set(16, -11, 0);
  techChip.rotation.set(-0.4, 0.6, -0.2);
  layerNear.add(techChip);

  // ══════════════════════════════════════════════════════════════
  // SECTION OBJECTS — Spread across page height for scrolling
  // ══════════════════════════════════════════════════════════════

  const sectionObjects = [];
  const sectionConfigs = [
    { geo: new THREE.IcosahedronGeometry(4, 1),    matW: matWireCyan,   matG: glassCoreMatCyan,   pos: [-17, -28, -4] },
    { geo: new THREE.OctahedronGeometry(4.5, 0),   matW: matWireViolet, matG: glassCoreMatViolet, pos: [17, -55, -2] },
    { geo: new THREE.TorusGeometry(5, 1.4, 16, 50),matW: matWirePink,   matG: glassCoreMatViolet, pos: [-15, -90, -4] },
    { geo: new THREE.DodecahedronGeometry(4.2, 0), matW: matWireViolet, matG: glassCoreMatViolet, pos: [16, -125, -3] },
    { geo: new THREE.OctahedronGeometry(4.8, 1),   matW: matWireCyan,   matG: glassCoreMatCyan,   pos: [-16, -155, -3] },
    { geo: new THREE.TorusKnotGeometry(3.8, 1.0, 80, 16), matW: matWireViolet, matG: glassCoreMatViolet, pos: [15, -190, -2] },
    { geo: new THREE.IcosahedronGeometry(4.5, 2),  matW: matWirePink,   matG: glassCoreMatCyan,   pos: [-16, -220, -4] },
    { geo: new THREE.DodecahedronGeometry(5.0, 0), matW: matWireViolet, matG: glassCoreMatViolet, pos: [16, -255, -3] }
  ];

  sectionConfigs.forEach(cfg => {
    const meshGroup = createHybridGlassMesh(cfg.geo, cfg.matW, cfg.matG, 1.015);
    meshGroup.position.set(...cfg.pos);
    layerNear.add(meshGroup);
    sectionObjects.push(meshGroup);
  });

  // ══════════════════════════════════════════════════════════════
  // GLASS CODE CUBES — Translucent 3D Glossy Cubes with Code Symbols
  // ══════════════════════════════════════════════════════════════

  function createCodeCubeTexture(symbol, bgColor, textColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Translucent glass face
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 128, 128);

    // Border glow
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 120, 120);

    // Code symbol
    ctx.fillStyle = textColor;
    ctx.font = 'bold 44px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, 64, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  const cubeSymbols = [
    { sym: '{ }',   pos: [8, 6, -2],   size: 1.8, rot: [0.3, 0.5, 0.1] },
    { sym: '</>',   pos: [20, -5, -1],  size: 1.5, rot: [0.8, 0.2, 0.4] },
    { sym: '{...}', pos: [12, -7, 1],   size: 1.4, rot: [0.1, 0.9, 0.3] },
    { sym: '</>', pos: [-6, 4, -3],   size: 1.3, rot: [0.6, 0.3, 0.7] },
    { sym: '[ ]',   pos: [24, 5, -4],   size: 1.2, rot: [0.4, 0.7, 0.2] },
    { sym: '{ }',   pos: [-2, -6, -5],  size: 1.6, rot: [0.2, 0.4, 0.8] },
    { sym: '< >',   pos: [18, 9, -3],   size: 1.1, rot: [0.7, 0.1, 0.5] },
    { sym: '=>',    pos: [6, -10, -2],  size: 1.3, rot: [0.5, 0.6, 0.1] },
    { sym: '::',    pos: [-10, -3, -6], size: 1.0, rot: [0.9, 0.2, 0.3] },
    { sym: '( )',   pos: [26, -9, -5],  size: 1.2, rot: [0.3, 0.8, 0.6] },
    // More cubes deeper in page
    { sym: '{ }',   pos: [-12, -40, -3], size: 1.5, rot: [0.4, 0.5, 0.2] },
    { sym: '</>',   pos: [14, -70, -2],  size: 1.4, rot: [0.2, 0.7, 0.5] },
    { sym: '[ ]',   pos: [-8, -100, -4], size: 1.3, rot: [0.6, 0.3, 0.8] },
    { sym: '=>',    pos: [18, -130, -3], size: 1.2, rot: [0.1, 0.9, 0.4] },
    { sym: '{...}', pos: [-14, -160, -5],size: 1.5, rot: [0.7, 0.2, 0.6] },
  ];

  const codeCubes = [];
  cubeSymbols.forEach(cfg => {
    const tex = createCodeCubeTexture(cfg.sym, 'rgba(124, 58, 237, 0.3)', 'rgba(192, 132, 252, 1)');
    const mat = new THREE.MeshPhongMaterial({
      map: tex,
      transparent: true,
      opacity: 0.75,
      specular: 0x38bdf8,
      shininess: 120,
      side: THREE.DoubleSide
    });
    const cube = new THREE.Mesh(new THREE.BoxGeometry(cfg.size, cfg.size, cfg.size), mat);
    cube.position.set(...cfg.pos);
    cube.rotation.set(...cfg.rot);
    cube.userData = { baseY: cfg.pos[1], speed: 0.3 + Math.random() * 0.7, rotSpeed: 0.002 + Math.random() * 0.006 };
    layerMid.add(cube);
    codeCubes.push(cube);
  });

  // ══════════════════════════════════════════════════════════════
  // FLOATING CODE SYMBOL PARTICLES — { } < > + ; / => scattered
  // ══════════════════════════════════════════════════════════════

  function createSymbolSprite(symbol) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(196, 181, 253, 0.9)';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, 32, 32);
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.8 });
    return new THREE.Sprite(mat);
  }

  const symbolChars = ['{ }', '</>', '+', ';', '=>', '< >', '::',  '[ ]', '( )', '&&', '||', '!=', '++'];
  const floatingSymbols = [];

  for (let i = 0; i < 80; i++) {
    const char = symbolChars[Math.floor(Math.random() * symbolChars.length)];
    const sprite = createSymbolSprite(char);
    const x = (Math.random() - 0.5) * 70;
    const y = (Math.random() - 0.5) * 320;
    const z = (Math.random() - 0.5) * 40 - 5;
    sprite.position.set(x, y, z);
    const scale = 0.5 + Math.random() * 1.2;
    sprite.scale.set(scale, scale, 1);
    sprite.userData = { baseY: y, driftSpeed: 0.1 + Math.random() * 0.4, phase: Math.random() * Math.PI * 2 };
    layerFar.add(sprite);
    floatingSymbols.push(sprite);
  }

  // ══════════════════════════════════════════════════════════════
  // STAR / DUST PARTICLE FIELD
  // ══════════════════════════════════════════════════════════════

  // Particle field across height
  const particleGeo = new THREE.BufferGeometry();
  const particleCount = 500;
  const posArray = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    posArray[i]     = (Math.random() - 0.5) * 100;
    posArray[i + 1] = (Math.random() - 0.5) * 350;
    posArray[i + 2] = (Math.random() - 0.5) * 60;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particleMat = new THREE.PointsMaterial({ size: 0.35, color: 0xc4b5fd, transparent: true, opacity: 0.65 });
  const particles = new THREE.Points(particleGeo, particleMat);
  layerFar.add(particles);

  // ══════════════════════════════════════════════════════════════
  // INTERACTIVE NODE CONNECTIONS — Glowing lines between nearby nodes
  // ══════════════════════════════════════════════════════════════

  const connectionMat = new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.15 });
  const maxConnectionDist = 12;
  let connectionLines = [];

  function getNodePositions() {
    const nodes = [];
    codeCubes.forEach(c => {
      const wp = new THREE.Vector3();
      c.getWorldPosition(wp);
      nodes.push(wp);
    });
    return nodes;
  }

  function updateConnections() {
    // Remove old lines
    connectionLines.forEach(l => scene.remove(l));
    connectionLines = [];

    const nodes = getNodePositions();
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < maxConnectionDist) {
          const geo = new THREE.BufferGeometry().setFromPoints([nodes[i], nodes[j]]);
          const opacity = 0.15 * (1 - dist / maxConnectionDist);
          const mat = new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: opacity });
          const line = new THREE.Line(geo, mat);
          scene.add(line);
          connectionLines.push(line);
        }
      }
    }
  }

  // ══════════════════════════════════════════════════════════════
  // MOUSE & SCROLL TRACKING
  // ══════════════════════════════════════════════════════════════

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let frameCount = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.025;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.025;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });

  // ══════════════════════════════════════════════════════════════
  // RENDER LOOP
  // ══════════════════════════════════════════════════════════════

  function render3dScene() {
    frameCount++;
    const time = frameCount * 0.01;

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // ── Hero Object Rotations + Mouse Tilt ──
    heroTorus.rotation.x += 0.004;
    heroTorus.rotation.y += 0.006;
    heroTorus.rotation.x += targetY * 0.008;
    heroTorus.rotation.y += targetX * 0.008;

    heroTorus2.rotation.x += 0.005;
    heroTorus2.rotation.y -= 0.004;

    heroRing.rotation.x += 0.003;
    heroRing.rotation.z += 0.002;

    heroIcosa.rotation.x += 0.006;
    heroIcosa.rotation.y += 0.004;

    heroOcta1.rotation.x += 0.005;
    heroOcta1.rotation.z += 0.007;

    heroDodeca.rotation.y += 0.006;
    heroDodeca.rotation.z += 0.003;

    heroTetra.rotation.x += 0.008;
    heroTetra.rotation.y += 0.005;

    heroSphere.rotation.y += 0.002;

    heroIcosa2.rotation.x += 0.005;
    heroIcosa2.rotation.z += 0.004;

    scatterOcta1.rotation.x += 0.004;
    scatterOcta1.rotation.y += 0.006;

    scatterOcta2.rotation.z += 0.005;

    // ── Floating UI Window Cards Hover Physics ──
    uiCard1.position.y = 5 + Math.sin(time * 1.2) * 0.4;
    uiCard1.rotation.y = 0.4 + Math.cos(time * 0.8) * 0.08 + targetX * 0.005;

    uiCard2.position.y = -7 + Math.sin(time * 1.0 + 1.5) * 0.35;
    uiCard2.rotation.x = -0.3 + Math.sin(time * 0.7) * 0.06 + targetY * 0.005;

    // ── Background Looping Infinity Torus Ribbon ──
    bgRibbonMesh.rotation.x += 0.002;
    bgRibbonMesh.rotation.y += 0.003;

    // ── Section Object Rotations ──
    sectionObjects.forEach((obj, i) => {
      obj.rotation.x += 0.004 + i * 0.001;
      obj.rotation.y += 0.003 + i * 0.0008;
    });

    // ── Code Cubes: Hover Float + Slow Rotation ──
    codeCubes.forEach((cube) => {
      cube.position.y = cube.userData.baseY + Math.sin(time * cube.userData.speed + cube.userData.speed) * 0.6;
      cube.rotation.x += cube.userData.rotSpeed;
      cube.rotation.y += cube.userData.rotSpeed * 0.7;
    });

    // ── Floating Symbols: Gentle Drift ──
    floatingSymbols.forEach((sprite) => {
      sprite.position.y = sprite.userData.baseY + Math.sin(time * sprite.userData.driftSpeed + sprite.userData.phase) * 0.8;
    });

    // ── Particles Drift ──
    particles.rotation.y += 0.0005;

    // ── Update Node Connections every 8 frames ──
    if (frameCount % 8 === 0) {
      updateConnections();
    }

    // ── Camera: Mouse Tilt Inertia ──
    camera.position.x = targetX * 0.6;
    camera.position.y = -targetY * 0.6;
    camera.lookAt(scene.position);

    // ── Multi-Layer Parallax Scroll ──
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollPercent = scrollY / maxScroll;

    layerNear.position.y = scrollPercent * 260;   // 1.0x velocity
    layerMid.position.y  = scrollPercent * 140;   // 0.5x velocity
    layerFar.position.y  = scrollPercent * 45;    // 0.15x velocity

    renderer.render(scene, camera);
    requestAnimationFrame(render3dScene);
  }

  requestAnimationFrame(render3dScene);
}

/* ==========================================================================
   FAQ SMOOTH ACCORDION TOGGLE
   ========================================================================== */
(function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-summary');
    if (!trigger) return;

    trigger.addEventListener('click', () => toggleFaqItem(item, faqItems));
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFaqItem(item, faqItems);
      }
    });
  });

  function toggleFaqItem(clickedItem, allItems) {
    const isOpen = clickedItem.classList.contains('is-open');

    // Close all other items smoothly
    allItems.forEach(otherItem => {
      if (otherItem !== clickedItem && otherItem.classList.contains('is-open')) {
        otherItem.classList.remove('is-open');
      }
    });

    // Toggle clicked item
    if (isOpen) {
      clickedItem.classList.remove('is-open');
    } else {
      clickedItem.classList.add('is-open');
    }
  }
})();

/* ==========================================================================
   PREVENT BACKGROUND SCROLL LEAK WHEN MODAL POPUP IS ACTIVE
   ========================================================================== */
document.addEventListener('wheel', (e) => {
  const activeModal = document.querySelector('.team-modal.active');
  if (!activeModal) return;

  // Prevent scrolling on the background overlay outside the modal container
  if (!e.target.closest('.team-modal-container')) {
    e.preventDefault();
  }
}, { passive: false });
