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
import TicketContextProvider from './TicketContext';
import RemoteConfigContextProvider from './RemoteConfigContext';
import {loadLocalConfig} from './local-config';
import Bugsnag from '@bugsnag/react-native';
import {setInstallId as setApiInstallId} from './api/client';
import ErrorBoundary from './error-boundary';

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
import {useLanguage, LanguageProvider} from './utils/language';

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
  const {currentLanguage} = useLanguage();

  useEffect(() => {
    async function config() {
      await setupConfig();
      setIsLoading(false);
    }
    config();
  }, []);
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
                  <TicketContextProvider>
                    <RemoteConfigContextProvider>
                      <LanguageProvider value={currentLanguage}>
                                           <NavigationRoot />
                                         </LanguageProvider>
                    </RemoteConfigContextProvider>
                  </TicketContextProvider>
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
