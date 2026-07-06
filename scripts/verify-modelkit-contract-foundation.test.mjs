import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const openapi = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../apis/app-api/modelkit/modelkit-app-api.openapi.json'), 'utf8'),
);

assert.equal(openapi.info.title, 'SDKWork Modelkit App API');
assert.ok(openapi.paths['/app/v3/api/modelkit/preferences/{namespace}']);
console.log('[sdkwork-modelkit] contract foundation OK');
