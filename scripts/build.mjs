import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'public');
const output = resolve(root, 'dist');
const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

const serviceWorkerPath = resolve(output, 'service-worker.js');
const serviceWorker = await readFile(serviceWorkerPath, 'utf8');
await writeFile(serviceWorkerPath, serviceWorker.replaceAll('__APP_VERSION__', pkg.version), 'utf8');
await writeFile(resolve(output, '.nojekyll'), '', 'utf8');

console.log(`Zbudowano wersję ${pkg.version} w katalogu dist.`);
