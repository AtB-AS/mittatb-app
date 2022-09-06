import 'react-native-get-random-values';

import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppContextProvider from './AppContext';
import {GlobalMessagesContextProvider} from './global-messages';
import GeolocationContextProvider from './GeolocationContext';
import NavigationRoot from './navigation';
import trackAppState from './diagnostics/trackAppState';
import ThemeContextProvider from './theme/ThemeContext';
import FavoritesContextProvider from './favorites/FavoritesContext';
import SearchHistoryContextProvider from './search-history';
import {TicketContextProvider} from './tickets';
import RemoteConfigContextProvider from './RemoteConfigContext';
import {AuthContextProvider} from './auth';
import ErrorBoundary from './error-boundary';
import {PreferencesContextProvider} from './preferences';
import configureAndStartBugsnag from './diagnostics/bugsnagConfig';
import AccessibilityContextProvider from '@atb/AccessibilityContext';

configureAndStartBugsnag();

import {MAPBOX_API_TOKEN} from '@env';
import MapboxGL from '@react-native-mapbox-gl/maps';
import AppLanguageProvider from './translations/LanguageContext';
import {BottomSheetProvider} from '@atb/components/bottom-sheet';
import LocaleContextProvider from '@atb/LocaleProvider';
import {setupConfig} from './setup';
import {MobileTokenContextProvider} from '@atb/mobile-token';
import FeedbackQuestionsProvider from './components/feedback/FeedbackContext';
import {FirestoreConfigurationContextProvider} from '@atb/configuration/FirestoreConfigurationContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

MapboxGL.setAccessToken(MAPBOX_API_TOKEN);

trackAppState();

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
    return <GestureHandlerRootView style={{flex: 1}}></GestureHandlerRootView>;
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary type="full-screen">
        <AppContextProvider>
          <PreferencesContextProvider>
            <LocaleContextProvider>
              <AuthContextProvider>
                <AccessibilityContextProvider>
                  <ThemeContextProvider>
                    <FavoritesContextProvider>
                      <SearchHistoryContextProvider>
                        <GeolocationContextProvider>
                          <RemoteConfigContextProvider>
                            <FirestoreConfigurationContextProvider>
                              <TicketContextProvider>
                                <MobileTokenContextProvider>
                                  <AppLanguageProvider>
                                    <GlobalMessagesContextProvider>
                                      <BottomSheetProvider>
                                        <FeedbackQuestionsProvider>
                                          <NavigationRoot />
                                        </FeedbackQuestionsProvider>
                                      </BottomSheetProvider>
                                    </GlobalMessagesContextProvider>
                                  </AppLanguageProvider>
                                </MobileTokenContextProvider>
                              </TicketContextProvider>
                            </FirestoreConfigurationContextProvider>
                          </RemoteConfigContextProvider>
                        </GeolocationContextProvider>
                      </SearchHistoryContextProvider>
                    </FavoritesContextProvider>
                  </ThemeContextProvider>
                </AccessibilityContextProvider>
              </AuthContextProvider>
            </LocaleContextProvider>
          </PreferencesContextProvider>
        </AppContextProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

export default App;
