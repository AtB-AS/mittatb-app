import * as RNLocalize from 'react-native-localize';
import {useState, useEffect} from 'react';
import {initLobot} from '@leile/lobo-t';

export enum Language {
  nb,
  en,
}

const lobot = initLobot<typeof Language>(Language.nb);

export const LanguageProvider = lobot.LanguageProvider;
export const useTranslation = lobot.useTranslation;

export function useLanguage(): {currentLanguage: Language} {
  const [locale, setLocale] = useState(preferredLocale());
  const onChange = () => {
    setLocale(preferredLocale());
  };
  useEffect(() => {
    RNLocalize.addEventListener('change', onChange);
    return () => {
      RNLocalize.removeEventListener('change', onChange);
    };
  }, []);
  return {
    currentLanguage: getAsAppLanguage(locale?.languageCode) ?? Language.en,
  };
}
function preferredLocale(): RNLocalize.Locale | undefined {
  const preferredSystemLocales = RNLocalize.getLocales();
  const locale = preferredSystemLocales.find(
    (l) => !!getAsAppLanguage(l.languageCode),
  );
  return locale;
}
function getAsAppLanguage(arg?: string): Language | undefined {
  return Language[arg as keyof typeof Language];
}
