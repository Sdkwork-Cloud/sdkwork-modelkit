import { isBlank, trim } from '@sdkwork/utils';

export const MODELKIT_APP_SESSION_STORAGE_KEY = 'sdkwork-modelkit-auth-session';

export interface ModelkitAppSessionTokens {
  accessToken?: string;
  authToken?: string;
  refreshToken?: string;
}

function normalizeBearerToken(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const normalized = trim(value.replace(/^Bearer\s+/i, ''));
  return isBlank(normalized) ? undefined : normalized;
}

export function readModelkitAppSessionTokens(): ModelkitAppSessionTokens {
  if (typeof sessionStorage === 'undefined') {
    return {};
  }

  try {
    const raw = sessionStorage.getItem(MODELKIT_APP_SESSION_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as ModelkitAppSessionTokens;
    return {
      accessToken: normalizeBearerToken(parsed.accessToken),
      authToken: normalizeBearerToken(parsed.authToken),
      refreshToken: trim(parsed.refreshToken ?? '') || undefined,
    };
  } catch {
    return {};
  }
}

export function persistModelkitAppSessionTokens(tokens: ModelkitAppSessionTokens): void {
  if (typeof sessionStorage === 'undefined') {
    return;
  }

  const payload = {
    accessToken: normalizeBearerToken(tokens.accessToken),
    authToken: normalizeBearerToken(tokens.authToken),
    refreshToken: trim(tokens.refreshToken ?? '') || undefined,
  };

  if (!payload.accessToken && !payload.authToken && !payload.refreshToken) {
    sessionStorage.removeItem(MODELKIT_APP_SESSION_STORAGE_KEY);
    return;
  }

  sessionStorage.setItem(MODELKIT_APP_SESSION_STORAGE_KEY, JSON.stringify(payload));
}

export function clearModelkitAppSessionTokens(): void {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(MODELKIT_APP_SESSION_STORAGE_KEY);
  }
}

export function hasModelkitAppSessionTokens(
  tokens: ModelkitAppSessionTokens = readModelkitAppSessionTokens(),
): boolean {
  return Boolean(tokens.accessToken && tokens.authToken);
}
