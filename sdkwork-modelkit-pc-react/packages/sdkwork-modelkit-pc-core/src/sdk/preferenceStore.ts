import {
  getModelkitAppApiClient,
  MODELKIT_PREFERENCE_NAMESPACES,
  type ModelkitPreferenceNamespace,
} from './modelkitAppApiClient';

export async function loadPreferencePayload<T>(
  namespace: ModelkitPreferenceNamespace,
  fallback: T,
): Promise<T> {
  try {
    const record = await getModelkitAppApiClient().getPreference<T>(namespace);
    return record?.payload ?? fallback;
  } catch {
    return fallback;
  }
}

export async function savePreferencePayload<T>(
  namespace: ModelkitPreferenceNamespace,
  payload: T,
): Promise<void> {
  await getModelkitAppApiClient().putPreference(namespace, payload);
}

export { MODELKIT_PREFERENCE_NAMESPACES };
