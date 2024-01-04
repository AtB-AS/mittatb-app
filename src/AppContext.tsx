import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {register as registerChatUser} from './chat/user';
import {storage} from '@atb/storage';

enum storeKey {
  onboarding = '@ATB_onboarded',
  mobileTokenOnboarding = '@ATB_mobile_token_onboarded',
  mobileTokenWithoutTravelcardOnboarding = '@ATB_mobile_token_without_travelcard_onboarded',
  notificationPermissionOnboarding = '@ATB_notification_permission_onboarded',
  locationWhenInUsePermissionOnboarded = '@ATB_location_when_in_use_permission_onboarded',
  shareTravelHabitsOnboarded = '@ATB_SHARE_TRAVEL_HABITS_onboarded',
}
type AppState = {
  isLoading: boolean;
  onboarded: boolean;
  mobileTokenOnboarded: boolean;
  mobileTokenWithoutTravelcardOnboarded: boolean;
  notificationPermissionOnboarded: boolean;
  locationWhenInUsePermissionOnboarded: boolean;
  shareTravelHabitsOnboarded: boolean;
};

type AppReducerAction =
  | {
      type: 'LOAD_APP_SETTINGS';
      onboarded: boolean;
      mobileTokenOnboarded: boolean;
      mobileTokenWithoutTravelcardOnboarded: boolean;
      notificationPermissionOnboarded: boolean;
      locationWhenInUsePermissionOnboarded: boolean;
      shareTravelHabitsOnboarded: boolean;
    }
  | {type: 'COMPLETE_ONBOARDING'}
  | {type: 'RESTART_ONBOARDING'}
  | {type: 'COMPLETE_MOBILE_TOKEN_ONBOARDING'}
  | {type: 'RESTART_MOBILE_TOKEN_ONBOARDING'}
  | {type: 'COMPLETE_MOBILE_TOKEN_WITHOUT_TRAVELCARD_ONBOARDING'}
  | {type: 'RESTART_MOBILE_TOKEN_WITHOUT_TRAVELCARD_ONBOARDING'}
  | {type: 'COMPLETE_NOTIFICATION_PERMISSION_ONBOARDING'}
  | {type: 'RESTART_NOTIFICATION_PERMISSION_ONBOARDING'}
  | {type: 'COMPLETE_LOCATION_WHEN_IN_USE_PERMISSION_ONBOARDING'}
  | {type: 'RESTART_LOCATION_WHEN_IN_USE_PERMISSION_ONBOARDING'}
  | {type: 'COMPLETE_SHARE_TRAVEL_HABITS_ONBOARDING'}
  | {type: 'RESTART_SHARE_TRAVEL_HABITS_ONBOARDING'};

type AppContextState = AppState & {
  completeOnboarding: () => void;
  restartOnboarding: () => void;
  completeMobileTokenOnboarding: () => void;
  restartMobileTokenOnboarding: () => void;
  completeMobileTokenWithoutTravelcardOnboarding: () => void;
  restartMobileTokenWithoutTravelcardOnboarding: () => void;
  completeNotificationPermissionOnboarding: () => void;
  restartNotificationPermissionOnboarding: () => void;
  completeLocationWhenInUsePermissionOnboarding: () => void;
  restartLocationWhenInUsePermissionOnboarding: () => void;
  completeShareTravelHabitsOnboarding: () => void;
  restartShareTravelHabitsOnboarding: () => void;
};
const AppContext = createContext<AppContextState | undefined>(undefined);
const AppDispatch = createContext<Dispatch<AppReducerAction> | undefined>(
  undefined,
);

type AppReducer = (prevState: AppState, action: AppReducerAction) => AppState;

const appReducer: AppReducer = (prevState, action) => {
  switch (action.type) {
    case 'LOAD_APP_SETTINGS':
      const {
        onboarded,
        mobileTokenOnboarded,
        mobileTokenWithoutTravelcardOnboarded,
        notificationPermissionOnboarded,
        locationWhenInUsePermissionOnboarded,
        shareTravelHabitsOnboarded,
      } = action;
      return {
        ...prevState,
        onboarded,
        isLoading: false,
        mobileTokenOnboarded,
        mobileTokenWithoutTravelcardOnboarded,
        notificationPermissionOnboarded,
        locationWhenInUsePermissionOnboarded,
        shareTravelHabitsOnboarded,
      };
    case 'COMPLETE_ONBOARDING':
      return {
        ...prevState,
        onboarded: true,
      };
    case 'RESTART_ONBOARDING':
      return {
        ...prevState,
        onboarded: false,
      };
    case 'COMPLETE_MOBILE_TOKEN_ONBOARDING':
      return {
        ...prevState,
        mobileTokenOnboarded: true,
      };
    case 'RESTART_MOBILE_TOKEN_ONBOARDING':
      return {
        ...prevState,
        mobileTokenOnboarded: false,
      };
    case 'COMPLETE_MOBILE_TOKEN_WITHOUT_TRAVELCARD_ONBOARDING':
      return {
        ...prevState,
        mobileTokenWithoutTravelcardOnboarded: true,
      };
    case 'RESTART_MOBILE_TOKEN_WITHOUT_TRAVELCARD_ONBOARDING':
      return {
        ...prevState,
        mobileTokenWithoutTravelcardOnboarded: false,
      };

    case 'COMPLETE_NOTIFICATION_PERMISSION_ONBOARDING':
      return {
        ...prevState,
        notificationPermissionOnboarded: true,
      };

    case 'RESTART_NOTIFICATION_PERMISSION_ONBOARDING':
      return {
        ...prevState,
        notificationPermissionOnboarded: false,
      };

    case 'COMPLETE_LOCATION_WHEN_IN_USE_PERMISSION_ONBOARDING':
      return {
        ...prevState,
        locationWhenInUsePermissionOnboarded: true,
      };

    case 'RESTART_LOCATION_WHEN_IN_USE_PERMISSION_ONBOARDING':
      return {
        ...prevState,
        locationWhenInUsePermissionOnboarded: false,
      };

    case 'COMPLETE_SHARE_TRAVEL_HABITS_ONBOARDING':
      return {
        ...prevState,
        shareTravelHabitsOnboarded: true,
      };

    case 'RESTART_SHARE_TRAVEL_HABITS_ONBOARDING':
      return {
        ...prevState,
        shareTravelHabitsOnboarded: false,
      };
  }
};

const defaultAppState: AppState = {
  isLoading: true,
  onboarded: false,
  mobileTokenOnboarded: false,
  mobileTokenWithoutTravelcardOnboarded: false,
  notificationPermissionOnboarded: false,
  locationWhenInUsePermissionOnboarded: false,
  shareTravelHabitsOnboarded: false,
};

export const AppContextProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer<AppReducer>(appReducer, defaultAppState);

  useEffect(() => {
    async function loadAppSettings() {
      const savedOnboarded = await storage.get(storeKey.onboarding);
      const onboarded = !savedOnboarded ? false : JSON.parse(savedOnboarded);

      const savedMobileTokenOnboarded = await storage.get(
        storeKey.mobileTokenOnboarding,
      );
      const mobileTokenOnboarded = !savedMobileTokenOnboarded
        ? false
        : JSON.parse(savedMobileTokenOnboarded);

      const savedMobileTokenWithoutTravelcardOnboarded = await storage.get(
        storeKey.mobileTokenWithoutTravelcardOnboarding,
      );
      const mobileTokenWithoutTravelcardOnboarded =
        !savedMobileTokenWithoutTravelcardOnboarded
          ? false
          : JSON.parse(savedMobileTokenWithoutTravelcardOnboarded);

      const savedNotificationPermissionOnboarded = await storage.get(
        storeKey.notificationPermissionOnboarding,
      );

      const notificationPermissionOnboarded =
        !savedNotificationPermissionOnboarded
          ? false
          : JSON.parse(savedNotificationPermissionOnboarded);

      const savedLocationWhenInUsePermissionOnboarded = await storage.get(
        storeKey.locationWhenInUsePermissionOnboarded,
      );
      const locationWhenInUsePermissionOnboarded =
        !savedLocationWhenInUsePermissionOnboarded
          ? false
          : JSON.parse(savedLocationWhenInUsePermissionOnboarded);

      const savedShareTravelHabitsOnboarded = await storage.get(
        storeKey.shareTravelHabitsOnboarded,
      );
      const shareTravelHabitsOnboarded = !savedShareTravelHabitsOnboarded
        ? false
        : JSON.parse(savedShareTravelHabitsOnboarded);

      if (onboarded) {
        registerChatUser();
      }

      dispatch({
        type: 'LOAD_APP_SETTINGS',
        onboarded,
        mobileTokenOnboarded,
        mobileTokenWithoutTravelcardOnboarded,
        notificationPermissionOnboarded,
        locationWhenInUsePermissionOnboarded,
        shareTravelHabitsOnboarded,
      });

      RNBootSplash.hide({fade: true});
    }
    loadAppSettings();
  }, []);

  const {
    completeOnboarding,
    restartOnboarding,
    completeMobileTokenOnboarding,
    restartMobileTokenOnboarding,
    completeMobileTokenWithoutTravelcardOnboarding,
    restartMobileTokenWithoutTravelcardOnboarding,
    completeNotificationPermissionOnboarding,
    restartNotificationPermissionOnboarding,
    completeLocationWhenInUsePermissionOnboarding,
    restartLocationWhenInUsePermissionOnboarding,
    completeShareTravelHabitsOnboarding,
    restartShareTravelHabitsOnboarding,
  } = useMemo(
    () => ({
      completeOnboarding: async () => {
        await storage.set(storeKey.onboarding, JSON.stringify(true));
        dispatch({type: 'COMPLETE_ONBOARDING'});

        registerChatUser();
      },
      restartOnboarding: async () => {
        await storage.set(storeKey.onboarding, JSON.stringify(false));
        dispatch({type: 'RESTART_ONBOARDING'});
      },
      completeMobileTokenOnboarding: async () => {
        dispatch({type: 'COMPLETE_MOBILE_TOKEN_ONBOARDING'});
        await storage.set(storeKey.mobileTokenOnboarding, JSON.stringify(true));
      },
      restartMobileTokenOnboarding: async () => {
        dispatch({type: 'RESTART_MOBILE_TOKEN_ONBOARDING'});
        await storage.set(
          storeKey.mobileTokenOnboarding,
          JSON.stringify(false),
        );
      },
      completeMobileTokenWithoutTravelcardOnboarding: async () => {
        dispatch({type: 'COMPLETE_MOBILE_TOKEN_WITHOUT_TRAVELCARD_ONBOARDING'});
        await storage.set(
          storeKey.mobileTokenWithoutTravelcardOnboarding,
          JSON.stringify(true),
        );
      },
      restartMobileTokenWithoutTravelcardOnboarding: async () => {
        dispatch({type: 'RESTART_MOBILE_TOKEN_WITHOUT_TRAVELCARD_ONBOARDING'});
        await storage.set(
          storeKey.mobileTokenWithoutTravelcardOnboarding,
          JSON.stringify(false),
        );
      },
      completeNotificationPermissionOnboarding: async () => {
        await storage.set(
          storeKey.notificationPermissionOnboarding,
          JSON.stringify(true),
        );
        dispatch({type: 'COMPLETE_NOTIFICATION_PERMISSION_ONBOARDING'});
      },
      restartNotificationPermissionOnboarding: async () => {
        await storage.set(
          storeKey.notificationPermissionOnboarding,
          JSON.stringify(false),
        );
        dispatch({type: 'RESTART_NOTIFICATION_PERMISSION_ONBOARDING'});
      },

      completeLocationWhenInUsePermissionOnboarding: async () => {
        await storage.set(
          storeKey.locationWhenInUsePermissionOnboarded,
          JSON.stringify(true),
        );
        dispatch({type: 'COMPLETE_LOCATION_WHEN_IN_USE_PERMISSION_ONBOARDING'});
      },
      restartLocationWhenInUsePermissionOnboarding: async () => {
        await storage.set(
          storeKey.locationWhenInUsePermissionOnboarded,
          JSON.stringify(false),
        );
        dispatch({type: 'RESTART_LOCATION_WHEN_IN_USE_PERMISSION_ONBOARDING'});
      },

      completeShareTravelHabitsOnboarding: async () => {
        await storage.set(
          storeKey.shareTravelHabitsOnboarded,
          JSON.stringify(true),
        );
        dispatch({type: 'COMPLETE_SHARE_TRAVEL_HABITS_ONBOARDING'});
      },
      restartShareTravelHabitsOnboarding: async () => {
        await storage.set(
          storeKey.shareTravelHabitsOnboarded,
          JSON.stringify(false),
        );
        dispatch({type: 'RESTART_SHARE_TRAVEL_HABITS_ONBOARDING'});
      },
    }),
    [],
  );

  return (
    <AppContext.Provider
      value={{
        ...state,
        completeOnboarding,
        restartOnboarding,
        completeMobileTokenOnboarding,
        restartMobileTokenOnboarding,
        completeMobileTokenWithoutTravelcardOnboarding,
        restartMobileTokenWithoutTravelcardOnboarding,
        completeNotificationPermissionOnboarding,
        restartNotificationPermissionOnboarding,
        completeLocationWhenInUsePermissionOnboarding,
        restartLocationWhenInUsePermissionOnboarding,
        completeShareTravelHabitsOnboarding,
        restartShareTravelHabitsOnboarding,
      }}
    >
      <AppDispatch.Provider value={dispatch}>{children}</AppDispatch.Provider>
    </AppContext.Provider>
  );
};

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a AppContextProvider');
  }
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatch);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within a AppContextProvider');
  }
  return context;
}
