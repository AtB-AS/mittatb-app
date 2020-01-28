import AsyncStorage from '@react-native-community/async-storage';

type SettingsKeys = 'stored_user_locations';

export const getSetting = async <T>(key: SettingsKeys): Promise<T | null> => {
  const json = await AsyncStorage.getItem(key);
  if (!json) return null;
  return JSON.parse(json) as T;
};

export const saveSetting = async <T>(
  key: SettingsKeys,
  item: T,
): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(item));
};

export const removeSetting = async (key: SettingsKeys) =>
  await AsyncStorage.removeItem(key);
