import { bootstrapIamRuntime } from './iamRuntime';
import { bootstrapRuntimeClients } from './runtime';

export function bootstrapApplication(): void {
  bootstrapIamRuntime();
  bootstrapRuntimeClients();
}

export { bootstrapIamRuntime } from './iamRuntime';
export { bootstrapRuntimeClients } from './runtime';
export { readBrowserRuntimeEnv } from './environment';
