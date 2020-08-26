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
import bugsnag from './diagnostics/bugsnag';
import {setInstallId as setApiInstallId} from './api/client';
import ErrorBoundary from './error-boundary';

import {MAPBOX_API_TOKEN} from 'react-native-dotenv';
import MapboxGL from '@react-native-mapbox-gl/maps';
MapboxGL.setAccessToken(MAPBOX_API_TOKEN);

async function setupConfig() {
  const {installId} = await loadLocalConfig();
  bugsnag.setUser(installId);
  setApiInstallId(installId);
}

trackAppState();
enableScreens();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

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
                  <RemoteConfigContextProvider>
                    <NavigationRoot />
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
