function loginScreen() {
  return `<section class="screen" data-screen="login">
    ${topBar('Přihlášení', 'DSO V1.0', { logout: false })}
    <main class="scroll"><div class="content">
      ${brandPanel({ title: 'Vítejte zpět', supporting: 'Vyberte svůj účet. Kontroly i dokumenty zůstávají bezpečně v tomto telefonu.', status: 'Offline provoz' })}
      <h2 style="font-size:21px;margin:1px 0 -2px">Technici</h2>
      ${futureCard(`<div class="card-pad">
        <span class="icon-surface" style="--icon-color:var(--secondary)">${svg('badge','icon icon--large')}</span>
        <div class="flex-1"><h3>${demo.technician.name}</h3><p class="supporting">Technik</p></div>
        ${svg('lock')}
      </div>`, { tone: 'secondary', button: true, attrs: 'data-action="open-login" data-testid="technician-card"', classes: 'account-card' })}
      <p class="supporting" style="text-align:center;margin-top:5px">Veřejný UI mirror používá pouze smyšlené údaje.</p>
    </div></main>
  </section>`;
}

function dashboardHero() {
  return `<section class="brand-panel">
    <div class="brand-row">
      <img class="brand-icon" src="../assets/app-icon.svg" alt="Ikona DSO" />
      <div class="brand-copy"><p class="eyebrow">DSO V1.0</p><h1>Digitální Správa Objektů</h1><p style="margin:4px 0 0">${demo.technician.name} · Technik</p></div>
    </div>
    <div style="margin-top:13px">${pill('1 rozpracovaná', 'primary', 'drafts')}</div>
  </section>`;
}

function dashboardTile({ route, title, supporting, badge, iconName, tone }) {
  return futureCard(`<div class="card-pad">
    <div class="row row--between row--top">
      <span class="icon-surface" style="--icon-color:var(--${tone})">${svg(iconName,'icon icon--large')}</span>
      ${badge != null ? pill(String(badge), tone) : ''}
    </div>
    <div><div class="row row--between"><h3>${title}</h3>${svg('arrow','icon icon--small')}</div><p class="supporting">${supporting}</p></div>
  </div>`, { tone, button: true, attrs: `data-route="${route}"`, classes: 'dashboard-tile' });
}

function dashboardScreen() {
  const progress = Math.round(demo.draft.completed / demo.draft.total * 100);
  return `<section class="screen" data-screen="dashboard">
    ${topBar('DSO', 'DSO V1.0')}
    <main class="scroll"><div class="content">
      ${dashboardHero()}
      ${futureCard(`<div class="card-pad stack">
        <div class="row row--between row--top"><div class="flex-1"><p class="eyebrow" style="color:var(--tertiary)">Pokračovat v poslední kontrole</p><h3>${demo.draft.address}</h3><p class="supporting">${demo.draft.completed}/${demo.draft.total} hotovo · uloženo 17. 8. 14:26</p></div><span class="icon-surface" style="--icon-color:var(--tertiary)">${svg('arrow')}</span></div>
        <div class="progress"><span style="--progress:${progress}%"></span></div>
      </div>`, { tone: 'tertiary', button: true, attrs: 'data-route="inspection"' })}
      ${sectionHeader('Přehled', 'Vše důležité po ruce', 'Nová kontrola, rozpracovaná práce i archiv bez zbytečného hledání.')}
      <div class="dashboard-grid">
        ${dashboardTile({ route:'work', title:'Práce', supporting:'Domy podle termínu', badge:3, iconName:'work', tone:'primary' })}
        ${dashboardTile({ route:'drafts', title:'Rozpracované', supporting:'Bezpečně uložené kontroly', badge:1, iconName:'drafts', tone:'tertiary' })}
        ${dashboardTile({ route:'history', title:'Historie', supporting:'Uzavřené protokoly a PDF', badge:3, iconName:'history', tone:'secondary' })}
        ${dashboardTile({ route:'settings', title:'Nastavení', supporting:'Objekty, účty a bezpečnost', iconName:'settings', tone:'secondary' })}
      </div>
    </div></main>
  </section>`;
}

function workScreen() {
  const cards = demo.buildings.map((building, index) => {
    const tone = building.tone;
    return futureCard(`<div class="card-pad">
      <div class="row row--top"><span class="icon-surface" style="--icon-color:var(--${tone})">${svg('building','icon icon--large')}</span><div class="flex-1 stack stack--small"><h3>${building.address}</h3>${pill(building.due, tone)}</div></div>
      <button class="button button--wide" data-route="inspection" data-building="${building.id}">${svg('play')}Zahájit kontrolu</button>
    </div>`, { tone, classes:'building-card' });
  }).join('');
  return mainShell({ title:'Místní šetření', active:'work', content:`${sectionHeader('Nová kontrola','Domy podle termínu','Vyberte objekt. Další kontrolu lze zahájit, i když jiná ještě zůstává rozpracovaná.')}${cards}` });
}

function draftsScreen() {
  const d = demo.draft;
  const progress = Math.round(d.completed / d.total * 100);
  const card = futureCard(`<div class="card-pad stack">
    <div class="row row--between row--top"><div class="flex-1"><h3>${d.address}</h3><p class="supporting">${d.protocol} · 17. 8. 2026</p></div><button class="button button--tonal button--small" data-route="inspection">Pokračovat ${svg('arrow','icon icon--small')}</button></div>
    <div class="progress-row"><div class="progress-meta"><span>${d.completed}/${d.total} položek hotovo</span><span style="color:var(--primary)">${progress} %</span></div><div class="progress"><span style="--progress:${progress}%"></span></div></div>
    <div class="metric-row"><span class="metric">${svg('error','icon icon--small')}${d.defects} závady</span><span class="metric">${svg('camera','icon icon--small')}${d.photos} foto</span><span class="metric" style="margin-left:auto">${svg('clock','icon icon--small')}Uloženo ${d.saved}</span></div>
  </div>`, { tone:'tertiary', button:true, attrs:'data-route="inspection"' });
  return mainShell({ title:'Rozpracované', active:'drafts', content:`${sectionHeader('Živá práce','1 otevřená kontrola','Každá změna se průběžně a odolně ukládá v telefonu.')}${card}` });
}

function historyCard(item) {
  const selected = state.historySelection.includes(item.id);
  return futureCard(`<div class="card-pad stack">
    ${state.historyDeleteMode ? `<label class="selection-row"><input type="checkbox" data-history-select="${item.id}" ${selected ? 'checked' : ''} /><span>Vybrat protokol ke smazání</span></label>` : ''}
    <div class="row row--between row--top"><div class="flex-1"><h3>${item.address}</h3><p class="supporting">${item.protocol} · ${item.date}</p></div>${pill(item.defects ? `${item.defects} závady` : 'Bez závad', item.defects ? 'error' : 'tertiary')}</div>
    <div class="row"><button class="button button--tonal button--small flex-1" data-route="pdf" data-doc="${item.id}">${svg('file','icon icon--small')}Otevřít PDF</button><button class="icon-button icon-button--outlined" data-action="share" aria-label="Sdílet">${svg('share')}</button><button class="icon-button icon-button--outlined" data-action="download" aria-label="Uložit">${svg('download')}</button></div>
  </div>`, { tone:'secondary' });
}

function historyScreen() {
  const q = state.historyQuery.trim().toLowerCase();
  const items = demo.history.filter(item => !q || `${item.address} ${item.protocol}`.toLowerCase().includes(q));
  return mainShell({ title:'Historie', active:'history', content:`
    ${sectionHeader('Dokumenty','Archiv protokolů','Zobrazují se pouze hotové a ukončené kontroly.')}
    ${futureCard(`<div class="delete-card"><div class="delete-card__header">${svg('trash','icon icon--compact')}<h3>Smazat protokoly</h3><button class="button button--tonal button--compact" data-action="history-delete-mode">${state.historyDeleteMode ? 'Zrušit' : 'Vybrat'}</button></div><div class="delete-card__meta"><span>Jednotlivě nebo podle data</span><button class="button button--text button--compact" data-action="history-delete-from-date">Od data</button></div>${state.historyDeleteMode ? `<div class="delete-card__actions"><button class="button button--tonal button--compact" data-action="history-select-visible">Vše</button><button class="button button--danger button--compact" data-action="history-delete-open" ${state.historySelection.length ? '' : 'disabled'}>Smazat (${state.historySelection.length})</button></div>` : ''}</div>`, { tone:'error' })}
    ${futureCard(`<div class="card-pad search-card"><div class="field"><span class="field-icon">${svg('search','icon icon--small')}</span><label for="history-search">Hledat adresu nebo číslo protokolu</label><input id="history-search" data-action="history-search" value="${escapeHtml(state.historyQuery)}" /></div><div class="filter-row"><button class="filter-chip is-selected">Všechny domy</button><button class="filter-chip is-selected">Všechna data</button></div></div>`, { tone:'secondary' })}
    ${pill(`Zobrazeno ${items.length} z ${demo.history.length}`, 'secondary', 'filter')}
    ${items.map(historyCard).join('') || futureCard('<div class="card-pad" style="text-align:center"><h3>Nic jsme nenašli</h3><p class="supporting">Zkuste upravit hledaný text.</p></div>', { tone:'secondary' })}
  ` });
}

const settingsItems = [
  ['Upozornění','bell','Termíny, resty a soukromí'],
  ['Aktivní účty','people','Technici a přístup'],
  ['Domy','building','Objekty a termíny'],
  ['Export a import','backup','Šifrovaná záloha'],
  ['Kontrola dat','shield','Integrita úložiště'],
  ['Kategorie a objekty','checklist','Obsah formuláře'],
  ['Telefon','phone','Kompatibilita zařízení'],
  ['Tisk','print','Nativní tiskárna'],
  ['Změnit heslo','password','Lokální zabezpečení'],
];

function settingsScreen() {
  const tiles = settingsItems.map(([title,iconName,supporting], i) => futureCard(`<div class="card-pad"><span class="icon-surface" style="--icon-color:var(--${i % 3 === 0 ? 'tertiary' : i % 2 ? 'secondary' : 'primary'})">${svg(iconName,'icon icon--large')}</span><div><h3>${title}</h3><p class="supporting">${supporting}</p></div></div>`, { tone:i % 3 === 0 ? 'tertiary' : i % 2 ? 'secondary' : 'primary', button:true, attrs:title === 'Upozornění' ? 'data-route="notifications"' : `data-action="settings-info" data-label="${title}"`, classes:'settings-tile' })).join('');
  return mainShell({ title:'Nastavení', active:'settings', content:`${sectionHeader('Správa zařízení','Nastavení DSO','Účty, domy, formuláře, zálohy a technické kontroly na jednom místě.')}<div class="settings-grid">${tiles}</div>` });
}

function notificationsScreen() {
  return mainShell({ title:'Upozornění', active:'settings', back:true, content:`
    ${sectionHeader('Upozornění V102','Modulární připomenutí kontrol','Samostatné notifikace pro zítřejší, dnešní a prošlé kontroly. Kategorie se standardně přepočítají v 06:00.')}
    ${futureCard(`<div class="card-pad notification-settings">
      <label class="setting-row"><span><strong>Kontroly zítra</strong><small>Upozornit před termínem</small></span><input type="checkbox" checked /></label>
      <label class="setting-row"><span><strong>Kontroly dnes</strong><small>Připomenout v den termínu</small></span><input type="checkbox" checked /></label>
      <label class="setting-row"><span><strong>Prošlé kontroly</strong><small>Opakovat nesplněné resty</small></span><input type="checkbox" checked /></label>
      <label class="setting-row"><span><strong>Počet dnů předem</strong><small>1 až 30 dnů</small></span><input data-notification-input type="number" min="1" max="30" value="1" /></label>
      <label class="setting-row"><span><strong>Čas přepočtu</strong><small>Hodina dne</small></span><input data-notification-input type="number" min="0" max="23" value="6" /></label>
      <label class="setting-row"><span><strong>Kolik objektů zobrazit</strong><small>1 až 8 objektů</small></span><input data-notification-input type="number" min="1" max="8" value="5" /></label>
    </div>`, { tone:'primary' })}
    <button class="button button--wide" data-action="save-notifications" ${state.notificationDirty ? '' : 'disabled'}>Uložit nastavení upozornění</button>
    ${futureCard(`<div class="card-pad stack"><div class="row row--between"><h3>Aktuální resty</h3>${pill('2','error')}</div>${pill('Prošlé kontroly · Ukázková 12','error','bell')}${pill('Kontroly dnes · Javorová 8','primary','bell')}<p class="supporting">Klepnutí na konkrétní rest otevře odpovídající dům v části Práce.</p></div>`, { tone:'error' })}
  ` });
}

const inspectionItems = [
  { id:'entrance', title:'Vstupní dveře', note:'Zámek a zavírání bez závady.', photo:true },
  { id:'bells', title:'Domovní zvonky', note:'Tlačítko bytu 14 je poškozené.', photo:true },
  { id:'light', title:'Osvětlení chodby', note:'', photo:false },
  { id:'meter', title:'Vodoměr', note:'Odečet 01842,6 m³.', photo:true },
];

function inspectionItem(item) {
  const value = state.answers[item.id] || '';
  return futureCard(`<div class="card-pad stack">
    <div class="row row--between"><div class="row"><span class="icon-surface" style="--icon-color:var(--primary)">${svg(item.id === 'meter' ? 'circle' : 'home')}</span><div><h3>${item.title}</h3><p class="supporting">${value ? 'Průběžně uloženo' : 'Čeká na vyplnění'}</p></div></div>${item.photo ? pill('1 foto','secondary','camera') : ''}</div>
    <div class="answer-row">
      <button class="answer ${value === 'ok' ? 'is-selected' : ''}" data-answer="${item.id}" data-value="ok">V pořádku</button>
      <button class="answer ${value === 'defect' ? 'is-selected' : ''}" data-answer="${item.id}" data-value="defect">Závada</button>
      <button class="answer ${value === 'na' ? 'is-selected' : ''}" data-answer="${item.id}" data-value="na">Netýká se</button>
    </div>
    <div class="field"><label>Poznámka</label><textarea data-note="${item.id}" placeholder="Doplňte poznámku…">${escapeHtml(item.note)}</textarea></div>
    <div class="item-actions"><button class="button button--tonal button--small" data-route="photo">${svg('camera','icon icon--small')}Fotografie</button><button class="button button--tonal button--small" data-action="saved">${svg('check','icon icon--small')}Uloženo</button></div>
  </div>`, { tone:value === 'defect' ? 'error' : value === 'ok' ? 'tertiary' : 'primary' });
}

function inspectionScreen() {
  const completed = Object.values(state.answers).filter(Boolean).length;
  const progress = Math.round(completed / inspectionItems.length * 100);
  return `<section class="screen" data-screen="inspection">
    ${topBar('Jabloňová 12', 'DSO-2026-0043', { back:true })}
    <main class="scroll"><div class="content">
      ${futureCard(`<div class="card-pad inspection-summary"><div class="row row--between"><div><p class="eyebrow">Místní šetření</p><h2>Vstup a technické části</h2></div>${pill(`${completed}/${inspectionItems.length} hotovo`,'tertiary')}</div><div class="progress"><span style="--progress:${progress}%"></span></div><p class="supporting">Odpovědi a poznámky se ukládají průběžně v zařízení.</p></div>`, { tone:'tertiary' })}
      ${inspectionItems.map(inspectionItem).join('')}
      <button class="button button--wide" data-action="finish-demo">Dokončit ukázku kontroly</button>
    </div></main>
  </section>`;
}

function photoScreen() {
  return `<section class="screen" data-screen="photo">
    ${topBar('Označení fotografie','Vstupní dveře',{ back:true, theme:false })}
    <main class="scroll">
      <div class="photo-stage"><img src="../assets/photos/entrance-door.webp" alt="Ilustrační fotografie vstupních dveří" /><svg viewBox="0 0 390 390" aria-hidden="true"><circle cx="244" cy="184" r="58" fill="none" stroke="#ff3b30" stroke-width="8"/><path d="M80 310 190 225" fill="none" stroke="#ff3b30" stroke-width="8" stroke-linecap="round"/><path d="m190 225-22 4 10 19Z" fill="#ff3b30"/></svg></div>
      <div class="photo-toolbar">
        <button class="tool ${state.photoTool === 'circle' ? 'is-selected' : ''}" data-photo-tool="circle">${svg('circle')}Kruh</button>
        <button class="tool ${state.photoTool === 'pen' ? 'is-selected' : ''}" data-photo-tool="pen">${svg('pen')}Kreslit</button>
        <button class="tool" data-action="photo-undo">${svg('back')}Zpět</button>
        <button class="tool" data-action="photo-clear">${svg('trash')}Smazat</button>
      </div>
      <div class="content"><button class="button button--wide" data-action="save-photo">${svg('check')}Uložit označení</button><p class="supporting" style="text-align:center">Ilustrační veřejně licencovaný snímek · žádná zákaznická data</p></div>
    </main>
  </section>`;
}

function pdfScreen() {
  return `<section class="screen" data-screen="pdf">
    ${topBar('Náhled PDF','DSO-2026-0042',{ back:true, theme:false })}
    <main class="scroll"><div class="content content--tight">
      <div class="row"><button class="button button--tonal button--small flex-1" data-action="download">${svg('download','icon icon--small')}Uložit</button><button class="button button--tonal button--small flex-1" data-action="share">${svg('share','icon icon--small')}Sdílet</button></div>
      <article class="pdf-page">
        <div class="pdf-head"><div><p class="eyebrow" style="color:#0b78f6">DSO V1.0</p><h2>Protokol o kontrole objektu</h2><p class="tiny">DSO-2026-0042 · 14. 8. 2026</p></div><img src="../assets/app-icon.svg" alt="DSO" /></div>
        <div class="pdf-table"><div class="pdf-row"><span>Objekt</span><span>Na Výsluní 84, Praha 4</span></div><div class="pdf-row"><span>Technik</span><span>Jan Novák</span></div><div class="pdf-row"><span>Stav</span><span>Dokončeno</span></div><div class="pdf-row"><span>Závady</span><span>3 evidované položky</span></div></div>
        <h3 style="margin-top:22px">Souhrn kontroly</h3><p class="small">Kontrola společných prostor, technických zařízení a dokumentace objektu. Tento dokument obsahuje pouze smyšlená demonstrační data.</p>
        <div class="pdf-table"><div class="pdf-row"><span>Vstupní dveře</span><span>V pořádku</span></div><div class="pdf-row"><span>Domovní zvonky</span><span>Závada</span></div><div class="pdf-row"><span>Osvětlení chodby</span><span>V pořádku</span></div><div class="pdf-row"><span>Vodoměr</span><span>Odečet 01842,6 m³</span></div></div>
      </article>
    </div></main>
  </section>`;
}
