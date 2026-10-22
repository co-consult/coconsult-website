import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const astro = path.join(root, 'node_modules', 'astro', 'bin', 'astro.mjs');
const output = path.join(root, 'dist-guide');
const env = {
  ...process.env,
  PUBLIC_ASSISTANT: 'true',
  GUIDE_PREVIEW_DIR: 'dist-guide',
  ASTRO_TELEMETRY_DISABLED: '1',
};

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function launch(args) {
  return spawn(process.execPath, [astro, ...args], { cwd: root, env, stdio: 'inherit' });
}

function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const relative = path.normalize(decoded).replace(/^([/\\])+/, '');
  const target = path.resolve(output, relative);
  if (target !== output && !target.startsWith(`${output}${path.sep}`)) return '';
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) return path.join(target, 'index.html');
  if (fs.existsSync(target) && fs.statSync(target).isFile()) return target;
  const indexed = path.join(target, 'index.html');
  if (fs.existsSync(indexed)) return indexed;
  return '';
}

function serve() {
  const server = http.createServer((request, response) => {
    const file = resolveFile(request.url || '/');
    if (!file) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }
    response.writeHead(200, {
      'content-type': types[path.extname(file)] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    fs.createReadStream(file).pipe(response);
  });
  server.listen(4322, '127.0.0.1');
  const stop = () => server.close(() => process.exit(0));
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
}

const build = launch(['build']);
build.on('exit', (code) => {
  if (code !== 0) {
    process.exit(code ?? 1);
    return;
  }
  serve();
});
