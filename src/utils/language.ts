import * as RNLocalize from 'react-native-localize';
import {useState, useEffect} from 'react';

const appLanguageCodes = ['nb', 'en'] as const;
export type AppLanguageCode = typeof appLanguageCodes[number];

export type AppLanguage = {
  languageCode: AppLanguageCode;
};

export function useLocaleSettings(): {languageCode: AppLanguageCode} {
  const [locale, setLocale] = useState(getLocaleForApp());
  const onChange = () => {
    setLocale(getLocaleForApp());
  };
  useEffect(() => {
    RNLocalize.addEventListener('change', onChange);
    return () => {
      RNLocalize.removeEventListener('change', onChange);
    };
  }, []);
  return {languageCode: (locale?.languageCode as AppLanguageCode) ?? 'en'};
}
function getLocaleForApp(): RNLocalize.Locale | undefined {
  const preferredSystemLocales = RNLocalize.getLocales();
  const locale = preferredSystemLocales.find((l) =>
    isAppLanguage(l.languageCode),
  );
  return locale;
}
function isAppLanguage(arg: string): arg is AppLanguageCode {
  return (appLanguageCodes as readonly string[]).includes(arg);
}
