import 'react-native-get-random-values';

import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {OnboardingContextProvider} from './onboarding';
import {GlobalMessagesContextProvider} from '@atb/modules/global-messages';
import {MapContextProvider} from './MapContext';
import {GeolocationContextProvider} from './GeolocationContext';
import {RootStack} from '@atb/stacks-hierarchy';
import {trackAppState} from './diagnostics/trackAppState';
import {ThemeContextProvider} from './theme/ThemeContext';
import {FavoritesContextProvider} from './favorites';
import {SearchHistoryContextProvider} from './search-history';
import {TicketingContextProvider} from './ticketing';
import {RemoteConfigContextProvider} from './RemoteConfigContext';
import {AuthContextProvider} from '@atb/modules/auth';
import {ErrorBoundary} from './screen-components/error-boundary';
import {PreferencesContextProvider} from './preferences';
import {configureAndStartBugsnag} from './diagnostics/bugsnagConfig';
import {AccessibilityContextProvider} from '@atb/AccessibilityContext';
import {MAPBOX_API_TOKEN} from '@env';
import MapboxGL from '@rnmapbox/maps';
import {AppLanguageContextProvider} from '@atb/translations/LanguageContext';
import {BottomSheetContextProvider} from '@atb/components/bottom-sheet';
import {LocaleContextProvider} from '@atb/LocaleProvider';
import {setupConfig} from './setup';
import {MobileTokenContextProvider} from '@atb/mobile-token';
import {FeedbackQuestionsContextProvider} from '@atb/components/feedback';
import {FirestoreConfigurationContextProvider} from '@atb/configuration/FirestoreConfigurationContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {LogBox, Platform, UIManager} from 'react-native';
import {FiltersContextProvider} from '@atb/travel-search-filters/FiltersContext';
import {ReactQueryProvider} from '@atb/queries';
import {TimeContextProvider} from '@atb/time';
import {AnnouncementsContextProvider} from '@atb/modules/announcements';
import {PopOverContextProvider} from '@atb/popover';
import {StorybookContextProvider} from '@atb/storybook/StorybookContext';
import {NotificationContextProvider} from '@atb/modules/notifications';
import {BeaconsContextProvider} from './beacons/BeaconsContext';
import {FeatureTogglesContextProvider} from '@atb/modules/feature-toggles';
import {configureReanimatedLogger} from 'react-native-reanimated';

configureAndStartBugsnag();
configureReanimatedLogger({
  strict: false,
});

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

  // For react-native-gesture-handler to work properly, it needs to be wrapped in a GestureHandlerRootView
  // https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StorybookContextProvider>
          <ErrorBoundary type="full-screen">
            <PreferencesContextProvider>
              <LocaleContextProvider>
                <ReactQueryProvider>
                  <RemoteConfigContextProvider>
                    <FeatureTogglesContextProvider>
                      <AuthContextProvider>
                        <TimeContextProvider>
                          <AccessibilityContextProvider>
                            <ThemeContextProvider>
                              <FavoritesContextProvider>
                                <FiltersContextProvider>
                                  <SearchHistoryContextProvider>
                                    <FirestoreConfigurationContextProvider>
                                      <TicketingContextProvider>
                                        <MobileTokenContextProvider>
                                          <AppLanguageContextProvider>
                                            <GeolocationContextProvider>
                                              <MapContextProvider>
                                                <GlobalMessagesContextProvider>
                                                  <AnnouncementsContextProvider>
                                                    <NotificationContextProvider>
                                                      <PopOverContextProvider>
                                                        <BottomSheetContextProvider>
                                                          <FeedbackQuestionsContextProvider>
                                                            <BeaconsContextProvider>
                                                              <OnboardingContextProvider>
                                                                <RootStack />
                                                              </OnboardingContextProvider>
                                                            </BeaconsContextProvider>
                                                          </FeedbackQuestionsContextProvider>
                                                        </BottomSheetContextProvider>
                                                      </PopOverContextProvider>
                                                    </NotificationContextProvider>
                                                  </AnnouncementsContextProvider>
                                                </GlobalMessagesContextProvider>
                                              </MapContextProvider>
                                            </GeolocationContextProvider>
                                          </AppLanguageContextProvider>
                                        </MobileTokenContextProvider>
                                      </TicketingContextProvider>
                                    </FirestoreConfigurationContextProvider>
                                  </SearchHistoryContextProvider>
                                </FiltersContextProvider>
                              </FavoritesContextProvider>
                            </ThemeContextProvider>
                          </AccessibilityContextProvider>
                        </TimeContextProvider>
                      </AuthContextProvider>
                    </FeatureTogglesContextProvider>
                  </RemoteConfigContextProvider>
                </ReactQueryProvider>
              </LocaleContextProvider>
            </PreferencesContextProvider>
          </ErrorBoundary>
        </StorybookContextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
