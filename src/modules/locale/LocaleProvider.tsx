import {getLocales} from 'react-native-localize';
import {TFunc} from '@leile/lobo-t';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Language} from '@atb/translations';
import {usePreferencesContext} from '@atb/modules/preferences';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_REGION,
  FALLBACK_LANGUAGE,
} from '@atb/translations/commons';
import {AppState} from 'react-native';

export let languageGlobal: Language = DEFAULT_LANGUAGE;

/**
 * tGlobal can be used instead of the t function for when you don't want
 * language changes to potentially retrigger an action (such as e.g. an alert box)
 */
export const tGlobal: TFunc<typeof Language> = (translatable) =>
  translatable[languageGlobal];

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

type Props = {
  children: React.ReactNode;
};

/**
 * We'll create a locale as a mix of system locale and language preferences set in 'Profile'
 * where we always use region from system locale
 * and language from settings or from system locale.
 * if system locale language is not supported by the app we fallback to FALLBACK_LANGUAGE
 */
export const LocaleContextProvider = ({children}: Props) => {
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
  } = usePreferencesContext();
  // listen for updates to system Locale
  useEffect(() => {
    setSystemLocale(getPreferredSystemLocale);
    const onChange = () => {
      setSystemLocale(getPreferredSystemLocale);
    };
    const subscription = AppState.addEventListener('change', onChange);
    return () => {
      subscription.remove();
    };
  }, []);

  // listen for updates to language settings
  useEffect(() => {
    const newLanguage = useSystemLanguage
      ? systemLocale.language
      : mapLanguageStringToEnum(userPreferencedLanguage);

    languageGlobal = newLanguage;
    setLanguage(newLanguage);
  }, [useSystemLanguage, userPreferencedLanguage, systemLocale]);

  return {
    language: language,
    region: systemLocale.region,
    localeString: `${language}_${systemLocale.region}`,
  } as Locale;
}

// Fetch the preferred supported system locale or fallback
function getPreferredSystemLocale(): Locale {
  const systemLocale = getLocales().find((locale) => {
    return (
      locale.languageCode === Language.Norwegian ||
      Language.English ||
      Language.Nynorsk
    );
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
  if (language == Language.Nynorsk) {
    return Language.Nynorsk;
  }
  return FALLBACK_LANGUAGE;
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error(
      'useLocaleContext must be used within a LocaleContextProvedier',
    );
  }
  return context;
}
