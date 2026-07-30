#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const env = {
  ...process.env,
  SDKWORK_MODELKIT_APPLICATION_PUBLIC_INGRESS_BIND:
    process.env.SDKWORK_MODELKIT_APPLICATION_PUBLIC_INGRESS_BIND || '127.0.0.1:3901',
  SDKWORK_DATABASE_URL:
    process.env.SDKWORK_DATABASE_URL
    || 'postgresql://sdkwork_ai_dev:sdkworkdev123@127.0.0.1:5432/sdkwork_ai_dev',
  SDKWORK_DATABASE_SCHEMA: process.env.SDKWORK_DATABASE_SCHEMA || 'sdkwork_ai_dev',
};

const child = spawn(
  'cargo',
  ['run', '-p', 'sdkwork-api-modelkit-standalone-gateway', '--bin', 'sdkwork-api-modelkit-standalone-gateway'],
  { cwd: repoRoot, env, stdio: 'inherit', shell: process.platform === 'win32' },
);

child.on('exit', (code) => process.exit(code ?? 1));
