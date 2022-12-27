import storage, {StorageModelTypes} from '../storage';
import {PreferenceItem, UserPreferences} from './types';

const STORAGE_KEY: StorageModelTypes = '@ATB_user_preferences';

export async function getPreferences(): Promise<UserPreferences> {
  const preferences = await storage.get(STORAGE_KEY);
  if (!preferences) return {};
  let data = (preferences ? JSON.parse(preferences) : []) as UserPreferences;
  return data;
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
  let preferences = (await getPreferences()) ?? {};
  delete preferences[key];
  return await setPreference(preferences);
}
