import {listRecurringPayments} from '@atb/tickets';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {
  getPreferences as getPreferences_storage,
  resetPreference as resetPreference_storage,
  setPreference as setPreference_storage,
} from './storage';
import {
  PreferenceItem,
  UserPreferences,
  SavedPaymentOption,
} from '@atb/preferences';

type PreferencesContextState = {
  preferences: UserPreferences;
  setPreference(items: UserPreferences): void;
  resetPreference(key: PreferenceItem): void;
  // getSavedPaymentOptions: () => Promise<Array<SavedPaymentOption>>;
};
const PreferencesContext = createContext<PreferencesContextState | undefined>(
  undefined,
);

const PreferencesContextProvider: React.FC = ({children}) => {
  let [preferences, setPreferencesState] = useState<UserPreferences>({});
  const {t, language} = useTranslation();
  let colorScheme = useColorScheme();

  async function populatePreferences() {
    let preferences = await getPreferences_storage();
    setPreferencesState(preferences);
  }

  useEffect(() => {
    populatePreferences();
  }, []);

  // function getTextsForType(type: number) {
  //   switch (type) {
  //     case 2:
  //       return {
  //         text: t(PurchaseConfirmationTexts.paymentButtonVipps.text),
  //         a11y: t(PurchaseConfirmationTexts.paymentButtonVipps.a11yHint),
  //       };
  //     case 3:
  //       return {
  //         text: t(PurchaseConfirmationTexts.paymentButtonCardVisa.text),
  //         a11y: t(PurchaseConfirmationTexts.paymentButtonVipps.a11yHint),
  //       };
  //     case 4:
  //       return {
  //         text: t(PurchaseConfirmationTexts.paymentButtonCardMC.text),
  //         a11y: t(PurchaseConfirmationTexts.paymentButtonVipps.a11yHint),
  //       };
  //     default:
  //       return {
  //         text: t(PurchaseConfirmationTexts.paymentButtonCardVisa.text),
  //         a11y: t(PurchaseConfirmationTexts.paymentButtonVipps.a11yHint),
  //       };
  //   }
  // }

  const contextValue: PreferencesContextState = {
    preferences: {
      colorScheme,
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

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error(
      'usePreferences must be used within a PreferencesContextProvider',
    );
  }
  return context;
}

export function usePreferenceItems() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error(
      'usePreferences must be used within a PreferencesContextProvider',
    );
  }
  return context.preferences;
}

export default PreferencesContextProvider;
