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
    preferences: {useSystemLanguage, language: userPreferencedLanguage},
  } = usePreferences();

  // Usage of system setting not explicitly chosen, and user preferenced language has value
  const shouldUseUserPreferenced =
    !useSystemLanguage && !!userPreferencedLanguage;

  useEffect(() => {
    if (shouldUseUserPreferenced) {
      const newLanguage = getAsAppLanguage(userPreferencedLanguage);
      setCurrentLanguage(newLanguage);
    } else {
      const onChange = () => {
        setLocale(preferredLocale);
      };
      RNLocalize.addEventListener('change', onChange);
      return () => {
        RNLocalize.removeEventListener('change', onChange);
      };
    }
  }, [shouldUseUserPreferenced]);

  useEffect(() => {
    if (!shouldUseUserPreferenced) {
      const language = locale
        ? getAsAppLanguage(locale.languageCode)
        : DEFAULT_LANGUAGE;
      setCurrentLanguage(language);
    }
  }, [locale, useSystemLanguage]);

  return currentLanguage;
}

function preferredLocale(): RNLocalize.Locale | undefined {
  const preferredSystemLocales = RNLocalize.getLocales();
  const locale = preferredSystemLocales.find(
    (l) => !!getAsAppLanguage(l.languageCode),
  );
  return locale;
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
