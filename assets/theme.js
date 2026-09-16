document.addEventListener('DOMContentLoaded', () => {
  // 1. Add js-reveal class to body for animated reveals
  document.body.classList.add('js-reveal');

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', !isHidden);
    });
  }

  // 3. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-init');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px 0px 50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('reveal-visible'));
  }

  // 4. Stat Counters Animation
  const counterElements = document.querySelectorAll('.stat-counter');
  let countersAnimated = false;

  const runCounterAnimation = () => {
    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1800;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * target);

        if (target % 1 === 0) {
          counter.textContent = prefix + currentVal.toLocaleString() + suffix;
        } else {
          counter.textContent = prefix + (easeProgress * target).toFixed(1) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = prefix + target.toLocaleString() + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsSection = document.getElementById('stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          runCounterAnimation();
        }
      });
    }, { threshold: 0.2 });

    statsObserver.observe(statsSection);
  }

  // 5. Hero Rotating Word
  const rotatingWordEl = document.getElementById('hero-rotating-word');
  if (rotatingWordEl) {
    const wordsAttr = rotatingWordEl.getAttribute('data-words');
    const words = wordsAttr ? wordsAttr.split(',').map(w => w.trim()) : ['Home', 'Office', 'Kitchen', 'Shop', 'Cabin', 'Factory', 'Break Room'];
    let wordIdx = 0;
    setInterval(() => {
      wordIdx = (wordIdx + 1) % words.length;
      rotatingWordEl.style.opacity = '0';
      rotatingWordEl.style.transform = 'translateY(4px)';
      setTimeout(() => {
        rotatingWordEl.textContent = words[wordIdx];
        rotatingWordEl.style.opacity = '1';
        rotatingWordEl.style.transform = 'translateY(0)';
      }, 200);
    }, 2200);
  }

  // 6. Savings Calculator
  const dailySlider = document.getElementById('daily-gallons');
  const costSlider = document.getElementById('cost-per-gallon');
  const dailyVal = document.getElementById('daily-gallons-val');
  const costVal = document.getElementById('cost-per-gallon-val');
  const curAnnual = document.getElementById('calc-current-annual');
  const awgAnnual = document.getElementById('calc-awg-annual');
  const netSavings = document.getElementById('calc-net-savings');
  const payback = document.getElementById('calc-payback');

  function updateCalc() {
    if (!dailySlider || !costSlider) return;
    const g = parseFloat(dailySlider.value);
    const c = parseFloat(costSlider.value);
    if (dailyVal) dailyVal.textContent = g + ' Gal/day';
    if (costVal) costVal.textContent = '$' + c.toFixed(2) + ' / Gal';

    const annualGal = g * 365;
    const annualBottled = annualGal * c;
    const annualAwg = annualGal * 0.08;
    const saved = annualBottled - annualAwg;
    const months = saved > 0 ? (1495 / (saved / 12)).toFixed(1) : 0;

    if (curAnnual) curAnnual.textContent = '$' + Math.round(annualBottled).toLocaleString() + ' / yr';
    if (awgAnnual) awgAnnual.textContent = '$' + Math.round(annualAwg).toLocaleString() + ' / yr';
    if (netSavings) netSavings.textContent = '$' + Math.round(saved).toLocaleString() + ' / yr';
    if (payback) {
      payback.textContent = saved > 0 ? 'Machine pays for itself in ~' + months + ' months!' : 'Calculated based on average power usage';
    }
  }

  if (dailySlider && costSlider) {
    dailySlider.addEventListener('input', updateCalc);
    costSlider.addEventListener('input', updateCalc);
    updateCalc();
  }

  // 7. FAQ Accordion
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-toggle');
    if (!btn) return;
    
    e.preventDefault();
    const item = btn.closest('.faq-item');
    const content = item ? item.querySelector('.faq-content') : btn.nextElementSibling;
    const icon = btn.querySelector('.faq-icon');
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    
    // Close other FAQ items in same section/container
    const container = btn.closest('.space-y-3') || document;
    container.querySelectorAll('.faq-toggle').forEach(otherBtn => {
      if (otherBtn !== btn) {
        otherBtn.setAttribute('aria-expanded', 'false');
        const otherItem = otherBtn.closest('.faq-item');
        const otherContent = otherItem ? otherItem.querySelector('.faq-content') : otherBtn.nextElementSibling;
        const otherIcon = otherBtn.querySelector('.faq-icon');
        if (otherContent) otherContent.classList.add('hidden');
        if (otherIcon) otherIcon.classList.remove('rotate-180');
      }
    });

    if (isExpanded) {
      btn.setAttribute('aria-expanded', 'false');
      if (content) content.classList.add('hidden');
      if (icon) icon.classList.remove('rotate-180');
    } else {
      btn.setAttribute('aria-expanded', 'true');
      if (content) content.classList.remove('hidden');
      if (icon) icon.classList.add('rotate-180');
    }
  });

  // 8. Order Modal & Quote Logic
  const quoteModal = document.getElementById('quote-modal');
  const quoteButtons = document.querySelectorAll('.open-quote-modal');
  const closeModalButtons = document.querySelectorAll('.close-quote-modal');

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

  quoteButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  closeModalButtons.forEach(btn => btn.addEventListener('click', closeModal));

  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && quoteModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Quote Form Submission Handler
  const quoteForm = document.getElementById('quote-form');
  const formSuccess = document.getElementById('quote-form-success');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Processing...
      `;
      submitBtn.disabled = true;

      // Check if product form action exists (Shopify Cart Ajax integration)
      const variantIdInput = quoteForm.querySelector('input[name="id"]');
      if (variantIdInput && variantIdInput.value) {
        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [{
              id: variantIdInput.value,
              quantity: 1
            }]
          })
        })
        .then(res => res.json())
        .then(() => {
          window.location.href = '/checkout';
        })
        .catch(() => {
          showSuccessUI();
        });
      } else {
        setTimeout(showSuccessUI, 900);
      }

      function showSuccessUI() {
        quoteForm.classList.add('hidden');
        if (formSuccess) formSuccess.classList.remove('hidden');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        setTimeout(() => {
          closeModal();
          setTimeout(() => {
            quoteForm.reset();
            quoteForm.classList.remove('hidden');
            if (formSuccess) formSuccess.classList.add('hidden');
          }, 300);
        }, 2500);
      }
    });
  }

  // Interactive Process Step Highlights
  const processCards = document.querySelectorAll('.process-step-card');
  processCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      processCards.forEach(c => c.classList.remove('ring-2', 'ring-cyan-400', 'bg-cyan-50/50'));
      card.classList.add('ring-2', 'ring-cyan-400', 'bg-cyan-50/50');
    });
  });

  // Smooth Scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
          }
        }
      }
    });
  });
});
