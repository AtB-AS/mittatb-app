import React from 'react';
import {enableScreens} from 'react-native-screens';
import AppContextProvider from './AppContext';
import GeolocationContextProvider from './GeolocationContext';
import NavigationRoot from './navigation';
import trackAppState from './diagnostics/trackAppState';
import ThemeContextProvider from './theme/ThemeContext';
import FavoritesContextProvider from './favorites/FavoritesContext';

trackAppState();
enableScreens();

const App = () => {
  return (
    <AppContextProvider>
      <ThemeContextProvider>
        <FavoritesContextProvider>
          <GeolocationContextProvider>
            <NavigationRoot />
          </GeolocationContextProvider>
        </FavoritesContextProvider>
      </ThemeContextProvider>
    </AppContextProvider>
  );
};

export default App;
