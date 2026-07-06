import type { PropsWithChildren, ReactElement } from 'react';
import { SdkworkSessionAuthBrowserRoot } from '@sdkwork/auth-pc-react';
import { ModelkitAuthGate } from '@sdkwork/modelkit-pc-auth';

export function AuthGate({ children }: PropsWithChildren): ReactElement {
  return (
    <SdkworkSessionAuthBrowserRoot>
      <ModelkitAuthGate>{children}</ModelkitAuthGate>
    </SdkworkSessionAuthBrowserRoot>
  );
}
