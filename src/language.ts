import * as RNLocalize from 'react-native-localize';
import {useState, useEffect} from 'react';

const appLanguageCodes = ['nb', 'en'] as const;
export type AppLanguageCode = typeof appLanguageCodes[number];

export function useSystemLocaleSettings(): {languageCode: AppLanguageCode} {
  const [locale, setLocale] = useState(getLocale());
  const onChange = () => {
    setLocale(getLocale());
  };
  useEffect(() => {
    RNLocalize.addEventListener('change', onChange);
    return () => {
      RNLocalize.removeEventListener('change', onChange);
    };
  }, []);
  return {languageCode: locale};
}
function getLocale(): AppLanguageCode {
  const preferredSystemLocales = RNLocalize.getLocales();
  const preferredAppLanguage = preferredSystemLocales.find((l) =>
    isAppLanguage(l.languageCode),
  )?.languageCode;
  console.log(preferredSystemLocales);
  return (preferredAppLanguage as AppLanguageCode) ?? 'en';
}
function isAppLanguage(arg: string): arg is AppLanguageCode {
  return (appLanguageCodes as readonly string[]).includes(arg);
}
