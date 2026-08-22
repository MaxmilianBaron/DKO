import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { createServer } from 'node:http';

const root = resolve(decodeURIComponent(new URL('..', import.meta.url).pathname).replace(/^\/(.:)/, '$1'));
const port = Number(process.argv[2] || 4174);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
};

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
  const relative = normalize(pathname === '/' ? 'index.html' : pathname.slice(1));
  const file = resolve(join(root, relative));
  if (file !== root && !file.startsWith(`${root}\\`) && !file.startsWith(`${root}/`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  try {
    if (!statSync(file).isFile()) throw new Error('Not a file');
    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`DKO demo: http://127.0.0.1:${port}/`);
});
