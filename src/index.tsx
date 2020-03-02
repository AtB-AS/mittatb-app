import React from 'react';
import AppContextProvider from './AppContext';
import GeolocationContextProvider from './GeolocationContext';
import NavigationRoot from './NavigationRoot';
import trackAppState from './diagnostics/trackAppState';
import ThemeContextProvider from './theme/ThemeContext';

trackAppState();

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
