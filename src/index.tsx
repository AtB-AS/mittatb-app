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
import {LogBox, Platform, UIManager} from 'react-native';
import {FiltersContextProvider} from '@atb/travel-search-filters/FiltersContext';
import {AnalyticsContextProvider} from '@atb/analytics';
import {ReactQueryProvider} from '@atb/queries';
import {TimeContextProvider} from '@atb/time';
import {AnnouncementsContextProvider} from './announcements';
import {PopOverContextProvider} from '@atb/popover';
import {StorybookContextProvider} from '@atb/storybook/StorybookContext';
import {NotificationContextProvider} from './notifications';
import {BeaconsContextProvider} from './beacons/BeaconsContext';
import FlipperAsyncStorage from 'rn-flipper-async-storage-advanced';
import {IS_QA_OR_DEV} from '@atb/utils/is-qa-or-dev';

configureAndStartBugsnag();

MapboxGL.setAccessToken(MAPBOX_API_TOKEN);

trackAppState();

LogBox.ignoreLogs(['new NativeEventEmitter', 'Could not find Fiber with id']);

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
    return <GestureHandlerRootView style={{flex: 1}} />;
  }

  return (
    <SafeAreaProvider>
      {IS_QA_OR_DEV && <FlipperAsyncStorage />}
      <StorybookContextProvider>
        <ErrorBoundary type="full-screen">
          <AppContextProvider>
            <TimeContextProvider>
              <PreferencesContextProvider>
                <LocaleContextProvider>
                  <AuthContextProvider>
                    <RemoteConfigContextProvider>
                      <AnalyticsContextProvider>
                        <AccessibilityContextProvider>
                          <ThemeContextProvider>
                            <FavoritesContextProvider>
                              <FiltersContextProvider>
                                <SearchHistoryContextProvider>
                                  <FirestoreConfigurationContextProvider>
                                    <TicketingContextProvider>
                                      <ReactQueryProvider>
                                        <MobileTokenContextProvider>
                                          <AppLanguageProvider>
                                            <GeolocationContextProvider>
                                              <GlobalMessagesContextProvider>
                                                <AnnouncementsContextProvider>
                                                  <NotificationContextProvider>
                                                    <PopOverContextProvider>
                                                      <BottomSheetProvider>
                                                        <FeedbackQuestionsProvider>
                                                          <BeaconsContextProvider>
                                                            <RootStack />
                                                          </BeaconsContextProvider>
                                                        </FeedbackQuestionsProvider>
                                                      </BottomSheetProvider>
                                                    </PopOverContextProvider>
                                                  </NotificationContextProvider>
                                                </AnnouncementsContextProvider>
                                              </GlobalMessagesContextProvider>
                                            </GeolocationContextProvider>
                                          </AppLanguageProvider>
                                        </MobileTokenContextProvider>
                                      </ReactQueryProvider>
                                    </TicketingContextProvider>
                                  </FirestoreConfigurationContextProvider>
                                </SearchHistoryContextProvider>
                              </FiltersContextProvider>
                            </FavoritesContextProvider>
                          </ThemeContextProvider>
                        </AccessibilityContextProvider>
                      </AnalyticsContextProvider>
                    </RemoteConfigContextProvider>
                  </AuthContextProvider>
                </LocaleContextProvider>
              </PreferencesContextProvider>
            </TimeContextProvider>
          </AppContextProvider>
        </ErrorBoundary>
      </StorybookContextProvider>
    </SafeAreaProvider>
  );
};
