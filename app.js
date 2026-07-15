const app = document.querySelector('#app');
const query = new URLSearchParams(window.location.search);
document.documentElement.classList.toggle('mobile-mode', query.get('mobile') === '1');

app.addEventListener('error', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  const retries = Number(image.dataset.retryCount || 0);
  if (retries >= 2) return;
  image.dataset.retryCount = String(retries + 1);
  window.setTimeout(() => {
    const retryUrl = new URL(image.currentSrc || image.src, location.href);
    retryUrl.searchParams.set('image-retry', String(retries + 1));
    image.src = retryUrl.href;
  }, 180 * (retries + 1));
}, true);

const sections = [
  { key: 'outside_information', title: 'Informace vně objektu', icon: 'info', items: [
    { key: 'outside.house_number', label: 'Tabulka s č. p.', options: [['YES','Ano','good'],['NO','Ne','defect']] },
    { key: 'outside.orientation_number', label: 'Tabulka s č. o.', options: [['YES','Ano','good'],['NO','Ne','defect']] },
    { key: 'outside.snp2_board', label: 'Informační tabulka SNP2', options: [['YES','Ano','good'],['NO','Ne','defect']] },
    { key: 'outside.cleaning_company_board', label: 'Informační tabulka úklidové firmy', options: [['YES','Ano','good'],['NO','Ne','defect']] },
  ] },
  { key: 'inside_information', title: 'Informace uvnitř objektu', icon: 'clipboard', items: [
    { key: 'inside.sf_contacts', label: 'Kontakty SF', options: [['YES','Ano','good'],['NO','Ne','defect']] },
    { key: 'inside.sf_notice', label: 'Oznámení SF v nástěnce', options: [['YES','Ano','good'],['NO','Ne','defect']] },
    { key: 'inside.boiler_contact', label: 'Kontakt – kotelna', options: [['YES','Ano','good'],['NO','Ne','defect'],['NOT_IN_HOUSE','Kotelna není v domě','neutral']] },
    { key: 'inside.cleaning_record', label: 'Záznam o úklidu', options: [['YES','Uveden','good'],['NO','Chybí','defect']] },
  ] },
  { key: 'outside_inspection', title: 'Venkovní obhlídka objektu', icon: 'building', items: [
    { key: 'exterior.street_facade', label: 'Fasáda uliční', options: [['UNDAMAGED','Nepoškozené','good'],['DAMAGED','Poškozené','defect']] },
    { key: 'exterior.yard_facade', label: 'Fasáda dvorní', options: [['UNDAMAGED','Nepoškozené','good'],['DAMAGED','Poškozené','defect']] },
    { key: 'exterior.cultural_objects', label: 'Kulturní předměty (pamětní desky, busty...)', options: [['RECORDED','Popsáno','good'],['MISSING','Doplnit','defect']] },
    { key: 'exterior.street_windows', label: 'Okna uliční', options: [['GOOD','Dobrá','good'],['DAMAGED','Poškozená','defect']] },
    { key: 'exterior.yard_windows', label: 'Okna dvorní', options: [['GOOD','Dobrá','good'],['DAMAGED','Poškozená','defect']] },
    { key: 'exterior.entrance_doors', label: 'Vchodové dveře (zámek, zavírač, nátěr)', options: [['FUNCTIONAL','Funkční','good'],['NON_FUNCTIONAL','Nefunkční','defect']] },
    { key: 'exterior.yard_doors', label: 'Dveře do dvora (zámek, zavírač, nátěr)', options: [['FUNCTIONAL','Funkční','good'],['NON_FUNCTIONAL','Nefunkční','defect']] },
    { key: 'exterior.common_doors', label: 'Dveře do společných prostor', options: [['FUNCTIONAL','Funkční','good'],['NON_FUNCTIONAL','Nefunkční','defect']] },
    { key: 'exterior.intercom', label: 'Zvonky, domácí telefony', options: [['FUNCTIONAL','Funkční','good'],['NON_FUNCTIONAL','Nefunkční','defect']] },
    { key: 'exterior.roof', label: 'Střecha', options: [['FUNCTIONAL','Funkční','good'],['NON_FUNCTIONAL','Závada','defect']] },
    { key: 'exterior.bird_protection', label: 'Ochrana proti ptactvu', options: [['FUNCTIONAL','Funkční','good'],['NON_FUNCTIONAL','Nefunkční','defect']] },
    { key: 'exterior.drainage', label: 'Dešťové svody, gajgry, hromosvod', options: [['FUNCTIONAL','Funkční','good'],['NON_FUNCTIONAL','Nefunkční','defect']] },
  ] },
  { key: 'waste', title: 'Popelnice', icon: 'trash', items: [
    { key: 'waste.location_condition', label: 'Umístění popelnic / stav', options: [['OK','V pořádku','good'],['DEFECT','Závada','defect']] },
    { key: 'waste.flats', label: 'Počet popelnic – byty', options: [['RECORDED','Zapsáno','good'],['MISSING','Doplnit','defect']] },
    { key: 'waste.sorted', label: 'Počet nádob – tříděný odpad', options: [['RECORDED','Zapsáno','good'],['MISSING','Doplnit','defect']] },
    { key: 'waste.non_residential', label: 'Počet popelnic – nebyty', options: [['RECORDED','Zapsáno','good'],['MISSING','Doplnit','defect']] },
    { key: 'waste.surroundings', label: 'Okolí popelnic', options: [['CLEAN','Čisté','good'],['WASTE','Odložený odpad','defect']] },
  ] },
  { key: 'common_areas', title: 'Společné prostory', icon: 'stairs', items: [
    { key: 'common.mat', label: 'Rohožka', options: [['FUNCTIONAL','Funkční','good'],['DAMAGED','Poškozená','defect'],['NONE','Není','defect']] },
    { key: 'common.mailboxes', label: 'Poštovní schránky', options: [['FUNCTIONAL','Funkční','good'],['DAMAGED','Poškozené','defect']] },
    { key: 'common.paint', label: 'Malba', options: [['PRESERVED','Zachovalá','good'],['DAMAGED','Poškozená','defect']] },
    { key: 'common.stairs', label: 'Schody', options: [['PRESERVED','Zachovalé','good'],['DAMAGED','Poškozené','defect']] },
    { key: 'common.railings', label: 'Zábradlí', options: [['PRESERVED','Zachovalé','good'],['DAMAGED','Poškozené','defect']] },
    { key: 'common.attic', label: 'Půda', options: [['MAINTAINED','Udržovaná','good'],['UNMAINTAINED','Neudržovaná','defect'],['WASTE','Odložený odpad','defect']] },
    { key: 'common.cellars', label: 'Sklepy', options: [['MAINTAINED','Udržované','good'],['UNMAINTAINED','Neudržované','defect'],['WASTE','Odložený odpad','defect']] },
  ] },
  { key: 'yard', title: 'Dvůr / zahrádka', icon: 'leaf', items: [
    { key: 'yard.condition', label: 'Stav dvora', options: [['CLEAN','Čistý','good'],['UNMAINTAINED','Neudržovaný','defect']] },
    { key: 'yard.technical', label: 'Technický stav (povrch, dlažba, vlhkost)', options: [['PRESERVED','Zachovalý','good'],['DAMAGED','Poškozený','defect']] },
    { key: 'yard.greenery', label: 'Stav zeleně', options: [['MAINTAINED','Udržovaná','good'],['UNMAINTAINED','Neudržovaná','defect']] },
    { key: 'yard.buildings', label: 'Stavby na dvoře (garáže, NB)', options: [['PRESERVED','Zachovalé','good'],['DAMAGED','Závada','defect']] },
  ] },
  { key: 'lighting', title: 'Osvětlení', icon: 'bulb', items: [
    { key: 'lighting.switches', label: 'Vypínače ve všech patrech', options: [['FUNCTIONAL','Funkční','good'],['DAMAGED','Poškozené','defect']] },
    { key: 'lighting.lights', label: 'Světla ve všech patrech', options: [['FUNCTIONAL','Všechna funkční','good'],['PARTIAL','Některá nesvítí','defect']] },
    { key: 'lighting.covers', label: 'Kryty na světlech ve všech patrech', options: [['PRESENT','Jsou','good'],['MISSING','Nejsou','defect']] },
    { key: 'lighting.cellar_a', label: 'Sklep – osvětlení I', options: [['FUNCTIONAL','Funkční','good'],['PARTIAL','Některá nesvítí','defect'],['NONE','Nefunkční komplet','defect']] },
    { key: 'lighting.cellar_b', label: 'Sklep – osvětlení II', options: [['FUNCTIONAL','Funkční','good'],['PARTIAL','Některá nesvítí','defect'],['NONE','Nefunkční komplet','defect']] },
    { key: 'lighting.distribution_boards', label: 'Elektrické rozvaděče, zámky', options: [['FUNCTIONAL','Funkční','good'],['CLOSED','Uzavřené','good'],['OPEN','Otevřené','defect']] },
  ] },
  { key: 'other', title: 'Ostatní', icon: 'note', items: [
    { key: 'other.cleaning', label: 'Úklid (zábradlí, prach, okna, odložený odpad, podlahy)', options: [['RECORDED','Popsáno','good'],['MISSING','Doplnit','defect']] },
    { key: 'other.notes', label: 'Poznámky', options: [['RECORDED','Zapsáno','good'],['NONE','Bez poznámky','neutral']] },
  ] },
  { key: 'meters', title: 'Měřidla', icon: 'gauge', items: [
    { key: 'meters.water_1', label: 'Vodoměr 1', options: [['READ','Odečteno','good'],['MISSING','Nedostupné','defect']] },
    { key: 'meters.water_2', label: 'Vodoměr 2', options: [['READ','Odečteno','good'],['MISSING','Nedostupné','defect']] },
    { key: 'meters.electricity_1', label: 'Elektroměr 1', options: [['READ','Odečteno','good'],['MISSING','Nedostupné','defect']] },
    { key: 'meters.electricity_2', label: 'Elektroměr 2', options: [['READ','Odečteno','good'],['MISSING','Nedostupné','defect']] },
  ] },
];

const secondProtocolPageKeys = new Set([
  'common.stairs', 'common.railings', 'common.attic', 'common.cellars',
  'yard.condition', 'yard.technical', 'yard.greenery', 'yard.buildings',
  'lighting.switches', 'lighting.lights', 'lighting.covers', 'lighting.cellar_a', 'lighting.cellar_b', 'lighting.distribution_boards',
  'other.cleaning', 'other.notes',
  'meters.water_1', 'meters.water_2', 'meters.electricity_1', 'meters.electricity_2',
]);
const allItems = sections.flatMap(section => section.items.map(item => ({
  ...item,
  sectionKey: section.key,
  pdfPage: secondProtocolPageKeys.has(item.key) ? 2 : 1,
})));
const photoLibrary = allItems.map((item, index) => ({
  itemKey: item.key,
  title: item.label,
  src: `assets/photos/items/item-${String(index + 1).padStart(2, '0')}.webp`,
}));

function createDemoFormSections() {
  return sections.map(section => ({
    key: section.key,
    title: section.title,
    icon: section.icon,
    items: section.items.map(item => ({ key: item.key, label: item.label, enabled: true, custom: false })),
  }));
}

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
    pdfDocument: 'complete',
    adminTab: null,
    final: true,
    signature: true,
    pendingPhoto: null,
    loginRole: null,
    loginName: null,
    formSections: createDemoFormSections(),
    formRevision: 1,
    formEditingKey: null,
    formPendingRemoveKey: null,
    adminEntityId: null,
    adminError: null,
    technicians: [
      { id: 'technician-1', name: 'Daniel Novák', active: true },
      { id: 'technician-2', name: 'Petra Malá', active: true },
    ],
    buildings: [
      { id: 'building-1', address: 'Ukázková 12, Praha 3', interval: 14, active: true },
      { id: 'building-2', address: 'Javorová 8, Praha 10', interval: 30, active: true },
      { id: 'building-3', address: 'Parková 31, Praha 7', interval: 30, active: true },
    ],
    photos: photoLibrary.map((photo, index) => ({
      id: `F${String(index + 1).padStart(3, '0')}`,
      sequence: index + 1,
      itemKey: photo.itemKey,
      src: photo.src,
      markedSrc: null,
      location: sections.find(section => section.items.some(item => item.key === photo.itemKey))?.title || 'Kontrolovaný objekt',
      description: `Ilustrační fotografie: ${photo.title}.`,
      strokes: [],
    })),
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

function managedFormEntry(itemKey) {
  for (const section of state.formSections) {
    const index = section.items.findIndex(item => item.key === itemKey);
    if (index >= 0) return { section, item: section.items[index], index };
  }
  return null;
}

function activeManagedFormCount() {
  return state.formSections.reduce((count, section) => count + section.items.filter(item => item.enabled).length, 0);
}

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
        <img src="assets/app-icon.svg" alt="">
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
        <div class="brand-row"><img src="assets/app-icon.svg" alt="Ikona DKO"><div><strong>DKO</strong><span>Digitální kontrola objektů</span></div></div>
        <h1 class="title">Kdo bude aplikaci používat?</h1>
        <p class="body-copy" style="color:inherit">Data zůstávají pouze v tomto telefonu. Vyberte svůj účet a zadejte heslo.</p>
      </section>
      <h2 class="section-title">Technici</h2>
      <button class="account-card" data-action="login-technician" data-login-name="Daniel Novák"><span class="list-icon">${icon('badge')}</span><span><strong>Daniel Novák</strong><small>Technik · demo účet</small></span></button>
      <button class="account-card" data-action="login-technician" data-login-name="Petra Malá"><span class="list-icon">${icon('badge')}</span><span><strong>Petra Malá</strong><small>Technik · demo účet</small></span></button>
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
  const primaryPhoto = photos[0];
  const additionalPhotos = photos.slice(1);
  return `<article class="item-card" data-item-key="${item.key}">
    <div class="row-between"><h3>${escapeHtml(item.label)}</h3>${answer.value ? `<span class="chip ${item.options.find(option => option[0] === answer.value)?.[2] === 'defect' ? 'chip--warn' : 'chip--good'}">${answer.value ? 'Hotovo' : ''}</span>` : ''}</div>
    ${primaryPhoto ? `<button class="item-evidence" data-edit-photo="${primaryPhoto.id}" data-item-photo-key="${item.key}" data-photo-id="${primaryPhoto.id}"><img src="${primaryPhoto.markedSrc || primaryPhoto.src}" alt="${escapeHtml(`Fotografie ${primaryPhoto.id} – ${item.label}`)}"><span><strong>${primaryPhoto.id}</strong><small>Fotografie přiřazená k této položce</small></span></button>` : `<div class="item-evidence item-evidence--missing" data-missing-photo-key="${item.key}">Chybí fotografie k položce</div>`}
    <div class="field"><label>Stav</label><div class="choice-row">
      ${item.options.map(([value,label,tone]) => `<button class="choice is-${tone} ${answer.value === value ? 'is-selected' : ''}" data-answer="${item.key}" data-value="${value}">${label}</button>`).join('')}
    </div></div>
    <div class="field"><label>Poznámka</label><textarea class="textarea" data-note="${item.key}" placeholder="Doplňte zjištění…">${escapeHtml(answer.note)}</textarea></div>
    <button class="button button--wide" data-photo-for="${item.key}">${icon('camera')} Přidat další fotografii</button>
    ${additionalPhotos.length ? `<div><p class="small" style="font-weight:700;margin:0 0 7px">Další uložené fotografie</p><div class="photo-row">${additionalPhotos.map(photo => `<button class="photo-thumb" data-edit-photo="${photo.id}"><img src="${photo.markedSrc || photo.src}" alt="${photo.id}"><span>${photo.id}</span></button>`).join('')}</div></div>` : ''}
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
  const photoPages = Math.max(1, Math.ceil(state.photos.length / 4));
  return `<div class="document-row"><button class="button button--text" data-pdf-document="protocol" data-pdf="0">Protokol · 2 strany A4</button><button class="icon-button" data-demo-toast="PDF bylo uloženo pouze v ukázce">${icon('download')}</button><button class="icon-button" data-demo-toast="Otevřen tiskový dialog ukázky">${icon('print')}</button><button class="icon-button" data-demo-toast="Sdílení je v demu vypnuté">${icon('share')}</button></div>
    <div class="document-row"><button class="button button--text" data-pdf-document="photos" data-pdf="0">Fotodokumentace · ${photoPages}× A4 / 4× A6</button><button class="icon-button" data-demo-toast="PDF bylo uloženo pouze v ukázce">${icon('download')}</button><button class="icon-button" data-demo-toast="Otevřen tiskový dialog ukázky">${icon('print')}</button><button class="icon-button" data-demo-toast="Sdílení je v demu vypnuté">${icon('share')}</button></div>
    <div class="document-row"><button class="button button--text" data-pdf-document="complete" data-pdf="0">Kompletní PDF · ${2 + photoPages} stran</button><button class="icon-button" data-demo-toast="PDF bylo uloženo pouze v ukázce">${icon('download')}</button><button class="icon-button" data-demo-toast="Otevřen tiskový dialog ukázky">${icon('print')}</button><button class="icon-button" data-demo-toast="Sdílení je v demu vypnuté">${icon('share')}</button></div>`;
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

const pdfDetailSamples = {
  'inside.cleaning_record': 'Den úklidu: 15. 7. 2026',
  'exterior.cultural_objects': 'Pamětní deska u hlavního vstupu, stav bez závady',
  'waste.location_condition': 'Vnitroblok, vpravo od průjezdu',
  'waste.flats': 'Počet: 4',
  'waste.sorted': 'Počet: 3',
  'waste.non_residential': 'Počet: 1',
  'common.mailboxes': 'Kolik: 18',
  'other.cleaning': 'Podlahy a zábradlí čisté, bez odloženého odpadu',
  'other.notes': 'Pravidelná kontrola objektu dokončena.',
  'meters.water_1': 'Číslo: V-10021 · stav: 01234 m³ · technická místnost',
  'meters.water_2': 'Číslo: V-10022 · stav: 00987 m³ · suterén',
  'meters.electricity_1': 'Číslo: E-20841 · stav: 05678 kWh · přízemí',
  'meters.electricity_2': 'Číslo: E-20842 · stav: 03456 kWh · suterén',
};

function pdfAnswer(item) {
  const answer = answerFor(item.key);
  const selectedCode = answer.value || item.options[0][0];
  const stateLabel = item.options.find(option => option[0] === selectedCode)?.[1] || selectedCode;
  const detail = [];
  if (answer.note) detail.push(answer.note);
  else if (pdfDetailSamples[item.key]) detail.push(pdfDetailSamples[item.key]);
  const photos = photosFor(item.key).sort((a,b) => a.sequence - b.sequence);
  if (photos.length) detail.push(`Foto: ${photos.map(photo => photo.id).join(', ')}`);
  return { stateLabel, detail: detail.join(' · ') };
}

function pdfTable(pageIndex) {
  const sourcePage = pageIndex + 1;
  const pageSections = sections.map(section => ({
    ...section,
    pageItems: allItems.filter(item => item.sectionKey === section.key && item.pdfPage === sourcePage),
  })).filter(section => section.pageItems.length);
  return `<div class="pdf-page" data-protocol-page="${sourcePage}">
    <div class="pdf-header">
      <div class="pdf-logo"><span class="pdf-logo-mark"><i></i><b></b></span><strong>SPRÁVA NEMOVITOSTÍ PRAHA 2</strong></div>
      <div class="pdf-heading"><strong>Záznam z místního šetření ze dne:</strong><span>15. 7. 2026 09:41</span><span>adresa objektu: Ukázková 12, 130 00 Praha 3</span></div>
      <div class="pdf-document-meta"><span>Číslo: DKO-DEMO-2026-001 · část ${sourcePage}/2</span><span>Technik: Daniel Novák</span></div>
    </div>
    <table class="pdf-table"><colgroup><col style="width:30%"><col style="width:34%"><col></colgroup><tbody>${pageSections.map(section => `<tr class="pdf-section-row"><th colspan="3">${section.title.toUpperCase()}</th></tr>${section.pageItems.map(item => { const answer=pdfAnswer(item); return `<tr data-pdf-row-key="${item.key}"><td><strong>${escapeHtml(item.label)}</strong></td><td>${escapeHtml(answer.stateLabel)}</td><td>${escapeHtml(answer.detail)}</td></tr>`; }).join('')}`).join('')}</tbody></table>
    <div class="pdf-footer"><span>Jméno technika: Daniel Novák</span>${sourcePage === 2 ? '<span class="pdf-signature">Podpis technika: <i>Daniel Novák</i></span>' : '<span></span>'}<span>DKO-DEMO-2026-001 · šablona 2.0.0 · strana ${sourcePage}</span></div>
  </div>`;
}

function photoSheet(pageIndex, sheetCount) {
  const photos = [...state.photos].sort((a,b) => a.sequence - b.sequence).slice(pageIndex * 4, pageIndex * 4 + 4);
  return `<div class="photo-sheet" data-photo-sheet="${pageIndex + 1}">${photos.map(photo => {
    const item = allItems.find(value => value.key === photo.itemKey);
    return `<figure><div class="photo-sheet-card"><img src="${photo.markedSrc || photo.src}" alt="${photo.id}"><figcaption><div class="photo-sheet-title"><strong>${photo.id} · DKO-DEMO-2026-001</strong><span>list ${pageIndex + 1}/${sheetCount}</span></div><span>Ukázková 12, 130 00 Praha 3</span><span>15. 7. 2026 09:41 · ${escapeHtml(item?.label || photo.itemKey)}</span><span>Umístění: ${escapeHtml(photo.location || 'neuvedeno')}</span><span>Popis: ${escapeHtml(photo.description || 'bez popisu')}</span><span>Technik: Daniel Novák · Zdroj: ukázková fotografie</span></figcaption></div></figure>`;
  }).join('')}<div class="photo-sheet-footer">DKO-DEMO-2026-001 · fotodokumentace · list ${pageIndex + 1}/${sheetCount}</div></div>`;
}

function currentPdfPageCount() {
  const photoPages = Math.max(1, Math.ceil(state.photos.length / 4));
  if (state.pdfDocument === 'protocol') return 2;
  if (state.pdfDocument === 'photos') return photoPages;
  return 2 + photoPages;
}

function renderPdf() {
  const photoPages = Math.max(1, Math.ceil(state.photos.length / 4));
  const pageCount = currentPdfPageCount();
  const isProtocol = state.pdfDocument === 'protocol' || (state.pdfDocument === 'complete' && state.pdfPage < 2);
  const photoIndex = state.pdfDocument === 'photos' ? state.pdfPage : state.pdfPage - 2;
  const content = isProtocol ? pdfTable(state.pdfPage) : photoSheet(photoIndex, photoPages);
  const subtitle = isProtocol ? 'Protokol 2× A4 na šířku · všech 48 položek' : `Fotodokumentace ${photoPages}× A4 na výšku · 4× A6`;
  const documentLabel = state.pdfDocument === 'protocol' ? 'Protokol' : state.pdfDocument === 'photos' ? 'Fotodokumentace' : 'Kompletní PDF';
  return screen(`${appTopbar('Náhled PDF', subtitle, { back: 'history' })}
    <div class="pdf-viewer">${content}</div>
    <div class="pdf-controls"><button class="button button--compact" data-action="pdf-prev" ${state.pdfPage === 0 ? 'disabled' : ''}>Předchozí</button><strong class="small">${documentLabel} · strana ${state.pdfPage+1} / ${pageCount}</strong><button class="button button--compact" data-action="pdf-next" ${state.pdfPage === pageCount-1 ? 'disabled' : ''}>Další</button></div>`);
}

const adminSections = [
  ['technicians','Aktivní účty','people'],['buildings','Domy','building'],['backup','Export a import','backup'],['integrity','Kontrola dat','shield'],
  ['form','Kontrolní položky','clipboard'],['device','Telefon','phone'],['print','Tisk','print'],['password','Změnit heslo','key'],
];

function renderAdmin() {
  if (state.adminTab) return renderAdminTab();
  return screen(`${appTopbar('Nastavení', 'Demo Admin', { menu: true, logout: true })}
    <div class="app-scroll"><div class="content">
      <button class="button button--wide" data-action="technician-add">${icon('plus')} Přidat technika</button>
      <div class="menu-grid">${adminSections.map(([key,title,ico]) => `<button class="menu-tile" data-admin="${key}"><span class="tile-icon">${icon(ico)}</span><strong>${title}</strong></button>`).join('')}</div>
      <section class="hero-card stack"><strong>Administrace zůstává lokální</strong><span class="small">Účty, objekty, kontrolní seznamy, fotografie, PDF i zálohy jsou spravované přímo v telefonu.</span></section>
    </div></div>`, { drawer: true });
}

function adminTabContent(tab) {
  const content = {
    technicians: renderTechniciansAdmin(),
    buildings: renderBuildingsAdmin(),
    backup: `<div class="stack"><h2 class="title">Export a import dat</h2><p class="body-copy">Šifrovaný soubor zahrnuje databázi, originály i publikované fotografie, PDF a nastavení. V tomto demu se žádný soubor nevytváří.</p></div><div class="field"><label>Heslo zálohy</label><input class="input" type="password" value="demoheslo"></div><button class="button button--wide" data-demo-toast="Ukázkový export byl simulován">${icon('backup')} Exportovat data</button><button class="button button--wide button--outline" data-demo-toast="Ukázkový import byl simulován">Importovat a sloučit data</button>`,
    integrity: `<div class="stack"><h2 class="title">Kontrola integrity</h2><p class="body-copy">Ověří databázi, existenci a kontrolní součty originálů fotografií i PDF.</p></div><button class="button button--wide" data-action="integrity-run">${icon('shield')} Spustit kontrolu</button>${state.integrityRan ? `<div class="integrity-result"><strong>Data jsou v pořádku</strong><div class="small">68 souborů · 48 fotografií · 3 PDF · demo úložiště</div></div>` : ''}`,
    form: renderManagedFormItems(),
    device: `<div class="stack"><h2 class="title">Telefon</h2><p class="body-copy">Stav zařízení a lokální diagnostika.</p></div><section class="outlined-card card-pad stack"><div class="row-between"><span class="muted">Úložiště</span><strong>V pořádku</strong></div><div class="row-between"><span class="muted">Fotoaparát</span><strong>Demo režim</strong></div><div class="row-between"><span class="muted">PDF engine</span><strong>OK</strong></div><div class="row-between"><span class="muted">Internetové oprávnění</span><strong>Není požadováno</strong></div></section>`,
    print: `<div class="stack"><h2 class="title">Tisk</h2><p class="body-copy">Protokol používá 2× A4 na šířku. Fotolist používá samostatné A4 na výšku se čtyřmi A6 oblastmi.</p></div><button class="button button--wide" data-demo-toast="Kalibrační stránka byla otevřena v ukázce">${icon('print')} Vytisknout kalibrační stránku</button>`,
    password: `<div class="stack"><h2 class="title">Změnit heslo</h2><div class="field"><label>Současné heslo</label><input class="input" type="password"></div><div class="field"><label>Nové heslo</label><input class="input" type="password"></div><div class="field"><label>Nové heslo znovu</label><input class="input" type="password"></div><button class="button button--wide" data-demo-toast="Heslo se v demu neukládá">Uložit nové heslo</button></div>`,
  };
  return content[tab] || '';
}

function renderTechniciansAdmin() {
  const technicians = state.technicians.filter(account => account.active);
  return `<section class="hero-card stack"><strong>Účty spravuje pouze Admin</strong><span class="small">Technik tuto obrazovku nevidí. Odebrání vyžaduje nové zadání hesla Admina a zachová auditní historii účtu.</span></section>
    <button class="button button--wide" data-action="technician-add">${icon('plus')} Přidat technika</button>
    <div class="managed-form">${technicians.map(account => `<article class="managed-form-item" data-technician-row="${escapeHtml(account.id)}">
      <span class="list-icon">${icon('badge')}</span>
      <div class="managed-form-copy"><strong>${escapeHtml(account.name)}</strong><small>Aktivní účet · Technik · fake data</small></div>
      <div class="managed-form-actions"><button class="icon-button" data-technician-edit="${escapeHtml(account.id)}" aria-label="Upravit technika" title="Upravit">${icon('edit')}</button><button class="icon-button icon-button--danger" data-technician-remove="${escapeHtml(account.id)}" aria-label="Odstranit technika" title="Odstranit">${icon('delete')}</button></div>
    </article>`).join('')}</div>
    ${technicians.length ? '' : '<p class="body-copy">Nejsou zde žádné aktivní účty techniků.</p>'}`;
}

function renderBuildingsAdmin() {
  const buildings = state.buildings.filter(building => building.active);
  return `<section class="hero-card stack"><strong>Správa domů</strong><span class="small">Admin může přidat, upravit nebo odebrat objekt. Odebrání vyžaduje heslo Admina; hotové kontroly a PDF zůstanou zachované.</span></section>
    <button class="button button--wide" data-action="building-add">${icon('plus')} Přidat dům</button>
    <div class="managed-form">${buildings.map(building => `<article class="managed-form-item" data-building-row="${escapeHtml(building.id)}">
      <span class="list-icon">${icon('building')}</span>
      <div class="managed-form-copy"><strong>${escapeHtml(building.address)}</strong><small>Interval ${building.interval} dní · fake data</small></div>
      <div class="managed-form-actions"><button class="icon-button" data-building-edit="${escapeHtml(building.id)}" aria-label="Upravit dům" title="Upravit">${icon('edit')}</button><button class="icon-button icon-button--danger" data-building-remove="${escapeHtml(building.id)}" aria-label="Odstranit dům" title="Odstranit">${icon('delete')}</button></div>
    </article>`).join('')}</div>
    ${buildings.length ? '' : '<p class="body-copy">Nejsou zde žádné aktivní domy.</p>'}`;
}

function renderManagedFormItems() {
  return `<section class="hero-card stack">
      <strong>Seznam pro nové kontroly</strong>
      <span class="small">Změny se použijí jen u nových kontrol. Rozpracované a hotové protokoly zachovávají svůj neměnný otisk.</span>
      <span class="chip">${activeManagedFormCount()} aktivních položek · verze demo-${state.formRevision}</span>
    </section>
    <button class="button button--wide" data-action="form-add">${icon('plus')} Přidat kontrolní položku</button>
    <div class="managed-form">${state.formSections.map(section => `
      <section class="managed-form-section" data-form-section="${escapeHtml(section.key)}">
        <header><span class="list-icon">${icon(section.icon)}</span><div><strong>${escapeHtml(section.title)}</strong><small>${section.items.filter(item => item.enabled).length} aktivních z ${section.items.length}</small></div></header>
        <div class="managed-form-items">${section.items.map((item, index) => `
          <article class="managed-form-item ${item.enabled ? '' : 'is-disabled'}" data-form-item-row="${escapeHtml(item.key)}">
            <div class="managed-form-copy"><strong>${escapeHtml(item.label)}</strong><small>${item.enabled ? (item.custom ? 'Vlastní položka · aktivní pro nové kontroly' : 'Aktivní pro nové kontroly') : 'Odebraná z nových kontrol · lze obnovit'}</small></div>
            <div class="managed-form-actions">
              <button class="icon-button" data-form-move="${escapeHtml(item.key)}" data-direction="-1" aria-label="Posunout položku nahoru" title="Posunout nahoru" ${index === 0 ? 'disabled' : ''}>↑</button>
              <button class="icon-button" data-form-move="${escapeHtml(item.key)}" data-direction="1" aria-label="Posunout položku dolů" title="Posunout dolů" ${index === section.items.length - 1 ? 'disabled' : ''}>↓</button>
              <button class="icon-button" data-form-edit="${escapeHtml(item.key)}" aria-label="Přejmenovat položku" title="Přejmenovat">${icon('edit')}</button>
              ${item.enabled
                ? `<button class="icon-button icon-button--danger" data-form-remove="${escapeHtml(item.key)}" aria-label="Odebrat položku pro nové kontroly" title="Odebrat pro nové kontroly">${icon('delete')}</button>`
                : `<button class="icon-button icon-button--restore" data-form-restore="${escapeHtml(item.key)}" aria-label="Obnovit položku" title="Obnovit">${icon('undo')}</button>`}
            </div>
          </article>`).join('')}</div>
      </section>`).join('')}</div>`;
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
  if (state.modal === 'login') {
    const admin = state.loginRole === 'admin';
    return `<div class="modal"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="login-dialog-title">
      <div class="row" style="justify-content:center;color:var(--primary)">${icon(admin ? 'admin' : 'badge')}</div>
      <h2 id="login-dialog-title">${admin ? 'Přihlášení Admin' : escapeHtml(state.loginName || 'Technik')}</h2>
      <p>V ostré aplikaci zadejte své heslo. V této ukázce použijte předvyplněné heslo <strong>demo</strong>.</p>
      <div class="field"><label>Heslo</label><input id="demo-login-password" class="input" type="password" value="demo" autocomplete="off"></div>
      <div class="button-row"><button class="button button--outline" data-action="modal-close">Zrušit</button><button class="button" data-action="confirm-login">Přihlásit</button></div>
    </section></div>`;
  }
  if (state.modal === 'photo-gallery') return `<div class="modal"><section class="dialog"><h2>Vyberte ukázkový snímek</h2><p>48 skutečných veřejně licencovaných fotografií, jedna pro každou aktivní položku. Nejde o zákaznickou dokumentaci.</p><div class="gallery">${photoLibrary.map((photo,index) => `<button data-library-photo="${index}" class="${state.pendingPhoto?.libraryIndex === index ? 'is-selected' : ''}"><img src="${photo.src}" alt="${photo.title}"><span>${photo.title}</span></button>`).join('')}</div><a class="small primary-text" href="docs/demo-assets.md" target="_blank" rel="noopener">Zdroje a licence fotografií</a><button class="button button--wide button--outline" data-action="modal-close">Zavřít</button></section></div>`;
  if (state.modal === 'technician-add' || state.modal === 'technician-edit') {
    const editing = state.modal === 'technician-edit';
    const account = state.technicians.find(value => value.id === state.adminEntityId);
    return `<div class="modal"><section class="dialog" role="dialog" aria-modal="true"><h2>${editing ? 'Upravit technika' : 'Přidat technika'}</h2>
      <div class="field"><label for="technician-name">Jméno technika</label><input id="technician-name" class="input" maxlength="80" autocomplete="off" value="${escapeHtml(account?.name || '')}" placeholder="Např. Jan Nový"></div>
      ${editing ? '' : '<div class="field"><label for="technician-password">Dočasné heslo</label><input id="technician-password" class="input" type="password" autocomplete="new-password" value="demo"></div><div class="field"><label for="technician-password-repeat">Heslo znovu</label><input id="technician-password-repeat" class="input" type="password" autocomplete="new-password" value="demo"></div>'}
      <p>Jde pouze o fake účet v prohlížeči. V ostré offline aplikaci ho vytváří výhradně Admin.</p>
      <div class="button-row"><button class="button button--outline" data-action="modal-close">Zrušit</button><button class="button" data-action="technician-save">${editing ? 'Uložit' : 'Přidat'}</button></div>
    </section></div>`;
  }
  if (state.modal === 'building-add' || state.modal === 'building-edit') {
    const editing = state.modal === 'building-edit';
    const building = state.buildings.find(value => value.id === state.adminEntityId);
    return `<div class="modal"><section class="dialog" role="dialog" aria-modal="true"><h2>${editing ? 'Upravit dům' : 'Přidat dům'}</h2>
      <div class="field"><label for="building-address">Adresa objektu</label><input id="building-address" class="input" maxlength="120" autocomplete="off" value="${escapeHtml(building?.address || '')}" placeholder="Např. Testovací 10, Praha"></div>
      <div class="field"><label for="building-interval">Interval kontroly ve dnech</label><input id="building-interval" class="input" type="number" min="1" max="365" value="${building?.interval || 30}"></div>
      <p>V demu se ukládají pouze dočasná fake data v tomto otevřeném prohlížeči.</p>
      <div class="button-row"><button class="button button--outline" data-action="modal-close">Zrušit</button><button class="button" data-action="building-save">${editing ? 'Uložit' : 'Přidat'}</button></div>
    </section></div>`;
  }
  if (state.modal === 'admin-remove') {
    const account = state.technicians.find(value => value.id === state.adminEntityId);
    const building = state.buildings.find(value => value.id === state.adminEntityId);
    const entity = account || building;
    const isTechnician = Boolean(account);
    const label = account?.name || building?.address || 'Vybraná položka';
    return `<div class="modal"><section class="dialog" role="dialog" aria-modal="true"><h2>Odstranit ${isTechnician ? 'technika' : 'dům'}?</h2>
      <p><strong>${escapeHtml(label)}</strong> zmizí z aktivního seznamu. Historické kontroly, PDF a auditní údaje zůstanou zachované.</p>
      <div class="field"><label for="admin-confirm-password">Heslo Admina pro potvrzení</label><input id="admin-confirm-password" class="input" type="password" autocomplete="current-password" placeholder="V demu zadejte demo"></div>
      ${state.adminError ? `<p class="primary-text" role="alert">${escapeHtml(state.adminError)}</p>` : ''}
      <div class="button-row"><button class="button button--outline" data-action="modal-close">Zrušit</button><button class="button button--danger" data-action="admin-remove-confirm" ${entity ? '' : 'disabled'}>Odstranit</button></div>
    </section></div>`;
  }
  if (state.modal === 'form-add') return `<div class="modal"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="form-add-title">
    <h2 id="form-add-title">Přidat kontrolní položku</h2>
    <div class="field"><label for="form-add-section">Sekce</label><select id="form-add-section" class="input">${state.formSections.map(section => `<option value="${escapeHtml(section.key)}">${escapeHtml(section.title)}</option>`).join('')}</select></div>
    <div class="field"><label for="form-add-name">Název položky</label><input id="form-add-name" class="input" maxlength="120" autocomplete="off" placeholder="Např. Stav hasicích přístrojů"></div>
    <p>Nová položka nabídne stavy V pořádku / Závada, poznámku a fotografie. Použije se až v nové kontrole.</p>
    <div class="button-row"><button class="button button--outline" data-action="modal-close">Zrušit</button><button class="button" data-action="form-add-confirm">Přidat</button></div>
  </section></div>`;
  if (state.modal === 'form-edit') {
    const entry = managedFormEntry(state.formEditingKey);
    if (!entry) return '';
    return `<div class="modal"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="form-edit-title">
      <h2 id="form-edit-title">Přejmenovat položku</h2>
      <div class="field"><label for="form-edit-name">Název položky</label><input id="form-edit-name" class="input" maxlength="120" autocomplete="off" value="${escapeHtml(entry.item.label)}"></div>
      <p>Změna názvu se použije až v nových kontrolách.</p>
      <div class="button-row"><button class="button button--outline" data-action="modal-close">Zrušit</button><button class="button" data-action="form-edit-confirm">Uložit</button></div>
    </section></div>`;
  }
  if (state.modal === 'form-remove') {
    const entry = managedFormEntry(state.formPendingRemoveKey);
    if (!entry) return '';
    return `<div class="modal"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="form-remove-title">
      <h2 id="form-remove-title">Odebrat položku?</h2>
      <p><strong>${escapeHtml(entry.item.label)}</strong> se přestane nabízet v nových kontrolách. Rozpracované a uzavřené protokoly zůstanou beze změny a položku bude možné znovu obnovit.</p>
      <div class="button-row"><button class="button button--outline" data-action="modal-close">Zrušit</button><button class="button button--danger" data-action="form-remove-confirm">Odebrat</button></div>
    </section></div>`;
  }
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
  if (target.dataset.action === 'login-technician') { state.loginRole='technician'; state.loginName=target.dataset.loginName || 'Daniel Novák'; state.modal='login'; return render(); }
  if (target.dataset.action === 'login-admin') { state.loginRole='admin'; state.loginName='Demo Admin'; state.modal='login'; return render(); }
  if (target.dataset.action === 'confirm-login') {
    const password=document.querySelector('#demo-login-password')?.value || '';
    if(!password)return;
    const role=state.loginRole;
    state.modal=null;
    state.role=role;
    return navigate(role==='admin'?'admin':'work');
  }
  if (target.dataset.section) { state.currentSection=target.dataset.section; return navigate('section'); }
  if (target.dataset.answer) { state.answers[target.dataset.answer]={...answerFor(target.dataset.answer),value:target.dataset.value}; return render(); }
  if (target.dataset.note) return;
  if (target.dataset.markGood) {
    const section=sections.find(value=>value.key===target.dataset.markGood);
    section.items.forEach(item=>{ if(!answerFor(item.key).value) state.answers[item.key]={...answerFor(item.key),value:item.options.find(option=>option[2]==='good')?.[0] || item.options[0][0]}; });
    return render();
  }
  if (target.dataset.photoFor) {
    state.selectedItem = target.dataset.photoFor;
    const libraryIndex = Math.max(0, photoLibrary.findIndex(photo => photo.itemKey === state.selectedItem));
    startPendingPhoto(photoLibrary[libraryIndex].src, libraryIndex);
    return navigate('photo-capture');
  }
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
  if (target.dataset.pdfDocument) { state.pdfDocument=target.dataset.pdfDocument; state.pdfPage=0; return navigate('pdf'); }
  if (target.dataset.pdf !== undefined) { state.pdfDocument='complete'; state.pdfPage=Number(target.dataset.pdf); return navigate('pdf'); }
  if (target.dataset.action === 'pdf-prev') { state.pdfPage=Math.max(0,state.pdfPage-1); return render(); }
  if (target.dataset.action === 'pdf-next') { state.pdfPage=Math.min(currentPdfPageCount()-1,state.pdfPage+1); return render(); }
  if (target.dataset.action === 'technician-add') { state.adminEntityId=null; state.adminError=null; state.modal='technician-add'; return render(); }
  if (target.dataset.technicianEdit) { state.adminEntityId=target.dataset.technicianEdit; state.adminError=null; state.modal='technician-edit'; return render(); }
  if (target.dataset.action === 'technician-save') {
    const name=(document.querySelector('#technician-name')?.value || '').trim();
    if(name.length<2){state.modal='toast:Jméno technika musí mít alespoň 2 znaky.';return render();}
    if(state.modal==='technician-add'){
      const password=document.querySelector('#technician-password')?.value || '';
      const repeat=document.querySelector('#technician-password-repeat')?.value || '';
      if(password.length<4 || password!==repeat){state.modal='toast:Hesla se musí shodovat a mít alespoň 4 znaky.';return render();}
      state.technicians.push({id:`technician-${Date.now()}`,name,active:true});
      state.modal='toast:Technik byl přidán. Jde o dočasný fake účet v tomto demu.';
    }else{
      const account=state.technicians.find(value=>value.id===state.adminEntityId);
      if(account)account.name=name;
      state.modal='toast:Účet technika byl upraven.';
    }
    state.adminEntityId=null;
    return render();
  }
  if (target.dataset.technicianRemove) { state.adminEntityId=target.dataset.technicianRemove; state.adminError=null; state.modal='admin-remove'; return render(); }
  if (target.dataset.action === 'building-add') { state.adminEntityId=null; state.adminError=null; state.modal='building-add'; return render(); }
  if (target.dataset.buildingEdit) { state.adminEntityId=target.dataset.buildingEdit; state.adminError=null; state.modal='building-edit'; return render(); }
  if (target.dataset.action === 'building-save') {
    const address=(document.querySelector('#building-address')?.value || '').trim();
    const interval=Number(document.querySelector('#building-interval')?.value || 0);
    if(address.length<5 || !Number.isInteger(interval) || interval<1 || interval>365){state.modal='toast:Zadejte platnou adresu a interval 1 až 365 dní.';return render();}
    if(state.modal==='building-add'){
      state.buildings.push({id:`building-${Date.now()}`,address,interval,active:true});
      state.modal='toast:Dům byl přidán do dočasných fake dat dema.';
    }else{
      const building=state.buildings.find(value=>value.id===state.adminEntityId);
      if(building){building.address=address;building.interval=interval;}
      state.modal='toast:Dům byl upraven.';
    }
    state.adminEntityId=null;
    return render();
  }
  if (target.dataset.buildingRemove) { state.adminEntityId=target.dataset.buildingRemove; state.adminError=null; state.modal='admin-remove'; return render(); }
  if (target.dataset.action === 'admin-remove-confirm') {
    const password=document.querySelector('#admin-confirm-password')?.value || '';
    if(password!=='demo'){state.adminError='Heslo Admina není správné. V demu použijte demo.';return render();}
    const account=state.technicians.find(value=>value.id===state.adminEntityId);
    const building=state.buildings.find(value=>value.id===state.adminEntityId);
    if(account)account.active=false;
    if(building)building.active=false;
    state.adminEntityId=null;
    state.adminError=null;
    state.modal=`toast:${account ? 'Technik' : 'Dům'} byl odstraněn z aktivního seznamu. Historie zůstala zachovaná.`;
    return render();
  }
  if (target.dataset.action === 'form-add') { state.modal='form-add'; return render(); }
  if (target.dataset.action === 'form-add-confirm') {
    const sectionKey=document.querySelector('#form-add-section')?.value || '';
    const name=(document.querySelector('#form-add-name')?.value || '').trim();
    const section=state.formSections.find(value=>value.key===sectionKey);
    const duplicate=state.formSections.some(value=>value.items.some(item=>item.label.localeCompare(name,'cs',{sensitivity:'base'})===0));
    if(!section || name.length<2){state.modal='toast:Název položky musí mít alespoň 2 znaky.';return render();}
    if(duplicate){state.modal='toast:Položka s tímto názvem už v seznamu existuje.';return render();}
    const key=`custom.demo.${state.formRevision}`;
    section.items.push({key,label:name,enabled:true,custom:true});
    state.formRevision+=1;
    state.modal=`toast:Položka „${name}“ byla přidána pro nové kontroly.`;
    return render();
  }
  if (target.dataset.formEdit) { state.formEditingKey=target.dataset.formEdit; state.modal='form-edit'; return render(); }
  if (target.dataset.action === 'form-edit-confirm') {
    const entry=managedFormEntry(state.formEditingKey);
    const name=(document.querySelector('#form-edit-name')?.value || '').trim();
    const duplicate=state.formSections.some(value=>value.items.some(item=>item.key!==state.formEditingKey && item.label.localeCompare(name,'cs',{sensitivity:'base'})===0));
    if(!entry || name.length<2){state.modal='toast:Název položky musí mít alespoň 2 znaky.';return render();}
    if(duplicate){state.modal='toast:Položka s tímto názvem už v seznamu existuje.';return render();}
    entry.item.label=name;
    state.formRevision+=1;
    state.formEditingKey=null;
    state.modal='toast:Název položky byl změněn pro nové kontroly.';
    return render();
  }
  if (target.dataset.formRemove) { state.formPendingRemoveKey=target.dataset.formRemove; state.modal='form-remove'; return render(); }
  if (target.dataset.action === 'form-remove-confirm') {
    const entry=managedFormEntry(state.formPendingRemoveKey);
    if(entry){entry.item.enabled=false;state.formRevision+=1;}
    state.formPendingRemoveKey=null;
    state.modal='toast:Položka byla odebrána z nových kontrol. Starší kontroly zůstaly beze změny.';
    return render();
  }
  if (target.dataset.formRestore) {
    const entry=managedFormEntry(target.dataset.formRestore);
    if(entry){entry.item.enabled=true;state.formRevision+=1;state.modal='toast:Položka byla obnovena pro nové kontroly.';}
    return render();
  }
  if (target.dataset.formMove) {
    const entry=managedFormEntry(target.dataset.formMove);
    const direction=Number(target.dataset.direction);
    if(entry && (direction===-1 || direction===1)){
      const destination=entry.index+direction;
      if(destination>=0 && destination<entry.section.items.length){
        const [item]=entry.section.items.splice(entry.index,1);
        entry.section.items.splice(destination,0,item);
        state.formRevision+=1;
      }
    }
    return render();
  }
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
    if(target.dataset.jump==='photo'){
      state.role='technician';
      const existing=state.photos.find(photo=>photo.itemKey==='exterior.entrance_doors')||state.photos[0];
      state.selectedItem=existing.itemKey;
      state.pendingPhoto={...existing,strokes:existing.strokes||[],editingId:existing.id,libraryIndex:photoLibrary.findIndex(photo=>photo.itemKey===existing.itemKey),rotation:0};
    }
    return navigate(map[target.dataset.jump]);
  }
});

window.addEventListener('resize', () => {
  if (state.route === 'photo-edit') initMarkupCanvas();
  if (state.route === 'signature') initSignatureCanvas();
});

if ('serviceWorker' in navigator && ['http:', 'https:'].includes(location.protocol)) {
  const registerServiceWorker = () => navigator.serviceWorker.register('./sw.js').catch(() => {});
  if (document.readyState === 'complete') registerServiceWorker();
  else window.addEventListener('load', registerServiceWorker, { once: true });
}

setInterval(() => {
  const clock=document.querySelector('[data-clock]');
  if(clock)clock.textContent=new Intl.DateTimeFormat('cs-CZ',{hour:'2-digit',minute:'2-digit'}).format(new Date());
},30000);

render();
