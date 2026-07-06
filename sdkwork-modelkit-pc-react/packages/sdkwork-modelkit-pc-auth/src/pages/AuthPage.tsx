import { SdkworkAuthPage } from '@sdkwork/auth-pc-react';
import { resolveModelkitAuthAppearance, resolveModelkitAuthRuntimeConfig } from '../appAuthRuntime';
import { useAuthController } from '../store/authStore';
import { SdkworkIamThemeProvider } from '../theme/SdkworkIamThemeProvider';

export function AuthPage() {
  const controller = useAuthController();

  return (
    <div data-modelkit-iam-screen="auth">
      <SdkworkIamThemeProvider>
        <SdkworkAuthPage
          appearance={resolveModelkitAuthAppearance()}
          basePath="/auth"
          controller={controller}
          homePath="/"
          runtimeConfig={resolveModelkitAuthRuntimeConfig()}
        />
      </SdkworkIamThemeProvider>
    </div>
  );
}
