function render() {
  setTheme(state.theme);
  const screens = {
    login: loginScreen,
    dashboard: dashboardScreen,
    work: workScreen,
    drafts: draftsScreen,
    history: historyScreen,
    settings: settingsScreen,
    notifications: notificationsScreen,
    inspection: inspectionScreen,
    photo: photoScreen,
    pdf: pdfScreen,
  };
  app.innerHTML = (screens[state.route] || loginScreen)();
  renderDialog();
  if (state.toast) {
    app.insertAdjacentHTML('beforeend', `<div class="toast" role="status">${state.toast}</div>`);
    window.clearTimeout(render.toastTimer);
    render.toastTimer = window.setTimeout(() => { state.toast = ''; render(); }, 1700);
  }
}

function renderDialog() {
  if (state.dialog === 'login') {
    dialogRoot.innerHTML = `<div class="dialog-backdrop" data-backdrop><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <div class="row"><span class="icon-surface" style="--icon-color:var(--secondary)">${svg('badge','icon icon--large')}</span><div><p class="eyebrow">Technik</p><h2 id="login-title">${demo.technician.name}</h2></div></div>
      <div class="field" style="margin-top:16px"><label for="pin">Heslo</label><input id="pin" data-testid="pin" type="password" value="1234" autocomplete="off" /></div>
      <p class="supporting" style="margin-top:10px">Pro ukázku je heslo předvyplněné. Nic se neposílá mimo prohlížeč.</p>
      <div class="dialog-actions"><button class="button button--text" data-action="dismiss-dialog">Zrušit</button><button class="button" data-action="login" data-testid="login-button">Přihlásit</button></div>
    </section></div>`;
  } else if (state.dialog === 'finish') {
    dialogRoot.innerHTML = `<div class="dialog-backdrop" data-backdrop><section class="dialog" role="dialog" aria-modal="true"><p class="eyebrow">Bezpečná ukázka</p><h2>Kontrola zůstala rozpracovaná</h2><p class="supporting">Veřejný preview mirror nevytváří skutečné PDF ani databázový záznam. Produkční chování běží pouze v nativní Android aplikaci.</p><div class="dialog-actions"><button class="button" data-action="dismiss-dialog">Rozumím</button></div></section></div>`;
  } else if (state.dialog === 'history-delete') {
    const selected = demo.history.filter(item => state.historySelection.includes(item.id));
    dialogRoot.innerHTML = `<div class="dialog-backdrop" data-backdrop><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="delete-history-title"><p class="eyebrow" style="color:var(--error)">V102 · demo ukázka</p><h2 id="delete-history-title">Smazat ${protocolCountLabel(selected.length)}?</h2><p class="supporting">Smažou se pouze fiktivní záznamy v tomto veřejném preview.</p><div class="delete-preview">${selected.map(item => `<div><strong>${escapeHtml(item.protocol)}</strong><span>${escapeHtml(item.address)}</span></div>`).join('')}</div><p class="tiny">V nativní aplikaci se současně odstraní odpovědi, fotografie a PDF a akce se zapíše do auditní stopy.</p><div class="dialog-actions"><button class="button button--text" data-action="dismiss-dialog">Zrušit</button><button class="button button--danger" data-action="history-delete-confirm">Smazat demo natrvalo</button></div></section></div>`;
  } else if (state.dialog === 'history-date') {
    dialogRoot.innerHTML = `<div class="dialog-backdrop" data-backdrop><section class="dialog dialog--compact" role="dialog" aria-modal="true" aria-labelledby="history-date-title"><p class="eyebrow" style="color:var(--error)">Hromadné mazání</p><h2 id="history-date-title">Smazat od data</h2><label class="field"><span>Datum včetně</span><input type="date" data-history-date value="${escapeHtml(state.historyDeleteFromDate)}" /></label><p class="tiny">V dalším kroku se zobrazí přesný seznam protokolů.</p><div class="dialog-actions"><button class="button button--text" data-action="dismiss-dialog">Zrušit</button><button class="button button--danger" data-action="history-date-confirm" ${state.historyDeleteFromDate ? '' : 'disabled'}>Pokračovat</button></div></section></div>`;
  } else {
    dialogRoot.innerHTML = '';
  }
}

function navigate(route) {
  if (route === state.route) return;
  state.previous.push(state.route);
  state.route = route;
  state.dialog = null;
  render();
}

function back() {
  state.route = state.previous.pop() || (state.route === 'dashboard' ? 'login' : 'dashboard');
  state.dialog = null;
  render();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
}

function protocolCountLabel(count) {
  if (count === 1) return '1 protokol';
  if (count >= 2 && count <= 4) return `${count} protokoly`;
  return `${count} protokolů`;
}

function deletedProtocolMessage(count) {
  if (count === 1) return 'Smazán 1 protokol';
  if (count >= 2 && count <= 4) return `Smazány ${count} protokoly`;
  return `Smazáno ${count} protokolů`;
}

document.addEventListener('click', (event) => {
  if (event.target.matches('[data-backdrop]')) { state.dialog = null; renderDialog(); return; }
  const routeTarget = event.target.closest('[data-route]');
  if (routeTarget) { navigate(routeTarget.dataset.route); return; }
  const answer = event.target.closest('[data-answer]');
  if (answer) { state.answers[answer.dataset.answer] = answer.dataset.value; state.toast = 'Změna byla průběžně uložena'; render(); return; }
  const photoTool = event.target.closest('[data-photo-tool]');
  if (photoTool) { state.photoTool = photoTool.dataset.photoTool; render(); return; }
  const actionTarget = event.target.closest('[data-action]');
  if (!actionTarget) return;
  const action = actionTarget.dataset.action;
  if (action === 'theme') { setTheme(state.theme === 'dark' ? 'light' : 'dark'); render(); }
  else if (action === 'back') back();
  else if (action === 'close') { state.toast = 'Veřejnou ukázku lze kdykoli znovu otevřít'; render(); }
  else if (action === 'logout') { state.previous = []; state.route = 'login'; render(); }
  else if (action === 'open-login') { state.dialog = 'login'; renderDialog(); }
  else if (action === 'dismiss-dialog') { state.dialog = null; renderDialog(); }
  else if (action === 'login') { state.dialog = null; state.previous = ['login']; state.route = 'dashboard'; render(); }
  else if (action === 'share') { state.toast = 'Sdílení je v UI mirroru pouze názorné'; render(); }
  else if (action === 'download') { state.toast = 'Stažení je v UI mirroru pouze názorné'; render(); }
  else if (action === 'settings-info') { state.toast = `${actionTarget.dataset.label}: demonstrační obrazovka`; render(); }
  else if (action === 'save-notifications') { state.notificationDirty = false; state.toast = 'Nastavení upozornění bylo uloženo'; render(); }
  else if (action === 'saved') { state.toast = 'Položka je bezpečně uložena'; render(); }
  else if (action === 'finish-demo') { state.dialog = 'finish'; renderDialog(); }
  else if (action === 'save-photo') { state.toast = 'Označení fotografie bylo uloženo'; back(); }
  else if (action === 'photo-undo') { state.toast = 'Poslední tah byl vrácen'; render(); }
  else if (action === 'photo-clear') { state.toast = 'Označení bylo vymazáno'; render(); }
  else if (action === 'history-delete-mode') { state.historyDeleteMode = !state.historyDeleteMode; if (!state.historyDeleteMode) state.historySelection = []; render(); }
  else if (action === 'history-select-visible') { state.historySelection = demo.history.filter(item => !state.historyQuery || `${item.address} ${item.protocol}`.toLowerCase().includes(state.historyQuery.trim().toLowerCase())).map(item => item.id); render(); }
  else if (action === 'history-delete-open') { state.dialog = 'history-delete'; renderDialog(); }
  else if (action === 'history-delete-from-date') { state.dialog = 'history-date'; renderDialog(); }
  else if (action === 'history-date-confirm') { const from = state.historyDeleteFromDate; state.historySelection = from ? demo.history.filter(item => item.iso >= from).map(item => item.id) : []; if (state.historySelection.length) { state.dialog = 'history-delete'; renderDialog(); } else { state.dialog = null; state.toast = 'Od zvoleného data není žádný demo protokol'; render(); } }
  else if (action === 'history-delete-confirm') { const deleted = new Set(state.historySelection); demo.history = demo.history.filter(item => !deleted.has(item.id)); state.historySelection = []; state.historyDeleteMode = false; state.dialog = null; state.toast = `Demo: ${deletedProtocolMessage(deleted.size).toLowerCase()}`; render(); }
});

document.addEventListener('change', (event) => { const checkbox = event.target.closest('[data-history-select]'); if (!checkbox) return; const id = checkbox.dataset.historySelect; state.historySelection = checkbox.checked ? [...new Set([...state.historySelection, id])] : state.historySelection.filter(item => item !== id); render(); });

document.addEventListener('input', (event) => {
  if (event.target.matches('[data-history-date]')) { state.historyDeleteFromDate = event.target.value; const button = document.querySelector('[data-action="history-date-confirm"]'); if (button) button.disabled = !event.target.value; return; }
  if (event.target.matches('[data-notification-input]')) {
    state.notificationDirty = event.target.checkValidity();
    const button = document.querySelector('[data-action="save-notifications"]');
    if (button) button.disabled = !state.notificationDirty;
    return;
  }
  if (event.target.matches('[data-action="history-search"]')) {
    state.historyQuery = event.target.value;
    const position = event.target.selectionStart;
    render();
    const next = document.querySelector('[data-action="history-search"]');
    next?.focus();
    next?.setSelectionRange(position, position);
  }
});

window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (state.dialog) { state.dialog = null; renderDialog(); }
    else back();
  }
});

setTheme(state.theme);
render();
