import {useAppState} from '@atb/AppContext';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

import {useAuthState} from '@atb/auth';
import {useShouldShowShareTravelHabitsScreen} from '@atb/beacons/use-should-show-share-travel-habits-screen';
import {useMobileTokenContextState} from '@atb/mobile-token';
import {
  useNotifications,
  usePushNotificationsEnabled,
} from '@atb/notifications';
import {useHasFareContractWithActivatedNotification} from '@atb/notifications/use-has-fare-contract-with-activated-notification';
import {RootNavigationProps, RootStackParamList} from '@atb/stacks-hierarchy';

import {useValidRightNowFareContract} from '@atb/ticketing/use-valid-right-now-fare-contracts';

import {useNavigation, StackActions} from '@react-navigation/native';

import {useCallback, useEffect, useState} from 'react';
import {InteractionManager, Platform} from 'react-native';

type ScreenProps =
  | {
      screenName?: keyof RootStackParamList;
      params?: any;
    }
  | undefined;
export type GoToScreenType = (screenName: any, params?: any) => void;

// note: utilizeThisHookInstanceForSessionCounting should only be true for one instance
export const useOnboardingNavigationFlow = (
  utilizeThisHookInstanceForSessionCounting = false,
) => {
  const navigation = useNavigation<RootNavigationProps>();
  const {enable_extended_onboarding} = useRemoteConfig();
  const {onboarded: loginOnboardingCompleted} = useAppState();

  const shouldShowTravelTokenOnboarding = useShouldShowTravelTokenOnboarding();

  const shouldShowLocationOnboarding = useShouldShowLocationOnboarding();

  const shouldShowShareTravelHabitsScreen =
    useShouldShowShareTravelHabitsScreen(
      utilizeThisHookInstanceForSessionCounting,
    );

  const shouldShowNotificationPermissionScreen =
    useShouldShowNotificationPermissionScreen();

  const getNextOnboardingScreen = useCallback(
    (comingFromScreenName?: keyof RootStackParamList): ScreenProps => {
      let screenName: keyof RootStackParamList | undefined = undefined;
      let params = undefined;
      if (!loginOnboardingCompleted) {
        if (enable_extended_onboarding) {
          screenName = 'Root_OnboardingStack';
        } else {
          screenName = 'Root_LoginOptionsScreen';
          params = {};
        }
      } else {
        const orderedOnboardingScreensAfterLogin: {
          shouldShow: boolean;
          screenName: keyof RootStackParamList;
          params?: any;
        }[] = [
          {
            shouldShow: shouldShowTravelTokenOnboarding,
            screenName: 'Root_ConsiderTravelTokenChangeScreen',
          },
          {
            shouldShow: shouldShowLocationOnboarding,
            screenName: 'Root_LocationWhenInUsePermissionScreen',
          },
          {
            shouldShow: shouldShowShareTravelHabitsScreen,
            screenName: 'Root_ShareTravelHabitsScreen',
          },
          {
            shouldShow: shouldShowNotificationPermissionScreen,
            screenName: 'Root_NotificationPermissionScreen',
          },
        ];
        for (const onboardingScreen of orderedOnboardingScreensAfterLogin) {
          if (
            onboardingScreen.shouldShow &&
            onboardingScreen.screenName !== comingFromScreenName
          ) {
            screenName = onboardingScreen.screenName;
            params = onboardingScreen?.params;
            break;
          }
        }
      }
      return {
        screenName,
        params,
      };
    },
    [
      loginOnboardingCompleted,
      enable_extended_onboarding,
      shouldShowTravelTokenOnboarding,
      shouldShowLocationOnboarding,
      shouldShowShareTravelHabitsScreen,
      shouldShowNotificationPermissionScreen,
    ],
  );

  const goToScreen = useCallback(
    (replace, screenName, params?) => {
      InteractionManager.runAfterInteractions(() => {
        if (replace) {
          navigation.dispatch(StackActions.replace(screenName, params));
        } else {
          navigation.navigate(screenName, params);
        }
      });
    },
    [navigation],
  );

  const continueFromOnboardingScreen = useCallback(
    (comingFromScreenName?: keyof RootStackParamList) => {
      const nextOnboardingScreen =
        getNextOnboardingScreen(comingFromScreenName);
      if (nextOnboardingScreen?.screenName) {
        goToScreen(
          true,
          nextOnboardingScreen.screenName,
          nextOnboardingScreen.params,
        );
      } else {
        navigation.goBack();
      }
    },
    [getNextOnboardingScreen, goToScreen, navigation],
  );

  const [nextOnboardingScreen, setNextOnboardingScreen] =
    useState<ScreenProps>();

  useEffect(() => {
    setNextOnboardingScreen(getNextOnboardingScreen());
  }, [getNextOnboardingScreen]);

  return {
    nextOnboardingScreen,
    goToScreen,
    continueFromOnboardingScreen,
  };
};

const useShouldShowTravelTokenOnboarding = () => {
  const {authenticationType} = useAuthState();
  const {mobileTokenOnboarded, mobileTokenWithoutTravelcardOnboarded} =
    useAppState();
  const {disable_travelcard} = useRemoteConfig();
  const {tokens, mobileTokenStatus} = useMobileTokenContextState();
  const hasInspectableToken = tokens.some((token) => token.isInspectable);
  return (
    hasInspectableToken &&
    mobileTokenStatus === 'success' &&
    authenticationType === 'phone' &&
    ((!mobileTokenOnboarded && !disable_travelcard) ||
      (!mobileTokenWithoutTravelcardOnboarded && disable_travelcard))
  );
};

const useShouldShowLocationOnboarding = () => {
  const {locationWhenInUsePermissionOnboarded} = useAppState();
  const {status: locationWhenInUsePermissionStatus} = useGeolocationState();

  return (
    !locationWhenInUsePermissionOnboarded &&
    locationWhenInUsePermissionStatus === 'denied'
  );
};

const useShouldShowNotificationPermissionScreen = () => {
  const {notificationPermissionOnboarded} = useAppState();

  const validFareContracts = useValidRightNowFareContract();

  const hasFareContractWithActivatedNotification =
    useHasFareContractWithActivatedNotification();

  const pushNotificationsEnabled = usePushNotificationsEnabled();
  const {permissionStatus: pushNotificationPermissionStatus} =
    useNotifications();

  const pushNotificationPermissionsNotGranted =
    Platform.OS === 'ios'
      ? pushNotificationPermissionStatus === 'undetermined'
      : pushNotificationPermissionStatus === 'denied';

  return (
    !notificationPermissionOnboarded &&
    pushNotificationsEnabled &&
    pushNotificationPermissionsNotGranted &&
    validFareContracts.length > 0 &&
    hasFareContractWithActivatedNotification
  );
};
