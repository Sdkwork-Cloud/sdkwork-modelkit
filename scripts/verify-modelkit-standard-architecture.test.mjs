import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

const required = [
  'AGENTS.md',
  'Cargo.toml',
  'package.json',
  'pnpm-workspace.yaml',
  'specs/topology.spec.json',
  'apis/app-api/modelkit/modelkit-app-api.openapi.json',
  'sdkwork-modelkit-pc-react/src/bootstrap/index.ts',
  'sdkwork-modelkit-pc-react/src/AuthGate.tsx',
  'sdkwork-modelkit-pc-react/packages/sdkwork-modelkit-pc-core/src/sdk/modelkitAppApiClient.ts',
];

for (const relativePath of required) {
  assert.ok(existsSync(resolve(root, relativePath)), `missing ${relativePath}`);
}

console.log('[sdkwork-modelkit] standard architecture files present');
