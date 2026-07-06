import { getModelkitIamBundle } from '@sdkwork/modelkit-pc-core/sdk';
import { configureModelkitAppApiClient } from '@sdkwork/modelkit-pc-core/sdk';
import { readBrowserRuntimeEnv } from './environment';

export function bootstrapIamRuntime(): void {
  getModelkitIamBundle();
}

export function bootstrapRuntimeClients(): void {
  const env = readBrowserRuntimeEnv();
  configureModelkitAppApiClient({
    baseUrl: env.platformApiGatewayHttpUrl,
  });
}
