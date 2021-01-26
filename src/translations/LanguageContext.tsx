import React from 'react';
import * as RNLocalize from 'react-native-localize';
import {useState, useEffect} from 'react';
import {Language, lobot, DEFAULT_LANGUAGE} from './';
import {useRemoteConfig} from '../RemoteConfigContext';
import {usePreferences} from '../preferences';

const AppLanguageProvider: React.FC = ({children}) => {
  const currentLanguage = useLanguage();
  const {enable_i18n} = useRemoteConfig();
  if (!enable_i18n) {
    return <>{children}</>;
  }
  return (
    <lobot.LanguageProvider value={currentLanguage}>
      {children}
    </lobot.LanguageProvider>
  );
};
function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  const [locale, setLocale] = useState(preferredLocale);
  const {
    preferences: {useSystemLanguage = true, language: userPreferencedLanguage},
  } = usePreferences();

  useEffect(() => {
    const onChange = () => {
      setLocale(preferredLocale);
    };
    RNLocalize.addEventListener('change', onChange);
    return () => {
      RNLocalize.removeEventListener('change', onChange);
    };
  }, []);

  useEffect(() => {
    if (useSystemLanguage) {
      // Get preferred locale from system settings.
      // If no system settings match our languages we select
      // English as it is more likely they know english than Norwegian.
      // If locale is undefined we don't support any of the system languages.
      const language = locale
        ? getAsAppLanguage(locale.languageCode)
        : Language.English;
      setCurrentLanguage(language);
    } else {
      const newLanguage = getAsAppLanguage(
        userPreferencedLanguage ?? DEFAULT_LANGUAGE,
      );
      setCurrentLanguage(newLanguage);
    }
  }, [locale, userPreferencedLanguage, useSystemLanguage]);

  return currentLanguage;
}

function preferredLocale(): RNLocalize.Locale | undefined {
  const preferredSystemLocales = RNLocalize.getLocales();
  const locale = preferredSystemLocales.find(isAppLanguage);
  return locale;
}
function isAppLanguage(arg?: RNLocalize.Locale): boolean {
  return (
    arg?.languageCode == Language.English ||
    arg?.languageCode == Language.Norwegian
  );
}

function getAsAppLanguage(arg?: string): Language {
  if (arg == Language.English) {
    return Language.English;
  }
  if (arg == Language.Norwegian) {
    return Language.Norwegian;
  }
  return DEFAULT_LANGUAGE;
}
export default AppLanguageProvider;
