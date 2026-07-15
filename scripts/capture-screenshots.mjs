import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'docs', 'screenshots');
const edgePath = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const url = process.env.DEMO_URL || 'http://127.0.0.1:4174/';
const port = Number(process.env.CDP_PORT || (9700 + Math.floor(Math.random() * 200)));
const profile = join(process.env.TEMP || root, `dko-demo-capture-${Date.now()}`);

class Cdp {
  constructor(socket) {
    this.socket=socket; this.nextId=1; this.pending=new Map();
    socket.onmessage=event=>{const message=JSON.parse(event.data);if(!message.id||!this.pending.has(message.id))return;const pending=this.pending.get(message.id);this.pending.delete(message.id);message.error?pending.reject(new Error(message.error.message)):pending.resolve(message.result);};
  }
  send(method,params={}){const id=this.nextId++;this.socket.send(JSON.stringify({id,method,params}));return new Promise((resolvePromise,reject)=>this.pending.set(id,{resolve:resolvePromise,reject}));}
}

async function getJson(path){for(let i=0;i<50;i+=1){try{const response=await fetch(`http://127.0.0.1:${port}${path}`);if(response.ok)return response.json();}catch{}await delay(100);}throw new Error('CDP unavailable');}
async function evaluate(cdp,expression){const response=await cdp.send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});return response.result?.value;}
async function click(cdp,selector){const ok=await evaluate(cdp,`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)return false;e.click();return true})()`);if(!ok)throw new Error(`Missing ${selector}`);await delay(220);}
async function draw(cdp,selector){const r=await evaluate(cdp,`(()=>{const r=document.querySelector(${JSON.stringify(selector)})?.getBoundingClientRect();return r&&({x:r.left,y:r.top,w:r.width,h:r.height})})()`);if(!r)return;const points=[[.43,.27],[.58,.41],[.69,.29],[.72,.53]];await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:r.x+r.w*points[0][0],y:r.y+r.h*points[0][1],button:'left',clickCount:1});for(const [x,y] of points.slice(1))await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:r.x+r.w*x,y:r.y+r.h*y,button:'left'});await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:r.x+r.w*points.at(-1)[0],y:r.y+r.h*points.at(-1)[1],button:'left',clickCount:1});await delay(120);}
async function waitForImages(cdp){await evaluate(cdp,`Promise.all(Array.from(document.images,async image=>{if(!image.complete)await new Promise(resolve=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',resolve,{once:true});});if(image.decode)await image.decode().catch(()=>{});return image.naturalWidth;}))`);await delay(500);}
async function capture(cdp,name){await evaluate(cdp,'window.scrollTo(0,0)');const shot=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});await writeFile(join(output,`${name}.png`),Buffer.from(shot.data,'base64'));}

async function main(){
  await mkdir(output,{recursive:true});
  const browser=spawn(edgePath,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'--window-size=1440,1000','about:blank'],{stdio:'ignore',windowsHide:true});
  try{
    const pages=await getJson('/json/list');const target=pages.find(page=>page.type==='page'&&page.webSocketDebuggerUrl);const socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolvePromise,reject)=>{socket.onopen=resolvePromise;socket.onerror=reject;});const cdp=new Cdp(socket);
    await cdp.send('Page.enable');await cdp.send('Runtime.enable');await cdp.send('Page.navigate',{url});await delay(700);
    await capture(cdp,'01-login');
    await click(cdp,'[data-jump="work"]');await capture(cdp,'02-technician-work');
    await click(cdp,'[data-jump="inspection"]');await capture(cdp,'03-inspection-sections');
    await click(cdp,'[data-section="outside_information"]');await waitForImages(cdp);await capture(cdp,'03b-item-photo-coverage');
    await click(cdp,'[data-jump="photo"]');await draw(cdp,'#markup-canvas');await capture(cdp,'04-photo-markup');
    await click(cdp,'[data-jump="history"]');await capture(cdp,'05-history');
    await click(cdp,'[data-pdf-document="protocol"]');await delay(500);await capture(cdp,'06-pdf-preview');
    await click(cdp,'[data-action="pdf-next"]');await delay(500);await capture(cdp,'06b-pdf-preview-page-2');
    await click(cdp,'[data-route="history"]');await click(cdp,'[data-pdf-document="photos"]');await delay(900);await capture(cdp,'06c-photo-sheet-preview');
    await click(cdp,'[data-jump="admin"]');await capture(cdp,'07-admin');
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    await cdp.send('Page.navigate',{url});await delay(500);await capture(cdp,'08-mobile-login-1to1');
    await click(cdp,'[data-jump="photo"]');await click(cdp,'[data-route="photo-capture"]');await click(cdp,'[data-action="choose-photo"]');await delay(500);await capture(cdp,'10-mobile-real-photo-library');
    await click(cdp,'[data-library-photo="0"]');await click(cdp,'[data-action="use-photo"]');await draw(cdp,'#markup-canvas');await capture(cdp,'09-mobile-photo-markup');
    socket.close();console.log(`Captured DKO demo screenshots to ${output}`);
  }finally{browser.kill();await delay(300);await rm(profile,{recursive:true,force:true}).catch(()=>{});}
}

main().catch(error=>{console.error(error);process.exitCode=1;});
