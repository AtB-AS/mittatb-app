import 'react-native-get-random-values';
import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppContextProvider} from './AppContext';
import {GlobalMessagesContextProvider} from './global-messages';
import {GeolocationContextProvider} from './GeolocationContext';
import {RootStack} from '@atb/stacks-hierarchy';
import {trackAppState} from './diagnostics/trackAppState';
import {ThemeContextProvider} from './theme/ThemeContext';
import {FavoritesContextProvider} from './favorites';
import {SearchHistoryContextProvider} from './search-history';
import {TicketingContextProvider} from './ticketing';
import {RemoteConfigContextProvider} from './RemoteConfigContext';
import {AuthContextProvider} from './auth';
import {ErrorBoundary} from './error-boundary';
import {PreferencesContextProvider} from './preferences';
import {configureAndStartBugsnag} from './diagnostics/bugsnagConfig';
import {AccessibilityContextProvider} from '@atb/AccessibilityContext';
import {MAPBOX_API_TOKEN} from '@env';
import MapboxGL from '@rnmapbox/maps';
import {AppLanguageProvider} from '@atb/translations/LanguageContext';
import {BottomSheetProvider} from '@atb/components/bottom-sheet';
import {LocaleContextProvider} from '@atb/LocaleProvider';
import {setupConfig} from './setup';
import {MobileTokenContextProvider} from '@atb/mobile-token';
import {FeedbackQuestionsProvider} from '@atb/components/feedback';
import {FirestoreConfigurationContextProvider} from '@atb/configuration/FirestoreConfigurationContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Platform, UIManager} from 'react-native';
import {FiltersContextProvider} from '@atb/travel-search-filters/FiltersContext';
import {ApolloProvider} from '@apollo/client';
import {apollo_client} from '@atb/api/apollo_client';

configureAndStartBugsnag();

MapboxGL.setAccessToken(MAPBOX_API_TOKEN);

trackAppState();

if (Platform.OS === 'android') {
  // Default seems to be True in later React Native versions,
  // but LayoutAnimation doesn't seem to be working properly
  // on Android for our use case. Disable for now.
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(false);
  }
}

export const App = () => {
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
                      <FiltersContextProvider>
                        <SearchHistoryContextProvider>
                          <GeolocationContextProvider>
                            <RemoteConfigContextProvider>
                              <FirestoreConfigurationContextProvider>
                                <TicketingContextProvider>
                                  <ApolloProvider client={apollo_client}>
                                    <MobileTokenContextProvider>
                                      <AppLanguageProvider>
                                        <GlobalMessagesContextProvider>
                                          <BottomSheetProvider>
                                            <FeedbackQuestionsProvider>
                                              <RootStack />
                                            </FeedbackQuestionsProvider>
                                          </BottomSheetProvider>
                                        </GlobalMessagesContextProvider>
                                      </AppLanguageProvider>
                                    </MobileTokenContextProvider>
                                  </ApolloProvider>
                                </TicketingContextProvider>
                              </FirestoreConfigurationContextProvider>
                            </RemoteConfigContextProvider>
                          </GeolocationContextProvider>
                        </SearchHistoryContextProvider>
                      </FiltersContextProvider>
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
