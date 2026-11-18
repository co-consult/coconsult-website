(() => {
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#mobile-menu');
  const header = document.querySelector('.site-header');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (button instanceof HTMLButtonElement && nav instanceof HTMLElement && header) {
    const closedLabel = button.dataset.closedLabel || 'Menu';
    const openLabel = button.dataset.openLabel || 'Close menu';

    function setBodyLock(locked) {
      document.documentElement.classList.toggle('nav-open', locked);
      document.body.classList.toggle('nav-open', locked);
    }

    function close() {
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', closedLabel);
      nav.hidden = true;
      setBodyLock(false);
    }

    function open() {
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('aria-label', openLabel);
      nav.hidden = false;
      setBodyLock(true);
      const first = nav.querySelector('a');
      if (first instanceof HTMLElement) first.focus();
    }

    button.addEventListener('click', () => {
      if (button.getAttribute('aria-expanded') === 'true') {
        close();
        button.focus();
      } else {
        open();
      }
    });

    nav.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest('a')) close();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        close();
        button.focus();
      }
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (button.getAttribute('aria-expanded') === 'true' && !header.contains(target)) close();
    });
  }

  if (header instanceof HTMLElement) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const revealNodes = [...document.querySelectorAll('[data-reveal]')];
  if (revealNodes.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealNodes.forEach((node) => node.classList.add('is-in'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
      );
      revealNodes.forEach((node) => revealObserver.observe(node));
    }
  }

  const staggerHosts = [...document.querySelectorAll('[data-stagger]')];
  if (staggerHosts.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      staggerHosts.forEach((host) => host.classList.add('is-in'));
    } else {
      const staggerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            staggerObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -4% 0px' },
      );
      staggerHosts.forEach((host) => staggerObserver.observe(host));
    }
  }

  const pageHero = document.querySelector('[data-page-hero]');
  if (pageHero instanceof HTMLElement) {
    requestAnimationFrame(() => pageHero.classList.add('is-ready'));
  }
})();
