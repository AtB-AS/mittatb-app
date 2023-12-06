import {useAppState} from '@atb/AppContext';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {shouldOnboardMobileToken} from '@atb/api/utils';
import {useAuthState} from '@atb/auth';
import {useMaybeShowShareTravelHabitsScreen} from '@atb/beacons/use-maybe-show-share-travel-habits-screen';
import {
  usePushNotifications,
  usePushNotificationsEnabled,
} from '@atb/notifications';
import {RootNavigationProps} from '@atb/stacks-hierarchy';

import {
  useTicketingState,
  filterValidRightNowFareContract,
} from '@atb/ticketing';
import {useTimeContextState} from '@atb/time';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useEffect, useCallback} from 'react';
import {InteractionManager} from 'react-native';

export const useOnboardingNavigationFlow = () => {
  const navigation = useNavigation<RootNavigationProps>();

  const isFocused = useIsFocused();

  const pushNotificationsEnabled = usePushNotificationsEnabled();
  const {status: locationWhenInUsePermissionStatus} = useGeolocationState();
  const {enable_extended_onboarding} = useRemoteConfig();
  const {
    onboarded,
    notificationPermissionOnboarded,
    locationWhenInUsePermissionOnboarded,
  } = useAppState();

  const {serverNow} = useTimeContextState();

  const {fareContracts} = useTicketingState();
  const validFareContracts = filterValidRightNowFareContract(
    fareContracts,
    serverNow,
  );
  const {status: notificationStatus} = usePushNotifications();

  const goToScreen = useCallback(
    (screenName, params?) => {
      InteractionManager.runAfterInteractions(() =>
        navigation.navigate(screenName, params),
      );
    },
    [navigation],
  );

  // todo: how to ensure Root_LocationWhenInUsePermissionScreen is shown before Root_ShareTravelHabitsScreen when runAfterSessionsCount is 0?
  useMaybeShowShareTravelHabitsScreen(() =>
    goToScreen('Root_ShareTravelHabitsScreen'),
  );
  useGoToMobileTokenOnboardingWhenNecessary();

  useEffect(() => {
    if (!isFocused) return; // only show onboarding screens from Root_TabNavigatorStack path

    const shouldShowLocationOnboarding =
      !locationWhenInUsePermissionOnboarded &&
      locationWhenInUsePermissionStatus === 'denied';

    if (!onboarded) {
      if (enable_extended_onboarding) {
        goToScreen('Root_OnboardingStack');
      } else {
        goToScreen('Root_LoginOptionsScreen', {});
      }
    } else if (shouldShowLocationOnboarding) {
      goToScreen('Root_LocationWhenInUsePermissionScreen');
    }

    if (
      !notificationPermissionOnboarded &&
      pushNotificationsEnabled &&
      validFareContracts.length > 0 &&
      notificationStatus !== 'granted' &&
      !shouldShowLocationOnboarding
    ) {
      goToScreen('Root_NotificationPermissionScreen');
    }
  }, [
    onboarded,
    navigation,
    notificationPermissionOnboarded,
    pushNotificationsEnabled,
    locationWhenInUsePermissionOnboarded,
    locationWhenInUsePermissionStatus,
    validFareContracts.length,
    notificationStatus,
    enable_extended_onboarding,
    goToScreen,
    isFocused,
  ]);
};

const useGoToMobileTokenOnboardingWhenNecessary = () => {
  const {authenticationType} = useAuthState();
  const {mobileTokenOnboarded, mobileTokenWithoutTravelcardOnboarded} =
    useAppState();
  const {disable_travelcard} = useRemoteConfig();
  const navigation = useNavigation<RootNavigationProps>();

  const shouldOnboard = shouldOnboardMobileToken(
    authenticationType,
    mobileTokenOnboarded,
    mobileTokenWithoutTravelcardOnboarded,
    disable_travelcard,
  );

  const isFocused = useIsFocused();
  useEffect(() => {
    if (shouldOnboard && isFocused) {
      InteractionManager.runAfterInteractions(() =>
        navigation.navigate('Root_ConsiderTravelTokenChangeScreen'),
      );
    }
  }, [shouldOnboard, isFocused, navigation]);
};
