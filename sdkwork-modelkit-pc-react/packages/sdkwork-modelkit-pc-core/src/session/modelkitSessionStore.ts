import { isBlank, trim } from '@sdkwork/utils';

export interface ModelkitSessionSnapshot {
  accessToken?: string;
  authToken?: string;
  refreshToken?: string;
  sessionId?: string;
  tenantId?: string;
  organizationId?: string;
  userId?: string;
}

const SESSION_STORAGE_KEY = 'sdkwork-modelkit-auth-session';
const listeners = new Set<() => void>();
let memorySnapshot: ModelkitSessionSnapshot = {};

function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

function normalizeToken(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const normalized = trim(value.replace(/^Bearer\s+/i, ''));
  return isBlank(normalized) ? undefined : normalized;
}

function normalizeSnapshot(snapshot: ModelkitSessionSnapshot): ModelkitSessionSnapshot {
  return {
    accessToken: normalizeToken(snapshot.accessToken),
    authToken: normalizeToken(snapshot.authToken),
    refreshToken: normalizeToken(snapshot.refreshToken),
    sessionId: trim(snapshot.sessionId ?? '') || undefined,
    tenantId: trim(snapshot.tenantId ?? '') || undefined,
    organizationId: trim(snapshot.organizationId ?? '') || undefined,
    userId: trim(snapshot.userId ?? '') || undefined,
  };
}

function hasTokens(snapshot: ModelkitSessionSnapshot): boolean {
  return Boolean(snapshot.accessToken && snapshot.authToken);
}

function readStorageSnapshot(): ModelkitSessionSnapshot {
  const storage = resolvePersistentStorage();
  if (!storage) {
    return {};
  }

  try {
    const raw = storage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    return normalizeSnapshot(JSON.parse(raw) as ModelkitSessionSnapshot);
  } catch {
    return {};
  }
}

function writeStorageSnapshot(snapshot: ModelkitSessionSnapshot): void {
  const storage = resolvePersistentStorage();
  if (!storage) {
    return;
  }

  if (!hasTokens(snapshot)) {
    storage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot));
}

function resolvePersistentStorage(): Storage | undefined {
  if (typeof localStorage === 'undefined') {
    return undefined;
  }
  if (typeof sessionStorage !== 'undefined') {
    const legacySession = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (legacySession && !localStorage.getItem(SESSION_STORAGE_KEY)) {
      localStorage.setItem(SESSION_STORAGE_KEY, legacySession);
    }
    if (legacySession) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }
  return localStorage;
}

export class ModelkitSessionStore {
  getSnapshot(): ModelkitSessionSnapshot {
    return { ...memorySnapshot };
  }

  refreshSession(): ModelkitSessionSnapshot {
    const stored = readStorageSnapshot();
    memorySnapshot = hasTokens(stored) ? stored : {};
    return this.getSnapshot();
  }

  setSession(snapshot: ModelkitSessionSnapshot): void {
    memorySnapshot = normalizeSnapshot(snapshot);
    writeStorageSnapshot(memorySnapshot);
    emitChange();
  }

  clearSession(): void {
    memorySnapshot = {};
    writeStorageSnapshot({});
    emitChange();
  }

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
}

export const modelkitSessionStore = new ModelkitSessionStore();

export function hasModelkitIamSession(snapshot: ModelkitSessionSnapshot = modelkitSessionStore.getSnapshot()): boolean {
  return hasTokens(snapshot);
}
