import 'react-native-get-random-values';

import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {OnboardingContextProvider} from '@atb/modules/onboarding';
import {GlobalMessagesContextProvider} from '@atb/modules/global-messages';
import {MapContextProvider} from '@atb/modules/map';
import {GeolocationContextProvider} from '@atb/modules/geolocation';
import {RootStack} from '@atb/stacks-hierarchy';
import {
  trackAppState,
  configureAndStartBugsnag,
} from '@atb/modules/diagnostics';
import {ThemeContextProvider} from '@atb/theme/ThemeContext';
import {FavoritesContextProvider} from '@atb/modules/favorites';
import {SearchHistoryContextProvider} from '@atb/modules/search-history';
import {TicketingContextProvider} from '@atb/modules/ticketing';
import {RemoteConfigContextProvider} from '@atb/modules/remote-config';
import {AuthContextProvider} from '@atb/modules/auth';
import {ErrorBoundary} from '@atb/screen-components/error-boundary';
import {PreferencesContextProvider} from '@atb/modules/preferences';
import {AccessibilityContextProvider} from '@atb/modules/accessibility';
import {AppLanguageContextProvider} from '@atb/translations/LanguageContext';
import {LocaleContextProvider} from '@atb/modules/locale';
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
import {StorybookContextProvider} from '@atb/modules/storybook';
import {NotificationContextProvider} from '@atb/modules/notifications';
import {BeaconsContextProvider} from '@atb/modules/beacons';
import {FeatureTogglesContextProvider} from '@atb/modules/feature-toggles';
import {configureReanimatedLogger} from 'react-native-reanimated';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {BottomSheetContextProvider} from './components/bottom-sheet/BottomSheetContext';
import {EventStreamContextProvider} from './modules/event-stream/EventStreamContext';

// https://rnfirebase.io/migrating-to-v22
(globalThis as any).RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

configureAndStartBugsnag();
configureReanimatedLogger({
  strict: false,
});

trackAppState();

LogBox.ignoreLogs([
  'new NativeEventEmitter',
  'Could not find Fiber with id',
  'Open debugger to view warnings.',
]);

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
                          <EventStreamContextProvider>
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
                                                        <BottomSheetModalProvider>
                                                          <BottomSheetContextProvider>
                                                            <FeedbackQuestionsContextProvider>
                                                              <BeaconsContextProvider>
                                                                <OnboardingContextProvider>
                                                                  <RootStack />
                                                                </OnboardingContextProvider>
                                                              </BeaconsContextProvider>
                                                            </FeedbackQuestionsContextProvider>
                                                          </BottomSheetContextProvider>
                                                        </BottomSheetModalProvider>
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
                          </EventStreamContextProvider>
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
