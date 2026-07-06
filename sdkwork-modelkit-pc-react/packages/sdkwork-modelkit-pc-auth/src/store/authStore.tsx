import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  useSdkworkAuthControllerState,
  type SdkworkAuthController,
} from '@sdkwork/auth-pc-react';
import { createModelkitAuthController } from '../services/sdkworkAuthBridge';

export interface ModelkitAuthStoreState {
  isAuthenticated: boolean;
  isSessionReady: boolean;
  signOut: () => Promise<void>;
  user: ReturnType<typeof useSdkworkAuthControllerState>['user'];
}

const AuthControllerContext = createContext<SdkworkAuthController | null>(null);
const AuthStoreContext = createContext<ModelkitAuthStoreState | null>(null);

export function AuthStoreProvider({ children }: PropsWithChildren) {
  const [controller] = useState(() => createModelkitAuthController());
  const state = useSdkworkAuthControllerState(controller);

  useEffect(() => {
    void controller.bootstrap().catch((error: unknown) => {
      console.error('[modelkit-auth] session bootstrap failed', error);
    });
  }, [controller]);

  const value = useMemo<ModelkitAuthStoreState>(
    () => ({
      isAuthenticated: state.isAuthenticated,
      isSessionReady: state.isBootstrapped,
      async signOut() {
        await controller.signOut();
      },
      user: state.user,
    }),
    [controller, state.isAuthenticated, state.isBootstrapped, state.user],
  );

  return (
    <AuthControllerContext.Provider value={controller}>
      <AuthStoreContext.Provider value={value}>
        {children}
      </AuthStoreContext.Provider>
    </AuthControllerContext.Provider>
  );
}

export function useAuthController(): SdkworkAuthController {
  const controller = useContext(AuthControllerContext);
  if (!controller) {
    throw new Error('useAuthController must be used within AuthStoreProvider');
  }
  return controller;
}

export function useAuthStore<T>(selector: (state: ModelkitAuthStoreState) => T): T {
  const context = useContext(AuthStoreContext);
  if (!context) {
    throw new Error('useAuthStore must be used within AuthStoreProvider.');
  }
  return selector(context);
}
