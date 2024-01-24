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
import {RootStackParamList} from '@atb/stacks-hierarchy';

import {useValidRightNowFareContract} from '@atb/ticketing/use-valid-right-now-fare-contracts';

import {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';

import {PartialRoute, Route} from '@react-navigation/native';

type ScreenProps =
  | {
      screenName?: keyof RootStackParamList;
      params?: any;
    }
  | undefined;
export type GoToScreenType = (screenName: any, params?: any) => void;

// note: utilizeThisHookInstanceForSessionCounting should only be true for one instance
export const useOnboardingFlow = (
  utilizeThisHookInstanceForSessionCounting = false,
  assumeUserCreationOnboarded = false,
) => {
  const shouldShowExtendedOnboarding = useShouldShowExtendedOnboarding();

  const shouldShowUserCreationOnboarding =
    useShouldShowUserCreationOnboarding();

  const shouldShowLocationOnboarding = useShouldShowLocationOnboarding();

  const shouldShowTravelTokenOnboarding = useShouldShowTravelTokenOnboarding();

  const shouldShowShareTravelHabitsScreen =
    useShouldShowShareTravelHabitsScreen(
      utilizeThisHookInstanceForSessionCounting,
    );

  const shouldShowNotificationPermissionScreen =
    useShouldShowNotificationPermissionScreen();

  const getNextOnboardingScreen = useCallback(
    (
      comingFromScreenName?: keyof RootStackParamList,
      assumeUserCreationOnboarded?: Boolean,
    ): ScreenProps => {
      let screenName: keyof RootStackParamList | undefined = undefined;
      let params = undefined;

      const orderedOnboardingScreens: {
        shouldShow: boolean;
        screenName: keyof RootStackParamList;
        params?: any;
      }[] = [
        {
          shouldShow:
            shouldShowExtendedOnboarding && !assumeUserCreationOnboarded,
          screenName: 'Root_OnboardingStack',
        },
        {
          shouldShow:
            shouldShowUserCreationOnboarding && !assumeUserCreationOnboarded,
          screenName: 'Root_LoginOptionsScreen',
          params: {},
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
        {
          shouldShow: shouldShowTravelTokenOnboarding,
          screenName: 'Root_ConsiderTravelTokenChangeScreen',
        },
      ];
      for (const onboardingScreen of orderedOnboardingScreens) {
        if (
          onboardingScreen.shouldShow &&
          onboardingScreen.screenName !== comingFromScreenName
        ) {
          screenName = onboardingScreen.screenName;
          params = onboardingScreen?.params;
          break;
        }
      }

      return {
        screenName,
        params,
      };
    },
    [
      shouldShowExtendedOnboarding,
      shouldShowUserCreationOnboarding,
      shouldShowLocationOnboarding,
      shouldShowTravelTokenOnboarding,
      shouldShowNotificationPermissionScreen,
      shouldShowShareTravelHabitsScreen,
    ],
  );

  const [nextOnboardingScreen, setNextOnboardingScreen] = useState<ScreenProps>(
    getNextOnboardingScreen(undefined, assumeUserCreationOnboarded),
  );

  useEffect(() => {
    setNextOnboardingScreen(
      getNextOnboardingScreen(undefined, assumeUserCreationOnboarded),
    );
  }, [getNextOnboardingScreen, assumeUserCreationOnboarded]);

  /**
   * add Root_TabNavigatorStack as root when userCreationOnboarded
   * this allows goBack from an onboarding screen when used as initial screen
   * @param {Boolean} shouldGoDirectlyToOnboardingScreen when userCreationOnboarded, true if going directly to the next onboarding screen, false if instead going to Root_TabNavigatorStack first
   * @returns navigation state object
   */
  const getInitialNavigationContainerState = (
    shouldGoDirectlyToOnboardingScreen: boolean,
  ) => {
    const initialOnboardingScreen = getNextOnboardingScreen(); // dont rely on effects as it will be too late for initialState
    const initialOnboardingRoute = {
      name: initialOnboardingScreen?.screenName ?? 'Root_TabNavigatorStack',
      params: initialOnboardingScreen?.params,
    };

    const routes: PartialRoute<
      Route<keyof RootStackParamList, object | undefined>
    >[] = [];
    if (shouldShowUserCreationOnboarding) {
      routes.push(initialOnboardingRoute);
    } else {
      routes.push({name: 'Root_TabNavigatorStack'});

      if (shouldGoDirectlyToOnboardingScreen) {
        routes.push(initialOnboardingRoute);
      }
    }
    return {routes};
  };

  return {
    nextOnboardingScreen,
    getNextOnboardingScreen,
    getInitialNavigationContainerState,
  };
};

const useShouldShowExtendedOnboarding = () => {
  const {enable_extended_onboarding} = useRemoteConfig();
  const {extendedOnboardingOnboarded} = useAppState();

  return enable_extended_onboarding && !extendedOnboardingOnboarded;
};

const useShouldShowUserCreationOnboarding = () => {
  const {userCreationOnboarded} = useAppState();
  return !userCreationOnboarded;
};

const useShouldShowTravelTokenOnboarding = () => {
  const {authenticationType} = useAuthState();
  const {mobileTokenOnboarded, mobileTokenWithoutTravelcardOnboarded} =
    useAppState();
  const {disable_travelcard} = useRemoteConfig();
  const {tokens, mobileTokenStatus} = useMobileTokenContextState();
  const inspectableToken = tokens.find((token) => token.isInspectable);
  return (
    !!inspectableToken &&
    !inspectableToken?.isThisDevice &&
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
