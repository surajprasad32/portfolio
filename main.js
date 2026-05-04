// --- Nav scroll effect ---
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // --- Mobile menu ---
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    function closeMobileMenu() {
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMobileMenu();
    });

    // --- Scroll reveal ---
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    // --- Project filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
          const cats = card.dataset.category || '';
          const show = filter === 'all' || cats.includes(filter);
          card.style.display = show ? '' : 'none';
        });
      });
    });

    // --- Smooth anchor scroll (offset for sticky nav) ---
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });

    // --- Active section highlighting ---
    const sectionIds = ['work', 'skills', 'experience', 'publications', 'contact'];
    const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { threshold: 0.35, rootMargin: '-90px 0px -45% 0px' });
    sectionIds.forEach(id => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });

    // --- Animated counters ---
    const counters = document.querySelectorAll('.counter');
    let countersStarted = false;
    const animateCounters = () => {
      counters.forEach(counter => {
        const target = Number(counter.dataset.target);
        const decimals = Number(counter.dataset.decimals || 0);
        const duration = 1200;
        const startTime = performance.now();
        const tick = now => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = (target * eased).toFixed(decimals);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    };
    const metrics = document.getElementById('metrics');
    if (metrics) {
      const counterObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
          counterObserver.disconnect();
        }
      }, { threshold: 0.35 });
      counterObserver.observe(metrics);
    }

    // --- Contact form validation + localStorage fallback ---
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const submission = {
        name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        subject: String(formData.get('subject') || '').trim(),
        message: String(formData.get('message') || '').trim(),
        submittedAt: new Date().toISOString()
      };

      if (!submission.name || !submission.email || !submission.subject || !submission.message) {
        formMessage.textContent = 'Please fill in all required fields.';
        formMessage.className = 'form-message error';
        return;
      }
      if (!emailPattern.test(submission.email)) {
        formMessage.textContent = 'Please enter a valid email address.';
        formMessage.className = 'form-message error';
        return;
      }

      const stored = JSON.parse(localStorage.getItem('portfolioContactSubmissions') || '[]');
      stored.push(submission);
      localStorage.setItem('portfolioContactSubmissions', JSON.stringify(stored));

      formMessage.textContent = "Thanks! I'll get back to you soon.";
      formMessage.className = 'form-message success';
      contactForm.reset();
    });
