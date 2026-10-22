import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const project = 'coconsult-egress-check';
const proxyName = 'coconsult-egress-check-proxy';
const container = 'coconsult-egress-check';
const subnet = '10.230.22.0/24';
const bind = '10.230.22.10';

function dockerAvailable() {
  try {
    execFileSync('docker', ['info'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

if (!dockerAvailable()) {
  console.log('SKIP contact egress: docker is not available. Outbound Brevo connectivity is not claimed as passed.');
  process.exit(0);
}

function ipv4ToInt(ip) {
  return ip.split('.').reduce((acc, part) => ((acc << 8) + Number(part)) >>> 0, 0);
}

function cidrOverlaps(left, right) {
  const [leftNet, leftBits] = left.split('/');
  const [rightNet, rightBits] = right.split('/');
  const bits = Math.min(Number(leftBits), Number(rightBits));
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (ipv4ToInt(leftNet) & mask) === (ipv4ToInt(rightNet) & mask);
}

const overlay = readFileSync(new URL('../compose.contact.yaml', import.meta.url), 'utf8');
assert.equal(overlay.includes('172.30.22.0/24'), false);
assert.equal(overlay.includes(`subnet: ${subnet}`), true);
assert.equal(overlay.includes('internal: true'), true);
assert.equal(overlay.includes('ports:'), false);

const networkIds = execFileSync('docker', ['network', 'ls', '-q'], { encoding: 'utf8' }).trim().split(/\s+/).filter(Boolean);
for (const id of networkIds) {
  const described = execFileSync('docker', ['network', 'inspect', id, '--format', '{{.Name}}|{{range .IPAM.Config}}{{.Subnet}} {{end}}'], { encoding: 'utf8' }).trim();
  const [name, subnets = ''] = described.split('|');
  if (name.startsWith(`${project}_`)) continue;
  for (const existing of subnets.split(/\s+/).filter((value) => value.includes('.'))) {
    assert.equal(cidrOverlaps(subnet, existing), false, `${subnet} overlaps ${name} ${existing}`);
  }
}

const proxyDir = mkdtempSync(join(tmpdir(), 'coconsult-egress-'));
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
  '  coconsult-contact:',
  `    container_name: ${container}`,
  '    env_file: !reset []',
  '',
].join('\n'));
const files = ['-f', 'compose.yaml', '-f', proxyFile, '-f', 'compose.contact.yaml', '-f', overrideFile];

function cleanup() {
  spawnSync('docker', ['compose', '-p', project, ...files, 'down', '--remove-orphans'], { stdio: 'ignore' });
  spawnSync('docker', ['network', 'rm', proxyName], { stdio: 'ignore' });
  rmSync(proxyDir, { recursive: true, force: true });
}

const reached = `
(async () => {
  const response = await fetch('https://api.brevo.com/v3/account', {
    method: 'GET',
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(20000),
  });
  const body = await response.text();
  const local = await fetch('http://127.0.0.1:3602/healthz', { signal: AbortSignal.timeout(2000) }).then(() => 'open').catch(() => 'closed');
  const priv = await fetch('http://${bind}:3602/healthz', { signal: AbortSignal.timeout(2000) }).then((item) => String(item.status)).catch(() => 'closed');
  if (response.status !== 401) {
    console.error('status=' + response.status);
    process.exit(2);
  }
  if (body.includes('messageId')) process.exit(3);
  if (local !== 'closed' || priv !== '200') {
    console.error('bind local=' + local + ' private=' + priv);
    process.exit(5);
  }
  console.log('brevo-unauthorized');
})().catch((error) => {
  console.error(error && error.message ? error.message : error);
  process.exit(1);
});
`;

const blocked = `
fetch('https://api.brevo.com/v3/account', { method: 'GET', signal: AbortSignal.timeout(8000) })
  .then(() => process.exit(0))
  .catch(() => process.exit(7));
`;

const health = `
fetch('http://${bind}:3602/healthz', { signal: AbortSignal.timeout(8000) })
  .then((response) => process.exit(response.ok ? 0 : 1))
  .catch(() => process.exit(1));
`;

spawnSync('docker', ['compose', '-p', project, ...files, 'down', '--remove-orphans'], { stdio: 'ignore' });
spawnSync('docker', ['network', 'rm', proxyName], { stdio: 'ignore' });
let failed = 0;
try {
  execFileSync('docker', ['network', 'create', proxyName], { stdio: 'ignore' });
  execFileSync('docker', ['compose', '-p', project, ...files, 'up', '-d', '--build', '--no-deps', 'coconsult-contact'], { stdio: 'inherit' });
  const listed = JSON.parse(execFileSync('docker', ['inspect', container], { encoding: 'utf8' }));
  const settings = listed[0];
  const bindings = settings.HostConfig.PortBindings;
  assert.equal(bindings == null || Object.keys(bindings).length === 0, true);
  const published = settings.NetworkSettings.Ports || {};
  assert.equal(Object.values(published).every((value) => value == null), true);
  assert.equal((settings.Config.Env || []).some((item) => item === 'CONTACT_SEND_ENABLED=true'), false);
  assert.equal((settings.Config.Env || []).some((item) => item.startsWith('BREVO_API_KEY=')), false);
  const attached = settings.NetworkSettings.Networks;
  const names = Object.keys(attached);
  assert.equal(names.some((name) => name.endsWith('_coconsult-contact')), true);
  assert.equal(names.some((name) => name.endsWith('_coconsult-egress')), true);
  assert.equal(names.some((name) => name.includes('proxy')), false);
  const privateNet = names.find((name) => name.endsWith('_coconsult-contact'));
  const egressNet = names.find((name) => name.endsWith('_coconsult-egress'));
  assert.equal(attached[privateNet].IPAddress, bind);
  const privateInfo = JSON.parse(execFileSync('docker', ['network', 'inspect', privateNet], { encoding: 'utf8' }));
  const egressInfo = JSON.parse(execFileSync('docker', ['network', 'inspect', egressNet], { encoding: 'utf8' }));
  assert.equal(privateInfo[0].Internal, true);
  assert.equal(egressInfo[0].Internal, false);
  assert.equal(egressInfo[0].Options['com.docker.network.bridge.enable_icc'], 'false');
  const image = settings.Image;
  const fromContact = spawnSync('docker', ['compose', '-p', project, ...files, 'exec', '-T', 'coconsult-contact', 'node', '-e', reached], { encoding: 'utf8', timeout: 40000 });
  assert.equal(fromContact.status, 0, `${fromContact.stdout}\n${fromContact.stderr}`);
  assert.equal(fromContact.stdout.includes('brevo-unauthorized'), true);
  const fromPrivate = spawnSync('docker', ['run', '--rm', '--network', privateNet, '--entrypoint', 'node', image, '-e', blocked], { encoding: 'utf8', timeout: 20000 });
  assert.equal(fromPrivate.status, 7, `${fromPrivate.stdout}\n${fromPrivate.stderr}`);
  let healthy = 1;
  for (let attempt = 0; attempt < 10 && healthy !== 0; attempt += 1) {
    const probe = spawnSync('docker', ['run', '--rm', '--network', privateNet, '--entrypoint', 'node', image, '-e', health], { encoding: 'utf8', timeout: 15000 });
    healthy = probe.status;
  }
  assert.equal(healthy, 0);
  const egressIp = attached[egressNet].IPAddress;
  const closed = `
fetch('http://${egressIp}:3602/healthz', { signal: AbortSignal.timeout(5000) })
  .then(() => process.exit(0))
  .catch(() => process.exit(4));
`;
  const fromEgress = spawnSync('docker', ['run', '--rm', '--network', egressNet, '--entrypoint', 'node', image, '-e', closed], { encoding: 'utf8', timeout: 15000 });
  assert.equal(fromEgress.status, 4, `${fromEgress.stdout}\n${fromEgress.stderr}`);
} catch (error) {
  failed = 1;
  throw error;
} finally {
  cleanup();
  if (failed) process.exitCode = 1;
}

console.log('Contact egress checks passed');
