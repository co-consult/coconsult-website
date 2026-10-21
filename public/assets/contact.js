(() => {
  const panel = document.querySelector('[data-contact-panel]');
  if (!(panel instanceof HTMLElement)) return;

  const email = panel.dataset.email || 'contact@coconsult.fr';
  const select = panel.querySelector('[data-contact-type]');
  const openMail = panel.querySelector('[data-open-mail]');
  const copyAddress = panel.querySelector('[data-copy-email]');
  const copyStatus = panel.querySelector('[data-copy-status]');
  const message = document.getElementById('message');
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const companyField = document.getElementById('company');
  const flag = document.getElementById('topic-flag');
  const hintsBox = document.getElementById('hints');
  const prepare = document.getElementById('prepare');
  const outcome = document.getElementById('outcome');
  const copyMail = document.getElementById('copy-mail');
  const copyFullStatus = document.getElementById('copy-status');
  const copyFallback = document.getElementById('copy-fallback');
  const preview = document.getElementById('mail-preview');
  const gmail = document.getElementById('open-gmail');
  const outlook = document.getElementById('open-outlook');
  const hintNode = document.getElementById('contact-hints');
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
    cloud: 'project',
    quality: 'qaDiscuss',
    other: 'partnership',
  };
  const hints = hintNode ? JSON.parse(hintNode.textContent || '{}') : {};
  const state = { need: '', inquiry: 'project', topic: '', reached: 1 };

  function productToken() {
    const product = (params.get('product') || '').toLowerCase();
    if (allowedProducts.has(product)) return product;
    if ((params.get('topic') || '').toLowerCase() === 'copharia' || state.topic === 'copharia') return 'copharia';
    return '';
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
      });
      hintsBox.appendChild(button);
    });
  }

  function fieldValue(field) {
    return field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement ? field.value.trim() : '';
  }

  function paintSummary() {
    const needButton = document.querySelector(`[data-need="${state.need}"] b`);
    const needLabel = needButton ? needButton.textContent || '' : '';
    const sumNeed = document.getElementById('sum-need');
    const sumMsg = document.getElementById('sum-msg');
    const sumWho = document.getElementById('sum-who');
    if (sumNeed) sumNeed.textContent = state.topic === 'copharia' ? `${needLabel} · COPHARIA` : needLabel;
    if (sumMsg) sumMsg.textContent = fieldValue(message);
    const company = fieldValue(companyField);
    if (sumWho) sumWho.textContent = `${fieldValue(nameField)} · ${fieldValue(emailField)}${company ? ` · ${company}` : ''}`;
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

  function show(step) {
    document.querySelectorAll('[data-step]').forEach((item) => {
      if (item instanceof HTMLElement) item.hidden = Number(item.dataset.step) !== step;
    });
    document.querySelectorAll('[data-goto]').forEach((item) => {
      if (!(item instanceof HTMLButtonElement)) return;
      const value = Number(item.dataset.goto);
      if (value === step) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
      item.disabled = value > state.reached;
    });
    if (step === 2) paintHints();
    if (step === 4) paintSummary();
  }

  function validate(step) {
    const error = document.getElementById(`err-${step}`);
    if (error) error.textContent = '';
    if (step === 1 && !state.need) {
      if (error) error.textContent = panel.dataset.needErr || '';
      return false;
    }
    if (step === 2 && fieldValue(message).length < 20) {
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
    show(step);
  }

  document.querySelectorAll('[data-need]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!(button instanceof HTMLElement)) return;
      const need = button.dataset.need || '';
      setNeed(need);
      if (state.topic === 'copharia' && need !== 'other') state.topic = '';
      const inquiry = state.topic === 'copharia' ? 'demo' : button.dataset.inquiry || needToInquiry[need] || 'project';
      setInquiry(inquiry);
      if (flag) flag.hidden = state.topic !== 'copharia';
    });
  });

  document.querySelectorAll('[data-next]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!(button instanceof HTMLElement)) return;
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
      if (target <= state.reached) show(target);
    });
  });

  if (prepare) {
    prepare.addEventListener('click', () => {
      const error = document.getElementById('err-4');
      if (!validate(1) || !validate(2) || !validate(3)) {
        if (error) error.textContent = panel.dataset.needErr || '';
        return;
      }
      if (error) error.textContent = '';
      applyMailLinks();
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
  if (topic === 'copharia' || (type === 'demo' && product === 'copharia')) {
    state.topic = 'copharia';
    setNeed('other');
    setInquiry('demo');
    if (message instanceof HTMLTextAreaElement && !message.value) message.value = panel.dataset.cophariaPrefill || '';
    if (flag) {
      flag.hidden = false;
      flag.textContent = panel.dataset.cophariaFlag || '';
    }
  }

  if (select instanceof HTMLSelectElement) select.addEventListener('change', refreshMail);
  refreshMail();
  show(1);
})();
