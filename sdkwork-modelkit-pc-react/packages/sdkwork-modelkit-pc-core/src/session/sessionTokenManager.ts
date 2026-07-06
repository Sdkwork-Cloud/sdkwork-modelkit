import type { AuthTokenManager, AuthTokens } from '@sdkwork/sdk-common';
import { resetModelkitDriveAppClient } from '../sdk/driveAppClient';
import {
  clearModelkitAppSessionTokens,
  persistModelkitAppSessionTokens,
  readModelkitAppSessionTokens,
  type ModelkitAppSessionTokens,
} from './appSession';

let modelkitGlobalTokenManager: AuthTokenManager | null = null;

function createModelkitSessionTokenManager(
  readSession: () => ModelkitAppSessionTokens,
): AuthTokenManager {
  let currentSession = readSession();

  const readCurrentSession = () => currentSession ?? readSession();
  const patchTokens = (tokens: Partial<ModelkitAppSessionTokens>) => {
    currentSession = {
      ...readCurrentSession(),
      ...tokens,
    };
    persistModelkitAppSessionTokens(currentSession);
    resetModelkitDriveAppClient();
  };

  return {
    getAuthToken: () => readCurrentSession().authToken,
    getAccessToken: () => readCurrentSession().accessToken,
    getRefreshToken: () => readCurrentSession().refreshToken,
    getTokens: (): AuthTokens => ({
      ...(readCurrentSession().accessToken ? { accessToken: readCurrentSession().accessToken } : {}),
      ...(readCurrentSession().authToken ? { authToken: readCurrentSession().authToken } : {}),
      ...(readCurrentSession().refreshToken ? { refreshToken: readCurrentSession().refreshToken } : {}),
    }),
    setTokens: (tokens: AuthTokens) => patchTokens(tokens),
    setAccessToken: (accessToken: string) => patchTokens({ accessToken }),
    setAuthToken: (authToken: string) => patchTokens({ authToken }),
    setRefreshToken: (refreshToken: string) => patchTokens({ refreshToken }),
    clearTokens: () => {
      currentSession = {};
      clearModelkitAppSessionTokens();
      resetModelkitDriveAppClient();
    },
    clearAuthToken: () => patchTokens({ authToken: undefined }),
    clearAccessToken: () => patchTokens({ accessToken: undefined }),
    isExpired: () => false,
    isValid: () => Boolean(readCurrentSession().authToken && readCurrentSession().accessToken),
    hasToken: () => Boolean(readCurrentSession().authToken && readCurrentSession().accessToken),
    hasAuthToken: () => Boolean(readCurrentSession().authToken),
    hasAccessToken: () => Boolean(readCurrentSession().accessToken),
    willExpireIn: () => false,
  };
}

export function getModelkitGlobalTokenManager(): AuthTokenManager {
  if (!modelkitGlobalTokenManager) {
    modelkitGlobalTokenManager = createModelkitSessionTokenManager(() => readModelkitAppSessionTokens());
  }
  return modelkitGlobalTokenManager;
}

export function resetModelkitGlobalTokenManager(): void {
  modelkitGlobalTokenManager = null;
}
