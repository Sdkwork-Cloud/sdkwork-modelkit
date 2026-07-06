#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const gateway = spawn('node', ['scripts/run-modelkit-standalone-gateway.mjs'], {
  cwd: repoRoot,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

const renderer = spawn('pnpm', ['--filter', '@sdkwork/modelkit-pc-react', 'dev'], {
  cwd: repoRoot,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

function shutdown(code = 0) {
  gateway.kill('SIGTERM');
  renderer.kill('SIGTERM');
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

gateway.on('exit', (code) => {
  if (code && code !== 0) shutdown(code);
});

renderer.on('exit', (code) => {
  if (code && code !== 0) shutdown(code);
});
