#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const env = {
  ...process.env,
  SDKWORK_MODELKIT_APPLICATION_PUBLIC_INGRESS_BIND:
    process.env.SDKWORK_MODELKIT_APPLICATION_PUBLIC_INGRESS_BIND || '127.0.0.1:3901',
  SDKWORK_MODELKIT_DATABASE_URL:
    process.env.SDKWORK_MODELKIT_DATABASE_URL || 'sqlite://./.runtime/modelkit-dev.db',
};

const child = spawn(
  'cargo',
  ['run', '-p', 'sdkwork-api-modelkit-standalone-gateway', '--bin', 'sdkwork-api-modelkit-standalone-gateway'],
  { cwd: repoRoot, env, stdio: 'inherit', shell: process.platform === 'win32' },
);

child.on('exit', (code) => process.exit(code ?? 1));
