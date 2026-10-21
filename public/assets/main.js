(() => {
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#mobile-menu');
  const header = document.querySelector('.site-header');
  if (!(button instanceof HTMLButtonElement) || !(nav instanceof HTMLElement) || !header) return;

  const closedLabel = button.dataset.closedLabel || 'Menu';
  const openLabel = button.dataset.openLabel || 'Close menu';

  function close() {
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', closedLabel);
    nav.hidden = true;
  }

  function open() {
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', openLabel);
    nav.hidden = false;
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
})();

(() => {
  const panel = document.querySelector('[data-contact-panel]');
  if (!(panel instanceof HTMLElement)) return;
  const email = panel.dataset.email || '';
  const select = panel.querySelector('[data-contact-type]');
  const openMail = panel.querySelector('[data-open-mail]');
  const copyButton = panel.querySelector('[data-copy-email]');
  const copyStatus = panel.querySelector('[data-copy-status]');
  const form = panel.querySelector('[data-contact-form]');
  const unavailable = panel.querySelector('[data-form-unavailable]');
  const formStatus = panel.querySelector('[data-form-status]');
  const hiddenType = panel.querySelector('[data-hidden-type]');
  const hiddenProduct = panel.querySelector('[data-hidden-product]');
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const product = (params.get('product') || '').toLowerCase();
  const allowedProducts = new Set(['copharia']);
  const typeToOption = {
    project: 'project',
    team: 'team',
    qa: 'qaDiscuss',
    'qa-team': 'qaTeam',
    payments: 'payments',
    automation: 'automation',
    ai: 'ai',
    partnership: 'partnership',
    demo: 'demo',
  };

  function selectedSubject() {
    if (!(select instanceof HTMLSelectElement)) return 'Coconsult';
    const option = select.selectedOptions[0];
    const subject = option?.dataset.subject || 'Coconsult';
    if (select.value === 'demo' && allowedProducts.has(product)) {
      return `${subject} - ${product.toUpperCase()}`;
    }
    return subject;
  }

  function refreshMail() {
    if (!(openMail instanceof HTMLAnchorElement)) return;
    const href = `mailto:${email}?subject=${encodeURIComponent(selectedSubject())}`;
    openMail.setAttribute('href', href);
    if (hiddenType instanceof HTMLInputElement && select instanceof HTMLSelectElement) hiddenType.value = select.value;
    if (hiddenProduct instanceof HTMLInputElement) hiddenProduct.value = allowedProducts.has(product) ? product : '';
  }

  if (select instanceof HTMLSelectElement && type && typeToOption[type]) {
    select.value = typeToOption[type];
  }
  if (select instanceof HTMLSelectElement) select.addEventListener('change', refreshMail);
  refreshMail();

  if (copyButton instanceof HTMLButtonElement) {
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(email);
        if (copyStatus) copyStatus.textContent = copyButton.dataset.copied || panel.dataset.copied || 'OK';
      } catch {
        if (copyStatus) copyStatus.textContent = panel.dataset.copyFailed || '';
      }
    });
  }

  const messages = {
    sent: document.documentElement.lang === 'fr' ? 'Votre demande a été envoyée.' : 'Your request has been sent.',
    failed: panel.dataset.failed || '',
  };

  fetch('/api/contact', { headers: { accept: 'application/json' } })
    .then((response) => (response.ok ? response.json() : null))
    .then((body) => {
      if (!body || body.configured !== true || !(form instanceof HTMLFormElement)) return;
      form.hidden = false;
      if (unavailable instanceof HTMLElement) unavailable.hidden = true;
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        if (formStatus) formStatus.textContent = '';
        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'content-type': 'application/json', accept: 'application/json' },
            body: JSON.stringify(data),
          });
          const payload = await response.json().catch(() => null);
          if (formStatus) formStatus.textContent = response.ok && payload && payload.ok ? messages.sent : messages.failed;
          if (response.ok && payload && payload.ok) form.reset();
        } catch {
          if (formStatus) formStatus.textContent = messages.failed;
        }
      });
    })
    .catch(() => {});
})();
