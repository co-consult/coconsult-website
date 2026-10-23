import { armHandoff, clearHandoff } from './handoff.mjs';
import { start, turn } from './guide.mjs';

const SAFE_PREFIXES = [
  '/',
  '/en/',
  '/contact/',
  '/services/',
  '/modes-intervention/',
  '/realisations/',
  '/a-propos/',
  '/innovation/',
  '/solutions/',
];

let launcher = null;
let panel = null;
let state = null;
let open = false;
let handoffMessage = '';
let leaving = false;

export function mountAssistant(button) {
  if (!(button instanceof HTMLButtonElement)) return;
  if (button.dataset.assistantReady === 'true') return;
  const dialog = document.getElementById('cc-assistant-dialog');
  if (!(dialog instanceof HTMLElement)) return;
  button.dataset.assistantReady = 'true';
  launcher = button;
  panel = dialog;
  const locale = button.dataset.locale === 'en' ? 'en' : 'fr';
  const opening = start(locale);
  state = opening.state;
  render(opening);
  dialog.querySelector('[data-assistant-close]')?.addEventListener('click', () => setOpen(false));
  dialog.addEventListener('click', onChoice);
  dialog.addEventListener('click', onHandoff);
  dialog.addEventListener('keydown', onKey);
  const form = dialog.querySelector('[data-assistant-form]');
  form?.addEventListener('submit', onSubmit);
  const field = dialog.querySelector('#cc-assistant-input');
  field?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (form instanceof HTMLFormElement) form.requestSubmit();
    }
  });
}

export function toggleAssistant() {
  setOpen(!open);
}

function setOpen(next) {
  if (!panel || !launcher) return;
  open = next;
  if (!next && !leaving) void clearHandoff();
  panel.hidden = !open;
  launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
  const target = open ? panel.querySelector('[data-assistant-close]') : launcher;
  if (target instanceof HTMLElement) target.focus();
}

function onChoice(event) {
  const target = event.target instanceof Element ? event.target.closest('[data-choice]') : null;
  if (!(target instanceof HTMLButtonElement) || !state) return;
  void clearHandoff();
  show(turn(state, { type: 'choice', id: target.dataset.choice || '' }));
}

function onSubmit(event) {
  event.preventDefault();
  if (!panel || !state) return;
  const field = panel.querySelector('#cc-assistant-input');
  if (!(field instanceof HTMLTextAreaElement)) return;
  const text = field.value;
  field.value = '';
  void clearHandoff();
  show(turn(state, { type: 'text', text }));
  field.focus();
}

function onKey(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    setOpen(false);
    return;
  }
  if (event.key !== 'Tab' || !panel) return;
  const nodes = [...panel.querySelectorAll('button, a[href], textarea')].filter((node) => node instanceof HTMLElement);
  if (nodes.length === 0) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function show(reply) {
  state = reply.state;
  render(reply);
}

function render(reply) {
  if (!panel) return;
  const log = panel.querySelector('.cc-assistant-log');
  const choices = panel.querySelector('.cc-assistant-choices');
  if (!(log instanceof HTMLElement) || !(choices instanceof HTMLElement)) return;
  handoffMessage = reply.handoff?.message || '';
  log.replaceChildren();
  const paragraph = document.createElement('p');
  paragraph.textContent = reply.text;
  log.append(paragraph);
  if (reply.summary?.lines) {
    const list = document.createElement('ul');
    for (const line of reply.summary.lines) {
      const item = document.createElement('li');
      item.textContent = line;
      list.append(item);
    }
    log.append(list);
  }
  for (const link of reply.links || []) appendLink(log, link, false);
  if (reply.handoff) appendHandoff(log, reply.handoff);
  if (reply.contact) appendLink(log, reply.contact, true);
  choices.replaceChildren();
  for (const choice of reply.choices || []) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cc-assistant-choice';
    button.dataset.choice = choice.id;
    button.textContent = choice.label;
    choices.append(button);
  }
}

function appendLink(parent, link, contact) {
  const anchor = document.createElement('a');
  anchor.href = safeHref(link.href);
  anchor.textContent = link.label;
  if (contact) {
    anchor.className = 'cc-assistant-contact';
    anchor.addEventListener('click', () => { void clearHandoff(); });
  }
  parent.append(anchor);
}

function appendHandoff(parent, handoff) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'cc-assistant-handoff';
  button.dataset.handoff = 'summary';
  button.dataset.href = safeHref(handoff.href);
  button.textContent = handoff.label;
  parent.append(button);
}

async function onHandoff(event) {
  const target = event.target instanceof Element ? event.target.closest('[data-handoff]') : null;
  if (!(target instanceof HTMLButtonElement) || target.disabled) return;
  event.preventDefault();
  const href = safeHref(target.dataset.href || '');
  target.disabled = true;
  const armed = await armHandoff(handoffMessage);
  if (armed) {
    leaving = true;
    location.assign(href);
    return;
  }
  target.disabled = false;
}

export function safeHref(href) {
  if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//') || href.includes('\\')) return '/contact/';
  const path = href.split('?')[0];
  const allowed = path === '/' || SAFE_PREFIXES.some((prefix) => prefix !== '/' && path.startsWith(prefix));
  return allowed ? href : '/contact/';
}
