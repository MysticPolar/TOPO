/**
 * Phone preview (works without LAN access to :8081):
 * 1) Cloudflare quick tunnel → HTTPS URL for Vite (:3000) → EXPO_PUBLIC_PREVIEW_URL
 * 2) Expo --tunnel for Metro (uses @expo/ngrok; phone loads bundle over the internet)
 *
 * Default Expo script uses LAN (`npm run start`). Use `npm run start:tunnel` for this mode.
 *
 * Requires: Vite on :3000, cloudflared (`brew install cloudflared`), @expo/ngrok (npm dep).
 */
const { spawn } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const { resolveLanIp } = require('./resolve-lan-ip');
const { applyPackagerHost } = require('./apply-packager-host');

function resolveCloudflared() {
  const candidates = [
    '/opt/homebrew/bin/cloudflared',
    '/usr/local/bin/cloudflared',
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      /* ignore */
    }
  }
  return 'cloudflared';
}

const extra = process.argv.slice(2);
let expoChild = null;
let cfChild = null;
let expoStarted = false;
let waitTimeout = null;

function startExpoTunnel() {
  if (expoStarted) return;
  expoStarted = true;
  if (waitTimeout) {
    clearTimeout(waitTimeout);
    waitTimeout = null;
  }
  const args = ['expo', 'start', '--tunnel', '--port', '8081', ...extra];
  console.log(`[expo] npx ${args.join(' ')}`);
  console.log('[expo] Metro uses Expo tunnel (no LAN :8081 needed). Run: npm run qr');
  expoChild = spawn('npx', args, {
    stdio: 'inherit',
    env: process.env,
    shell: false,
  });
  expoChild.on('exit', (code) => {
    if (cfChild) {
      try {
        cfChild.kill('SIGTERM');
      } catch {
        /* ignore */
      }
    }
    process.exit(code ?? 0);
  });
}

function startExpoLan() {
  if (expoStarted) return;
  expoStarted = true;
  if (waitTimeout) {
    clearTimeout(waitTimeout);
    waitTimeout = null;
  }
  const ip = resolveLanIp();
  applyPackagerHost(ip);
  if (!process.env.EXPO_PUBLIC_PREVIEW_URL) {
    process.env.EXPO_PUBLIC_PREVIEW_URL = `http://${ip}:3000/`;
  }
  console.log(`[expo] Packager host: ${ip}`);
  const args = ['expo', 'start', '--lan', '--port', '8081', ...extra];
  console.log(`[expo] npx ${args.join(' ')}`);
  expoChild = spawn('npx', args, {
    stdio: 'inherit',
    env: process.env,
    shell: false,
  });
  expoChild.on('exit', (code) => {
    if (cfChild) {
      try {
        cfChild.kill('SIGTERM');
      } catch {
        /* ignore */
      }
    }
    process.exit(code ?? 0);
  });
}

function fallbackLan(reason) {
  if (expoStarted) return;
  console.warn(`[expo] ${reason}`);
  console.warn('[expo] Falling back to LAN Metro (same Wi‑Fi + firewall allows 8081).');
  startExpoLan();
}

function shutdown() {
  try {
    if (cfChild) cfChild.kill('SIGTERM');
  } catch {
    /* ignore */
  }
  try {
    if (expoChild) expoChild.kill('SIGTERM');
  } catch {
    /* ignore */
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

const cfBin = resolveCloudflared();
cfChild = spawn(cfBin, ['tunnel', '--url', 'http://127.0.0.1:3000'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

cfChild.on('error', (err) => {
  fallbackLan(`cloudflared failed (${err.message}). Install: brew install cloudflared`);
});

let previewUrl = null;

function onCfLine(line, isErr) {
  if (isErr) {
    process.stderr.write(line + '\n');
  } else {
    process.stdout.write(line + '\n');
  }
  const m = line.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
  if (m && !previewUrl) {
    previewUrl = m[0] + '/';
    process.env.EXPO_PUBLIC_PREVIEW_URL = previewUrl;
    console.log(`[expo] EXPO_PUBLIC_PREVIEW_URL=${previewUrl}`);
    startExpoTunnel();
  }
}

readline.createInterface({ input: cfChild.stdout }).on('line', (line) => onCfLine(line, false));
readline.createInterface({ input: cfChild.stderr }).on('line', (line) => onCfLine(line, true));

cfChild.on('exit', (code) => {
  if (!previewUrl && !expoStarted) {
    fallbackLan(`cloudflared exited (${code}). Is Vite on :3000?`);
  }
});

waitTimeout = setTimeout(() => {
  if (!previewUrl && !expoStarted) {
    try {
      cfChild.kill('SIGTERM');
    } catch {
      /* ignore */
    }
    fallbackLan('Timed out waiting for Cloudflare tunnel URL.');
  }
}, 90000);
