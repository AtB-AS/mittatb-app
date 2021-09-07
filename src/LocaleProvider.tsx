import * as RNLocalize from 'react-native-localize';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Language} from '@atb/translations';
import {usePreferences} from '@atb/preferences';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_REGION,
  FALLBACK_LANGUAGE,
} from '@atb/translations/commons';

export type Locale = {
  language: Language;
  region: string;
  localeString: string;
};

const norwegianLocale: Locale = {
  language: Language.Norwegian,
  region: 'NO',
  localeString: 'nb_NO',
};

const fallbackLocale: Locale = {
  language: FALLBACK_LANGUAGE,
  region: DEFAULT_REGION,
  localeString: `${FALLBACK_LANGUAGE}_${DEFAULT_REGION}`,
};

export const LocaleContext = createContext<Locale>(norwegianLocale);

/**
 * We'll create a locale as a mix of system locale and language preferences set in 'my AtB'
 * where we always use region from system locale
 * and language from settings or from system locale.
 * if system locale language is not supported by the app we fallback to FALLBACK_LANGUAGE
 */
const LocaleContextProvider: React.FC = ({children}) => {
  const locale = useLocale();
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
};

function useLocale(): Locale {
  const [systemLocale, setSystemLocale] = useState(fallbackLocale);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const {
    preferences: {useSystemLanguage = true, language: userPreferencedLanguage},
  } = usePreferences();

  // listen for updates to system Locale
  useEffect(() => {
    setSystemLocale(getPreferredSystemLocale);
    const onChange = () => {
      setSystemLocale(getPreferredSystemLocale);
    };
    RNLocalize.addEventListener('change', onChange);
    return () => {
      RNLocalize.removeEventListener('change', onChange);
    };
  }, []);

  // listen for updates to language settings
  useEffect(() => {
    if (useSystemLanguage) {
      setLanguage(systemLocale.language);
    } else {
      setLanguage(mapLanguageStringToEnum(userPreferencedLanguage));
    }
  }, [useSystemLanguage, userPreferencedLanguage, systemLocale]);

  return {
    language: language,
    region: systemLocale.region,
    localeString: `${language}_${systemLocale.region}`,
  } as Locale;
}

// Fetch the preferred supported system locale or fallback
function getPreferredSystemLocale(): Locale {
  const systemLocale = RNLocalize.getLocales().find((locale) => {
    return locale.languageCode === Language.Norwegian || Language.English;
  });
  if (systemLocale) {
    return {
      language: mapLanguageStringToEnum(systemLocale.languageCode),
      region: systemLocale.countryCode,
      localeString: `${systemLocale.languageCode}_${systemLocale.countryCode}`,
    };
  }
  return fallbackLocale;
}

function mapLanguageStringToEnum(language: string | undefined): Language {
  if (language == Language.English) {
    return Language.English;
  }
  if (language == Language.Norwegian) {
    return Language.Norwegian;
  }
  return FALLBACK_LANGUAGE;
}

export default LocaleContextProvider;

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error(
      'useLocaleContext must be used within a LocaleContextProvedier',
    );
  }
  return context;
}
