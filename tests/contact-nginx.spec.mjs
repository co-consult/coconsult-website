import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const nginx = readFileSync(new URL('../nginx.conf', import.meta.url), 'utf8');
const snippet = readFileSync(new URL('../deploy/nginx.contact.conf', import.meta.url), 'utf8');
const overlay = readFileSync(new URL('../compose.contact.yaml', import.meta.url), 'utf8');
const compose = readFileSync(new URL('../compose.yaml', import.meta.url), 'utf8');

assert.match(nginx, /location\s+=\s+\/api\/contact\s*\{/);
assert.match(nginx, /proxy_pass\s+http:\/\/coconsult-contact:3602;/);
assert.match(nginx, /set_real_ip_from\s+172\.19\.0\.0\/16;/);
assert.match(nginx, /real_ip_header\s+X-Real-IP;/);
assert.match(nginx, /real_ip_recursive\s+off;/);
assert.match(nginx, /proxy_set_header\s+X-Real-IP\s+\$remote_addr;/);
assert.match(nginx, /proxy_set_header\s+X-Forwarded-For\s+"";/);
assert.match(nginx, /client_max_body_size\s+20k;/);
assert.match(nginx, /proxy_connect_timeout\s+3s;/);
assert.match(nginx, /proxy_read_timeout\s+12s;/);
assert.equal(/set_real_ip_from\s+172\.16\.0\.0\/12/.test(nginx), false);
assert.equal(/set_real_ip_from\s+172\.16\./.test(nginx), false);
assert.equal(nginx.includes('proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for'), false);

assert.match(snippet, /set_real_ip_from\s+172\.19\.0\.0\/16;/);
assert.match(snippet, /proxy_pass\s+http:\/\/coconsult-contact:3602;/);
assert.equal(/set_real_ip_from\s+172\.16\.0\.0\/12/.test(snippet), false);

assert.equal(overlay.includes('CONTACT_SEND_ENABLED: "false"'), true);
assert.equal(overlay.includes('ports:'), false);
assert.equal(overlay.includes('10.230.22.10'), true);
assert.equal(overlay.includes('CONTACT_TRUST_CIDRS: 10.230.22.0/24'), true);
assert.equal(compose.includes('127.0.0.1:3601:8080'), true);
assert.equal(compose.includes('coconsult-contact'), false);

function dockerAvailable() {
  try {
    execFileSync('docker', ['info'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

if (!dockerAvailable()) {
  console.log('SKIP contact nginx integration: docker is not available');
  process.exit(0);
}

const project = 'coconsult-nginx-check';
const proxyName = 'coconsult-nginx-check-proxy';
const webName = 'coconsult-nginx-check-web';
const contactName = 'coconsult-nginx-check-contact';
const proxyDir = mkdtempSync(join(tmpdir(), 'coconsult-nginx-'));
const proxyFile = join(proxyDir, 'compose.proxy.yaml');
const overrideFile = join(proxyDir, 'override.yaml');

writeFileSync(proxyFile, [
  'services:',
  '  coconsult-web:',
  '    networks:',
  '      - proxy',
  'networks:',
  '  proxy:',
  '    external: true',
  `    name: ${proxyName}`,
  '',
].join('\n'));

writeFileSync(overrideFile, [
  'services:',
  '  coconsult-web:',
  `    container_name: ${webName}`,
  `    image: ${webName}:test`,
  '    ports:',
  '      - "127.0.0.1:3611:8080"',
  '  coconsult-contact:',
  `    container_name: ${contactName}`,
  `    image: ${contactName}:test`,
  '    env_file: !reset []',
  '',
].join('\n'));

const files = ['-f', 'compose.yaml', '-f', proxyFile, '-f', 'compose.contact.yaml', '-f', overrideFile];

function cleanup() {
  spawnSync('docker', ['compose', '-p', project, ...files, 'down', '--remove-orphans', '--rmi', 'local'], {
    stdio: 'ignore',
  });
  spawnSync('docker', ['rmi', '-f', `${webName}:test`, `${contactName}:test`], { stdio: 'ignore' });
  spawnSync('docker', ['network', 'rm', proxyName], { stdio: 'ignore' });
  rmSync(proxyDir, { recursive: true, force: true });
}

spawnSync('docker', ['compose', '-p', project, ...files, 'down', '--remove-orphans'], { stdio: 'ignore' });
spawnSync('docker', ['network', 'rm', proxyName], { stdio: 'ignore' });

let failed = 0;
try {
  execFileSync('docker', ['network', 'create', proxyName], { stdio: 'ignore' });
  execFileSync('docker', ['compose', '-p', project, ...files, 'up', '-d', '--build'], {
    stdio: 'inherit',
    env: { ...process.env, BUILDX_NO_DEFAULT_ATTESTATIONS: '1' },
  });

  const contactInfo = JSON.parse(execFileSync('docker', ['inspect', contactName], { encoding: 'utf8' }))[0];
  const webInfo = JSON.parse(execFileSync('docker', ['inspect', webName], { encoding: 'utf8' }))[0];

  assert.equal(contactInfo.HostConfig.PortBindings == null || Object.keys(contactInfo.HostConfig.PortBindings).length === 0, true);
  assert.equal((contactInfo.Config.Env || []).includes('CONTACT_SEND_ENABLED=false'), true);
  assert.equal((contactInfo.Config.Env || []).some((item) => item.startsWith('BREVO_API_KEY=')), false);

  const contactNets = Object.keys(contactInfo.NetworkSettings.Networks);
  const webNets = Object.keys(webInfo.NetworkSettings.Networks);
  assert.equal(contactNets.some((name) => name.endsWith('_coconsult-contact')), true);
  assert.equal(contactNets.some((name) => name.endsWith('_coconsult-egress')), true);
  assert.equal(contactNets.some((name) => name.includes('proxy')), false);
  assert.equal(webNets.some((name) => name.endsWith('_coconsult-contact')), true);
  assert.equal(webNets.some((name) => name === proxyName || name.includes('proxy')), true);
  assert.equal(webNets.some((name) => name.endsWith('_coconsult-egress')), false);

  const privateNet = contactNets.find((name) => name.endsWith('_coconsult-contact'));
  assert.equal(contactInfo.NetworkSettings.Networks[privateNet].IPAddress, '10.230.22.10');

  let body = '';
  let status = 0;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch('http://127.0.0.1:3611/api/contact', {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(3000),
      });
      status = response.status;
      body = await response.text();
      if (status === 200) break;
    } catch {
      // wait for health
    }
  }
  assert.equal(status, 200, body);
  const payload = JSON.parse(body);
  assert.equal(payload.ok, true);
  assert.equal(payload.available, false);
  assert.equal('token' in payload, false);

  const health = await fetch('http://127.0.0.1:3611/healthz', { signal: AbortSignal.timeout(5000) });
  assert.equal(health.status, 200);
  assert.equal((await health.text()).trim(), 'ok');

  const forged = await fetch('http://127.0.0.1:3611/api/contact', {
    headers: {
      accept: 'application/json',
      'x-forwarded-for': '198.51.100.200',
      'x-real-ip': '198.51.100.200',
    },
    signal: AbortSignal.timeout(5000),
  });
  assert.equal(forged.status, 200);
  assert.deepEqual(await forged.json(), { ok: true, available: false });

  const spoofPeer = spawnSync(
    'docker',
    [
      'run',
      '--rm',
      '--network',
      privateNet,
      '--entrypoint',
      'node',
      contactInfo.Image,
      '-e',
      `
fetch('http://10.230.22.10:3602/api/contact', {
  headers: { accept: 'application/json', 'x-real-ip': '198.51.100.44', 'x-forwarded-for': '198.51.100.44' },
  signal: AbortSignal.timeout(5000),
}).then(async (response) => {
  const data = await response.json();
  if (response.status !== 200 || data.available !== false) process.exit(2);
  console.log(JSON.stringify(data));
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
`,
    ],
    { encoding: 'utf8', timeout: 20000 },
  );
  assert.equal(spoofPeer.status, 0, `${spoofPeer.stdout}\n${spoofPeer.stderr}`);
  assert.equal(spoofPeer.stdout.includes('"available":false'), true);

  const logs = execFileSync('docker', ['logs', contactName], { encoding: 'utf8' });
  assert.equal(/api\.brevo\.com/i.test(logs), false, logs);
  assert.equal(/smtp\/email/i.test(logs), false, logs);
} catch (error) {
  failed = 1;
  throw error;
} finally {
  cleanup();
  if (failed) process.exitCode = 1;
}

console.log('Contact nginx integration checks passed');
