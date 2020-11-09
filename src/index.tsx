import 'react-native-get-random-values';

import React, {useEffect, useState} from 'react';
import {enableScreens} from 'react-native-screens';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppContextProvider from './AppContext';
import GeolocationContextProvider from './GeolocationContext';
import NavigationRoot from './navigation';
import trackAppState from './diagnostics/trackAppState';
import ThemeContextProvider from './theme/ThemeContext';
import FavoritesContextProvider from './favorites/FavoritesContext';
import SearchHistoryContextProvider from './search-history';
import RemoteConfigContextProvider from './RemoteConfigContext';
import {loadLocalConfig} from './local-config';
import Bugsnag from '@bugsnag/react-native';
import {setInstallId as setApiInstallId} from './api/client';
import ErrorBoundary from './error-boundary';
import {I18nProvider} from '@lingui/react';

import catalogEn from './locales/en/messages.js';
import catalogNo from './locales/no/messages.js';
import {en, nb} from 'make-plural/plurals';

import {i18n} from '@lingui/core';

if (!__DEV__) {
  Bugsnag.start();
} else {
  Bugsnag.notify = (error) => console.error(error);
  Bugsnag.leaveBreadcrumb = (message, metadata) =>
    // eslint-disable-next-line
    console.log(message, metadata);
  Bugsnag.setUser = () => {};
}

import {MAPBOX_API_TOKEN} from '@env';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {useSystemLocaleSettings} from './language';

MapboxGL.setAccessToken(MAPBOX_API_TOKEN);

async function setupConfig() {
  const {installId} = await loadLocalConfig();
  Bugsnag.setUser(installId);
  setApiInstallId(installId);
}

trackAppState();
enableScreens();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const catalogs = {en: catalogEn, nb: catalogNo};
  const {languageCode} = useSystemLocaleSettings();

  useEffect(() => {
    async function config() {
      await setupConfig();
      setIsLoading(false);
    }
    config();
  }, []);

  useEffect(() => {
    const plurals = languageCode === 'nb' ? nb : en;
    i18n.loadLocaleData(languageCode, {plurals});
    i18n.load(languageCode, catalogs[languageCode]?.messages);
    i18n.activate(languageCode);
  }, [languageCode]);

  if (isLoading) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppContextProvider>
          <ThemeContextProvider>
            <FavoritesContextProvider>
              <SearchHistoryContextProvider>
                <GeolocationContextProvider>
                  <RemoteConfigContextProvider>
                    <I18nProvider i18n={i18n}>
                      <NavigationRoot />
                    </I18nProvider>
                  </RemoteConfigContextProvider>
                </GeolocationContextProvider>
              </SearchHistoryContextProvider>
            </FavoritesContextProvider>
          </ThemeContextProvider>
        </AppContextProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

export default App;
