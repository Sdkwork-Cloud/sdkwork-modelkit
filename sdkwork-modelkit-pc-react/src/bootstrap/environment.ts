export function readBrowserRuntimeEnv() {
  const meta = import.meta as ImportMeta & { env?: Record<string, string | undefined> };
  return {
    deploymentProfile: meta.env?.VITE_SDKWORK_MODELKIT_DEPLOYMENT_PROFILE || 'standalone',
    applicationPublicHttpUrl:
      meta.env?.VITE_SDKWORK_MODELKIT_APPLICATION_PUBLIC_HTTP_URL || 'http://127.0.0.1:3901',
    platformApiGatewayHttpUrl:
      meta.env?.VITE_SDKWORK_MODELKIT_PLATFORM_API_GATEWAY_HTTP_URL || 'http://127.0.0.1:3901',
  };
}
