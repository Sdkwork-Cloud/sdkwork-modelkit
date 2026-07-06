import React, { useEffect, useState, type PropsWithChildren } from 'react';
import {
  bootstrapModelkitIamSession,
  hasModelkitAuthenticatedSession,
  modelkitSessionStore,
  type ModelkitSessionSnapshot,
} from '@sdkwork/modelkit-pc-core/sdk';
import { AuthPage } from './pages/AuthPage';
import { AuthStoreProvider } from './store/authStore';

export interface ModelkitAuthGateProps extends PropsWithChildren {
  homePath?: string;
}

export function isModelkitIamEnforced(): boolean {
  const flag = readEnv('VITE_SDKWORK_MODELKIT_IAM_REQUIRED')?.toLowerCase();
  if (flag === 'true' || flag === '1') {
    return true;
  }
  if (flag === 'false' || flag === '0') {
    return false;
  }
  return import.meta.env.PROD;
}

function hasDevAccessTokenBypass(): boolean {
  return Boolean(readEnv('VITE_SDKWORK_ACCESS_TOKEN', 'SDKWORK_ACCESS_TOKEN'));
}

export function ModelkitAuthGate({ children, homePath = '/' }: ModelkitAuthGateProps) {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [snapshot, setSnapshot] = useState<ModelkitSessionSnapshot>(() => modelkitSessionStore.getSnapshot());

  useEffect(() => {
    let cancelled = false;
    void bootstrapModelkitIamSession().then(() => {
      if (!cancelled) {
        setBootstrapping(false);
        setSnapshot(modelkitSessionStore.refreshSession());
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setSnapshot(modelkitSessionStore.refreshSession());
    return modelkitSessionStore.subscribe(() => {
      setSnapshot(modelkitSessionStore.refreshSession());
    });
  }, []);

  const hasSession = hasModelkitAuthenticatedSession(snapshot) || hasDevAccessTokenBypass();
  const requiresAuth = isModelkitIamEnforced() && !hasSession;

  if (bootstrapping) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-zinc-300">
        Validating session…
      </main>
    );
  }

  if (requiresAuth) {
    return (
      <AuthStoreProvider>
        <main className="min-h-screen bg-[#0a0a0a]">
          <AuthPage />
        </main>
      </AuthStoreProvider>
    );
  }

  void homePath;
  return <>{children}</>;
}

function readEnv(...keys: string[]): string | undefined {
  const meta = import.meta as ImportMeta & { env?: Record<string, string | undefined> };
  for (const key of keys) {
    const value = meta.env?.[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}
