/**
 * DSB BOREWELLS - Main Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('open');
    });

    // Close menu when clicking link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('open');
      });
    });
  }

  // 2. Sticky Navbar scroll state
  const mainNav = document.getElementById('mainNav');
  if (mainNav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        mainNav.classList.add('scrolled');
      } else {
        mainNav.classList.remove('scrolled');
      }
    });
  }

  // 3. Animated Counters for Stats
  const statElements = document.querySelectorAll('.hero-stat-val, .stat-number');
  let hasCounted = false;

  const runCounter = () => {
    statElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;

      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target + suffix;
          clearInterval(interval);
        } else {
          el.textContent = current + suffix;
        }
      }, 35);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasCounted) {
        hasCounted = true;
        runCounter();
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.querySelector('.hero-stats-inline, .stats-bar-section');
  if (statsSection) {
    observer.observe(statsSection);
  }

  // 4. Quote Modal Handlers
  const quoteModal = document.getElementById('quoteModal');
  const openModalBtns = document.querySelectorAll('.open-quote-modal');
  const closeModalBtns = document.querySelectorAll('.close-modal-btn');

  const openModal = () => {
    if (quoteModal) {
      quoteModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (quoteModal) {
      quoteModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) closeModal();
    });
  }

  // 5. Video Modal Handlers
  const videoModal = document.getElementById('videoModal');
  const openVideoBtns = document.querySelectorAll('.open-video-modal');
  const closeVideoBtns = document.querySelectorAll('.close-video-btn');

  if (videoModal) {
    openVideoBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    closeVideoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 6. Escape Key Listener for Modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      if (videoModal) videoModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // 7. Interactive WhatsApp Form Handler
  const sendInquiryToWhatsApp = (data) => {
    const waNumber = '919443268468';
    const waMessage = 
`*NEW BOREWELL ENQUIRY - DSB BOREWELLS*
---------------------------------------
👤 *Name:* ${data.name}
📞 *Phone:* ${data.phone}
📍 *Location:* ${data.location}
🛠 *Service Required:* ${data.service}
💬 *Message/Notes:* ${data.message || 'No additional notes provided'}
---------------------------------------
_Sent from DSB Borewells Official Website_`;

    // Backup to localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('dsb_inquiries') || '[]');
      stored.unshift({ ...data, date: new Date().toLocaleString() });
      localStorage.setItem('dsb_inquiries', JSON.stringify(stored.slice(0, 100)));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, '_blank');
  };

  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('.form-submit-btn');
      const originalText = submitBtn.innerHTML;

      const name = document.getElementById('quoteName')?.value.trim() || '';
      const phone = document.getElementById('quotePhone')?.value.trim() || '';
      const location = document.getElementById('quoteLocation')?.value.trim() || '';
      const serviceSelect = document.getElementById('quoteService');
      const service = serviceSelect?.options[serviceSelect.selectedIndex]?.text || '';
      const message = document.getElementById('quoteMessage')?.value.trim() || '';

      submitBtn.innerHTML = `<span>Connecting to WhatsApp...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        sendInquiryToWhatsApp({ name, phone, location, service, message });
        submitBtn.innerHTML = `<span>✓ Sent to WhatsApp!</span>`;
        
        setTimeout(() => {
          quoteForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          closeModal();
        }, 800);
      }, 500);
    });
  }

  // 8. Contact Page Form Handler
  const contactPageForm = document.getElementById('contactPageForm');
  if (contactPageForm) {
    contactPageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactPageForm.querySelector('.form-submit-btn');
      const originalText = submitBtn.innerHTML;

      const name = document.getElementById('cName')?.value.trim() || '';
      const phone = document.getElementById('cPhone')?.value.trim() || '';
      const location = document.getElementById('cLocation')?.value.trim() || '';
      const serviceSelect = document.getElementById('cService');
      const service = serviceSelect?.options[serviceSelect.selectedIndex]?.text || '';
      const message = document.getElementById('cMessage')?.value.trim() || '';

      submitBtn.innerHTML = `<span>Connecting to WhatsApp...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        sendInquiryToWhatsApp({ name, phone, location, service, message });
        submitBtn.innerHTML = `<span>✓ Opening WhatsApp...</span>`;

        setTimeout(() => {
          contactPageForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 1200);
      }, 400);
    });
  }

  // 9. Services & Gallery Dynamic Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('.services-section, .gallery-section');
      if (!container) return;

      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      const items = container.querySelectorAll('.service-full-card, .gallery-card');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = '';
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 10. Gallery Lightbox Preview
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightboxBtn = document.querySelector('.close-lightbox-btn');

  if (lightboxModal && lightboxImg) {
    document.querySelectorAll('.gallery-card').forEach(card => {
      card.addEventListener('click', () => {
        const src = card.getAttribute('data-src') || card.querySelector('img')?.src;
        const title = card.getAttribute('data-title') || '';
        const desc = card.getAttribute('data-desc') || '';

        lightboxImg.src = src;
        if (lightboxCaption) {
          lightboxCaption.innerHTML = `<strong>${title}</strong><div style="font-size:0.85rem; color:#94a3b8; margin-top:4px;">${desc}</div>`;
        }

        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeLightboxBtn) {
      closeLightboxBtn.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 11. Dual-Number Floating Call Menu Toggle
  const floatingCallWrap = document.getElementById('floatingCallWrap');
  const floatingCallBtn = document.getElementById('floatingCallBtn');

  if (floatingCallWrap && floatingCallBtn) {
    floatingCallBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      floatingCallWrap.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!floatingCallWrap.contains(e.target)) {
        floatingCallWrap.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        floatingCallWrap.classList.remove('active');
      }
    });
  }

  // 12. Ambient Living Water Canvas Simulation (Making the Website Alive!)
  const canvas = document.getElementById('heroWaterCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    window.addEventListener('resize', () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    // Particle bubbles
    const bubbleCount = Math.min(36, Math.floor(width / 35));
    const bubbles = [];

    class WaterBubble {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + Math.random() * 20;
        this.radius = Math.random() * 3.5 + 1.2;
        this.speedY = Math.random() * 0.9 + 0.35;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.03 + 0.01;
      }

      update(mouseX, mouseY) {
        this.y -= this.speedY;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.3 + this.speedX;

        // Mouse repulsion
        if (mouseX !== null && mouseY !== null) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dist > 0) {
            const force = (100 - dist) / 100;
            this.x += (dx / dist) * force * 3;
            this.y += (dy / dist) * force * 3;
          }
        }

        if (this.y < -20 || this.x < -20 || this.x > width + 20) {
          this.reset(false);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 210, 255, ${this.opacity})`;
        ctx.fill();

        // Highlight
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push(new WaterBubble());
    }

    let mouseX = null;
    let mouseY = null;

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
      mouseX = null;
      mouseY = null;
    });

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const animateBubbles = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);
        bubbles.forEach((b) => {
          b.update(mouseX, mouseY);
          b.draw();
        });
      }
      requestAnimationFrame(animateBubbles);
    };
    animateBubbles();
  }

  // 13. Interactive 3D Card Tilt Physics (Cards feel alive on hover!)
  const tiltCards = document.querySelectorAll('.tilt-card, .hero-service-card, .fleet-card, .btn-dual-call-card');
  tiltCards.forEach((card) => {
    // Add glow element if not present
    if (!card.querySelector('.tilt-card-glow')) {
      const glow = document.createElement('div');
      glow.className = 'tilt-card-glow';
      card.appendChild(glow);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 14. Liquid Ripple Wave on Button Click
  const rippleTargets = document.querySelectorAll('.btn-primary, .btn-whatsapp, .btn-call, .btn-call-hero, .btn-dual-call-card, .btn-cta-call');
  rippleTargets.forEach((btn) => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
});

