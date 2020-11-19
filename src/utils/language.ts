import * as RNLocalize from 'react-native-localize';
import {useState, useEffect} from 'react';
import {initLobot} from '@leile/lobo-t';

export enum Language {
  Norwegian = 'nb',
  English = 'en',
}
const DEFAULT_LANGUAGE = Language.Norwegian;

const lobot = initLobot<typeof Language>(DEFAULT_LANGUAGE);

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
    currentLanguage: locale
      ? getAsAppLanguage(locale.languageCode) ?? DEFAULT_LANGUAGE
      : DEFAULT_LANGUAGE,
  };
}
function preferredLocale(): RNLocalize.Locale | undefined {
  const preferredSystemLocales = RNLocalize.getLocales();
  const locale = preferredSystemLocales.find(
    (l) => !!getAsAppLanguage(l.languageCode),
  );
  console.log('locale', locale);
  return locale;
}
function getAsAppLanguage(arg: string): Language | undefined {
  if (arg == Language.English) return Language.English;
  if (arg == Language.Norwegian) return Language.Norwegian;
}
