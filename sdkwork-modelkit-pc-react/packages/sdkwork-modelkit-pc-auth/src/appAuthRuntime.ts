import type {
  SdkworkAuthAppearanceConfig,
  SdkworkAuthRuntimeConfig,
  SdkworkIamRuntimeAuthRuntimeLike,
} from '@sdkwork/auth-pc-react';
import {
  createSdkworkAppbasePcAuthRuntime,
  type SdkworkAppbasePcAuthRuntimeComposition,
} from '@sdkwork/auth-runtime-pc-react';
import {
  clearModelkitAppSessionTokens,
  getModelkitGlobalTokenManager,
  persistModelkitAppSessionTokens,
  readModelkitAppSessionTokens,
  resetModelkitGlobalTokenManager,
  resetModelkitIamRuntime,
  resolveModelkitPlatformApiGatewayHttpUrl,
} from '@sdkwork/modelkit-pc-core/sdk';
import type { ModelkitAppSessionTokens } from '@sdkwork/modelkit-pc-core/session';
import { resetModelkitDriveAppClient } from '@sdkwork/modelkit-pc-core/sdk';

type IamEnvironment = 'dev' | 'prod' | 'test';
type IamDeploymentMode = 'local' | 'private' | 'saas';

const MODELKIT_VERIFICATION_POLICY = {
  emailCodeLoginEnabled: false,
  emailRegistrationVerificationRequired: false,
  phoneCodeLoginEnabled: false,
  phoneRegistrationVerificationRequired: false,
} as const;

let modelkitIamRuntimeComposition: SdkworkAppbasePcAuthRuntimeComposition | null = null;

function readEnvValue(...keys: string[]): string | undefined {
  const meta = import.meta as ImportMeta & {
    env?: Record<string, string | boolean | undefined>;
  };

  for (const key of keys) {
    const value = meta.env?.[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

function resolveIamEnvironment(): IamEnvironment {
  const value = readEnvValue('VITE_SDKWORK_MODELKIT_IAM_ENVIRONMENT', 'VITE_SDKWORK_IAM_ENVIRONMENT');
  return value === 'prod' || value === 'production'
    ? 'prod'
    : value === 'test'
      ? 'test'
      : 'dev';
}

function resolveIamDeploymentMode(): IamDeploymentMode {
  const normalized = (readEnvValue(
    'VITE_SDKWORK_DEPLOYMENT_MODE',
    'VITE_SDKWORK_MODELKIT_DEPLOYMENT_PROFILE',
    'VITE_SDKWORK_IAM_DEPLOYMENT_MODE',
  ) ?? 'local').trim().toLowerCase();

  if (normalized === 'saas' || normalized === 'cloud-saas' || normalized === 'cloud') {
    return 'saas';
  }
  if (normalized === 'private' || normalized === 'server-private') {
    return 'private';
  }
  return 'local';
}

export function resetModelkitAuthenticatedClients(): void {
  resetModelkitDriveAppClient();
}

export function clearModelkitAuthRuntimeSession(): void {
  clearModelkitAppSessionTokens();
  resetModelkitAuthenticatedClients();
}

function createModelkitAuthIamRuntime(): SdkworkAppbasePcAuthRuntimeComposition {
  return createSdkworkAppbasePcAuthRuntime({
    app: {
      appId: 'sdkwork-modelkit-pc',
      deploymentMode: resolveIamDeploymentMode(),
      environment: resolveIamEnvironment(),
      platform: 'pc',
    },
    baseUrls: {
      appbaseAppApiBaseUrl: resolveModelkitPlatformApiGatewayHttpUrl(),
    },
    hooks: {
      onSessionChanged: () => {
        resetModelkitAuthenticatedClients();
      },
    },
    sdkClients: [],
    sessionBridge: {
      clearSession: clearModelkitAuthRuntimeSession,
      commitSession: (session) => persistModelkitAppSessionTokens(session as ModelkitAppSessionTokens),
      readSession: readModelkitAppSessionTokens,
    },
    tokenManager: getModelkitGlobalTokenManager(),
  });
}

export function getModelkitAuthIamRuntimeComposition(): SdkworkAppbasePcAuthRuntimeComposition {
  if (!modelkitIamRuntimeComposition) {
    modelkitIamRuntimeComposition = createModelkitAuthIamRuntime();
  }
  return modelkitIamRuntimeComposition;
}

export function getModelkitAuthIamRuntime(): SdkworkIamRuntimeAuthRuntimeLike {
  return getModelkitAuthIamRuntimeComposition().runtime as unknown as SdkworkIamRuntimeAuthRuntimeLike;
}

export function resetModelkitAuthIamRuntime(): void {
  modelkitIamRuntimeComposition = null;
  resetModelkitIamRuntime();
  resetModelkitGlobalTokenManager();
}

export function resolveModelkitAuthRuntimeConfig(): SdkworkAuthRuntimeConfig {
  return {
    leftRailMode: 'qr-only',
    loginMethods: ['password'],
    oauthLoginEnabled: false,
    oauthProviders: [],
    qrLoginEnabled: true,
    recoveryMethods: [],
    registerMethods: ['email', 'phone'],
    verificationPolicy: MODELKIT_VERIFICATION_POLICY,
  };
}

export function resolveModelkitAuthAppearance(): SdkworkAuthAppearanceConfig {
  return {
    pageClassName: 'sdkwork-modelkit-auth-page',
    shellClassName: 'sdkwork-modelkit-auth-card-shell',
  };
}
