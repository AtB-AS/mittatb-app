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
  userCreationOnboarded = '@ATB_onboarded', // variable renamed, but keep old storage key
  mobileTokenOnboarding = '@ATB_mobile_token_onboarded',
  mobileTokenWithoutTravelcardOnboarding = '@ATB_mobile_token_without_travelcard_onboarded',
  notificationPermissionOnboarding = '@ATB_notification_permission_onboarded',
  locationWhenInUsePermissionOnboarded = '@ATB_location_when_in_use_permission_onboarded',
  shareTravelHabitsOnboarded = '@ATB_share_travel_habits_onboarded',
}
type AppState = {
  isLoading: boolean;
  userCreationOnboarded: boolean;
  mobileTokenOnboarded: boolean;
  mobileTokenWithoutTravelcardOnboarded: boolean;
  notificationPermissionOnboarded: boolean;
  locationWhenInUsePermissionOnboarded: boolean;
  shareTravelHabitsOnboarded: boolean;
};

type AppReducerAction =
  | {
      type: 'LOAD_APP_SETTINGS';
      userCreationOnboarded: boolean;
      mobileTokenOnboarded: boolean;
      mobileTokenWithoutTravelcardOnboarded: boolean;
      notificationPermissionOnboarded: boolean;
      locationWhenInUsePermissionOnboarded: boolean;
      shareTravelHabitsOnboarded: boolean;
    }
  | {type: 'COMPLETE_USER_CREATION_ONBOARDING'}
  | {type: 'RESTART_USER_CREATION_ONBOARDING'}
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
  completeUserCreationOnboarding: () => void;
  restartUserCreationOnboarding: () => void;
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
        userCreationOnboarded,
        mobileTokenOnboarded,
        mobileTokenWithoutTravelcardOnboarded,
        notificationPermissionOnboarded,
        locationWhenInUsePermissionOnboarded,
        shareTravelHabitsOnboarded,
      } = action;
      return {
        ...prevState,
        userCreationOnboarded,
        isLoading: false,
        mobileTokenOnboarded,
        mobileTokenWithoutTravelcardOnboarded,
        notificationPermissionOnboarded,
        locationWhenInUsePermissionOnboarded,
        shareTravelHabitsOnboarded,
      };
    case 'COMPLETE_USER_CREATION_ONBOARDING':
      return {
        ...prevState,
        userCreationOnboarded: true,
      };
    case 'RESTART_USER_CREATION_ONBOARDING':
      return {
        ...prevState,
        userCreationOnboarded: false,
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
  userCreationOnboarded: false,
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
      const savedUserCreationOnboarded = await storage.get(
        storeKey.userCreationOnboarded,
      );
      const userCreationOnboarded = !savedUserCreationOnboarded
        ? false
        : JSON.parse(savedUserCreationOnboarded);

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

      if (userCreationOnboarded) {
        registerChatUser();
      }

      dispatch({
        type: 'LOAD_APP_SETTINGS',
        userCreationOnboarded,
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
    completeUserCreationOnboarding,
    restartUserCreationOnboarding,
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
      completeUserCreationOnboarding: async () => {
        await storage.set(storeKey.userCreationOnboarded, JSON.stringify(true));
        dispatch({type: 'COMPLETE_USER_CREATION_ONBOARDING'});

        registerChatUser();
      },
      restartUserCreationOnboarding: async () => {
        await storage.set(
          storeKey.userCreationOnboarded,
          JSON.stringify(false),
        );
        dispatch({type: 'RESTART_USER_CREATION_ONBOARDING'});
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
        completeUserCreationOnboarding,
        restartUserCreationOnboarding,
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
