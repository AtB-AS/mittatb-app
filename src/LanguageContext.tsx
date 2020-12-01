import React from 'react';
import * as RNLocalize from 'react-native-localize';
import {useState, useEffect} from 'react';
import {Language, lobot, DEFAULT_LANGUAGE} from './utils/language';

const AppLanguageProvider: React.FC = ({children}) => {
  const [locale, setLocale] = useState(preferredLocale);
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);

  const onChange = () => {
    setLocale(preferredLocale);
  };
  useEffect(() => {
    RNLocalize.addEventListener('change', onChange);
    return () => {
      RNLocalize.removeEventListener('change', onChange);
    };
  }, []);

  useEffect(() => {
    const language = locale
      ? getAsAppLanguage(locale.languageCode) ?? DEFAULT_LANGUAGE
      : DEFAULT_LANGUAGE;
    setCurrentLanguage(language);
  }, [locale]);

  return (
    <lobot.LanguageProvider value={currentLanguage}>
      {children}
    </lobot.LanguageProvider>
  );
};

function preferredLocale(): RNLocalize.Locale | undefined {
  const preferredSystemLocales = RNLocalize.getLocales();
  const locale = preferredSystemLocales.find(
    (l) => !!getAsAppLanguage(l.languageCode),
  );
  return locale;
}
function getAsAppLanguage(arg: string): Language | undefined {
  if (arg == Language.English) return Language.English;
  if (arg == Language.Norwegian) return Language.Norwegian;
}
export default AppLanguageProvider;
