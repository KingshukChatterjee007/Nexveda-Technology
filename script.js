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
    { start: 'rgba(168, 85, 247, ', end: 'rgba(236, 72, 153, ' },   // Deep Violet to Magenta
    { start: 'rgba(59, 130, 246, ', end: 'rgba(99, 102, 241, ' },   // Royal Blue to Indigo
    { start: 'rgba(52, 211, 153, ', end: 'rgba(6, 182, 212, ' },    // Emerald Mint to Cyan
    { start: 'rgba(251, 191, 36, ', end: 'rgba(245, 158, 11, ' },   // Amber Gold Accent
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
   GSAP & SCROLLTRIGGER SCROLL ANIMATIONS
   ========================================================================== */
if (window.gsap && window.ScrollTrigger) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  // Unified animation config
  const DURATION = 0.8;
  const STAGGER  = 0.1;
  const EASE     = 'power3.out';
  const START    = 'top 85%';

  // 1. Hero Content Entrance
  gsap.from('.hero-content > *', {
    opacity: 0,
    y: 35,
    duration: DURATION,
    stagger: 0.14,
    ease: EASE,
    clearProps: 'transform,opacity'
  });

  gsap.from('.hero-visual-cards .glass-card-float', {
    opacity: 0,
    x: 40,
    duration: DURATION,
    stagger: 0.2,
    delay: 0.3,
    ease: EASE,
    clearProps: 'transform,opacity'
  });

  gsap.from('.hero-scroll', {
    opacity: 0,
    y: 20,
    duration: 0.7,
    delay: 0.7,
    ease: EASE,
    clearProps: 'transform,opacity'
  });

  // 2. Section Headings Reveal
  gsap.utils.toArray('.section-heading').forEach((heading) => {
    gsap.from(heading, {
      scrollTrigger: { trigger: heading, start: START },
      opacity: 0,
      y: 30,
      duration: DURATION,
      ease: EASE,
      clearProps: 'transform,opacity'
    });
  });

  // 3. Services Cards Staggered Entrance (#services)
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length > 0) {
    gsap.from(serviceCards, {
      scrollTrigger: { trigger: '#services', start: START },
      opacity: 0,
      y: 40,
      duration: DURATION,
      stagger: STAGGER,
      ease: EASE,
      clearProps: 'transform,opacity'
    });
  }

  // 4. Portfolio Cards Entrance (#portfolio)
  const portCards = document.querySelectorAll('.portfolio-card');
  if (portCards.length > 0) {
    gsap.from(portCards, {
      scrollTrigger: { trigger: '#portfolio', start: START },
      opacity: 0,
      y: 45,
      duration: DURATION,
      stagger: STAGGER,
      ease: EASE,
      clearProps: 'transform,opacity'
    });
  }

  // 5. Process Cards (#process)
  const processCards = document.querySelectorAll('.process-card');
  if (processCards.length > 0) {
    gsap.from(processCards, {
      scrollTrigger: { trigger: '#process', start: START },
      opacity: 0,
      y: 35,
      scale: 0.94,
      duration: DURATION,
      stagger: STAGGER,
      ease: 'back.out(1.4)',
      clearProps: 'transform,opacity'
    });
  }

  // 6. About & Founder Sections Entrance (#about, #founder)
  const aboutCards = document.querySelectorAll('.about-main-card, .values-card');
  if (aboutCards.length > 0) {
    gsap.from(aboutCards, {
      scrollTrigger: { trigger: '#about', start: START },
      opacity: 0,
      y: 40,
      duration: DURATION,
      stagger: 0.15,
      ease: EASE,
      clearProps: 'transform,opacity'
    });
  }

  const founderElements = document.querySelectorAll('.founder-visual, .founder-content');
  if (founderElements.length > 0) {
    gsap.from(founderElements, {
      scrollTrigger: { trigger: '#founder', start: START },
      opacity: 0,
      y: 40,
      duration: DURATION,
      stagger: 0.15,
      ease: EASE,
      clearProps: 'transform,opacity'
    });
  }

  // 7. Team Cards (#team)
  const teamCards = document.querySelectorAll('.team-card');
  if (teamCards.length > 0) {
    gsap.from(teamCards, {
      scrollTrigger: { trigger: '#team', start: START },
      opacity: 0,
      y: 40,
      duration: DURATION,
      stagger: STAGGER,
      ease: EASE,
      clearProps: 'transform,opacity'
    });
  }

  // 8. Testimonials Showcase (#testimonials)
  const testimonialShowcase = document.querySelector('.testimonial-showcase');
  if (testimonialShowcase) {
    gsap.from(testimonialShowcase, {
      scrollTrigger: { trigger: '#testimonials', start: START },
      opacity: 0,
      y: 35,
      scale: 0.97,
      duration: DURATION,
      ease: EASE,
      clearProps: 'transform,opacity'
    });
  }

  // 9. Stats Counter Cards (#stats)
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards.length > 0) {
    gsap.from(statCards, {
      scrollTrigger: { trigger: '#stats', start: START },
      opacity: 0,
      y: 30,
      duration: DURATION,
      stagger: STAGGER,
      ease: EASE,
      clearProps: 'transform,opacity'
    });
  }

  // 10. FAQ Accordion (#faq)
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    gsap.from(faqItems, {
      scrollTrigger: { trigger: '#faq', start: START },
      opacity: 0,
      y: 25,
      duration: DURATION,
      stagger: 0.08,
      ease: EASE,
      clearProps: 'transform,opacity'
    });
  }

  // 11. Contact Section — info col and form animate together (no stagger)
  const contactInfoCol = document.querySelector('.contact-info-col');
  const contactFormEl  = document.querySelector('.contact-form');

  if (contactInfoCol) {
    gsap.from(contactInfoCol, {
      scrollTrigger: { trigger: '#contact', start: 'top 92%' },
      opacity: 0,
      x: -40,
      duration: DURATION,
      ease: EASE,
      clearProps: 'transform,opacity'
    });
  }

  if (contactFormEl) {
    gsap.from(contactFormEl, {
      scrollTrigger: { trigger: '#contact', start: 'top 92%' },
      opacity: 0,
      x: 40,
      duration: DURATION,
      ease: EASE,
      clearProps: 'transform,opacity'
    });
  }

  // 12. Marquee section heading
  const techHeading = document.querySelector('#technologies .section-heading');
  if (techHeading) {
    gsap.from(techHeading, {
      scrollTrigger: { trigger: '#technologies', start: START },
      opacity: 0,
      y: 30,
      duration: DURATION,
      ease: EASE,
      clearProps: 'transform,opacity'
    });
  }
}

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
  }
}

function closeTeamModal() {
  if (teamModal) {
    teamModal.classList.remove('active');
    teamModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
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
  }
}

if (meetBioBtn) {
  meetBioBtn.addEventListener('click', openMeetModal);
}

if (kingshukBioBtn) {
  kingshukBioBtn.addEventListener('click', openKingshukModal);
}

if (teamModalOverlay) teamModalOverlay.addEventListener('click', closeTeamModal);
if (teamModalClose) teamModalClose.addEventListener('click', closeTeamModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && teamModal && teamModal.classList.contains('active')) {
    closeTeamModal();
  }
});

/* ==========================================================================
   SECURITY: DISABLE RIGHT-CLICK CONTEXT MENU & INSPECT SHORTCUTS
   ========================================================================== */
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

document.addEventListener('keydown', (event) => {
  // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S
  if (
    event.key === 'F12' ||
    (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'i' || event.key === 'J' || event.key === 'j' || event.key === 'C' || event.key === 'c')) ||
    (event.ctrlKey && (event.key === 'u' || event.key === 'U' || event.key === 's' || event.key === 'S'))
  ) {
    event.preventDefault();
  }
});
