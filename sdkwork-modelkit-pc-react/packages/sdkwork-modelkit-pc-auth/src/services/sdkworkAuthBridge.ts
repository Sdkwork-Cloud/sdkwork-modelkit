import {
  createSdkworkAuthController,
  createSdkworkAuthService,
  type CreateSdkworkAuthControllerOptions,
  type CreateSdkworkAuthServiceOptions,
  type SdkworkAuthClient,
  type SdkworkAuthController,
  type SdkworkAuthService,
} from '@sdkwork/auth-pc-react';
import {
  clearModelkitAppSessionTokens,
  persistModelkitAppSessionTokens,
  readModelkitAppSessionTokens,
  refreshModelkitAppApiClientSession,
} from '@sdkwork/modelkit-pc-core/sdk';
import { getModelkitAuthIamRuntimeComposition } from '../appAuthRuntime';

export function createModelkitAuthService(
  options: CreateSdkworkAuthServiceOptions = {},
): SdkworkAuthService {
  return createSdkworkAuthService({
    ...options,
    clearSession: options.clearSession ?? (() => clearModelkitAppSessionTokens()),
    getClient: options.getClient ?? (() => (
      getModelkitAuthIamRuntimeComposition().appbaseApp as unknown as SdkworkAuthClient
    )),
    commitSession: options.commitSession ?? ((session) => {
      persistModelkitAppSessionTokens({
        authToken: session.authToken,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
      refreshModelkitAppApiClientSession();
      return session;
    }),
    readSession: options.readSession ?? (() => readModelkitAppSessionTokens()),
  });
}

export function createModelkitAuthController(
  options: CreateSdkworkAuthControllerOptions = {},
): SdkworkAuthController {
  return createSdkworkAuthController({
    ...options,
    service: {
      ...createModelkitAuthService(),
      ...(options.service ?? {}),
    },
  });
}
