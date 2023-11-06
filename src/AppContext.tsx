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
}
type AppState = {
  isLoading: boolean;
  onboarded: boolean;
  mobileTokenOnboarded: boolean;
  mobileTokenWithoutTravelcardOnboarded: boolean;
  notificationPermissionOnboarded: boolean;
};

type AppReducerAction =
  | {
      type: 'LOAD_APP_SETTINGS';
      onboarded: boolean;
      mobileTokenOnboarded: boolean;
      mobileTokenWithoutTravelcardOnboarded: boolean;
      notificationPermissionOnboarded: boolean;
    }
  | {type: 'COMPLETE_ONBOARDING'}
  | {type: 'RESTART_ONBOARDING'}
  | {type: 'COMPLETE_MOBILE_TOKEN_ONBOARDING'}
  | {type: 'RESTART_MOBILE_TOKEN_ONBOARDING'}
  | {type: 'COMPLETE_MOBILE_TOKEN_WITHOUT_TRAVELCARD_ONBOARDING'}
  | {type: 'RESTART_MOBILE_TOKEN_WITHOUT_TRAVELCARD_ONBOARDING'}
  | {type: 'COMPLETE_NOTIFICATION_PERMISSION_ONBOARDING'}
  | {type: 'RESTART_NOTIFICATION_PERMISSION_ONBOARDING'};

type AppContextState = AppState & {
  completeOnboarding: () => void;
  restartOnboarding: () => void;
  completeMobileTokenOnboarding: () => void;
  restartMobileTokenOnboarding: () => void;
  completeMobileTokenWithoutTravelcardOnboarding: () => void;
  restartMobileTokenWithoutTravelcardOnboarding: () => void;
  completeNotificationPermissionOnboarding: () => void;
  restartNotificationPermissionOnboarding: () => void;
};
const AppContext = createContext<AppContextState | undefined>(undefined);
const AppDispatch = createContext<Dispatch<AppReducerAction> | undefined>(
  undefined,
);

type AppReducer = (prevState: AppState, action: AppReducerAction) => AppState;

const appReducer: AppReducer = (prevState, action) => {
  switch (action.type) {
    case 'LOAD_APP_SETTINGS':
      return {
        ...prevState,
        onboarded: action.onboarded,
        isLoading: false,
        mobileTokenOnboarded: action.mobileTokenOnboarded,
        mobileTokenWithoutTravelcardOnboarded:
          action.mobileTokenWithoutTravelcardOnboarded,
        notificationPermissionOnboarded: action.notificationPermissionOnboarded,
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
  }
};

const defaultAppState: AppState = {
  isLoading: true,
  onboarded: false,
  mobileTokenOnboarded: false,
  mobileTokenWithoutTravelcardOnboarded: false,
  notificationPermissionOnboarded: false,
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

      if (onboarded) {
        registerChatUser();
      }

      dispatch({
        type: 'LOAD_APP_SETTINGS',
        onboarded,
        mobileTokenOnboarded,
        mobileTokenWithoutTravelcardOnboarded,
        notificationPermissionOnboarded,
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
