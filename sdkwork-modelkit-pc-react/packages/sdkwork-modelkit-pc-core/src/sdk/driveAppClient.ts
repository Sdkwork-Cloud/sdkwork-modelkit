import type { SdkworkDriveAppClient } from '@sdkwork/drive-app-sdk';
import { getModelkitIamBundle } from '../iam/modelkitIamRuntime';

let cachedDriveClient: SdkworkDriveAppClient | null = null;

export function getModelkitDriveAppClient(): SdkworkDriveAppClient {
  if (!cachedDriveClient) {
    cachedDriveClient = getModelkitIamBundle().createDriveClient();
  }
  return cachedDriveClient;
}

export function resetModelkitDriveAppClient(): void {
  cachedDriveClient = null;
}
