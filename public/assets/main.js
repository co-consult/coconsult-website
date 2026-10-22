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
