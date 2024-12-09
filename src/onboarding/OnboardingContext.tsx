import React, {
  createContext,
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {storage} from '@atb/storage';

import {
  getOnboardingSectionIsOnboarded,
  LoadedOnboardingSection,
  OnboardingSection,
  OnboardingSectionId,
  onboardingSectionsInPrioritizedOrder,
} from '@atb/onboarding';
import {ShouldShowArgsType} from '@atb/onboarding/types';
import {useHasFareContractWithActivatedNotification} from '@atb/notifications/use-has-fare-contract-with-activated-notification';
import {useNotifications} from '@atb/notifications';
import {useGeolocationState} from '@atb/GeolocationContext';
import {AuthStateChangeListenerCallback, useAuthState} from '@atb/auth';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useShouldShowShareTravelHabitsScreen} from '@atb/beacons/use-should-show-share-travel-habits-screen';
import {useMobileTokenContextState} from '@atb/mobile-token';
import {useOnAuthStateChanged} from '@atb/auth/use-subscribe-to-auth-user-change';
import {useFeatureToggles} from '@atb/feature-toggles';

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

export const OnboardingContextProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer<OnboardingReducer>(
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

  const shouldShowArgs = useShouldShowArgs(loadedOnboardingSections);

  const onboardingSections = useMemo(
    () =>
      loadedOnboardingSections.map((loadedOnboardingSection) => ({
        ...loadedOnboardingSection,
        shouldShow: loadedOnboardingSection.shouldShowPredicate(shouldShowArgs),
      })),
    [loadedOnboardingSections, shouldShowArgs],
  );

  return (
    <OnboardingContext.Provider
      value={{
        ...contextState,
        onboardingSections,
        completeOnboardingSection,
        restartOnboardingSection,
        restartAllOnboardingSections,
      }}
    >
      <OnboardingDispatch.Provider value={dispatch}>
        {children}
      </OnboardingDispatch.Provider>
    </OnboardingContext.Provider>
  );
};

export function useOnboardingState() {
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
): ShouldShowArgsType => {
  const hasFareContractWithActivatedNotification =
    useHasFareContractWithActivatedNotification();

  const {isPushNotificationsEnabled, isOnboardingLoginEnabled} =
    useFeatureToggles();
  const {permissionStatus: pushNotificationPermissionStatus} =
    useNotifications();

  const {status: locationPermissionStatus} = useGeolocationState();
  const {authenticationType} = useAuthState();

  const {
    enable_extended_onboarding: extendedOnboardingEnabled,
    disable_travelcard: travelCardDisabled,
  } = useRemoteConfig();

  const shouldShowShareTravelHabitsScreen =
    useShouldShowShareTravelHabitsScreen(loadedOnboardingSections);

  const userCreationIsOnboarded = getOnboardingSectionIsOnboarded(
    loadedOnboardingSections,
    'userCreation',
  );

  const {mobileTokenStatus} = useMobileTokenContextState();

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
    ],
  );
};
