import { execSync } from 'node:child_process';

function dockerAvailable() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

if (!dockerAvailable()) {
  console.log('SKIP docker: the daemon is not available on this machine. Container checks are not claimed as passed.');
  process.exit(0);
}

console.log('Docker is available. Run the commands in .github/workflows/validate.yml locally if you want the container proof.');
