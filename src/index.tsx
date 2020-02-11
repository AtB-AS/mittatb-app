import React from 'react';
import AppContextProvider from './AppContext';
import GeolocationContextProvider from './GeolocationContext';
import NavigationRoot from './NavigationRoot';
import trackAppState from './diagnostics/trackAppState';

trackAppState();

const App = () => {
  return (
    <AppContextProvider>
      <GeolocationContextProvider>
        <NavigationRoot />
      </GeolocationContextProvider>
    </AppContextProvider>
  );
};

export default App;
