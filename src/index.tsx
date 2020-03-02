import React from 'react';
import {enableScreens} from 'react-native-screens';
import AppContextProvider from './AppContext';
import GeolocationContextProvider from './GeolocationContext';
import NavigationRoot from './navigation';
import trackAppState from './diagnostics/trackAppState';
import ThemeContextProvider from './theme/ThemeContext';

trackAppState();
enableScreens();

const App = () => {
  return (
    <AppContextProvider>
      <ThemeContextProvider>
        <GeolocationContextProvider>
          <NavigationRoot />
        </GeolocationContextProvider>
      </ThemeContextProvider>
    </AppContextProvider>
  );
};

export default App;
