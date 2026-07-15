const app = document.querySelector('#app');

const photoLibrary = [
  { src: 'assets/photos/entrance-door.webp', title: 'Vstupní dveře' },
  { src: 'assets/photos/hallway-light.webp', title: 'Osvětlení chodby' },
  { src: 'assets/photos/mailboxes.webp', title: 'Poštovní schránky' },
  { src: 'assets/photos/courtyard.webp', title: 'Dvůr objektu' },
];

const sections = [
  { key: 'outside_information', title: 'Informace vně objektu', icon: 'info', items: [
    { key: 'outside.house_number', label: 'Tabulka s č. p.', options: [['YES','Ano','good'],['NO','Ne','defect']] },
    { key: 'outside.orientation_number', label: 'Tabulka s č. o.', options: [['YES','Ano','good'],['NO','Ne','defect']] },
  ] },
  { key: 'inside_information', title: 'Informace uvnitř objektu', icon: 'clipboard', items: [
    { key: 'inside.sf_contacts', label: 'Kontakty správce', options: [['YES','Ano','good'],['NO','Ne','defect']] },
    { key: 'inside.cleaning_record', label: 'Záznam o úklidu', options: [['YES','Uveden','good'],['NO','Chybí','defect']] },
  ] },
  { key: 'outside_inspection', title: 'Venkovní obhlídka objektu', icon: 'building', items: [
    { key: 'exterior.street_facade', label: 'Fasáda uliční', options: [['UNDAMAGED','Nepoškozená','good'],['DAMAGED','Poškozená','defect']] },
    { key: 'exterior.entrance_doors', label: 'Vchodové dveře', options: [['FUNCTIONAL','Funkční','good'],['NON_FUNCTIONAL','Nefunkční','defect']] },
  ] },
  { key: 'waste', title: 'Popelnice', icon: 'trash', items: [
    { key: 'waste.location_condition', label: 'Umístění popelnic / stav', options: [['OK','V pořádku','good'],['DEFECT','Závada','defect']] },
    { key: 'waste.surroundings', label: 'Okolí popelnic', options: [['CLEAN','Čisté','good'],['WASTE','Odložený odpad','defect']] },
  ] },
  { key: 'common_areas', title: 'Společné prostory', icon: 'stairs', items: [
    { key: 'common.mailboxes', label: 'Poštovní schránky', options: [['FUNCTIONAL','Funkční','good'],['DAMAGED','Poškozené','defect']] },
    { key: 'common.stairs', label: 'Schody', options: [['PRESERVED','Zachovalé','good'],['DAMAGED','Poškozené','defect']] },
  ] },
  { key: 'yard', title: 'Dvůr / zahrádka', icon: 'leaf', items: [
    { key: 'yard.condition', label: 'Stav dvora', options: [['CLEAN','Čistý','good'],['UNMAINTAINED','Neudržovaný','defect']] },
    { key: 'yard.technical', label: 'Technický stav povrchu', options: [['PRESERVED','Zachovalý','good'],['DAMAGED','Poškozený','defect']] },
  ] },
  { key: 'lighting', title: 'Osvětlení', icon: 'bulb', items: [
    { key: 'lighting.switches', label: 'Vypínače ve všech patrech', options: [['FUNCTIONAL','Funkční','good'],['DAMAGED','Poškozené','defect']] },
    { key: 'lighting.lights', label: 'Světla ve všech patrech', options: [['FUNCTIONAL','Všechna funkční','good'],['PARTIAL','Některá nesvítí','defect']] },
  ] },
  { key: 'other', title: 'Ostatní', icon: 'note', items: [
    { key: 'other.cleaning', label: 'Úklid společných prostor', options: [['OK','V pořádku','good'],['DEFECT','Závada','defect']] },
    { key: 'other.notes', label: 'Další zjištění', options: [['NONE','Bez zjištění','good'],['NOTE','Zapsat zjištění','defect']] },
  ] },
  { key: 'meters', title: 'Měřidla', icon: 'gauge', items: [
    { key: 'meters.water_1', label: 'Vodoměr 1', options: [['READ','Odečteno','good'],['MISSING','Nedostupné','defect']] },
    { key: 'meters.electricity_1', label: 'Elektroměr 1', options: [['READ','Odečteno','good'],['MISSING','Nedostupné','defect']] },
  ] },
];

const allItems = sections.flatMap(section => section.items.map(item => ({ ...item, sectionKey: section.key })));

function initialState() {
  return {
    theme: 'dark',
    role: null,
    route: 'login',
    drawer: false,
    modal: null,
    currentSection: 'outside_information',
    selectedItem: 'exterior.entrance_doors',
    pdfPage: 0,
    adminTab: null,
    final: true,
    signature: true,
    pendingPhoto: null,
    photos: [
      { id: 'F001', sequence: 1, itemKey: 'exterior.entrance_doors', src: photoLibrary[0].src, markedSrc: null, location: 'Hlavní vstup', description: 'Odřený nátěr u spodní hrany.', strokes: [] },
      { id: 'F002', sequence: 2, itemKey: 'lighting.lights', src: photoLibrary[1].src, markedSrc: null, location: '2. patro', description: 'Jedno svítidlo nesvítí.', strokes: [] },
    ],
    answers: {
      'outside.house_number': { value: 'YES', note: 'Tabulka je čitelná.' },
      'outside.orientation_number': { value: 'YES', note: '' },
      'inside.sf_contacts': { value: 'YES', note: '' },
      'inside.cleaning_record': { value: 'YES', note: 'Poslední záznam dnes.' },
      'exterior.street_facade': { value: 'UNDAMAGED', note: '' },
      'exterior.entrance_doors': { value: 'NON_FUNCTIONAL', note: 'Zavírač nedovírá, nátěr je poškozený.' },
      'lighting.lights': { value: 'PARTIAL', note: 'Nesvítí světlo ve 2. patře.' },
      'common.mailboxes': { value: 'DAMAGED', note: 'Dvířka schránky č. 8 nedrží.' },
    },
  };
}

let state = initialState();

const iconPaths = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  back: '<path d="m15 18-6-6 6-6"/><path d="M9 12h11"/>',
  logout: '<path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9"/>',
  badge: '<circle cx="12" cy="8" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2M8 3h8"/>',
  admin: '<path d="M12 3 4 6v5c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-3Z"/><path d="M9 11h6M12 8v6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 9h8M8 13h8M8 17h5"/>',
  building: '<path d="M4 21V5l8-3 8 3v16M8 8h2M14 8h2M8 12h2M14 12h2M9 21v-5h6v5"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
  stairs: '<path d="M3 19h5v-4h4v-4h4V7h5"/>',
  leaf: '<path d="M20 4C10 4 5 9 5 15c0 3 2 5 5 5 6 0 10-6 10-16Z"/><path d="M5 20c3-5 7-8 12-11"/>',
  bulb: '<path d="M9 18h6M10 22h4M8 14a7 7 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Z"/>',
  note: '<path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5"/>',
  gauge: '<path d="M4 18a8 8 0 1 1 16 0M12 14l4-4M7 18h10"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.7-.7-1.7.9-1.9-2.1-2.1-1.9.9-1.7-.7L10.5 2h-3l-.7 2-1.7.7-1.9-.9-2.1 2.1.9 1.9-.7 1.7-2 .7v3l2 .7.7 1.7-.9 1.9 2.1 2.1 1.9-.9 1.7.7.7 2h3l.7-2 1.7-.7 1.9.9 2.1-2.1-.9-1.9.7-1.7 2-.7Z" transform="scale(.82) translate(2.5 2.5)"/>',
  work: '<path d="M5 4h14v17H5zM9 4V2h6v2M8 9l2 2 4-4M8 15h8"/>',
  camera: '<path d="M4 7h4l2-3h4l2 3h4v13H4z"/><circle cx="12" cy="13" r="4"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m3 17 5-5 4 4 3-3 6 5"/>',
  check: '<path d="m5 13 4 4L19 7"/>',
  edit: '<path d="m4 20 4-1 11-11-3-3L5 16l-1 4ZM14 7l3 3"/>',
  undo: '<path d="M9 7 4 12l5 5M4 12h9a6 6 0 0 1 6 6"/>',
  redo: '<path d="m15 7 5 5-5 5M20 12h-9a6 6 0 0 0-6 6"/>',
  rotate: '<path d="M20 11a8 8 0 1 0-2 6M20 4v7h-7"/>',
  delete: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  print: '<path d="M7 8V3h10v5M7 17H4V9h16v8h-3M7 14h10v7H7z"/>',
  share: '<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/>',
  people: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20a6 6 0 0 1 12 0M15 15a5 5 0 0 1 6 5"/>',
  backup: '<path d="M12 3v12M8 7l4-4 4 4M5 14v7h14v-7"/>',
  shield: '<path d="M12 3 4 6v5c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-3Z"/><path d="m8 12 3 3 5-6"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 18h4"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M15 8l2 2M17 6l2 2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  zoom: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
};

function icon(name, className = '') {
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.info}</svg>`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[char]);
}

function photosFor(itemKey) { return state.photos.filter(photo => photo.itemKey === itemKey); }
function answerFor(itemKey) { return state.answers[itemKey] || { value: '', note: '' }; }
function sectionProgress(section) { return section.items.filter(item => answerFor(item.key).value).length; }
function totalProgress() { return allItems.filter(item => answerFor(item.key).value).length; }
function defectsCount() { return allItems.filter(item => item.options.find(option => option[0] === answerFor(item.key).value)?.[2] === 'defect').length; }

function appTopbar(title, subtitle = '', { back = null, menu = false, logout = false } = {}) {
  return `<header class="app-topbar">
    ${menu ? `<button class="icon-button" data-action="drawer-open" aria-label="Otevřít hlavní menu">${icon('menu')}</button>` : ''}
    ${back ? `<button class="icon-button" data-route="${back}" aria-label="Zpět">${icon('back')}</button>` : ''}
    <div class="app-topbar-title"><strong>${escapeHtml(title)}</strong>${subtitle ? `<small>${escapeHtml(subtitle)}</small>` : ''}</div>
    ${logout ? `<button class="icon-button" data-action="logout" aria-label="Odhlásit">${icon('logout')}</button>` : ''}
  </header>`;
}

function appDrawer() {
  if (!state.drawer) return '';
  const technician = state.role === 'technician';
  const entries = technician
    ? [['history','Historie','history'],['settings','Nastavení','settings'],['work','Práce','work']]
    : [['history','Historie','history'],['admin','Nastavení','settings']];
  return `<div class="drawer">
    <button class="drawer-backdrop" data-action="drawer-close" aria-label="Zavřít menu"></button>
    <section class="drawer-panel">
      <div class="drawer-head">
        <img src="assets/app-icon.webp" alt="">
        <div style="flex:1"><strong>DKO</strong><span>Digitální kontrola objektů</span><small>${technician ? 'Daniel Novák · Technik' : 'Demo Admin · Admin'}</small></div>
        <button class="icon-button" data-action="drawer-close">${icon('close')}</button>
      </div>
      <div class="divider"></div>
      <p class="muted tiny" style="margin:18px 10px 7px;font-weight:800">HLAVNÍ NABÍDKA</p>
      <div class="menu-grid">
        ${entries.sort((a,b) => a[1].localeCompare(b[1], 'cs')).map(([route,title,ico]) => `<button class="menu-tile" data-route="${route}"><span class="tile-icon">${icon(ico)}</span><strong>${title}</strong></button>`).join('')}
      </div>
    </section>
  </div>`;
}

function screen(content, options = {}) {
  return `<section class="screen">${content}</section>${options.drawer ? appDrawer() : ''}${renderModal()}`;
}

function renderLogin() {
  return screen(`${appTopbar('Přihlášení do DKO')}
    <div class="app-scroll"><div class="content content--roomy">
      <section class="hero-card stack">
        <div class="brand-row"><img src="assets/app-icon.webp" alt="Ikona DKO"><div><strong>DKO</strong><span>Digitální kontrola objektů</span></div></div>
        <h1 class="title">Kdo bude aplikaci používat?</h1>
        <p class="body-copy" style="color:inherit">Data zůstávají pouze v tomto telefonu. Vyberte svůj účet a zadejte heslo.</p>
      </section>
      <h2 class="section-title">Technici</h2>
      <button class="account-card" data-action="login-technician"><span class="list-icon">${icon('badge')}</span><span><strong>Daniel Novák</strong><small>Technik · demo účet</small></span></button>
      <button class="account-card" data-action="login-technician"><span class="list-icon">${icon('badge')}</span><span><strong>Petra Malá</strong><small>Technik · demo účet</small></span></button>
    </div></div>
    <div class="bottom-action"><button class="button button--wide button--outline" data-action="login-admin">${icon('admin')} Přihlásit jako Admin</button></div>`);
}

function renderWork() {
  const done = totalProgress();
  return screen(`${appTopbar('Místní šetření', 'Daniel Novák', { menu: true })}
    <div class="app-scroll"><div class="content">
      <section class="card building-card">
        <p class="eyebrow">ROZPRACOVANÁ KONTROLA</p>
        <strong>Ukázková 12, 130 00 Praha 3</strong>
        <span class="muted small">DKO-DEMO-2026-001 · ${done}/${allItems.length} položek</span>
        <div class="progress"><span style="width:${Math.round(done/allItems.length*100)}%"></span></div>
        <button class="button button--wide" data-route="inspection">Pokračovat</button>
      </section>
      <h2 class="section-title">Domy podle termínu</h2>
      <section class="outlined-card building-card">
        <div class="row-between"><div><strong>Javorová 8, Praha 10</strong><div class="primary-text small">Kontrola dnes</div></div><span class="list-icon">${icon('building')}</span></div>
        <button class="button button--wide button--outline" data-action="start-demo-building">Zahájit</button>
      </section>
      <section class="outlined-card building-card">
        <div class="row-between"><div><strong>Parková 31, Praha 7</strong><div class="muted small">Kontrola za 4 dny</div></div><span class="list-icon">${icon('building')}</span></div>
        <button class="button button--wide button--outline" data-action="start-demo-building">Zahájit</button>
      </section>
    </div></div>`, { drawer: true });
}

function renderInspectionOverview() {
  const done = totalProgress();
  return screen(`${appTopbar('Kontrola objektu', 'Daniel Novák', { back: 'work' })}
    <div class="inspection-meta"><strong>Ukázková 12, 130 00 Praha 3</strong><small>${done}/${allItems.length} hotovo · ${defectsCount()} závady · ${state.photos.length} foto · průběžně uloženo</small></div>
    <div class="app-scroll"><div class="content">
      <div class="row-between"><div><p class="eyebrow">PŘEHLED KONTROLY</p><h2 class="section-title">Vyberte sekci</h2></div><span class="chip chip--good">Uloženo</span></div>
      <div class="menu-grid">
        ${sections.map(section => {
          const progress = sectionProgress(section);
          return `<button class="menu-tile" data-section="${section.key}"><span class="tile-icon">${icon(section.icon)}</span><strong>${section.title}</strong><small>${progress}/${section.items.length}</small></button>`;
        }).join('')}
      </div>
      <section class="hero-card stack"><strong>Rozpracovaná kontrola je bezpečně uložená</strong><span class="small">Odpovědi, poznámky a fotografie lze kdykoliv doplnit před podpisem.</span></section>
    </div></div>
    <div class="bottom-action"><button class="button button--wide" data-action="finish-check">${icon('check')} Zkontrolovat a dokončit</button></div>`);
}

function itemCard(item) {
  const answer = answerFor(item.key);
  const photos = photosFor(item.key);
  return `<article class="item-card">
    <div class="row-between"><h3>${escapeHtml(item.label)}</h3>${answer.value ? `<span class="chip ${item.options.find(option => option[0] === answer.value)?.[2] === 'defect' ? 'chip--warn' : 'chip--good'}">${answer.value ? 'Hotovo' : ''}</span>` : ''}</div>
    <div class="field"><label>Stav</label><div class="choice-row">
      ${item.options.map(([value,label,tone]) => `<button class="choice is-${tone} ${answer.value === value ? 'is-selected' : ''}" data-answer="${item.key}" data-value="${value}">${label}</button>`).join('')}
    </div></div>
    <div class="field"><label>Poznámka</label><textarea class="textarea" data-note="${item.key}" placeholder="Doplňte zjištění…">${escapeHtml(answer.note)}</textarea></div>
    <button class="button button--wide" data-photo-for="${item.key}">${icon('camera')} Přidat fotografii</button>
    ${photos.length ? `<div><p class="small" style="font-weight:700;margin:0 0 7px">Uložené fotografie</p><div class="photo-row">${photos.map(photo => `<button class="photo-thumb" data-edit-photo="${photo.id}"><img src="${photo.markedSrc || photo.src}" alt="${photo.id}"><span>${photo.id}</span></button>`).join('')}</div></div>` : ''}
  </article>`;
}

function renderInspectionSection() {
  const section = sections.find(value => value.key === state.currentSection) || sections[0];
  return screen(`${appTopbar(section.title, 'Ukázková 12, Praha 3', { back: 'inspection' })}
    <div class="app-scroll"><div class="content">
      <div class="row-between"><span class="chip">${sectionProgress(section)}/${section.items.length} hotovo</span><button class="button button--text button--compact" data-mark-good="${section.key}">${icon('check')} Vše v pořádku</button></div>
      ${section.items.map(itemCard).join('')}
    </div></div>
    <div class="bottom-action"><button class="button button--wide button--outline" data-route="inspection">Zpět na přehled sekcí</button></div>`);
}

function renderPhotoCapture() {
  const pending = state.pendingPhoto || { src: photoLibrary[0].src, libraryIndex: 0 };
  const item = allItems.find(value => value.key === state.selectedItem);
  return screen(`${appTopbar('Pořízení fotografie', item?.label || 'Kontrolní položka', { back: 'section' })}
    <div class="photo-stage">
      <img src="${pending.src}" alt="Ukázkový snímek objektu">
      <div class="capture-hint">Demo používá předem připravené anonymní snímky. Skutečná aplikace zde otevře fotoaparát telefonu.</div>
    </div>
    <div class="content" style="flex:0 0 auto">
      <button class="button button--wide button--outline" data-action="choose-photo">${icon('image')} Vybrat ukázkový snímek</button>
      <div class="button-row"><button class="button button--outline" data-route="section">Zrušit</button><button class="button" data-action="use-photo">${icon('check')} Použít fotografii</button></div>
    </div>`);
}

function renderPhotoEdit() {
  const pending = state.pendingPhoto || { src: photoLibrary[0].src, strokes: [], rotation: 0, location: '', description: '' };
  return screen(`${appTopbar('Kontrola fotografie', `Označení ${pending.strokes?.length || 0}/30`, { back: 'photo-capture' })}
    <div class="photo-stage" id="markup-stage">
      <img id="markup-image" src="${pending.src}" alt="Fotografie ke kontrole" style="transform:rotate(${pending.rotation || 0}deg)">
      <canvas id="markup-canvas" aria-label="Kreslicí plocha pro červené označení"></canvas>
    </div>
    <div class="photo-toolbar">
      <strong>${icon('edit')} Označení <span data-stroke-count>${pending.strokes?.length || 0}/30</span></strong>
      <div class="row" style="gap:2px"><button class="icon-button" data-action="markup-undo" aria-label="Zpět">${icon('undo')}</button><button class="icon-button" data-action="markup-clear" aria-label="Smazat označení">${icon('delete')}</button><button class="icon-button" data-action="photo-rotate" aria-label="Otočit">${icon('rotate')}</button></div>
    </div>
    <div class="photo-fields">
      <div class="field"><label>Umístění</label><input class="input" data-pending-field="location" value="${escapeHtml(pending.location || '')}" placeholder="Např. hlavní vstup"></div>
      <div class="field"><label>Popis fotografie</label><textarea class="textarea" data-pending-field="description" placeholder="Co fotografie dokládá?">${escapeHtml(pending.description || '')}</textarea></div>
      <div class="button-row"><button class="button button--outline" data-route="section">Zrušit</button><button class="button" data-action="save-photo">${icon('check')} Uložit změny</button></div>
    </div>`);
}

function renderSignature() {
  return screen(`${appTopbar('Elektronický podpis', 'Dokončení kontroly', { back: 'inspection' })}
    <div class="app-scroll"><div class="content content--roomy">
      <div class="stack"><h1 class="title">Podepište se prstem</h1><p class="body-copy">Podpis potvrzuje uzavření kontroly. Hotový protokol už nepůjde změnit bez nové auditovatelné revize.</p></div>
      <div class="signature-pad"><canvas id="signature-canvas"></canvas><span>Podpis technika</span></div>
      <button class="button button--wide button--outline" data-action="signature-clear">Vymazat podpis</button>
      <section class="outlined-card card-pad stack"><div class="row-between"><span class="muted small">Objekt</span><strong class="small">Ukázková 12, Praha 3</strong></div><div class="row-between"><span class="muted small">Technik</span><strong class="small">Daniel Novák</strong></div><div class="row-between"><span class="muted small">Závady</span><strong class="small">${defectsCount()}</strong></div></section>
    </div></div>
    <div class="bottom-action"><button class="button button--wide" data-action="finalize" ${state.signature ? '' : 'disabled'}>${icon('check')} Podepsat a vytvořit PDF</button></div>`);
}

function historyDocuments() {
  return `<div class="document-row"><button class="button button--text" data-pdf="0">Protokol</button><button class="icon-button" data-demo-toast="PDF bylo uloženo pouze v ukázce">${icon('download')}</button><button class="icon-button" data-demo-toast="Otevřen tiskový dialog ukázky">${icon('print')}</button><button class="icon-button" data-demo-toast="Sdílení je v demu vypnuté">${icon('share')}</button></div>
    <div class="document-row"><button class="button button--text" data-pdf="2">Fotodokumentace 4× A6</button><button class="icon-button" data-demo-toast="PDF bylo uloženo pouze v ukázce">${icon('download')}</button><button class="icon-button" data-demo-toast="Otevřen tiskový dialog ukázky">${icon('print')}</button><button class="icon-button" data-demo-toast="Sdílení je v demu vypnuté">${icon('share')}</button></div>
    <div class="document-row"><button class="button button--text" data-pdf="0">Kompletní PDF</button><button class="icon-button" data-demo-toast="PDF bylo uloženo pouze v ukázce">${icon('download')}</button><button class="icon-button" data-demo-toast="Otevřen tiskový dialog ukázky">${icon('print')}</button><button class="icon-button" data-demo-toast="Sdílení je v demu vypnuté">${icon('share')}</button></div>`;
}

function renderHistory() {
  const name = state.role === 'admin' ? 'Demo Admin' : 'Daniel Novák';
  return screen(`${appTopbar('Historie', name, { menu: true, logout: true })}
    <div class="app-scroll"><div class="content">
      <section class="card history-card">
        <strong>Ukázková 12, 130 00 Praha 3</strong>
        <span class="muted small">DKO-DEMO-2026-001 · 15. 7. 2026 09:41</span>
        <span class="chip chip--good">Hotovo</span>
        ${state.role === 'technician' ? `<button class="button button--wide button--outline" data-action="create-revision">Vytvořit opravu jako novou revizi</button>` : ''}
        ${historyDocuments()}
      </section>
      <section class="outlined-card history-card">
        <strong>Javorová 8, 100 00 Praha 10</strong>
        <span class="muted small">DKO-DEMO-2026-000 · 3. 7. 2026 14:18</span>
        <span class="chip">Nahrazeno revizí</span>
      </section>
    </div></div>`, { drawer: true });
}

function pdfTable(page) {
  const rows1 = [
    ['INFORMACE VNĚ OBJEKTU','',''],['Tabulka s č. p.','Ano','Tabulka je čitelná'],['Tabulka s č. o.','Ano',''],['INFORMACE UVNITŘ OBJEKTU','',''],['Kontakty správce','Ano',''],['Záznam o úklidu','Uveden','Poslední záznam dnes'],['VENKOVNÍ OBHLÍDKA OBJEKTU','',''],['Fasáda uliční','Nepoškozená',''],['Vchodové dveře','Nefunkční','Zavírač nedovírá · Foto F001'],['POPELNICE','',''],['Umístění popelnic / stav','V pořádku',''],['Okolí popelnic','Čisté',''],['SPOLEČNÉ PROSTORY','',''],['Poštovní schránky','Poškozené','Dvířka schránky č. 8 nedrží'],['Schody','Zachovalé',''],
  ];
  const rows2 = [
    ['DVŮR / ZAHRÁDKA','',''],['Stav dvora','Čistý','Foto F004'],['Technický stav povrchu','Zachovalý',''],['OSVĚTLENÍ','',''],['Vypínače ve všech patrech','Funkční',''],['Světla ve všech patrech','Některá nesvítí','2. patro · Foto F002'],['OSTATNÍ','',''],['Úklid společných prostor','V pořádku',''],['Další zjištění','Bez zjištění',''],['MĚŘIDLA','',''],['Vodoměr 1','Odečteno','Ukázkový stav 01234'],['Elektroměr 1','Odečteno','Ukázkový stav 05678'],
  ];
  const rows = page === 0 ? rows1 : rows2;
  return `<div class="pdf-page">
    <div class="pdf-header"><div class="pdf-logo"><span></span> DEMO SPRÁVA OBJEKTŮ</div><strong>Záznam z místního šetření</strong><div>Číslo: DKO-DEMO-2026-001 · část ${page+1}/2</div></div>
    <table class="pdf-table"><colgroup><col style="width:34%"><col style="width:25%"><col></colgroup><tbody>${rows.map(row => row[1] === '' ? `<tr><th colspan="3">${row[0]}</th></tr>` : `<tr><td><strong>${row[0]}</strong></td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join('')}</tbody></table>
    <div class="pdf-footer"><span>Technik: Daniel Novák</span><span>Všechna data jsou smyšlená · interaktivní demo</span><span>strana ${page+1}</span></div>
  </div>`;
}

function photoSheet() {
  const photos = [...state.photos];
  while (photos.length < 4) photos.push({ id: `F00${photos.length+1}`, src: photoLibrary[photos.length % photoLibrary.length].src, description: photoLibrary[photos.length % photoLibrary.length].title });
  return `<div class="photo-sheet">${photos.slice(0,4).map(photo => `<figure><img src="${photo.markedSrc || photo.src}" alt="${photo.id}"><figcaption><strong>${photo.id}</strong> · ${escapeHtml(photo.description || 'Ukázková fotografie objektu')}</figcaption></figure>`).join('')}</div>`;
}

function renderPdf() {
  const pageCount = 3;
  return screen(`${appTopbar('Náhled PDF', state.pdfPage < 2 ? 'Protokol 2× A4 na šířku' : 'Fotodokumentace 4× A6', { back: 'history' })}
    <div class="pdf-viewer">${state.pdfPage < 2 ? pdfTable(state.pdfPage) : photoSheet()}</div>
    <div class="pdf-controls"><button class="button button--compact" data-action="pdf-prev" ${state.pdfPage === 0 ? 'disabled' : ''}>Předchozí</button><strong class="small">Strana ${state.pdfPage+1} / ${pageCount}</strong><button class="button button--compact" data-action="pdf-next" ${state.pdfPage === pageCount-1 ? 'disabled' : ''}>Další</button></div>`);
}

const adminSections = [
  ['technicians','Aktivní účty','people'],['buildings','Domy','building'],['backup','Export a import','backup'],['integrity','Kontrola dat','shield'],
  ['form','Kontrolní položky','clipboard'],['device','Telefon','phone'],['print','Tisk','print'],['password','Změnit heslo','key'],
];

function renderAdmin() {
  if (state.adminTab) return renderAdminTab();
  return screen(`${appTopbar('Nastavení', 'Demo Admin', { menu: true, logout: true })}
    <div class="app-scroll"><div class="content">
      <button class="button button--wide" data-admin="technicians">${icon('plus')} Přidat technika</button>
      <div class="menu-grid">${adminSections.map(([key,title,ico]) => `<button class="menu-tile" data-admin="${key}"><span class="tile-icon">${icon(ico)}</span><strong>${title}</strong></button>`).join('')}</div>
      <section class="hero-card stack"><strong>Administrace zůstává lokální</strong><span class="small">Účty, objekty, kontrolní seznamy, fotografie, PDF i zálohy jsou spravované přímo v telefonu.</span></section>
    </div></div>`, { drawer: true });
}

function adminTabContent(tab) {
  const content = {
    technicians: `<button class="button button--wide">${icon('plus')} Přidat technika</button><div class="admin-list"><button class="list-button"><span class="list-icon">${icon('badge')}</span><span><strong>Daniel Novák</strong><small>Aktivní účet · Technik</small></span></button><button class="list-button"><span class="list-icon">${icon('badge')}</span><span><strong>Petra Malá</strong><small>Aktivní účet · Technik</small></span></button></div><p class="body-copy">Účet se kvůli auditní historii nikdy nemaže, lze jej pouze deaktivovat.</p>`,
    buildings: `<button class="button button--wide">${icon('plus')} Přidat dům</button><div class="admin-list">${['Ukázková 12, Praha 3','Javorová 8, Praha 10','Parková 31, Praha 7'].map((title,index) => `<button class="list-button"><span class="list-icon">${icon('building')}</span><span><strong>${title}</strong><small>Interval ${index ? 30 : 14} dní · pouze fake data</small></span></button>`).join('')}</div>`,
    backup: `<div class="stack"><h2 class="title">Export a import dat</h2><p class="body-copy">Šifrovaný soubor zahrnuje databázi, originály i publikované fotografie, PDF a nastavení. V tomto demu se žádný soubor nevytváří.</p></div><div class="field"><label>Heslo zálohy</label><input class="input" type="password" value="demoheslo"></div><button class="button button--wide" data-demo-toast="Ukázkový export byl simulován">${icon('backup')} Exportovat data</button><button class="button button--wide button--outline" data-demo-toast="Ukázkový import byl simulován">Importovat a sloučit data</button>`,
    integrity: `<div class="stack"><h2 class="title">Kontrola integrity</h2><p class="body-copy">Ověří databázi, existenci a kontrolní součty originálů fotografií i PDF.</p></div><button class="button button--wide" data-action="integrity-run">${icon('shield')} Spustit kontrolu</button>${state.integrityRan ? `<div class="integrity-result"><strong>Data jsou v pořádku</strong><div class="small">24 souborů · 4 fotografie · 3 PDF · demo úložiště</div></div>` : ''}`,
    form: `<section class="hero-card stack"><strong>Seznam pro nové kontroly</strong><span class="small">Změny se použijí jen u nových kontrol. Rozpracované a hotové protokoly zachovávají svůj neměnný otisk.</span></section><div class="admin-list">${sections.slice(0,5).map(section => `<button class="list-button"><span class="list-icon">${icon(section.icon)}</span><span><strong>${section.title}</strong><small>${section.items.length} ukázkové položky · zobrazeno</small></span></button>`).join('')}</div>`,
    device: `<div class="stack"><h2 class="title">Telefon</h2><p class="body-copy">Stav zařízení a lokální diagnostika.</p></div><section class="outlined-card card-pad stack"><div class="row-between"><span class="muted">Úložiště</span><strong>V pořádku</strong></div><div class="row-between"><span class="muted">Fotoaparát</span><strong>Demo režim</strong></div><div class="row-between"><span class="muted">PDF engine</span><strong>OK</strong></div><div class="row-between"><span class="muted">Internetové oprávnění</span><strong>Není požadováno</strong></div></section>`,
    print: `<div class="stack"><h2 class="title">Tisk</h2><p class="body-copy">Protokol používá 2× A4 na šířku. Fotolist používá samostatné A4 na výšku se čtyřmi A6 oblastmi.</p></div><button class="button button--wide" data-demo-toast="Kalibrační stránka byla otevřena v ukázce">${icon('print')} Vytisknout kalibrační stránku</button>`,
    password: `<div class="stack"><h2 class="title">Změnit heslo</h2><div class="field"><label>Současné heslo</label><input class="input" type="password"></div><div class="field"><label>Nové heslo</label><input class="input" type="password"></div><div class="field"><label>Nové heslo znovu</label><input class="input" type="password"></div><button class="button button--wide" data-demo-toast="Heslo se v demu neukládá">Uložit nové heslo</button></div>`,
  };
  return content[tab] || '';
}

function renderAdminTab() {
  const section = adminSections.find(([key]) => key === state.adminTab) || adminSections[0];
  return screen(`${appTopbar(section[1], 'Demo Admin', { back: 'admin' })}<div class="app-scroll"><div class="content content--roomy">${adminTabContent(section[0])}</div></div>`);
}

function renderSettings() {
  return screen(`${appTopbar('Nastavení', state.role === 'admin' ? 'Demo Admin' : 'Daniel Novák', { menu: true, logout: true })}
    <div class="app-scroll"><div class="content content--roomy"><section class="outlined-card card-pad stack"><h2 class="section-title">Účet technika</h2><span class="muted small">Daniel Novák · Technik</span><button class="button button--wide button--outline" data-demo-toast="Heslo se v demu neukládá">Změnit heslo</button></section><section class="hero-card stack"><strong>Offline režim</strong><span class="small">Aplikace nevyžaduje internet ani cloudové přihlášení.</span></section></div></div>`, { drawer: true });
}

function renderModal() {
  if (!state.modal) return '';
  if (state.modal === 'photo-gallery') return `<div class="modal"><section class="dialog"><h2>Vyberte ukázkový snímek</h2><p>Všechny fotografie byly vytvořené pouze pro toto demo.</p><div class="gallery">${photoLibrary.map((photo,index) => `<button data-library-photo="${index}" class="${state.pendingPhoto?.libraryIndex === index ? 'is-selected' : ''}"><img src="${photo.src}" alt="${photo.title}"><span>${photo.title}</span></button>`).join('')}</div><button class="button button--wide button--outline" data-action="modal-close">Zavřít</button></section></div>`;
  if (state.modal === 'incomplete') {
    const incomplete = allItems.length - totalProgress();
    return `<div class="modal"><section class="dialog"><h2>${incomplete} položek není hotových</h2><p>Kontrolu lze uzavřít, ale hotový protokol už nepůjde změnit bez nové revize.</p><div class="button-row"><button class="button button--outline" data-action="modal-close">Pokračovat v kontrole</button><button class="button" data-action="go-signature">Přejít k podpisu</button></div></section></div>`;
  }
  if (state.modal.startsWith('toast:')) return `<div class="modal" data-action="modal-close"><section class="dialog"><h2>Ukázková akce</h2><p>${escapeHtml(state.modal.slice(6))}</p><button class="button button--wide" data-action="modal-close">Rozumím</button></section></div>`;
  return '';
}

function journeyForRoute(route) {
  if (route === 'login') return 'login';
  if (['work','settings'].includes(route)) return 'work';
  if (['inspection','section','signature'].includes(route)) return 'inspection';
  if (['photo-capture','photo-edit'].includes(route)) return 'photo';
  if (['history','pdf'].includes(route)) return 'history';
  if (route === 'admin') return 'admin';
  return 'login';
}

function titleForRoute(route) {
  return ({ login:'Přihlášení do DKO', work:'Objekty a dnešní práce', inspection:'Přehled kontroly', section:'Kontrolní položky', 'photo-capture':'Pořízení fotografie', 'photo-edit':'Označení závady do fotografie', signature:'Elektronický podpis', history:'Historie a dokumenty', pdf:'Náhled PDF', admin:'Admin nastavení', settings:'Nastavení účtu' })[route] || 'DKO demo';
}

function render() {
  document.documentElement.dataset.theme = state.theme;
  document.querySelector('[data-theme-label]').textContent = state.theme === 'dark' ? 'Tmavý vzhled' : 'Světlý vzhled';
  document.querySelector('[data-stage-title]').textContent = titleForRoute(state.route);
  document.querySelectorAll('[data-jump]').forEach(button => button.classList.toggle('is-active', button.dataset.jump === journeyForRoute(state.route)));

  const routes = {
    login: renderLogin,
    work: renderWork,
    inspection: renderInspectionOverview,
    section: renderInspectionSection,
    'photo-capture': renderPhotoCapture,
    'photo-edit': renderPhotoEdit,
    signature: renderSignature,
    history: renderHistory,
    pdf: renderPdf,
    admin: renderAdmin,
    settings: renderSettings,
  };
  app.innerHTML = (routes[state.route] || renderLogin)();
  if (state.route === 'photo-edit') requestAnimationFrame(initMarkupCanvas);
  if (state.route === 'signature') requestAnimationFrame(initSignatureCanvas);
}

function navigate(route) {
  if (route === 'admin') { state.role = 'admin'; state.adminTab = null; }
  if (['work','inspection','section','photo-capture','photo-edit','signature','settings'].includes(route)) state.role = 'technician';
  if (route === 'history' && !state.role) state.role = 'technician';
  if (route === 'section' && !sections.some(section => section.key === state.currentSection)) state.currentSection = sections[0].key;
  state.route = route;
  state.drawer = false;
  state.modal = null;
  render();
}

function startPendingPhoto(src = photoLibrary[0].src, libraryIndex = 0) {
  state.pendingPhoto = { src, libraryIndex, strokes: [], rotation: 0, location: '', description: '' };
}

function initMarkupCanvas() {
  const canvas = document.querySelector('#markup-canvas');
  const stage = document.querySelector('#markup-stage');
  if (!canvas || !stage || !state.pendingPhoto) return;
  const ratio = window.devicePixelRatio || 1;
  const rect = stage.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(rect.width * ratio));
  canvas.height = Math.max(1, Math.round(rect.height * ratio));
  const context = canvas.getContext('2d');
  context.scale(ratio, ratio);
  context.lineWidth = 5;
  context.strokeStyle = '#ff2d2d';
  context.lineCap = 'round';
  context.lineJoin = 'round';

  const drawStroke = stroke => {
    if (!stroke?.length) return;
    context.beginPath();
    stroke.forEach((point,index) => {
      const x = point.x * rect.width;
      const y = point.y * rect.height;
      if (index === 0) context.moveTo(x,y); else context.lineTo(x,y);
    });
    context.stroke();
  };
  state.pendingPhoto.strokes.forEach(drawStroke);

  let activeStroke = null;
  const pointFromEvent = event => {
    const bounds = canvas.getBoundingClientRect();
    return { x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)), y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)) };
  };
  canvas.addEventListener('pointerdown', event => {
    if (state.pendingPhoto.strokes.length >= 30) return;
    canvas.setPointerCapture(event.pointerId);
    activeStroke = [pointFromEvent(event)];
    state.pendingPhoto.strokes.push(activeStroke);
  });
  canvas.addEventListener('pointermove', event => {
    if (!activeStroke) return;
    activeStroke.push(pointFromEvent(event));
    context.clearRect(0,0,rect.width,rect.height);
    state.pendingPhoto.strokes.forEach(drawStroke);
  });
  const stop = () => {
    if (!activeStroke) return;
    activeStroke = null;
    document.querySelector('[data-stroke-count]').textContent = `${state.pendingPhoto.strokes.length}/30`;
  };
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);
}

function initSignatureCanvas() {
  const canvas = document.querySelector('#signature-canvas');
  if (!canvas) return;
  const holder = canvas.parentElement;
  const ratio = window.devicePixelRatio || 1;
  const rect = holder.getBoundingClientRect();
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  const context = canvas.getContext('2d');
  context.scale(ratio, ratio);
  context.lineWidth = 3;
  context.strokeStyle = '#111';
  context.lineCap = 'round';
  let drawing = false;
  let drew = state.signature;
  if (drew) {
    context.beginPath();
    context.moveTo(rect.width*.18, rect.height*.62);
    context.bezierCurveTo(rect.width*.3,rect.height*.25,rect.width*.38,rect.height*.86,rect.width*.48,rect.height*.48);
    context.bezierCurveTo(rect.width*.58,rect.height*.18,rect.width*.62,rect.height*.75,rect.width*.78,rect.height*.43);
    context.stroke();
  }
  const point = event => { const bounds = canvas.getBoundingClientRect(); return [event.clientX-bounds.left,event.clientY-bounds.top]; };
  canvas.addEventListener('pointerdown', event => { drawing=true; canvas.setPointerCapture(event.pointerId); const [x,y]=point(event); context.beginPath(); context.moveTo(x,y); });
  canvas.addEventListener('pointermove', event => { if(!drawing)return; const [x,y]=point(event); context.lineTo(x,y); context.stroke(); if(!drew){drew=true;state.signature=true;document.querySelector('[data-action="finalize"]').disabled=false;} });
  canvas.addEventListener('pointerup', () => { drawing=false; });
  canvas.addEventListener('pointercancel', () => { drawing=false; });
}

function buildMarkedPhoto() {
  const pending = state.pendingPhoto;
  const image = document.querySelector('#markup-image');
  if (!pending || !image?.complete || !image.naturalWidth) return null;
  try {
    const output = document.createElement('canvas');
    output.width = 960;
    output.height = 720;
    const context = output.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0,0,output.width,output.height);
    const scale = Math.min(output.width/image.naturalWidth, output.height/image.naturalHeight);
    const width = image.naturalWidth*scale, height=image.naturalHeight*scale;
    context.save();
    context.translate(output.width/2, output.height/2);
    context.rotate((pending.rotation || 0)*Math.PI/180);
    context.drawImage(image,-width/2,-height/2,width,height);
    context.restore();
    context.strokeStyle='#ff2d2d';context.lineWidth=10;context.lineCap='round';context.lineJoin='round';
    pending.strokes.forEach(stroke => { if(!stroke.length)return; context.beginPath(); stroke.forEach((point,index)=>{const px=point.x*output.width,py=point.y*output.height;if(index===0)context.moveTo(px,py);else context.lineTo(px,py);});context.stroke(); });
    return output.toDataURL('image/jpeg',.88);
  } catch (error) {
    console.error('Could not create the marked preview copy.', error);
    return null;
  }
}

app.addEventListener('input', event => {
  const note = event.target.dataset.note;
  if (note) {
    state.answers[note] = { ...answerFor(note), note: event.target.value };
  }
  const field = event.target.dataset.pendingField;
  if (field && state.pendingPhoto) state.pendingPhoto[field] = event.target.value;
});

app.addEventListener('click', event => {
  const target = event.target.closest('button, [data-route]');
  if (!target) return;
  if (target.dataset.route) return navigate(target.dataset.route);
  if (target.dataset.action === 'drawer-open') { state.drawer=true; return render(); }
  if (target.dataset.action === 'drawer-close') { state.drawer=false; return render(); }
  if (target.dataset.action === 'logout') { state.role=null; state.route='login'; state.drawer=false; return render(); }
  if (target.dataset.action === 'login-technician') { state.role='technician'; return navigate('work'); }
  if (target.dataset.action === 'login-admin') { state.role='admin'; return navigate('admin'); }
  if (target.dataset.section) { state.currentSection=target.dataset.section; return navigate('section'); }
  if (target.dataset.answer) { state.answers[target.dataset.answer]={...answerFor(target.dataset.answer),value:target.dataset.value}; return render(); }
  if (target.dataset.note) return;
  if (target.dataset.markGood) {
    const section=sections.find(value=>value.key===target.dataset.markGood);
    section.items.forEach(item=>{ if(!answerFor(item.key).value) state.answers[item.key]={...answerFor(item.key),value:item.options.find(option=>option[2]==='good')?.[0] || item.options[0][0]}; });
    return render();
  }
  if (target.dataset.photoFor) { state.selectedItem=target.dataset.photoFor; startPendingPhoto(); return navigate('photo-capture'); }
  if (target.dataset.editPhoto) {
    const photo=state.photos.find(value=>value.id===target.dataset.editPhoto);
    if(photo){state.selectedItem=photo.itemKey;state.pendingPhoto={...photo,strokes:photo.strokes?.map(stroke=>stroke.map(point=>({...point})))||[],editingId:photo.id,libraryIndex:photoLibrary.findIndex(entry=>entry.src===photo.src),rotation:0};return navigate('photo-edit');}
  }
  if (target.dataset.action === 'choose-photo') { state.modal='photo-gallery'; return render(); }
  if (target.dataset.libraryPhoto !== undefined) { const index=Number(target.dataset.libraryPhoto); startPendingPhoto(photoLibrary[index].src,index); state.modal=null; return render(); }
  if (target.dataset.action === 'modal-close') { state.modal=null; return render(); }
  if (target.dataset.action === 'use-photo') return navigate('photo-edit');
  if (target.dataset.action === 'markup-undo') { state.pendingPhoto?.strokes.pop(); return render(); }
  if (target.dataset.action === 'markup-clear') { if(state.pendingPhoto)state.pendingPhoto.strokes=[]; return render(); }
  if (target.dataset.action === 'photo-rotate') { if(state.pendingPhoto)state.pendingPhoto.rotation=((state.pendingPhoto.rotation||0)+90)%360; return render(); }
  if (target.dataset.action === 'save-photo') {
    const markedSrc=buildMarkedPhoto();
    const pending=state.pendingPhoto;
    if(!pending)return;
    if(pending.editingId){
      const index=state.photos.findIndex(photo=>photo.id===pending.editingId);
      if(index>=0)state.photos[index]={...state.photos[index],...pending,markedSrc:markedSrc||state.photos[index].markedSrc};
    }else{
      const sequence=state.photos.length+1;
      state.photos.push({id:`F${String(sequence).padStart(3,'0')}`,sequence,itemKey:state.selectedItem,src:pending.src,markedSrc,location:pending.location,description:pending.description,strokes:pending.strokes});
    }
    state.pendingPhoto=null;
    return navigate('section');
  }
  if (target.dataset.action === 'finish-check') { state.modal='incomplete'; return render(); }
  if (target.dataset.action === 'go-signature') { state.modal=null; state.signature=false; return navigate('signature'); }
  if (target.dataset.action === 'signature-clear') { state.signature=false; return render(); }
  if (target.dataset.action === 'finalize') { state.final=true; state.signature=true; return navigate('history'); }
  if (target.dataset.action === 'create-revision') { state.final=false; state.signature=false; state.modal='toast:Nová revize byla vytvořena jako samostatná rozpracovaná kontrola.'; state.answers['other.notes']={value:'NOTE',note:'Revize původního protokolu.'}; return render(); }
  if (target.dataset.pdf !== undefined) { state.pdfPage=Number(target.dataset.pdf); return navigate('pdf'); }
  if (target.dataset.action === 'pdf-prev') { state.pdfPage=Math.max(0,state.pdfPage-1); return render(); }
  if (target.dataset.action === 'pdf-next') { state.pdfPage=Math.min(2,state.pdfPage+1); return render(); }
  if (target.dataset.admin) { state.adminTab=target.dataset.admin; return render(); }
  if (target.dataset.action === 'integrity-run') { state.integrityRan=true; return render(); }
  if (target.dataset.demoToast) { state.modal=`toast:${target.dataset.demoToast}`; return render(); }
  if (target.dataset.action === 'start-demo-building') { state.modal='toast:V produkci by se nyní založil nový odolně ukládaný koncept kontroly.'; return render(); }
});

document.addEventListener('click', event => {
  const target = event.target.closest('[data-demo-action], [data-jump]');
  if (!target || app.contains(target)) return;
  if (target.dataset.demoAction === 'reset') { event.preventDefault(); state=initialState(); return render(); }
  if (target.dataset.demoAction === 'theme') { state.theme=state.theme==='dark'?'light':'dark'; return render(); }
  if (target.dataset.jump) {
    const map={login:'login',work:'work',inspection:'inspection',photo:'photo-edit',history:'history',admin:'admin'};
    if(target.dataset.jump==='photo'){state.role='technician';state.selectedItem='exterior.entrance_doors';const existing=state.photos[0];state.pendingPhoto={...existing,strokes:existing.strokes||[],editingId:existing.id,libraryIndex:0,rotation:0};}
    return navigate(map[target.dataset.jump]);
  }
});

window.addEventListener('resize', () => {
  if (state.route === 'photo-edit') initMarkupCanvas();
  if (state.route === 'signature') initSignatureCanvas();
});

setInterval(() => {
  const clock=document.querySelector('[data-clock]');
  if(clock)clock.textContent=new Intl.DateTimeFormat('cs-CZ',{hour:'2-digit',minute:'2-digit'}).format(new Date());
},30000);

render();
