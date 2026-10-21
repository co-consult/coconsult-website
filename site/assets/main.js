(() => {
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#mobile-menu');
  if (!button || !nav) return;
  function close() { button.setAttribute('aria-expanded', 'false'); nav.hidden = true; }
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    nav.hidden = open;
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  window.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
})();
