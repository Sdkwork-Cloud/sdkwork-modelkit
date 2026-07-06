import { configureModelkitAppApiClient } from '@sdkwork/modelkit-pc-core/sdk';
import { readBrowserRuntimeEnv } from './environment';

export function bootstrapRuntimeClients(): void {
  const env = readBrowserRuntimeEnv();
  configureModelkitAppApiClient({
    baseUrl: env.applicationPublicHttpUrl,
  });
}
