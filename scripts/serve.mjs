import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const directory = resolve(root, process.argv[2] || 'public');
const port = Number(process.env.PORT || process.argv[3] || 4173);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

function safePath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const requested = resolve(directory, `.${decoded}`);
  if (requested !== directory && !requested.startsWith(`${directory}${sep}`)) return null;
  return requested;
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', 'http://localhost');
    let filePath = safePath(url.pathname);
    if (!filePath) {
      response.writeHead(403).end('Brak dostępu');
      return;
    }

    let info;
    try {
      info = await stat(filePath);
    } catch {
      filePath = resolve(directory, 'index.html');
      info = await stat(filePath);
    }

    if (info.isDirectory()) filePath = resolve(filePath, 'index.html');
    const finalInfo = await stat(filePath);
    const type = mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream';

    response.writeHead(200, {
      'Content-Type': type,
      'Content-Length': finalInfo.size,
      'Cache-Control': 'no-cache'
    });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    console.error(error);
    response.writeHead(500).end('Błąd serwera');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Misja: Informatyka działa pod adresem http://127.0.0.1:${port}`);
  console.log(`Serwowany katalog: ${directory}`);
});
