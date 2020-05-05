import 'react-native-get-random-values';

import React from 'react';
import {enableScreens} from 'react-native-screens';
import AppContextProvider from './AppContext';
import GeolocationContextProvider from './GeolocationContext';
import NavigationRoot from './navigation';
import trackAppState from './diagnostics/trackAppState';
import ThemeContextProvider from './theme/ThemeContext';
import FavoritesContextProvider from './favorites/FavoritesContext';
import SearchHistoryContextProvider from './search-history';
import RemoteConfigContextProvider from './RemoteConfigContext';

trackAppState();
enableScreens();

const App = () => {
  return (
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
  );
};

export default App;
