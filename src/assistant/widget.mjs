import { armGuideVisit, armHandoff, clearHandoff } from './handoff.mjs';
import { chrome } from './knowledge.mjs';
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
  '/secteurs/',
  '/partenariats/',
  '/en/industries/',
  '/en/partnerships/',
  '/en/case-studies/',
  '/en/engagement/',
  '/en/about/',
];

let launcher = null;
let panel = null;
let state = null;
let open = false;
let handoffMessage = '';
let leaving = false;
let locale = 'fr';
let labels = chrome('fr');
let history = [];
let typingTimer = 0;
let busy = false;

export function mountAssistant(button) {
  if (!(button instanceof HTMLButtonElement)) return;
  if (button.dataset.assistantReady === 'true') return;
  const dialog = document.getElementById('cc-assistant-dialog');
  if (!(dialog instanceof HTMLElement)) return;
  button.dataset.assistantReady = 'true';
  launcher = button;
  panel = dialog;
  locale = button.dataset.locale === 'en' ? 'en' : 'fr';
  labels = chrome(locale);
  resetConversation(false);
  dialog.querySelector('[data-assistant-close]')?.addEventListener('click', () => setOpen(false));
  dialog.querySelector('[data-assistant-restart]')?.addEventListener('click', () => {
    void clearHandoff();
    resetConversation(true);
  });
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
  field?.addEventListener('input', autoGrow);
}

export function toggleAssistant() {
  setOpen(!open);
}

function resetConversation(focusInput) {
  window.clearTimeout(typingTimer);
  busy = false;
  const opening = start(locale);
  state = opening.state;
  history = [];
  renderOpening(opening);
  if (focusInput) {
    const field = panel?.querySelector('#cc-assistant-input');
    if (field instanceof HTMLTextAreaElement) field.focus();
  }
}

function setOpen(next) {
  if (!panel || !launcher) return;
  open = next;
  if (!next && !leaving) void clearHandoff();
  if (open) {
    panel.hidden = false;
    requestAnimationFrame(() => panel?.classList.add('is-open'));
  } else {
    panel.classList.remove('is-open');
    window.setTimeout(() => {
      if (!open && panel) panel.hidden = true;
    }, 220);
  }
  launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
  const target = open ? panel.querySelector('#cc-assistant-input') : launcher;
  if (target instanceof HTMLElement) target.focus();
}

function onChoice(event) {
  const target = event.target instanceof Element ? event.target.closest('[data-choice]') : null;
  if (!(target instanceof HTMLButtonElement) || !state || busy) return;
  void clearHandoff();
  const label = target.textContent || '';
  pushUser(label);
  respond(turn(state, { type: 'choice', id: target.dataset.choice || '' }));
}

function onSubmit(event) {
  event.preventDefault();
  if (!panel || !state || busy) return;
  const field = panel.querySelector('#cc-assistant-input');
  if (!(field instanceof HTMLTextAreaElement)) return;
  const text = field.value.trim();
  if (!text) return;
  field.value = '';
  autoGrow({ target: field });
  void clearHandoff();
  pushUser(text);
  respond(turn(state, { type: 'text', text }));
  field.focus();
}

function onKey(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    setOpen(false);
    return;
  }
  if (event.key !== 'Tab' || !panel) return;
  const nodes = [...panel.querySelectorAll('button, a[href], textarea')].filter((node) => node instanceof HTMLElement && !node.hasAttribute('disabled'));
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

function pushUser(text) {
  history.push({ role: 'user', text });
  paintHistory();
  clearChoices();
}

function respond(reply) {
  busy = true;
  showTyping(true);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delay = reduce ? 0 : 280;
  window.clearTimeout(typingTimer);
  typingTimer = window.setTimeout(() => {
    showTyping(false);
    state = reply.state;
    history.push({ role: 'bot', reply });
    paintHistory();
    paintChoices(reply);
    busy = false;
    scrollLog();
  }, delay);
}

function renderOpening(reply) {
  history = [{ role: 'bot', reply }];
  paintHistory();
  paintChoices(reply);
}

function paintHistory() {
  if (!panel) return;
  const log = panel.querySelector('.cc-assistant-log');
  if (!(log instanceof HTMLElement)) return;
  log.replaceChildren();
  for (const item of history) {
    if (item.role === 'user') {
      log.append(messageNode('user', item.text));
      continue;
    }
    log.append(botNode(item.reply));
  }
  scrollLog();
}

function botNode(reply) {
  handoffMessage = reply.handoff?.message || '';
  const wrap = document.createElement('div');
  wrap.className = 'cc-msg cc-msg-bot';
  const meta = document.createElement('span');
  meta.className = 'cc-msg-meta';
  meta.textContent = labels.guideLabel;
  wrap.append(meta);
  const bubble = document.createElement('p');
  bubble.className = 'cc-msg-bubble';
  bubble.textContent = reply.text;
  wrap.append(bubble);
  if (reply.summary?.lines) {
    const list = document.createElement('ul');
    list.className = 'cc-msg-list';
    for (const line of reply.summary.lines) {
      const item = document.createElement('li');
      item.textContent = line;
      list.append(item);
    }
    wrap.append(list);
  }
  const actions = document.createElement('div');
  actions.className = 'cc-msg-actions';
  for (const link of reply.links || []) appendLink(actions, link, false);
  if (reply.handoff) appendHandoff(actions, reply.handoff);
  if (reply.contact) appendLink(actions, reply.contact, true);
  if (actions.childNodes.length) wrap.append(actions);
  return wrap;
}

function messageNode(role, text) {
  const wrap = document.createElement('div');
  wrap.className = `cc-msg cc-msg-${role}`;
  const meta = document.createElement('span');
  meta.className = 'cc-msg-meta';
  meta.textContent = role === 'user' ? labels.youLabel : labels.guideLabel;
  const bubble = document.createElement('p');
  bubble.className = 'cc-msg-bubble';
  bubble.textContent = text;
  wrap.append(meta, bubble);
  return wrap;
}

function paintChoices(reply) {
  if (!panel) return;
  const choices = panel.querySelector('.cc-assistant-choices');
  if (!(choices instanceof HTMLElement)) return;
  choices.replaceChildren();
  for (const choice of reply.choices || []) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = choice.primary ? 'cc-assistant-choice is-primary' : 'cc-assistant-choice';
    button.dataset.choice = choice.id;
    button.textContent = choice.label;
    choices.append(button);
  }
}

function clearChoices() {
  const choices = panel?.querySelector('.cc-assistant-choices');
  if (choices instanceof HTMLElement) choices.replaceChildren();
}

function showTyping(on) {
  if (!panel) return;
  const log = panel.querySelector('.cc-assistant-log');
  if (!(log instanceof HTMLElement)) return;
  const existing = log.querySelector('.cc-assistant-typing');
  if (!on) {
    existing?.remove();
    return;
  }
  if (existing) return;
  const row = document.createElement('div');
  row.className = 'cc-msg cc-msg-bot';
  const dots = document.createElement('div');
  dots.className = 'cc-assistant-typing';
  dots.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 3; i += 1) dots.append(document.createElement('span'));
  row.append(dots);
  log.append(row);
  scrollLog();
}

function scrollLog() {
  const log = panel?.querySelector('.cc-assistant-log');
  if (log instanceof HTMLElement) log.scrollTop = log.scrollHeight;
}

function autoGrow(event) {
  const field = event.target;
  if (!(field instanceof HTMLTextAreaElement)) return;
  field.style.height = 'auto';
  field.style.height = `${Math.min(110, Math.max(46, field.scrollHeight))}px`;
}

function appendLink(parent, link, contact) {
  const anchor = document.createElement('a');
  anchor.href = safeHref(link.href);
  anchor.textContent = link.label;
  if (contact) {
    anchor.className = 'cc-assistant-contact';
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      const href = safeHref(anchor.getAttribute('href') || '');
      void armGuideVisit().then(() => {
        leaving = true;
        location.assign(href);
      });
    });
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
