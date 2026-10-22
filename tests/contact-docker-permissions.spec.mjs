import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const root = fileURLToPath(new URL('..', import.meta.url));
const dockerfile = readFileSync(join(root, 'contact.Dockerfile'), 'utf8');
const dockerignore = readFileSync(join(root, '.dockerignore'), 'utf8');
const composeContact = readFileSync(join(root, 'compose.contact.yaml'), 'utf8');

assert.match(dockerfile, /mkdir -p \/app\/server/);
assert.match(dockerfile, /chmod 755 \/app\/server/);
assert.match(
  dockerfile,
  /COPY\s+--chown=65534:65534\s+--chmod=644\s+server\/contact\.mjs\s+\/app\/server\/contact\.mjs/,
);
assert.match(dockerfile, /USER\s+65534:65534/);
assert.equal(composeContact.includes('user: "65534:65534"'), true);
assert.equal(composeContact.includes('ports:'), false);
assert.equal(/CONTACT_SEND_ENABLED\s*:/.test(composeContact), false);
assert.equal(composeContact.includes('10.230.22.10'), true);

const ignoreLines = new Set(
  dockerignore
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#')),
);
assert.equal(ignoreLines.has('contact.env'), true);
assert.equal(ignoreLines.has('contact.env.*'), true);
assert.equal(ignoreLines.has('.env'), true);
assert.equal(ignoreLines.has('.env.*'), true);

function dockerAvailable() {
  try {
    execFileSync('docker', ['info'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

if (!dockerAvailable()) {
  console.log('SKIP contact docker permissions: docker is not available');
  process.exit(0);
}

const image = `coconsult-contact-perms:${randomBytes(4).toString('hex')}`;
const container = `coconsult-contact-perms-${randomBytes(3).toString('hex')}`;
const marker = `DO_NOT_SHIP_${randomBytes(12).toString('hex')}`;
const secretFiles = [
  join(root, 'contact.env'),
  join(root, 'contact.env.ci'),
  join(root, 'contact.env.local'),
];
const createdSecrets = [];

function cleanup() {
  spawnSync('docker', ['rm', '-f', container], { stdio: 'ignore' });
  spawnSync('docker', ['rmi', '-f', image], { stdio: 'ignore' });
  for (const file of createdSecrets) {
    try {
      unlinkSync(file);
    } catch {
      // ignore
    }
  }
}

try {
  for (const file of secretFiles) {
    if (existsSync(file)) continue;
    writeFileSync(file, `BREVO_API_KEY=${marker}\nCONTACT_FROM=test@example.com\n`, 'utf8');
    createdSecrets.push(file);
  }

  execFileSync('docker', ['build', '-f', 'contact.Dockerfile', '-t', image, '.'], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, DOCKER_BUILDKIT: '1' },
  });

  const ownership = spawnSync(
    'docker',
    [
      'run',
      '--rm',
      '--user',
      '65534:65534',
      '--entrypoint',
      'node',
      image,
      '-e',
      `
const fs = require('fs');
const file = '/app/server/contact.mjs';
const dir = '/app/server';
fs.accessSync(dir, fs.constants.X_OK);
fs.accessSync(file, fs.constants.R_OK);
const st = fs.statSync(file);
const dirSt = fs.statSync(dir);
if ((st.mode & 0o444) !== 0o444) {
  console.error('file-mode=' + (st.mode & 0o777).toString(8));
  process.exit(2);
}
if ((dirSt.mode & 0o111) !== 0o111) {
  console.error('dir-mode=' + (dirSt.mode & 0o777).toString(8));
  process.exit(6);
}
if (st.uid !== 65534 || st.gid !== 65534) {
  console.error('owner=' + st.uid + ':' + st.gid);
  process.exit(3);
}
console.log('readable');
`,
    ],
    { encoding: 'utf8', timeout: 20000 },
  );
  assert.equal(ownership.status, 0, `${ownership.stdout}\n${ownership.stderr}`);
  assert.equal(ownership.stdout.includes('readable'), true);

  const secretScan = spawnSync(
    'docker',
    [
      'run',
      '--rm',
      '--user',
      '0:0',
      '--entrypoint',
      'node',
      image,
      '-e',
      `
const fs = require('fs');
const path = require('path');
const marker = ${JSON.stringify(marker)};
const bannedNames = new Set(['contact.env', 'contact.env.ci', 'contact.env.local', 'contact.env.example']);
function walk(dir) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'proc' || entry.name === 'sys' || entry.name === 'dev') continue;
      walk(full);
      continue;
    }
    if (!entry.isFile()) continue;
    if (bannedNames.has(entry.name)) {
      console.error('present=' + full);
      process.exit(5);
    }
    let body = '';
    try { body = fs.readFileSync(full, 'utf8'); } catch { continue; }
    if (body.includes(marker)) {
      console.error(full);
      process.exit(4);
    }
  }
}
walk('/app');
console.log('secrets-absent');
`,
    ],
    { encoding: 'utf8', timeout: 60000 },
  );
  assert.equal(secretScan.status, 0, `${secretScan.stdout}\n${secretScan.stderr}`);
  assert.equal(secretScan.stdout.includes('secrets-absent'), true);

  execFileSync(
    'docker',
    [
      'run',
      '-d',
      '--name',
      container,
      '--user',
      '65534:65534',
      '--read-only',
      '--tmpfs',
      '/tmp:rw,noexec,nosuid,size=16m',
      '-e',
      'CONTACT_BIND=127.0.0.1',
      '-e',
      'CONTACT_PORT=3602',
      '-e',
      'CONTACT_SEND_ENABLED=false',
      image,
    ],
    { stdio: 'inherit' },
  );

  let healthy = false;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const probe = spawnSync(
      'docker',
      [
        'exec',
        container,
        'node',
        '-e',
        `fetch('http://127.0.0.1:3602/healthz').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))`,
      ],
      { encoding: 'utf8', timeout: 10000 },
    );
    if (probe.status === 0) {
      healthy = true;
      break;
    }
  }
  assert.equal(healthy, true, 'contact service did not become healthy as user 65534');

  const logs = execFileSync('docker', ['logs', container], { encoding: 'utf8' });
  assert.equal(/EACCES/i.test(logs), false, logs);
} finally {
  cleanup();
}

console.log('Contact docker permissions checks passed');
