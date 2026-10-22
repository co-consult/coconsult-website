(() => {
  const system = document.querySelector('.system');
  const focusRead = document.querySelector('.focus-read');
  if (system instanceof HTMLElement && focusRead instanceof HTMLElement) {
    document.querySelectorAll('button[data-lane]').forEach((button) => {
      button.addEventListener('click', () => {
        if (!(button instanceof HTMLButtonElement)) return;
        const lane = button.dataset.lane || '';
        const next = system.dataset.focus === lane ? 'all' : lane;
        system.dataset.focus = next;
        document.querySelectorAll('button[data-lane]').forEach((item) => {
          item.setAttribute('aria-pressed', item.dataset.lane === next ? 'true' : 'false');
        });
        const source = document.querySelector(`button[data-lane="${next}"]`);
        const text = next === 'all' ? focusRead.dataset.all : source instanceof HTMLElement ? source.dataset.focusText : '';
        if (text) focusRead.textContent = text;
      });
    });
  }

  const panels = [...document.querySelectorAll('.viz-panel')];
  const skillList = document.querySelector('.skill-list');
  if (skillList) {
    skillList.querySelectorAll('[data-skill]').forEach((tab) => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.skill;
        skillList.querySelectorAll('[data-skill]').forEach((item) => {
          const on = item.dataset.skill === id;
          item.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        panels.forEach((panel) => {
          panel.hidden = panel.id !== `panel-${id}`;
        });
      });
    });
    skillList.addEventListener('keydown', (event) => {
      if (!(event instanceof KeyboardEvent)) return;
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      const tabs = [...skillList.querySelectorAll('[data-skill]')];
      const index = tabs.indexOf(document.activeElement);
      if (index < 0) return;
      event.preventDefault();
      const next = tabs[(index + (event.key === 'ArrowDown' ? 1 : tabs.length - 1)) % tabs.length];
      if (next instanceof HTMLElement) {
        next.focus();
        next.click();
      }
    });
  }

  const aiResult = document.getElementById('ai-result');
  const aiPipe = document.getElementById('ai-pipe');
  document.querySelectorAll('[data-doc]').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-doc]').forEach((item) => item.setAttribute('aria-pressed', item === chip ? 'true' : 'false'));
      if (aiPipe) aiPipe.classList.add('is-live');
      if (aiResult && chip instanceof HTMLElement && chip.dataset.result) aiResult.textContent = chip.dataset.result;
    });
  });

  const softResult = document.getElementById('soft-result');
  document.querySelectorAll('[data-layer]').forEach((layer) => {
    layer.addEventListener('click', () => {
      document.querySelectorAll('[data-layer]').forEach((item) => item.setAttribute('aria-pressed', item === layer ? 'true' : 'false'));
      if (softResult && layer instanceof HTMLElement && layer.dataset.result) softResult.textContent = layer.dataset.result;
    });
  });

  const pipe = document.getElementById('pipe');
  const runPipe = document.getElementById('run-pipe');
  if (pipe && runPipe) {
    const pipeSteps = [...pipe.querySelectorAll('.step')];
    let pipeStep = -1;
    const paintPipe = (index) => {
      pipeStep = index;
      pipe.style.setProperty('--progress', String((index + 1) / pipeSteps.length));
      pipeSteps.forEach((step, stepIndex) => step.classList.toggle('is-on', stepIndex <= index));
    };
    runPipe.addEventListener('click', () => paintPipe((pipeStep + 1) % pipeSteps.length));
    pipeSteps.forEach((step) => {
      step.addEventListener('click', () => {
        if (step instanceof HTMLElement) paintPipe(Number(step.dataset.step));
      });
    });
  }

  const checks = [...document.querySelectorAll('#checks .check')];
  const fixQa = document.getElementById('fix-qa');
  const qaResult = document.getElementById('qa-result');
  const runQa = document.getElementById('run-qa');
  if (runQa && fixQa && qaResult) {
    runQa.addEventListener('click', () => {
      checks.forEach((check, index) => {
        check.classList.toggle('is-ok', index < 3);
        check.classList.toggle('is-fail', index === 3);
      });
      fixQa.hidden = false;
      qaResult.textContent = qaResult.dataset.fail || '';
    });
    fixQa.addEventListener('click', () => {
      checks.forEach((check) => {
        check.classList.remove('is-fail');
        check.classList.add('is-ok');
      });
      qaResult.textContent = qaResult.dataset.ok || '';
    });
  }

  const matrix = document.getElementById('matrix');
  if (matrix instanceof HTMLElement) {
    const rights = {
      read: { file: 'view', api: 'view', secret: 'none' },
      edit: { file: 'write', api: 'write', secret: 'none' },
      admin: { file: 'write', api: 'write', secret: 'write' },
    };
    const labels = { view: matrix.dataset.view || '', write: matrix.dataset.write || '', none: matrix.dataset.none || '' };
    const paintRole = (role) => {
      const map = rights[role] || rights.read;
      matrix.querySelectorAll('[data-cell]').forEach((cell) => {
        if (!(cell instanceof HTMLElement)) return;
        const level = map[cell.dataset.cell] || 'none';
        cell.dataset.level = level;
        cell.textContent = labels[level] || '';
      });
      document.querySelectorAll('[data-role]').forEach((button) => {
        button.setAttribute('aria-pressed', button.dataset.role === role ? 'true' : 'false');
      });
    };
    paintRole('read');
    document.querySelectorAll('[data-role]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button instanceof HTMLElement && button.dataset.role) paintRole(button.dataset.role);
      });
    });
  }

  const bridge = document.getElementById('bridge');
  const hopResult = document.getElementById('hop-result');
  const advanceHop = document.getElementById('advance-hop');
  if (bridge && hopResult && advanceHop) {
    const hops = [...bridge.querySelectorAll('[data-hop]')];
    let hop = 0;
    const paintHop = (index) => {
      hop = index;
      bridge.style.setProperty('--hop', String(hop));
      hops.forEach((button) => button.setAttribute('aria-pressed', Number(button.dataset.hop) === hop ? 'true' : 'false'));
      const current = hops[hop];
      if (current instanceof HTMLElement && current.dataset.result) hopResult.textContent = current.dataset.result;
    };
    advanceHop.addEventListener('click', () => paintHop((hop + 1) % hops.length));
    hops.forEach((button) => {
      button.addEventListener('click', () => {
        if (button instanceof HTMLElement) paintHop(Number(button.dataset.hop));
      });
    });
  }

  const docScene = document.querySelector('.scene-docs');
  const docRead = document.getElementById('doc-read');
  const docStamp = document.getElementById('doc-stamp');
  const docFileLabel = document.getElementById('doc-file');
  if (docScene instanceof HTMLElement) {
    let docStage = 0;
    let docFile = 0;
    const paintDoc = () => {
      document.querySelectorAll('[data-doc-stage]').forEach((item) => {
        item.setAttribute('aria-pressed', Number(item.dataset.docStage) === docStage ? 'true' : 'false');
      });
      document.querySelectorAll('[data-file]').forEach((item) => {
        item.setAttribute('aria-pressed', Number(item.dataset.file) === docFile ? 'true' : 'false');
      });
      document.querySelectorAll('[data-hist]').forEach((item) => {
        item.classList.toggle('is-kept', Number(item.dataset.hist) <= docStage);
      });
      docScene.style.setProperty('--doc-step', String(docStage));
      const stage = document.querySelector(`[data-doc-stage="${docStage}"]`);
      const file = document.querySelector(`[data-file="${docFile}"]`);
      if (docStamp && stage instanceof HTMLElement) docStamp.textContent = stage.dataset.label || '';
      if (docFileLabel && file instanceof HTMLElement) docFileLabel.textContent = file.dataset.label || '';
      if (docRead && stage instanceof HTMLElement) docRead.textContent = stage.dataset.detail || '';
    };
    document.querySelectorAll('[data-doc-stage]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button instanceof HTMLElement) {
          docStage = Number(button.dataset.docStage);
          paintDoc();
        }
      });
    });
    document.querySelectorAll('button[data-file]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button instanceof HTMLElement) {
          docFile = Number(button.dataset.file);
          paintDoc();
        }
      });
    });
  }

  const sportRead = document.getElementById('sport-read');
  const sportNow = document.getElementById('sport-now');
  if (sportNow || sportRead) {
    let sportStage = 0;
    const paintSport = () => {
      document.querySelectorAll('[data-sport]').forEach((item) => {
        item.setAttribute('aria-pressed', Number(item.dataset.sport) === sportStage ? 'true' : 'false');
      });
      const current = document.querySelector(`[data-sport="${sportStage}"]`);
      if (current instanceof HTMLElement) {
        if (sportNow) sportNow.textContent = current.dataset.label || '';
        if (sportRead) sportRead.textContent = current.dataset.detail || '';
      }
    };
    document.querySelectorAll('[data-sport]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button instanceof HTMLElement) {
          sportStage = Number(button.dataset.sport);
          paintSport();
        }
      });
    });
  }

  document.querySelectorAll('[data-case]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!(button instanceof HTMLButtonElement) || !button.parentElement) return;
      const more = button.parentElement.querySelector('.more');
      if (!(more instanceof HTMLElement)) return;
      const open = more.hidden;
      more.hidden = !open;
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      button.textContent = open ? button.dataset.less || '' : button.dataset.more || '';
    });
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-copharia-gallery]').forEach((gallery) => {
    if (!(gallery instanceof HTMLElement)) return;
    const img = gallery.querySelector('[data-screen]');
    const note = gallery.querySelector('[data-lab-note]');
    const label = gallery.querySelector('[data-screen-label]');
    const sub = gallery.querySelector('[data-stock-switch]');
    const views = [...gallery.querySelectorAll('[data-view]')];
    const shots = [...gallery.querySelectorAll('[data-shot]')];

    function paintImage(source) {
      if (!(img instanceof HTMLImageElement) || !(source instanceof HTMLElement)) return;
      const src = source.dataset.src || '';
      if (note instanceof HTMLElement) note.hidden = true;
      img.hidden = false;
      if (label) label.textContent = source.dataset.label || '';
      if (img.getAttribute('src') === src) {
        img.style.opacity = '1';
        return;
      }
      const apply = () => {
        img.src = src;
        img.alt = source.dataset.alt || '';
        if (source.dataset.w) img.width = Number(source.dataset.w);
        if (source.dataset.h) img.height = Number(source.dataset.h);
      };
      if (reduceMotion) {
        img.style.opacity = '1';
        apply();
        return;
      }
      img.style.opacity = '0';
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      }, { once: true });
      apply();
    }

    views.forEach((button) => {
      button.addEventListener('click', () => {
        if (!(button instanceof HTMLElement)) return;
        views.forEach((item) => item.setAttribute('aria-pressed', item === button ? 'true' : 'false'));
        if (button.dataset.view === 'lab') {
          if (sub instanceof HTMLElement) sub.hidden = true;
          if (img instanceof HTMLImageElement) img.hidden = true;
          if (note instanceof HTMLElement) note.hidden = false;
          if (label) label.textContent = button.dataset.label || '';
          return;
        }
        if (sub instanceof HTMLElement) sub.hidden = button.dataset.view !== 'stocks';
        if (button.dataset.view === 'stocks') {
          const list = shots.find((item) => item instanceof HTMLElement && item.dataset.shot === 'stocks');
          shots.forEach((item) => item.setAttribute('aria-pressed', item === list ? 'true' : 'false'));
          paintImage(list);
          return;
        }
        paintImage(button);
      });
    });

    shots.forEach((button) => {
      button.addEventListener('click', () => {
        if (!(button instanceof HTMLElement)) return;
        shots.forEach((item) => item.setAttribute('aria-pressed', item === button ? 'true' : 'false'));
        paintImage(button);
      });
    });

    gallery.querySelector('.gallery-tabs')?.addEventListener('keydown', (event) => {
      if (!(event instanceof KeyboardEvent)) return;
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      const index = views.indexOf(document.activeElement);
      if (index < 0) return;
      event.preventDefault();
      const step = event.key === 'ArrowRight' ? 1 : -1;
      const next = views[(index + step + views.length) % views.length];
      if (next instanceof HTMLElement) {
        next.focus();
        next.click();
      }
    });
  });
})();
