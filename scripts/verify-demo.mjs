import { spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const edgePath = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const url = process.env.DEMO_URL || 'http://127.0.0.1:4174/';
const port = Number(process.env.CDP_PORT || (9344 + Math.floor(Math.random() * 300)));
const profile = join(process.env.TEMP || '.', `dko-demo-verify-${Date.now()}`);

class Cdp {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    socket.onmessage = event => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const pending = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    };
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
}

async function getJson(path) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}${path}`);
      if (response.ok) return response.json();
    } catch {}
    await delay(100);
  }
  throw new Error(`CDP endpoint ${path} is unavailable.`);
}

async function evaluate(cdp, expression) {
  const response = await cdp.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || 'Browser evaluation failed.');
  return response.result?.value;
}

async function waitFor(cdp, expression, label) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    try {
      if (await evaluate(cdp, `Boolean(${expression})`)) return;
    } catch {}
    await delay(100);
  }
  const detail = await evaluate(cdp, `({url:location.href,text:document.body?.innerText?.slice(0,500),html:document.querySelector('#app')?.innerHTML?.slice(0,300)})`).catch(error => ({ error: error.message }));
  throw new Error(`Timed out waiting for ${label}. State: ${JSON.stringify(detail)}`);
}

async function click(cdp, selector) {
  const clicked = await evaluate(cdp, `(() => { const node=document.querySelector(${JSON.stringify(selector)}); if(!node)return false; node.click(); return true; })()`);
  if (!clicked) throw new Error(`Missing clickable element: ${selector}`);
  await delay(90);
}

async function draw(cdp, selector) {
  const rect = await evaluate(cdp, `(() => { const r=document.querySelector(${JSON.stringify(selector)})?.getBoundingClientRect(); return r && ({x:r.left,y:r.top,w:r.width,h:r.height}); })()`);
  if (!rect) throw new Error(`Missing canvas: ${selector}`);
  const points = [[.26,.38],[.38,.48],[.52,.34],[.65,.57]];
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: rect.x + rect.w*points[0][0], y: rect.y + rect.h*points[0][1], button: 'left', clickCount: 1 });
  for (const [x,y] of points.slice(1)) await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: rect.x + rect.w*x, y: rect.y + rect.h*y, button: 'left' });
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: rect.x + rect.w*points.at(-1)[0], y: rect.y + rect.h*points.at(-1)[1], button: 'left', clickCount: 1 });
  await delay(80);
}

async function main() {
  const browser = spawn(edgePath, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--window-size=1440,1000', 'about:blank',
  ], { stdio: 'ignore', windowsHide: true });
  let socket;

  try {
    const pages = await getJson('/json/list');
    const target = pages.find(page => page.type === 'page' && page.webSocketDebuggerUrl);
    if (!target) throw new Error('No browser page target found.');
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
    const cdp = new Cdp(socket);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await cdp.send('Page.navigate', { url });
    await waitFor(cdp, `document.querySelector('[data-action="login-technician"]')`, 'login screen');

    await click(cdp, '[data-action="login-technician"]');
    await waitFor(cdp, `document.querySelector('#demo-login-password')?.value === 'demo'`, 'technician password dialog');
    await click(cdp, '[data-action="confirm-login"]');
    await waitFor(cdp, `document.body.innerText.toLowerCase().includes('rozpracovaná kontrola')`, 'technician work screen');
    await click(cdp, '[data-route="inspection"]');
    await waitFor(cdp, `document.body.innerText.includes('Vyberte sekci')`, 'inspection overview');
    const coverage = await evaluate(cdp, `(() => ({
      items: allItems.length,
      photos: state.photos.length,
      itemKeys: new Set(allItems.map(item => item.key)).size,
      photoKeys: new Set(state.photos.map(photo => photo.itemKey)).size,
      sources: new Set(state.photos.map(photo => photo.src)).size,
      uncovered: allItems.filter(item => !state.photos.some(photo => photo.itemKey === item.key)).map(item => item.key),
    }))()`);
    if (coverage.items !== 48 || coverage.photos !== 48 || coverage.itemKeys !== 48 || coverage.photoKeys !== 48 || coverage.sources !== 48 || coverage.uncovered.length) {
      throw new Error(`Expected exact 48-item real-photo coverage: ${JSON.stringify(coverage)}`);
    }
    const visibleItemPhotos = await evaluate(cdp, `(() => {
      const rows=[];
      for(const section of sections){
        state.currentSection=section.key;
        state.route='section';
        render();
        for(const card of document.querySelectorAll('[data-item-key]')){
          const photo=card.querySelector('[data-item-photo-key]');
          const image=photo?.querySelector('img');
          rows.push({
            itemKey:card.dataset.itemKey,
            photoKey:photo?.dataset.itemPhotoKey || null,
            photoId:photo?.dataset.photoId || null,
            src:image?.getAttribute('src') || null,
            missing:Boolean(card.querySelector('[data-missing-photo-key]')),
          });
        }
      }
      state.route='inspection';
      render();
      return rows;
    })()`);
    const visibleItemPhotoSummary = {
      rows: visibleItemPhotos.length,
      itemKeys: new Set(visibleItemPhotos.map(row => row.itemKey)).size,
      photoKeys: new Set(visibleItemPhotos.map(row => row.photoKey)).size,
      photoIds: new Set(visibleItemPhotos.map(row => row.photoId)).size,
      sources: new Set(visibleItemPhotos.map(row => row.src)).size,
      invalid: visibleItemPhotos.filter(row => row.missing || !row.src || row.itemKey !== row.photoKey || !/^F\d{3}$/.test(row.photoId || '')),
    };
    if (visibleItemPhotoSummary.rows !== 48 || visibleItemPhotoSummary.itemKeys !== 48 || visibleItemPhotoSummary.photoKeys !== 48 || visibleItemPhotoSummary.photoIds !== 48 || visibleItemPhotoSummary.sources !== 48 || visibleItemPhotoSummary.invalid.length) {
      throw new Error(`Every item card must visibly contain its own F001-F048 photo: ${JSON.stringify(visibleItemPhotoSummary)}`);
    }
    await click(cdp, '[data-section="outside_inspection"]');
    await waitFor(cdp, `document.body.innerText.includes('Vchodové dveře')`, 'inspection items');
    await click(cdp, '[data-photo-for="exterior.entrance_doors"]');
    await waitFor(cdp, `document.body.innerText.includes('Pořízení fotografie')`, 'photo capture');
    await click(cdp, '[data-action="choose-photo"]');
    await waitFor(cdp, `document.querySelectorAll('[data-library-photo]').length === 48`, '48-photo library');
    const libraryIssues = await evaluate(cdp, `(async () => {
      const sources=Array.from(document.querySelectorAll('.gallery img'),image=>image.src);
      const results=await Promise.all(sources.map(async source=>{
        let lastError;
        for(let attempt=0;attempt<3;attempt+=1){
          try{
            const response=await fetch(source,{cache:'reload'});
            const type=response.headers.get('content-type')||'';
            if(!response.ok||!type.startsWith('image/'))throw new Error('HTTP '+response.status+' '+type);
            return null;
          }catch(error){lastError=error;await new Promise(resolve=>setTimeout(resolve,250));}
        }
        return {source,error:String(lastError)};
      }));
      return results.filter(Boolean);
    })()`);
    if (libraryIssues.length) throw new Error(`Broken real-photo library assets: ${JSON.stringify(libraryIssues)}`);
    await click(cdp, '[data-library-photo="13"]');
    await click(cdp, '[data-action="use-photo"]');
    await waitFor(cdp, `document.querySelector('#markup-canvas')`, 'markup editor');
    await draw(cdp, '#markup-canvas');
    const strokeCount = await evaluate(cdp, `document.querySelector('[data-stroke-count]').textContent`);
    if (strokeCount !== '1/30') throw new Error(`Expected one photo stroke, received ${strokeCount}.`);
    await evaluate(cdp, `document.querySelector('[data-pending-field="location"]').value='Hlavní vstup'; document.querySelector('[data-pending-field="location"]').dispatchEvent(new Event('input',{bubbles:true}));`);
    await click(cdp, '[data-action="save-photo"]');
    await delay(500);
    const photoSaveState = await evaluate(cdp, `({route:state.route,hasPending:Boolean(state.pendingPhoto),photos:state.photos.length})`);
    if (photoSaveState.route !== 'section') throw new Error(`Photo save did not navigate: ${JSON.stringify(photoSaveState)}`);
    await waitFor(cdp, `document.querySelector('[data-edit-photo="F049"]')`, 'saved additional photo in inspection');
    await click(cdp, '[data-route="inspection"]');
    await click(cdp, '[data-action="finish-check"]');
    await waitFor(cdp, `document.body.innerText.includes('položek není hotových')`, 'incomplete warning');
    await click(cdp, '[data-action="go-signature"]');
    await waitFor(cdp, `document.querySelector('#signature-canvas')`, 'signature canvas');
    await draw(cdp, '#signature-canvas');
    await click(cdp, '[data-action="finalize"]');
    await waitFor(cdp, `document.body.innerText.includes('Kompletní PDF')`, 'history documents');
    await click(cdp, '[data-pdf-document="protocol"]');
    await waitFor(cdp, `document.querySelector('[data-protocol-page="1"]')`, 'protocol PDF page one');
    const protocolPageOne = await evaluate(cdp, `Array.from(document.querySelectorAll('[data-pdf-row-key]'), row => row.dataset.pdfRowKey)`);
    if (protocolPageOne.length !== 28) throw new Error(`Protocol page one must contain 28 active items, received ${protocolPageOne.length}.`);
    await click(cdp, '[data-action="pdf-next"]');
    await waitFor(cdp, `document.querySelector('[data-protocol-page="2"]')`, 'protocol PDF page two');
    const protocolDesktopFrame = await evaluate(cdp, `({mobileMode:document.documentElement.classList.contains('mobile-mode'),sidebar:getComputedStyle(document.querySelector('.demo-sidebar')).display,viewport:innerWidth})`);
    if (protocolDesktopFrame.mobileMode || protocolDesktopFrame.sidebar === 'none') throw new Error(`Desktop frame disappeared on PDF page two: ${JSON.stringify(protocolDesktopFrame)}`);
    const protocolPageTwo = await evaluate(cdp, `Array.from(document.querySelectorAll('[data-pdf-row-key]'), row => row.dataset.pdfRowKey)`);
    const protocolKeys = new Set([...protocolPageOne, ...protocolPageTwo]);
    if (protocolPageTwo.length !== 20 || protocolKeys.size !== 48) {
      throw new Error(`Protocol must cover all 48 active items across 28+20 rows: ${JSON.stringify({pageOne:protocolPageOne.length,pageTwo:protocolPageTwo.length,unique:protocolKeys.size})}`);
    }
    await click(cdp, '[data-route="history"]');
    await click(cdp, '[data-pdf-document="photos"]');
    await waitFor(cdp, `document.querySelector('[data-photo-sheet="1"]')`, 'photo PDF first sheet');
    const photoDocument = await evaluate(cdp, `({pageCount:currentPdfPageCount(),expected:Math.ceil(state.photos.length/4),cards:document.querySelectorAll('.photo-sheet figure').length})`);
    if (photoDocument.pageCount !== photoDocument.expected || photoDocument.cards !== 4) throw new Error(`Photo PDF does not use four A6 cards per A4: ${JSON.stringify(photoDocument)}`);
    await evaluate(cdp, `state.pdfPage=currentPdfPageCount()-1;render()`);
    await waitFor(cdp, `document.querySelector('[data-photo-sheet="' + currentPdfPageCount() + '"]')`, 'photo PDF final sheet');
    const lastSheet = await evaluate(cdp, `({cards:document.querySelectorAll('.photo-sheet figure').length,expected:state.photos.length%4||4})`);
    if (lastSheet.cards !== lastSheet.expected) throw new Error(`Unexpected final photo sheet card count: ${JSON.stringify(lastSheet)}.`);
    await click(cdp, '[data-route="history"]');
    await click(cdp, '[data-pdf-document="complete"]');
    const completeDocument = await evaluate(cdp, `({pageCount:currentPdfPageCount(),expected:2+Math.ceil(state.photos.length/4),document:state.pdfDocument})`);
    if (completeDocument.document !== 'complete' || completeDocument.pageCount !== completeDocument.expected) throw new Error(`Complete PDF page count mismatch: ${JSON.stringify(completeDocument)}`);
    await click(cdp, '[data-jump="admin"]');
    await waitFor(cdp, `document.body.innerText.includes('Kontrola dat')`, 'admin menu');
    await click(cdp, '[data-admin="integrity"]');
    await click(cdp, '[data-action="integrity-run"]');
    await waitFor(cdp, `document.body.innerText.includes('Data jsou v pořádku')`, 'integrity result');

    const issues = await evaluate(cdp, `(() => {
      const issues=[];
      if(document.documentElement.scrollWidth>document.documentElement.clientWidth+1)issues.push('page-horizontal-overflow');
      for(const image of document.images){if(image.complete && image.naturalWidth===0)issues.push('broken-image:'+image.src);}
      return issues;
    })()`);
    if (issues.length) throw new Error(`Visual smoke issues: ${issues.join(', ')}`);

    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await cdp.send('Page.navigate', { url });
    await waitFor(cdp, `document.querySelector('[data-action="login-technician"]')`, 'mobile login screen');
    const mobileLayout = await evaluate(cdp, `(() => {
      const phone=document.querySelector('.phone')?.getBoundingClientRect();
      const sidebar=getComputedStyle(document.querySelector('.demo-sidebar')).display;
      return {phone:{x:phone?.x,y:phone?.y,width:phone?.width,height:phone?.height},sidebar,viewport:{width:innerWidth,height:innerHeight},overflow:document.documentElement.scrollWidth>innerWidth+1};
    })()`);
    if (mobileLayout.sidebar !== 'none' || mobileLayout.overflow || mobileLayout.phone.x !== 0 || mobileLayout.phone.y !== 0 || mobileLayout.phone.width !== 390 || mobileLayout.phone.height !== 844) {
      throw new Error(`Mobile layout is not edge-to-edge: ${JSON.stringify(mobileLayout)}`);
    }

    await cdp.send('Emulation.clearDeviceMetricsOverride');
    await cdp.send('Page.navigate', { url: `${url}${url.includes('?') ? '&' : '?'}mobile=1` });
    await waitFor(cdp, `document.documentElement.classList.contains('mobile-mode')`, 'explicit mobile mode');
    const explicitMode = await evaluate(cdp, `({sidebar:getComputedStyle(document.querySelector('.demo-sidebar')).display,phoneWidth:document.querySelector('.phone').getBoundingClientRect().width,viewportWidth:innerWidth})`);
    if (explicitMode.sidebar !== 'none' || explicitMode.phoneWidth !== explicitMode.viewportWidth) throw new Error(`Explicit mobile mode failed: ${JSON.stringify(explicitMode)}`);
    const serviceWorkerState = await evaluate(cdp, `(async () => {
      if (!('serviceWorker' in navigator)) return 'unsupported';
      try {
        const registration = await navigator.serviceWorker.register('./sw.js');
        const result = await Promise.race([navigator.serviceWorker.ready, new Promise(resolve => setTimeout(() => resolve(null), 5000))]);
        return result?.active?.state || registration.installing?.state || registration.waiting?.state || registration.active?.state || 'not-ready';
      } catch (error) {
        return 'error:' + error.message;
      }
    })()`);
    if (serviceWorkerState !== 'activated') throw new Error(`PWA service worker failed: ${serviceWorkerState}`);
    socket.close();
    console.log('DKO demo verification passed: technician flow, photo markup, signature, complete 48-item PDF, photo sheets, Admin, assets and edge-to-edge mobile mode.');
  } finally {
    socket?.close();
    browser.kill();
    await delay(350);
    await rm(profile, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
