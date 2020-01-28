import React from 'react';
import AppContextProvider from './AppContext';
import GeolocationContextProvider from './GeolocationContext';
import NavigationRoot from './NavigationRoot';

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
