import {PreferenceItem, UserPreferences} from './types';
import {storage, StorageModelTypes} from '@atb/modules/storage';

const STORAGE_KEY: StorageModelTypes = '@ATB_user_preferences';

export async function getPreferences(): Promise<UserPreferences> {
  const preferences = await storage.get(STORAGE_KEY);
  if (!preferences) return {};
  return (preferences ? JSON.parse(preferences) : []) as UserPreferences;
}

async function setPreferences(
  preferences: UserPreferences,
): Promise<UserPreferences> {
  await storage.set(STORAGE_KEY, JSON.stringify(preferences));
  return preferences;
}

export async function setPreference(
  items: UserPreferences,
): Promise<UserPreferences> {
  let preferences = (await getPreferences()) ?? {};
  preferences = {
    ...preferences,
    ...items,
  };
  return await setPreferences(preferences);
}

export async function resetPreference(
  key: PreferenceItem,
): Promise<UserPreferences> {
  const preferences = (await getPreferences()) ?? {};
  delete preferences[key];
  return await setPreference(preferences);
}
