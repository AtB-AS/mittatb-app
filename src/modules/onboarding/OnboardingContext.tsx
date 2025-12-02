import React, {
  createContext,
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {storage} from '@atb/modules/storage';

import {
  getOnboardingSectionIsOnboarded,
  LoadedOnboardingSection,
  OnboardingSection,
  OnboardingSectionId,
  onboardingSectionsInPrioritizedOrder,
} from '@atb/modules/onboarding';
import {ShouldShowArgsType} from '@atb/modules/onboarding';
import {useHasFareContractWithActivatedNotification} from '@atb/modules/notifications';
import {useNotificationsContext} from '@atb/modules/notifications';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {
  AuthStateChangeListenerCallback,
  useAuthContext,
} from '@atb/modules/auth';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useShouldShowShareTravelHabitsScreen} from '@atb/modules/beacons';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {useOnAuthStateChanged} from '@atb/modules/auth';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useVehicleRegistrationsQuery} from '../smart-park-and-ride';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {useFontScale} from '@atb/utils/use-font-scale';

export type OnboardingState = {
  isLoading: boolean;
  loadedOnboardingSections: LoadedOnboardingSection[];
};

type OnboardingContextState = Omit<
  OnboardingState,
  'loadedOnboardingSections'
> & {
  onboardingSections: OnboardingSection[];
  completeOnboardingSection: (onboardingSectionId: OnboardingSectionId) => void;
  restartOnboardingSection: (onboardingSectionId: OnboardingSectionId) => void;
  restartAllOnboardingSections: () => void;
  currentRouteName: string;
  setCurrentRouteName: (currentRouteName: string) => void;
};

type OnboardingReducerAction =
  | {
      type: 'LOAD_ONBOARDING_SETTINGS';
      loadedOnboardingSections: LoadedOnboardingSection[];
    }
  | {
      type: 'COMPLETE_ONBOARDING_SECTION';
      onboardingSectionId: OnboardingSectionId;
    }
  | {
      type: 'RESTART_ONBOARDING_SECTION';
      onboardingSectionId: OnboardingSectionId;
    };

const OnboardingContext = createContext<OnboardingContextState | undefined>(
  undefined,
);
const OnboardingDispatch = createContext<
  Dispatch<OnboardingReducerAction> | undefined
>(undefined);

type OnboardingReducer = (
  prevState: OnboardingState,
  action: OnboardingReducerAction,
) => OnboardingState;

const onboardingReducer: OnboardingReducer = (prevState, action) => {
  switch (action.type) {
    case 'LOAD_ONBOARDING_SETTINGS':
      const {loadedOnboardingSections} = action;
      return {
        ...prevState,
        isLoading: false,
        loadedOnboardingSections,
      };
    case 'COMPLETE_ONBOARDING_SECTION':
      return {
        ...prevState,
        loadedOnboardingSections: getUpdatedOnboardingSections(
          prevState.loadedOnboardingSections,
          action.onboardingSectionId,
          true,
        ),
      };
    case 'RESTART_ONBOARDING_SECTION':
      return {
        ...prevState,
        loadedOnboardingSections: getUpdatedOnboardingSections(
          prevState.loadedOnboardingSections,
          action.onboardingSectionId,
          false,
        ),
      };
  }
};

const defaultOnboardingState: OnboardingState = {
  isLoading: true,
  loadedOnboardingSections: [],
};

type Props = {
  children: React.ReactNode;
};

export const OnboardingContextProvider = ({children}: Props) => {
  const [state, dispatch] = useReducer(
    onboardingReducer,
    defaultOnboardingState,
  );

  // Omit internal fields from what's exposed externally.
  // loadedOnboardingSections is omitted since onboardingSections should be used instead
  const {loadedOnboardingSections, ...contextState} = state;

  useEffect(() => {
    async function loadOnboardingSettings() {
      const loadedOnboardingSections = await Promise.all(
        onboardingSectionsInPrioritizedOrder.map(
          async (staticOnboardingSection) => {
            const savedIsOnboarded = await storage.get(
              staticOnboardingSection.isOnboardedStoreKey,
            );
            const isOnboarded = !savedIsOnboarded
              ? false
              : JSON.parse(savedIsOnboarded);
            return {...staticOnboardingSection, isOnboarded};
          },
        ),
      );

      dispatch({
        type: 'LOAD_ONBOARDING_SETTINGS',
        loadedOnboardingSections,
      });

      RNBootSplash.hide({fade: true});
    }

    loadOnboardingSettings();
  }, []);

  const {completeOnboardingSection, restartOnboardingSection} = useMemo(
    () => ({
      completeOnboardingSection: async (
        onboardingSectionId: OnboardingSectionId,
      ) => {
        dispatch({
          type: 'COMPLETE_ONBOARDING_SECTION',
          onboardingSectionId,
        });
        await storeOnboardingSectionIsOnboarded(
          loadedOnboardingSections,
          onboardingSectionId,
          true,
        );
      },
      restartOnboardingSection: async (
        onboardingSectionId: OnboardingSectionId,
      ) => {
        dispatch({
          type: 'RESTART_ONBOARDING_SECTION',
          onboardingSectionId,
        });
        await storeOnboardingSectionIsOnboarded(
          loadedOnboardingSections,
          onboardingSectionId,
          false,
        );
      },
    }),
    [loadedOnboardingSections],
  );

  const onAuthStateChanged: AuthStateChangeListenerCallback = useCallback(
    (user) => {
      if (user && !user.isAnonymous) {
        completeOnboardingSection('userCreation');
      }
    },
    [completeOnboardingSection],
  );

  useOnAuthStateChanged(onAuthStateChanged);

  const restartAllOnboardingSections = useCallback(
    () =>
      Promise.all(
        loadedOnboardingSections.map((loadedOnboardingSection) =>
          restartOnboardingSection(loadedOnboardingSection.onboardingSectionId),
        ),
      ),
    [loadedOnboardingSections, restartOnboardingSection],
  );

  const [currentRouteName, setCurrentRouteName] = useState('');

  const shouldShowArgs = useShouldShowArgs(
    loadedOnboardingSections,
    currentRouteName,
  );
  console.log('shouldShowArgs', shouldShowArgs);
  console.log(
    'shouldShowArgs.isScreenReaderEnabled',
    shouldShowArgs.isScreenReaderEnabled,
  );
  console.log(
    'shouldShowArgs.isTravelAidStopButtonEnabled',
    shouldShowArgs.isTravelAidStopButtonEnabled,
  );
  console.log('shouldShowArgs.fontScale', shouldShowArgs.fontScale);

  const onboardingSections = useMemo(
    () =>
      loadedOnboardingSections.map((loadedOnboardingSection) => ({
        ...loadedOnboardingSection,
        shouldShow: loadedOnboardingSection.shouldShowPredicate(shouldShowArgs),
      })),
    [loadedOnboardingSections, shouldShowArgs],
  );
  console.log('onboardingSections', onboardingSections);
  console.log(
    'onboardingSections',
    onboardingSections
      .map(
        (os) =>
          `OnboardingSectionId ${os.onboardingSectionId}, shouldShow: ${os.shouldShow}`,
      )
      .join(', '),
  );

  return (
    <OnboardingContext.Provider
      value={{
        ...contextState,
        onboardingSections,
        completeOnboardingSection,
        restartOnboardingSection,
        restartAllOnboardingSections,
        currentRouteName,
        setCurrentRouteName,
      }}
    >
      <OnboardingDispatch.Provider value={dispatch}>
        {children}
      </OnboardingDispatch.Provider>
    </OnboardingContext.Provider>
  );
};

export function useOnboardingContext() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error(
      'useOnboardingState must be used within a OnboardingContextProvider',
    );
  }
  return context;
}

export function useOnboardingDispatch() {
  const context = useContext(OnboardingDispatch);
  if (context === undefined) {
    throw new Error(
      'useOnboardingDispatch must be used within a OnboardingContextProvider',
    );
  }
  return context;
}

const getUpdatedOnboardingSections = (
  onboardingSections: LoadedOnboardingSection[],
  onboardingSectionId: OnboardingSectionId,
  isOnboarded: boolean,
) => {
  const index = onboardingSections.findIndex(
    (oS) => oS.onboardingSectionId === onboardingSectionId,
  );
  if (index !== -1) {
    // only return a new array if a value is changed
    if (onboardingSections[index].isOnboarded !== isOnboarded) {
      const updatedOnboardingSections = [...onboardingSections];
      updatedOnboardingSections[index].isOnboarded = isOnboarded;
      return updatedOnboardingSections;
    }
  }
  return onboardingSections;
};

const storeOnboardingSectionIsOnboarded = async (
  onboardingSections: LoadedOnboardingSection[],
  onboardingSectionId: OnboardingSectionId,
  isOnboarded: boolean,
) => {
  const onboardingSection = onboardingSections.find(
    (oS) => oS.onboardingSectionId === onboardingSectionId,
  );
  if (onboardingSection?.isOnboardedStoreKey) {
    await storage.set(
      onboardingSection.isOnboardedStoreKey,
      JSON.stringify(isOnboarded),
    );
  }
};

const useShouldShowArgs = (
  loadedOnboardingSections: LoadedOnboardingSection[],
  currentRouteName: string,
): ShouldShowArgsType => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  const fontScale = useFontScale();

  const hasFareContractWithActivatedNotification =
    useHasFareContractWithActivatedNotification();

  const {
    isPushNotificationsEnabled,
    isOnboardingLoginEnabled,
    isTravelAidStopButtonEnabled,
  } = useFeatureTogglesContext();

  const {permissionStatus: pushNotificationPermissionStatus} =
    useNotificationsContext();

  const {status: locationPermissionStatus} = useGeolocationContext();
  const {authenticationType} = useAuthContext();

  const {
    enable_extended_onboarding: extendedOnboardingEnabled,
    disable_travelcard: travelCardDisabled,
  } = useRemoteConfigContext();

  const shouldShowShareTravelHabitsScreen =
    useShouldShowShareTravelHabitsScreen(loadedOnboardingSections);

  const userCreationIsOnboarded = getOnboardingSectionIsOnboarded(
    loadedOnboardingSections,
    'userCreation',
  );

  const {mobileTokenStatus} = useMobileTokenContext();

  const {data: vehicleRegistrations, isLoading: isLoadingVehicleRegistrations} =
    useVehicleRegistrationsQuery(
      currentRouteName !== 'Profile_SmartParkAndRideScreen',
    );
  const hasVehicleRegistrations =
    !!vehicleRegistrations?.length && !isLoadingVehicleRegistrations;

  return useMemo(
    () => ({
      hasFareContractWithActivatedNotification,
      pushNotificationPermissionStatus,
      isOnboardingLoginEnabled,
      isPushNotificationsEnabled,
      locationPermissionStatus,
      authenticationType,
      extendedOnboardingEnabled,
      shouldShowShareTravelHabitsScreen,
      travelCardDisabled,
      userCreationIsOnboarded,
      mobileTokenStatus,
      currentRouteName,
      hasVehicleRegistrations,
      isScreenReaderEnabled,
      isTravelAidStopButtonEnabled,
      fontScale,
    }),
    [
      hasFareContractWithActivatedNotification,
      pushNotificationPermissionStatus,
      isOnboardingLoginEnabled,
      isPushNotificationsEnabled,
      locationPermissionStatus,
      authenticationType,
      extendedOnboardingEnabled,
      shouldShowShareTravelHabitsScreen,
      travelCardDisabled,
      userCreationIsOnboarded,
      mobileTokenStatus,
      currentRouteName,
      hasVehicleRegistrations,
      isScreenReaderEnabled,
      isTravelAidStopButtonEnabled,
      fontScale,
    ],
  );
};
