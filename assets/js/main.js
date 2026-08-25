/**
 * MOTO VLOGZ (Adventure & Touring) - MAIN SCRIPTS
 * ES6+ Implementation. Zero console.logs in production.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const htmlEl = document.documentElement;
  const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const langSelectDesktop = document.getElementById('lang-select-desktop');
  const langSelectMobile = document.getElementById('lang-select-mobile');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const drawerMenu = document.getElementById('drawer-menu');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-actions .btn-primary');
  const videoOverlayPlay = document.getElementById('video-overlay-play');
  const youtubePlayer = document.getElementById('youtube-player');
  
  // --- Theme Toggle Management (Step 6) ---
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      htmlEl.setAttribute('data-theme', savedTheme);
      updateThemeIcons(savedTheme);
    } else {
      const defaultTheme = systemPrefersDark ? 'dark' : 'light';
      htmlEl.setAttribute('data-theme', defaultTheme);
      updateThemeIcons(defaultTheme);
    }
  };

  const toggleTheme = () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
  };

  const updateThemeIcons = (theme) => {
    const sunSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
    const moonSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    
    const icon = theme === 'dark' ? sunSvg : moonSvg;
    if (themeToggleDesktop) themeToggleDesktop.innerHTML = icon;
    if (themeToggleMobile) themeToggleMobile.innerHTML = icon;
  };

  themeToggleDesktop?.addEventListener('click', toggleTheme);
  themeToggleMobile?.addEventListener('click', toggleTheme);
  initTheme();

  // --- Client-Side Multi-Language Translation (Step 5) ---
  let translations = {};

  const loadLanguage = async (langCode) => {
    try {
      // Prefer the inlined dictionary: fetch() is blocked on file:// origins,
      // which silently broke language switching when opening the page locally.
      const inline = window.I18N_DATA && window.I18N_DATA[langCode];

      if (inline) {
        translations = inline;
      } else {
        const response = await fetch(`./assets/i18n/${langCode}.json`);
        if (!response.ok) throw new Error('Translation file load failed');
        translations = await response.json();
      }

      // Persist selection
      localStorage.setItem('lang', langCode);
      
      // Update sync selector components
      if (langSelectDesktop) langSelectDesktop.value = langCode;
      if (langSelectMobile) langSelectMobile.value = langCode;
      
      // Walk data-i18n elements
      translateUI();
    } catch (err) {
      // Fallback mechanism to 'en'
      if (langCode !== 'en') {
        loadLanguage('en');
      }
    }
  };

  const getTranslationVal = (path, obj) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const translateUI = () => {
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = getTranslationVal(key, translations);
      
      if (val) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.type === 'submit' || el.type === 'button') {
            el.value = val;
          } else {
            el.placeholder = val;
          }
        } else {
          el.textContent = val;
        }
      }
    });
  };

  const initLanguage = () => {
    const savedLang = localStorage.getItem('lang');
    const browserLang = navigator.language.slice(0, 2);
    const defaultLang = savedLang || (['en', 'es', 'fr'].includes(browserLang) ? browserLang : 'en');
    
    loadLanguage(defaultLang);
  };

  langSelectDesktop?.addEventListener('change', (e) => loadLanguage(e.target.value));
  langSelectMobile?.addEventListener('change', (e) => loadLanguage(e.target.value));
  initLanguage();

  // --- Hamburger Slider & Drawer Overlay ---
  const toggleDrawer = () => {
    const isOpen = drawerMenu.classList.contains('open');
    if (isOpen) {
      drawerMenu.classList.remove('open');
      drawerOverlay.classList.remove('active');
      hamburgerBtn.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      drawerMenu.classList.add('open');
      drawerOverlay.classList.add('active');
      hamburgerBtn.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  hamburgerBtn?.addEventListener('click', toggleDrawer);
  drawerOverlay?.addEventListener('click', toggleDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', toggleDrawer));

  // --- Sticky Navbar Backdrop and Offset Adjust ---
  const headerNav = document.getElementById('header-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }
  });

  // --- Intersection Observer: Nav Links Active Highlighting ---
  const sections = document.querySelectorAll('section');
  // Include the drawer links so the mobile menu highlights the current section too
  const navLinks = document.querySelectorAll('.nav-links .nav-link, .drawer-links .drawer-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // --- Hero Video Placeholder Activation ---
  videoOverlayPlay?.addEventListener('click', () => {
    if (youtubePlayer) {
      // Simulating loading video on play click
      youtubePlayer.src = "https://www.youtube.com/embed/5KneLq5eRmc?autoplay=1&mute=0";
      videoOverlayPlay.style.display = 'none';
    }
  });

  // --- Featured Videos Filtering (Core 1) ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const videoCards = document.querySelectorAll('.video-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      videoCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Community Testimonial Carousel ---
  const slides = document.querySelectorAll('.community-slide');
  const dotsContainer = document.getElementById('carousel-indicators');
  let currentSlideIdx = 0;
  let slideInterval;

  const initCarousel = () => {
    if (slides.length === 0 || !dotsContainer) return;
    
    // Clear indicators and rebuild
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.classList.add('carousel-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
    
    startAutoSlide();
  };

  const goToSlide = (idx) => {
    const carouselEl = document.getElementById('community-carousel');
    if (!carouselEl) return;
    
    currentSlideIdx = idx;
    carouselEl.style.transform = `translateX(-${idx * 100}%)`;
    
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, dIdx) => {
      if (dIdx === idx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    resetAutoSlide();
  };

  const startAutoSlide = () => {
    slideInterval = setInterval(() => {
      const nextIdx = (currentSlideIdx + 1) % slides.length;
      goToSlide(nextIdx);
    }, 6000);
  };

  const resetAutoSlide = () => {
    clearInterval(slideInterval);
    startAutoSlide();
  };

  initCarousel();

  // --- Accordion Mechanics (FAQ) ---
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    
    trigger?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = '0px';
        }
      });
      
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });

  // --- Client-Side Form Validations (Step 12) ---
  const validateField = (input, regex, errorKey) => {
    const formGroup = input.closest('.form-group');
    const errorEl = formGroup.querySelector('.form-error');
    const val = input.value.trim();
    
    let isValid = true;
    if (val === '') {
      isValid = false;
    } else if (regex && !regex.test(val)) {
      isValid = false;
    }
    
    if (!isValid) {
      formGroup.classList.remove('valid');
      formGroup.classList.add('invalid');
      if (errorEl && translations.contact) {
        errorEl.textContent = translations.contact[errorKey] || 'Field invalid';
      }
    } else {
      formGroup.classList.remove('invalid');
      formGroup.classList.add('valid');
    }
    
    return isValid;
  };

  // Contact Form Logic
  const contactForm = document.getElementById('collab-contact-form');
  const inputName = document.getElementById('contact-name');
  const inputEmail = document.getElementById('contact-email');
  const inputCountry = document.getElementById('contact-country');
  const textareaMessage = document.getElementById('contact-message');
  const contactSuccess = document.getElementById('contact-success-alert');

  // Input listeners for real-time visual updates
  inputName?.addEventListener('input', () => validateField(inputName, null, 'error_name'));
  inputEmail?.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField(inputEmail, emailRegex, 'error_email');
  });
  inputCountry?.addEventListener('input', () => validateField(inputCountry, null, 'error_country'));
  textareaMessage?.addEventListener('input', () => validateField(textareaMessage, null, 'error_message'));

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isNameValid = validateField(inputName, null, 'error_name');
    const isEmailValid = validateField(inputEmail, emailRegex, 'error_email');
    const isCountryValid = validateField(inputCountry, null, 'error_country');
    const isMsgValid = validateField(textareaMessage, null, 'error_message');
    
    if (isNameValid && isEmailValid && isCountryValid && isMsgValid) {
      // Emulating successful submit
      if (contactSuccess) {
        contactSuccess.style.display = 'block';
        contactSuccess.textContent = translations.contact.success || 'Sent!';
        contactForm.reset();
        
        // Reset valid state visual borders
        document.querySelectorAll('.form-group').forEach(group => {
          group.classList.remove('valid');
          group.classList.remove('invalid');
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          contactSuccess.style.display = 'none';
        }, 5000);
      }
    }
  });

  // Newsletter Form Logic
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterSuccess = document.getElementById('newsletter-success');

  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailVal = newsletterEmail.value.trim();
    
    if (emailRegex.test(emailVal)) {
      if (newsletterSuccess) {
        newsletterSuccess.style.display = 'block';
        newsletterForm.reset();
        setTimeout(() => {
          newsletterSuccess.style.display = 'none';
        }, 5000);
      }
    } else {
      newsletterEmail.style.borderColor = 'var(--color-error)';
      setTimeout(() => {
        newsletterEmail.style.borderColor = '';
      }, 3000);
    }
  });
});

// Back to Top
document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.getElementById('back-to-top');
  if (!backToTop) return;

  const toggleBackToTop = () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  };

  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  backToTop.addEventListener('click', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});
