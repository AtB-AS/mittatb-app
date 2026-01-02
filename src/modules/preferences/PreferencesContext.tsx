import React, {createContext, useContext, useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {
  getPreferences as getPreferences_storage,
  resetPreference as resetPreference_storage,
  setPreference as setPreference_storage,
} from './storage';
import {PreferenceItem, UserPreferences} from '@atb/modules/preferences';

type PreferencesContextState = {
  preferences: UserPreferences;
  setPreference(items: UserPreferences): void;
  resetPreference(key: PreferenceItem): void;
};
const PreferencesContext = createContext<PreferencesContextState | undefined>(
  undefined,
);

type Props = {
  children: React.ReactNode;
};

export const PreferencesContextProvider = ({children}: Props) => {
  const [preferences, setPreferencesState] = useState<UserPreferences>({});
  const colorScheme = useColorScheme();
  const systemColorWithFallback =
    colorScheme === 'unspecified' ? 'light' : colorScheme;

  async function populatePreferences() {
    const preferences = await getPreferences_storage();
    setPreferencesState(preferences);
  }

  useEffect(() => {
    populatePreferences();
  }, []);

  const contextValue: PreferencesContextState = {
    preferences: {
      colorScheme: systemColorWithFallback,
      ...preferences,
    },
    async setPreference(items: UserPreferences) {
      const preferences = await setPreference_storage(items);
      setPreferencesState(preferences);
    },

    async resetPreference(key: PreferenceItem) {
      const preferences = await resetPreference_storage(key);
      setPreferencesState(preferences);
    },
  };

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
    </PreferencesContext.Provider>
  );
};

export function usePreferencesContext() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error(
      'usePreferences must be used within a PreferencesContextProvider',
    );
  }
  return context;
}
