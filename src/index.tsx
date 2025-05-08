import 'react-native-get-random-values';

import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {OnboardingContextProvider} from '@atb/modules/onboarding';
import {GlobalMessagesContextProvider} from '@atb/modules/global-messages';
import {MapContextProvider} from '@atb/MapContext';
import {GeolocationContextProvider} from '@atb/GeolocationContext';
import {RootStack} from '@atb/stacks-hierarchy';
import {
  trackAppState,
  configureAndStartBugsnag,
} from '@atb/modules/diagnostics';
import {ThemeContextProvider} from '@atb/theme/ThemeContext';
import {FavoritesContextProvider} from '@atb/modules/favorites';
import {SearchHistoryContextProvider} from '@atb/modules/search-history';
import {TicketingContextProvider} from '@atb/modules/ticketing';
import {RemoteConfigContextProvider} from '@atb/RemoteConfigContext';
import {AuthContextProvider} from '@atb/modules/auth';
import {ErrorBoundary} from '@atb/screen-components/error-boundary';
import {PreferencesContextProvider} from '@atb/modules/preferences';
import {AccessibilityContextProvider} from '@atb/AccessibilityContext';
import {MAPBOX_API_TOKEN} from '@env';
import MapboxGL from '@rnmapbox/maps';
import {AppLanguageContextProvider} from '@atb/translations/LanguageContext';
import {BottomSheetContextProvider} from '@atb/components/bottom-sheet';
import {LocaleContextProvider} from '@atb/LocaleProvider';
import {setupConfig} from '@atb/setup';
import {MobileTokenContextProvider} from '@atb/modules/mobile-token';
import {FeedbackQuestionsContextProvider} from '@atb/components/feedback';
import {FirestoreConfigurationContextProvider} from '@atb/modules/configuration';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {LogBox, Platform, UIManager} from 'react-native';
import {FiltersContextProvider} from '@atb/modules/travel-search-filters';
import {ReactQueryProvider} from '@atb/queries';
import {TimeContextProvider} from '@atb/modules/time';
import {AnnouncementsContextProvider} from '@atb/modules/announcements';
import {PopOverContextProvider} from '@atb/modules/popover';
import {StorybookContextProvider} from '@atb/modules/storybook';
import {NotificationContextProvider} from '@atb/modules/notifications';
import {BeaconsContextProvider} from '@atb/modules/beacons';
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
