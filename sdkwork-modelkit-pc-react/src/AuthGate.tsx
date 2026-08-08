import type { PropsWithChildren, ReactElement } from 'react';
import { ModelkitAuthGate } from '@sdkwork/modelkit-pc-auth';

/**
 * Session-auth unauthorized handling is provided entirely by
 * `ModelkitAuthGate` (self-contained IAM bootstrap + inline `AuthPage`).
 * The app renders no Router, so `SdkworkSessionAuthBrowserRoot` — whose
 * provider requires a Router context to navigate — must not be mounted here.
 */
export function AuthGate({ children }: PropsWithChildren): ReactElement {
  return <ModelkitAuthGate>{children}</ModelkitAuthGate>;
}
