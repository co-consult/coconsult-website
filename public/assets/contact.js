(() => {
  const panel = document.querySelector('[data-contact-panel]');
  if (!(panel instanceof HTMLElement)) return;

  const email = panel.dataset.email || 'contact@coconsult.fr';
  const select = panel.querySelector('[data-contact-type]');
  const openMail = panel.querySelector('[data-open-mail]');
  const copyAddress = panel.querySelector('[data-copy-email]');
  const copyStatus = panel.querySelector('[data-copy-status]');
  const message = document.getElementById('message');
  const messageField = panel.querySelector('[data-message-field]');
  const messageLabel = panel.querySelector('[data-message-label]');
  const messageSlot = panel.querySelector('[data-demo-message-slot]');
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const companyField = document.getElementById('company');
  const sourceField = document.getElementById('source');
  let journey = 'direct';
  const flag = document.getElementById('topic-flag');
  const hintsBox = document.getElementById('hints');
  const prepare = document.getElementById('prepare');
  const outcome = document.getElementById('outcome');
  const outcomeText = document.getElementById('outcome-text');
  const sendStatus = document.getElementById('send-status');
  const honeypot = panel.querySelector('[data-honeypot]');
  const copyMail = document.getElementById('copy-mail');
  const copyFullStatus = document.getElementById('copy-status');
  const copyFallback = document.getElementById('copy-fallback');
  const preview = document.getElementById('mail-preview');
  const gmail = document.getElementById('open-gmail');
  const outlook = document.getElementById('open-outlook');
  const hintNode = document.getElementById('contact-hints');
  const headingMain = panel.querySelector('[data-heading-main]');
  const headingAccent = panel.querySelector('[data-heading-accent]');
  const introEl = panel.querySelector('[data-contact-intro]');
  const stepsGeneric = panel.querySelector('[data-steps-generic]');
  const stepsDemo = panel.querySelector('[data-steps-demo]');
  const params = new URLSearchParams(window.location.search);
  const allowedProducts = new Set(['copharia']);
  const typeToInquiry = {
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
  const typeToNeed = {
    project: 'software',
    team: 'team',
    qa: 'quality',
    'qa-team': 'quality',
    payments: 'other',
    automation: 'other',
    ai: 'ai',
    partnership: 'other',
    demo: 'other',
  };
  const needToInquiry = {
    ai: 'ai',
    software: 'project',
    team: 'team',
    cloud: 'cloud',
    quality: 'qaDiscuss',
    other: 'other',
  };
  const hints = hintNode ? JSON.parse(hintNode.textContent || '{}') : {};
  const state = { need: '', inquiry: 'project', topic: '', reached: 1, mode: 'generic' };
  const sendState = { available: false, token: '', readyAt: 0, sending: false, done: false };

  function apiType() {
    if (isDemoMode() || (state.inquiry === 'demo' && productToken() === 'copharia')) return 'demo';
    if (state.need === 'cloud' || state.inquiry === 'cloud') return 'cloud';
    if (state.inquiry === 'qaDiscuss' || state.inquiry === 'qaTeam' || state.inquiry === 'qa') return 'qa';
    if (state.inquiry === 'automation' || state.inquiry === 'other') return 'other';
    return state.inquiry || 'project';
  }

  function productToken() {
    const product = (params.get('product') || '').toLowerCase();
    if (allowedProducts.has(product)) return product;
    if ((params.get('topic') || '').toLowerCase() === 'copharia' || state.topic === 'copharia') return 'copharia';
    return '';
  }

  function isDemoMode() {
    return state.mode === 'demo' && state.topic === 'copharia';
  }

  function selectedSubject() {
    if (!(select instanceof HTMLSelectElement)) return 'Coconsult';
    const option = select.selectedOptions[0];
    const subject = option?.dataset.subject || 'Coconsult';
    const product = productToken();
    if (select.value === 'demo' && product) return `${subject} - ${product.toUpperCase()}`;
    return subject;
  }

  function refreshMail() {
    if (!(openMail instanceof HTMLAnchorElement)) return;
    openMail.setAttribute('href', `mailto:${email}?subject=${encodeURIComponent(selectedSubject())}`);
  }

  function setInquiry(id) {
    state.inquiry = id;
    if (select instanceof HTMLSelectElement) select.value = id;
    const hiddenType = panel.querySelector('[data-hidden-type]');
    if (hiddenType instanceof HTMLInputElement) hiddenType.value = apiType();
    refreshMail();
  }

  function setNeed(need) {
    state.need = need;
    document.querySelectorAll('[data-need]').forEach((button) => {
      button.setAttribute('aria-pressed', button.dataset.need === need ? 'true' : 'false');
    });
  }

  function paintHints() {
    if (!hintsBox) return;
    hintsBox.replaceChildren();
    const list = hints[state.need] || hints.other || [];
    list.forEach((text) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = text;
      button.addEventListener('click', () => {
        if (!(message instanceof HTMLTextAreaElement)) return;
        message.value = message.value ? `${message.value.replace(/\s+$/, '')} ${text}` : text;
        invalidatePrepared();
      });
      hintsBox.appendChild(button);
    });
  }

  function fieldValue(field) {
    return field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement ? field.value.trim() : '';
  }

  function paintSummary() {
    const needButton = document.querySelector(`[data-need="${state.need}"] b`);
    const needLabel = isDemoMode()
      ? (panel.dataset.demoNeedLabel || 'COPHARIA')
      : (needButton ? needButton.textContent || '' : '');
    const sumNeed = document.getElementById('sum-need');
    const sumMsg = document.getElementById('sum-msg');
    const sumWho = document.getElementById('sum-who');
    if (sumNeed) {
      sumNeed.textContent = !isDemoMode() && state.topic === 'copharia'
        ? `${needLabel} · COPHARIA`
        : needLabel;
    }
    if (sumMsg) sumMsg.textContent = fieldValue(message) || '—';
    const company = fieldValue(companyField);
    if (sumWho) sumWho.textContent = `${fieldValue(nameField)} · ${fieldValue(emailField)}${company ? ` · ${company}` : ''}`;
    const sumSource = document.getElementById('sum-source');
    if (sumSource) {
      const chosen = sourceField instanceof HTMLSelectElement ? sourceField.selectedOptions[0] : null;
      sumSource.textContent = sourceField instanceof HTMLSelectElement && sourceField.value && chosen
        ? chosen.textContent || '—'
        : '—';
    }
  }

  function messageBody() {
    return [fieldValue(message), '', [fieldValue(nameField), fieldValue(emailField), fieldValue(companyField)].filter(Boolean).join('\n')].join('\n');
  }

  function fullMessage() {
    const toLabel = panel.dataset.toLabel || 'To';
    const subjectLabel = panel.dataset.subjectLabel || 'Subject';
    return `${toLabel} : ${email}\n${subjectLabel} : ${selectedSubject()}\n\n${messageBody()}`;
  }

  function applyMailLinks() {
    const subject = encodeURIComponent(selectedSubject());
    const body = encodeURIComponent(messageBody());
    if (gmail instanceof HTMLAnchorElement) {
      gmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`;
    }
    if (outlook instanceof HTMLAnchorElement) {
      outlook.href = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(email)}&subject=${subject}&body=${body}`;
    }
    if (openMail instanceof HTMLAnchorElement) {
      openMail.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
    if (preview) preview.textContent = `${panel.dataset.toLabel || 'To'} ${email} · ${panel.dataset.subjectLabel || 'Subject'} ${selectedSubject()}`;
  }

  function retractMailLinks() {
    if (prepare instanceof HTMLElement) prepare.hidden = false;
    if (outcome instanceof HTMLElement) outcome.hidden = true;
    if (copyFullStatus) copyFullStatus.textContent = '';
    if (copyFallback) {
      copyFallback.hidden = true;
      copyFallback.textContent = '';
    }
    if (preview) preview.textContent = '';
    if (gmail instanceof HTMLAnchorElement) {
      gmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
    }
    if (outlook instanceof HTMLAnchorElement) {
      outlook.href = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(email)}`;
    }
    refreshMail();
  }

  function invalidatePrepared() {
    if (!(prepare instanceof HTMLElement)) return;
    if (prepare.dataset.action === 'send' && !prepare.hidden) {
      if (outcome instanceof HTMLElement && !outcome.hidden) outcome.hidden = true;
      const error = document.getElementById('err-4');
      if (error) error.textContent = '';
      if (sendStatus) sendStatus.textContent = '';
      return;
    }
    if (!prepare.hidden) return;
    retractMailLinks();
  }

  function show(step, moveFocus) {
    document.querySelectorAll('[data-step]').forEach((item) => {
      if (item instanceof HTMLElement) item.hidden = Number(item.dataset.step) !== step;
    });
    const stepButtons = isDemoMode()
      ? stepsDemo?.querySelectorAll('[data-goto]')
      : stepsGeneric?.querySelectorAll('[data-goto]');
    stepButtons?.forEach((item) => {
      if (!(item instanceof HTMLButtonElement)) return;
      const value = Number(item.dataset.goto);
      if (value === step) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
      item.disabled = value > state.reached;
    });
    if (step === 2 && !isDemoMode()) paintHints();
    if (step === 4) paintSummary();
    if (!moveFocus) return;
    const current = document.querySelector(`[data-step="${step}"]`);
    const target = current?.querySelector('textarea, input, #prepare, .btn.primary');
    if (target instanceof HTMLElement) target.focus();
  }

  function validate(step) {
    const error = document.getElementById(`err-${step}`);
    if (error) error.textContent = '';
    if (step === 1 && !isDemoMode() && !state.need) {
      if (error) error.textContent = panel.dataset.needErr || '';
      return false;
    }
    if (step === 2 && !isDemoMode() && fieldValue(message).length < 20) {
      if (error) error.textContent = panel.dataset.msgErr || '';
      return false;
    }
    if (step === 3) {
      if (fieldValue(nameField).length < 2) {
        if (error) error.textContent = panel.dataset.nameErr || '';
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue(emailField))) {
        if (error) error.textContent = panel.dataset.mailErr || '';
        return false;
      }
    }
    return true;
  }

  function goto(step, checkFrom) {
    if (checkFrom && !validate(checkFrom)) return;
    state.reached = Math.max(state.reached, step);
    show(step, true);
  }

  function enterDemoMode() {
    state.mode = 'demo';
    state.topic = 'copharia';
    state.need = 'other';
    state.inquiry = 'demo';
    state.reached = 3;
    setNeed('other');
    setInquiry('demo');
    panel.dataset.mode = 'demo';
    panel.dataset.product = 'copharia';

    if (headingMain) headingMain.textContent = panel.dataset.demoTitle || headingMain.textContent;
    if (headingAccent instanceof HTMLElement) headingAccent.hidden = true;
    if (introEl) introEl.textContent = panel.dataset.demoIntro || '';
    if (flag) {
      flag.hidden = false;
      flag.textContent = panel.dataset.cophariaFlag || '';
    }
    if (stepsGeneric instanceof HTMLElement) stepsGeneric.hidden = true;
    if (stepsDemo instanceof HTMLElement) stepsDemo.hidden = false;
    panel.querySelectorAll('[data-generic-only]').forEach((node) => {
      if (node instanceof HTMLElement && !node.matches('[data-step]')) node.hidden = true;
    });

    if (messageField instanceof HTMLElement && messageSlot instanceof HTMLElement) {
      messageSlot.appendChild(messageField);
      if (messageLabel) messageLabel.textContent = panel.dataset.msgOptionalLabel || messageLabel.textContent;
    }
    if (message instanceof HTMLTextAreaElement && !message.value) {
      message.value = panel.dataset.cophariaPrefill || '';
    }

    const hiddenProduct = panel.querySelector('[data-hidden-product]');
    if (hiddenProduct instanceof HTMLInputElement) hiddenProduct.value = 'copharia';
    show(3, false);
  }

  document.querySelectorAll('[data-need]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!(button instanceof HTMLElement) || isDemoMode()) return;
      const need = button.dataset.need || '';
      const previous = `${state.need}|${state.inquiry}|${state.topic}`;
      setNeed(need);
      if (state.topic === 'copharia' && need !== 'other') state.topic = '';
      const inquiry = state.topic === 'copharia' ? 'demo' : button.dataset.inquiry || needToInquiry[need] || 'project';
      setInquiry(inquiry);
      if (flag) flag.hidden = state.topic !== 'copharia';
      if (`${state.need}|${state.inquiry}|${state.topic}` !== previous) invalidatePrepared();
    });
  });

  [message, nameField, emailField, companyField].forEach((field) => {
    field?.addEventListener('input', invalidatePrepared);
  });

  document.querySelectorAll('[data-next]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!(button instanceof HTMLElement)) return;
      if (isDemoMode() && button.hasAttribute('data-generic-only')) return;
      const target = Number(button.dataset.next);
      const fromNode = button.closest('[data-step]');
      const from = fromNode instanceof HTMLElement ? Number(fromNode.dataset.step) : 0;
      goto(target, target > from ? from : 0);
    });
  });

  document.querySelectorAll('[data-goto]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!(button instanceof HTMLElement)) return;
      const target = Number(button.dataset.goto);
      if (isDemoMode() && (target === 1 || target === 2)) return;
      if (target <= state.reached) show(target, true);
    });
  });

  document.querySelectorAll('[data-edit-message]').forEach((button) => {
    button.addEventListener('click', () => {
      if (isDemoMode()) goto(3, 0);
      else goto(2, 0);
    });
  });

  function setMailActionsVisible(visible) {
    outcome?.querySelectorAll('.mail-actions, #mail-preview, #copy-mail, #copy-status, #copy-fallback').forEach((node) => {
      if (node instanceof HTMLElement) node.hidden = !visible;
    });
  }

  function showOutcome(mode, fallbackText) {
    const title = panel.querySelector('[data-outcome-title]');
    const body = panel.querySelector('[data-outcome-body]');
    const fallback = panel.querySelector('[data-outcome-fallback]');
    const success = mode === 'success';
    if (title instanceof HTMLElement) title.hidden = !success;
    if (body instanceof HTMLElement) body.hidden = !success;
    if (fallback instanceof HTMLElement) {
      fallback.hidden = success;
      if (!success && typeof fallbackText === 'string') fallback.textContent = fallbackText;
    }
    setMailActionsVisible(!success);
    if (outcome) outcome.hidden = false;
    if (outcomeText instanceof HTMLElement) outcomeText.focus();
  }

  function showMailFallback(text) {
    applyMailLinks();
    showOutcome('fallback', text || panel.dataset.sendError || '');
    if (copyFullStatus) copyFullStatus.textContent = '';
    if (copyFallback) copyFallback.hidden = true;
  }

  async function refreshToken() {
    try {
      const response = await fetch('/api/contact', { headers: { accept: 'application/json' } });
      if (!response.ok) return;
      const data = await response.json();
      if (data?.available === true && typeof data.token === 'string') {
        sendState.token = data.token;
        sendState.readyAt = Date.now() + 2100;
      }
    } catch {
      sendState.token = '';
    }
  }

  async function submitSend() {
    if (sendState.sending || sendState.done) return;
    const error = document.getElementById('err-4');
    if (isDemoMode()) {
      if (!validate(3)) {
        if (error) error.textContent = panel.dataset.nameErr || '';
        return;
      }
    } else if (!validate(1) || !validate(2) || !validate(3)) {
      if (error) error.textContent = panel.dataset.needErr || '';
      return;
    }
    if (error) error.textContent = '';
    sendState.sending = true;
    if (prepare instanceof HTMLButtonElement) {
      prepare.disabled = true;
      prepare.setAttribute('aria-busy', 'true');
    }
    if (sendStatus) sendStatus.textContent = panel.dataset.sendingLabel || '';
    const wait = sendState.readyAt - Date.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    const product = isDemoMode() ? 'copharia' : '';
    const payload = {
      name: fieldValue(nameField),
      email: fieldValue(emailField),
      company: fieldValue(companyField),
      type: apiType(),
      product,
      message: fieldValue(message),
      locale: panel.dataset.locale === 'en' ? 'en' : 'fr',
      source: sourceField instanceof HTMLSelectElement ? sourceField.value : '',
      path: journey,
      token: sendState.token,
      website: honeypot instanceof HTMLInputElement ? honeypot.value : '',
    };
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.accepted === true) {
        sendState.done = true;
        showOutcome('success');
        if (sendStatus) sendStatus.textContent = '';
        if (prepare instanceof HTMLButtonElement) {
          prepare.hidden = true;
          prepare.disabled = true;
        }
        return;
      }
      const uncertain = response.status === 504 || data.error === 'uncertain';
      if (error) error.textContent = '';
      showMailFallback(uncertain ? panel.dataset.uncertainLabel : panel.dataset.sendError);
    } catch {
      if (error) error.textContent = '';
      showMailFallback(panel.dataset.sendError);
    } finally {
      const succeeded = prepare instanceof HTMLButtonElement && prepare.hidden;
      sendState.sending = false;
      if (prepare instanceof HTMLButtonElement && !prepare.hidden) {
        prepare.disabled = false;
        prepare.removeAttribute('aria-busy');
      }
      if (sendStatus && !succeeded) sendStatus.textContent = '';
      if (!succeeded && sendState.available) await refreshToken();
    }
  }

  if (prepare) {
    prepare.addEventListener('click', () => {
      if (prepare.dataset.action === 'send') {
        submitSend();
        return;
      }
      const error = document.getElementById('err-4');
      if (isDemoMode()) {
        if (!validate(3)) {
          if (error) error.textContent = panel.dataset.nameErr || '';
          return;
        }
      } else if (!validate(1) || !validate(2) || !validate(3)) {
        if (error) error.textContent = panel.dataset.needErr || '';
        return;
      }
      if (error) error.textContent = '';
      applyMailLinks();
      setMailActionsVisible(true);
      if (outcome) outcome.hidden = false;
      prepare.hidden = true;
      if (copyFullStatus) copyFullStatus.textContent = '';
      if (copyFallback) copyFallback.hidden = true;
    });
  }

  if (copyAddress instanceof HTMLButtonElement) {
    copyAddress.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(email);
        if (copyStatus) copyStatus.textContent = panel.dataset.copied || '';
      } catch {
        if (copyStatus) copyStatus.textContent = panel.dataset.copyFailed || '';
      }
    });
  }

  if (copyMail) {
    copyMail.addEventListener('click', async () => {
      const text = fullMessage();
      try {
        await navigator.clipboard.writeText(text);
        if (copyFullStatus) copyFullStatus.textContent = panel.dataset.copiedFull || '';
        if (copyFallback) copyFallback.hidden = true;
      } catch {
        if (copyFullStatus) copyFullStatus.textContent = panel.dataset.copyFail || '';
        if (copyFallback) {
          copyFallback.hidden = false;
          copyFallback.textContent = text;
        }
      }
    });
  }

  const GUIDE_CACHE = 'cc-guide-handoff';
  const GUIDE_PATH = '/cc-guide-handoff';
  const GUIDE_TTL_MS = 120000;

  async function consumeGuideMark() {
    const empty = { path: '', message: '' };
    if (!('caches' in window)) return empty;
    const cache = await caches.open(GUIDE_CACHE);
    const hit = await cache.match(GUIDE_PATH);
    await caches.delete(GUIDE_CACHE);
    if (!hit) return empty;
    let data;
    try {
      data = JSON.parse(await hit.text());
    } catch {
      return empty;
    }
    if (!data || typeof data.exp !== 'number' || data.exp < Date.now()) return empty;
    if (Date.now() - (data.exp - GUIDE_TTL_MS) > GUIDE_TTL_MS) return empty;
    const path = data.path === 'guide' ? 'guide' : '';
    if (typeof data.message !== 'string') return { path, message: '' };
    const text = data.message
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]+/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .trim()
      .slice(0, 1500);
    if (!text || /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text) || /\+?\d[\d\s().-]{8,}\d/.test(text)) {
      return { path, message: '' };
    }
    return { path, message: text };
  }

  const type = params.get('type') || '';
  const need = params.get('need') || '';
  if (typeToInquiry[type]) {
    setNeed(typeToNeed[type]);
    setInquiry(typeToInquiry[type]);
  } else if (needToInquiry[need]) {
    setNeed(need);
    setInquiry(needToInquiry[need]);
  }

  const topic = (params.get('topic') || '').toLowerCase();
  const product = (params.get('product') || '').toLowerCase();
  const wantsCophariaDemo =
    topic === 'copharia' || (type === 'demo' && product === 'copharia');

  function applyGuideSummary(guideSummary) {
    if (!(message instanceof HTMLTextAreaElement) || message.value.trim() || !guideSummary) return false;
    message.value = guideSummary;
    return true;
  }

  async function openFirstStep() {
    let guideSummary = '';
    try {
      const mark = await consumeGuideMark();
      journey = mark.path === 'guide' ? 'guide' : 'direct';
      guideSummary = mark.message;
    } catch {
      journey = 'direct';
      guideSummary = '';
    }
    panel.dataset.journey = journey;
    if (wantsCophariaDemo) {
      applyGuideSummary(guideSummary);
      enterDemoMode();
      return;
    }
    if (select instanceof HTMLSelectElement) select.addEventListener('change', refreshMail);
    refreshMail();
    if (applyGuideSummary(guideSummary) && fieldValue(message).length >= 20) {
      state.reached = 2;
      show(2, true);
      return;
    }
    show(1);
  }

  openFirstStep();

  if (select instanceof HTMLSelectElement) select.addEventListener('change', refreshMail);
  refreshMail();

  async function probeAvailability() {
    try {
      const response = await fetch('/api/contact', { headers: { accept: 'application/json' } });
      if (!response.ok) return;
      const data = await response.json();
      if (data?.available !== true || typeof data.token !== 'string' || data.token.length < 16) return;
      sendState.available = true;
      sendState.token = data.token;
      sendState.readyAt = Date.now() + 2100;
      if (prepare instanceof HTMLButtonElement) {
        prepare.dataset.action = 'send';
        prepare.textContent = panel.dataset.sendLabel || prepare.textContent;
      }
      if (introEl && panel.dataset.sendIntro) introEl.textContent = panel.dataset.sendIntro;
    } catch {
      sendState.available = false;
    }
  }

  probeAvailability();
})();
