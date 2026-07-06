import {
  isBlank,
  isSdkWorkSuccessCode,
  trim,
  type SdkWorkApiResponse,
  type SdkWorkProblemDetail,
} from '@sdkwork/utils';
import { getModelkitGlobalTokenManager } from '../session/sessionTokenManager';

export function readModelkitApiBaseUrl(): string {
  const meta = import.meta as ImportMeta & { env?: Record<string, string | undefined> };
  const configured =
    meta.env?.VITE_SDKWORK_MODELKIT_PLATFORM_API_GATEWAY_HTTP_URL?.replace(/\/$/, '') ||
    meta.env?.VITE_SDKWORK_MODELKIT_APPLICATION_PUBLIC_HTTP_URL?.replace(/\/$/, '') ||
    '';
  if (configured) {
    return configured;
  }
  return typeof window !== 'undefined' ? window.location.origin : '';
}

function normalizeBearerToken(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const normalized = trim(value.replace(/^Bearer\s+/i, ''));
  return isBlank(normalized) ? undefined : normalized;
}

export function readModelkitAccessToken(): string | undefined {
  const meta = import.meta as ImportMeta & { env?: Record<string, string | undefined> };
  const fromEnv = meta.env?.VITE_SDKWORK_ACCESS_TOKEN || meta.env?.SDKWORK_ACCESS_TOKEN;
  const envToken = normalizeBearerToken(fromEnv);
  if (envToken) {
    return envToken;
  }
  return normalizeBearerToken(getModelkitGlobalTokenManager().getAccessToken());
}

export function readModelkitAuthToken(): string | undefined {
  return normalizeBearerToken(getModelkitGlobalTokenManager().getAuthToken());
}

export async function modelkitApiRequest<TData>(
  path: string,
  init: RequestInit = {},
  options?: { baseUrl?: string; accessToken?: string; authToken?: string },
): Promise<SdkWorkApiResponse<TData>> {
  const baseUrl = (options?.baseUrl || readModelkitApiBaseUrl()).replace(/\/$/, '');
  if (!baseUrl) {
    throw new Error('Modelkit app API base URL is not configured');
  }

  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const accessToken = options?.accessToken ?? readModelkitAccessToken();
  const authToken = options?.authToken ?? readModelkitAuthToken();
  if (accessToken) {
    headers.set('Access-Token', accessToken);
  }
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  if (!response.ok) {
    if (contentType.includes('application/problem+json')) {
      const problem = (await response.json()) as SdkWorkProblemDetail;
      throw new Error(problem.detail || problem.title);
    }
    throw new Error(`Modelkit API request failed with status ${response.status}`);
  }

  const envelope = (await response.json()) as SdkWorkApiResponse<TData> | { code: number };
  if (!isSdkWorkSuccessCode(envelope.code)) {
    throw new Error(`Modelkit API returned non-zero code ${envelope.code}`);
  }
  return envelope as SdkWorkApiResponse<TData>;
}
