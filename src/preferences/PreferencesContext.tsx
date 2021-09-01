import {listRecurringPayments} from '@atb/tickets';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {
  getPreferences as getPreferences_storage,
  resetPreference as resetPreference_storage,
  setPreference as setPreference_storage,
} from './storage';
import {PreferenceItem, UserPreferences, PaymentOption} from './types';

type PreferencesContextState = {
  preferences: UserPreferences;
  setPreference(items: UserPreferences): void;
  resetPreference(key: PreferenceItem): void;
  getSavedPaymentOptions: () => Promise<Array<PaymentOption>>;
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

  function getTextsForType(type: number) {
    switch (type) {
      case 2:
        return PurchaseConfirmationTexts.paymentButtonVipps;
      case 3:
        return PurchaseConfirmationTexts.paymentButtonCardVisa;
      case 4:
        return PurchaseConfirmationTexts.paymentButtonCardMC;
      default:
        return PurchaseConfirmationTexts.paymentButtonCardVisa;
    }
  }

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
    async getSavedPaymentOptions(): Promise<Array<PaymentOption>> {
      const options: Array<PaymentOption> = [
        {
          type: 4,
          description: t(getTextsForType(4).text),
          accessibilityHint: t(getTextsForType(4).a11yHint),
        },
        {
          type: 3,
          description: t(getTextsForType(3).text),
          accessibilityHint: t(getTextsForType(3).a11yHint),
        },
        {
          type: 2,
          description: t(getTextsForType(2).text),
          accessibilityHint: t(getTextsForType(2).a11yHint),
        },
      ];
      const remoteOptions: Array<PaymentOption> = (
        await listRecurringPayments()
      ).map((option) => {
        return {
          id: `${option.id}`,
          masked_pan: option.masked_pan,
          description: t(getTextsForType(option.payment_type).text),
          accessibilityHint: t(getTextsForType(option.payment_type).a11yHint),
          type: option.payment_type,
          expires_at: option.expires_at,
        };
      });
      return [...options, ...remoteOptions].reverse();
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
