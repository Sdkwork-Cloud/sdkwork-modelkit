#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const openapiPath = 'apis/app-api/modelkit/modelkit-app-api.openapi.json';
const assemblyPath = 'sdks/sdkwork-modelkit-app-sdk/.sdkwork-assembly.json';

const args = new Set(process.argv.slice(2));
const check = args.has('--check');

function validateOpenApiAuthority() {
  const fullPath = resolve(repoRoot, openapiPath);
  if (!existsSync(fullPath)) {
    throw new Error(`Missing OpenAPI authority: ${openapiPath}`);
  }
  const doc = JSON.parse(readFileSync(fullPath, 'utf8'));
  if (!doc.openapi || !doc.paths || !doc.info?.title) {
    throw new Error('Invalid OpenAPI authority');
  }
  console.log(`[sdkwork-modelkit] OK: ${doc.info.title} v${doc.info.version}`);
}

function validateAssembly() {
  const fullPath = resolve(repoRoot, assemblyPath);
  if (!existsSync(fullPath)) {
    throw new Error(`Missing SDK assembly: ${assemblyPath}`);
  }
  const assembly = JSON.parse(readFileSync(fullPath, 'utf8'));
  if (assembly.sdkOwner !== 'sdkwork-modelkit' || assembly.workspace !== 'sdkwork-modelkit-app-sdk') {
    throw new Error('Invalid sdkwork-modelkit-app-sdk assembly metadata');
  }
  console.log('[sdkwork-modelkit] OK: sdkwork-modelkit-app-sdk assembly');
}

async function main() {
  validateOpenApiAuthority();
  validateAssembly();
  if (!check) {
    const { generateModelkitAppSdk } = await import('../scripts/generate-modelkit-app-sdk.mjs');
    generateModelkitAppSdk();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
