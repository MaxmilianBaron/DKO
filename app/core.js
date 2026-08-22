const app = document.querySelector('#app');
const dialogRoot = document.querySelector('#dialog-root');
const THEME_KEY = 'dso-preview-theme';

const icons = {
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  back: '<path d="m15 18-6-6 6-6"/><path d="M9 12h10"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
  moon: '<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.7 8.7 0 1 0 20.5 14.2Z"/>',
  logout: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/>',
  badge: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M9 8h6M8 13h8M9 17h6"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  cloudOff: '<path d="m2 2 20 20M5.6 5.6A7 7 0 0 0 5 19h12.4M19.4 17.4A5 5 0 0 0 17 8h-1a7 7 0 0 0-6.2-3.9"/>',
  work: '<path d="M9 5h6M9 3h6a2 2 0 0 1 2 2v1h2a2 2 0 0 1 2 2v11H3V8a2 2 0 0 1 2-2h2V5a2 2 0 0 1 2-2Z"/><path d="M3 12h18M10 12v2h4v-2"/>',
  drafts: '<path d="M6 3h12v18H6z"/><path d="M9 7h6M9 11h6M9 15h4"/><circle cx="18" cy="18" r="3"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21h-4v-.08a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3v-4h.08a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3h4v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.15.6.68 1 1.3 1H21v4h-.3c-.62 0-1.15.4-1.3 1Z"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M9 21h6"/>',
  arrow: '<path d="m9 18 6-6-6-6"/>',
  building: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h2M13 9h2M9 13h2M13 13h2M10 21v-4h4v4"/>',
  play: '<path d="m8 5 11 7-11 7Z"/>',
  camera: '<path d="M4 7h3l2-2h6l2 2h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>',
  error: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  filter: '<path d="M4 5h16M7 12h10M10 19h4"/>',
  file: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 13h6M9 17h6"/>',
  share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.5-4.4M8.2 13.2l7.5 4.4"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  people: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 21v-2a5 5 0 0 1 10 0v2M14 16a4 4 0 0 1 7 3v2"/>',
  backup: '<path d="M4 7h16v13H4zM8 3h8v4H8z"/><path d="M9 15h6M12 12v6"/>',
  shield: '<path d="M12 3 20 6v6c0 5-3.4 8-8 10-4.6-2-8-5-8-10V6z"/><path d="m9 12 2 2 4-4"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  print: '<path d="M6 9V3h12v6M6 18H4V10h16v8h-2M6 14h12v7H6z"/>',
  password: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M14 9l2 2"/>',
  checklist: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3 6 1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2"/>',
  home: '<path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z"/>',
  note: '<path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="2"/><path d="m21 15-5-5L5 20"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  more: '<circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/>',
  circle: '<circle cx="12" cy="12" r="8"/>',
  pen: '<path d="m4 20 4.5-1 10-10-3.5-3.5-10 10Z"/><path d="m13.5 6.5 3.5 3.5"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
};

const svg = (name, cls = 'icon') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.more}</svg>`;

const state = {
  theme: localStorage.getItem(THEME_KEY) || 'light',
  route: 'login',
  previous: [],
  dialog: null,
  toast: '',
  answers: { entrance: 'ok', bells: 'defect', light: '', meter: 'ok' },
  historyQuery: '',
  historyDeleteMode: false,
  historySelection: [],
  historyDeleteFromDate: '',
  photoTool: 'circle',
  notificationDirty: false,
};

const demo = {
  technician: { name: 'Jan Novák', role: 'Technik' },
  buildings: [
    { id: 'jablonova', address: 'Jabloňová 12, Praha 10', due: 'Kontrola dnes', tone: 'tertiary' },
    { id: 'vysluni', address: 'Na Výsluní 84, Praha 4', due: 'Kontrola za 3 dny', tone: 'primary' },
    { id: 'zahradni', address: 'Zahradní 28, Brno', due: 'Kontrola za 12 dní', tone: 'primary' },
  ],
  draft: { address: 'Jabloňová 12, Praha 10', protocol: 'DSO-2026-0043', completed: 31, total: 48, defects: 2, photos: 6, saved: 'dnes 14:26' },
  history: [
    { id: '42', address: 'Na Výsluní 84, Praha 4', protocol: 'DSO-2026-0042', date: '14. 8. 2026', iso: '2026-08-14', defects: 3 },
    { id: '41', address: 'Jabloňová 12, Praha 10', protocol: 'DSO-2026-0041', date: '5. 8. 2026', iso: '2026-08-05', defects: 1 },
    { id: '39', address: 'Zahradní 28, Brno', protocol: 'DSO-2026-0039', date: '22. 7. 2026', iso: '2026-07-22', defects: 0 },
  ],
};

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
  localStorage.setItem(THEME_KEY, theme);
}

function themeButton() {
  const next = state.theme === 'dark' ? 'light' : 'dark';
  return `<button class="icon-button icon-button--outlined" data-action="theme" aria-label="Přepnout vzhled" title="${next === 'dark' ? 'Tmavý' : 'Světlý'} režim">${svg(state.theme === 'dark' ? 'sun' : 'moon')}</button>`;
}

function topBar(title, subtitle, options = {}) {
  const left = options.back
    ? `<button class="icon-button" data-action="back" aria-label="Zpět">${svg('back')}</button>`
    : `<button class="icon-button" data-action="close" aria-label="Zavřít ukázku">${svg('close')}</button>`;
  return `<header class="topbar">
    ${left}
    <div class="topbar__title"><strong>${title}</strong>${subtitle ? `<small>${subtitle}</small>` : ''}</div>
    ${options.theme === false ? '' : themeButton()}
    ${options.logout === false ? '' : `<button class="icon-button" data-action="logout" aria-label="Odhlásit">${svg('logout')}</button>`}
  </header>`;
}

function brandPanel({ title = 'Digitální Správa Objektů', supporting = '', status = '', compact = false } = {}) {
  return `<section class="brand-panel ${compact ? 'brand-panel--compact' : ''}">
    <div class="brand-row">
      <img class="brand-icon" src="../assets/app-icon.svg" alt="Ikona DSO" />
      <div class="brand-copy">
        <p class="eyebrow">DSO V1.0</p>
        <h1>${title}</h1>
      </div>
    </div>
    ${supporting ? `<p>${supporting}</p>` : ''}
    ${status ? `<div style="margin-top:12px">${pill(status, 'tertiary', 'cloudOff')}</div>` : ''}
  </section>`;
}

function pill(text, tone = 'primary', iconName = '') {
  const color = tone === 'tertiary' ? 'var(--tertiary)' : tone === 'error' ? 'var(--error)' : tone === 'secondary' ? 'var(--secondary)' : 'var(--primary)';
  return `<span class="status-pill" style="--pill:${color}">${iconName ? svg(iconName, 'icon icon--small') : ''}${text}</span>`;
}

function sectionHeader(eyebrow, title, supporting) {
  return `<section class="section-header"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2><p class="supporting">${supporting}</p></section>`;
}

function futureCard(content, { tone = 'primary', button = false, attrs = '', classes = '' } = {}) {
  const color = tone === 'tertiary' ? 'var(--tertiary)' : tone === 'secondary' ? 'var(--secondary)' : tone === 'error' ? 'var(--error)' : 'var(--primary)';
  const tag = button ? 'button' : 'section';
  return `<${tag} class="future-card ${button ? 'future-card--button' : ''} ${classes}" style="--accent:${color}" ${attrs}>${content}</${tag}>`;
}

function bottomNav(active) {
  const items = [
    ['work', 'Práce', 'work'],
    ['drafts', 'Rozpracované', 'drafts'],
    ['history', 'Historie', 'history'],
    ['settings', 'Více', 'more'],
  ];
  return `<div class="bottom-nav-wrap"><nav class="bottom-nav" aria-label="Hlavní navigace">${items.map(([route,label,iconName]) => `
    <button class="nav-item ${active === route ? 'is-active' : ''}" data-route="${route}" aria-label="${label}">
      <span class="nav-icon">${svg(iconName)}</span><span>${label}</span>
    </button>`).join('')}</nav></div>`;
}

function mainShell({ title, active, content, back = false }) {
  return `<section class="screen">
    ${topBar(title, demo.technician.name, { back })}
    <main class="scroll"><div class="content content--with-nav">${content}</div></main>
    ${bottomNav(active)}
  </section>`;
}
