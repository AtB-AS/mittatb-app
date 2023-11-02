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
  ticketing = '@ATB_ticket_informational_accepted',
  mobileTokenOnboarding = '@ATB_mobile_token_onboarded',
  mobileTokenWithoutTravelcardOnboarding = '@ATB_mobile_token_without_travelcard_onboarded',
  notificationPermissionOnboarding = '@ATB_notification_permission_onboarded',
}
type AppState = {
  isLoading: boolean;
  onboarded: boolean;
  ticketingAccepted: boolean;
  mobileTokenOnboarded: boolean;
  mobileTokenWithoutTravelcardOnboarded: boolean;
  notificationPermissionOnboarded: boolean;
};

type AppReducerAction =
  | {
      type: 'LOAD_APP_SETTINGS';
      onboarded: boolean;
      ticketingAccepted: boolean;
      mobileTokenOnboarded: boolean;
      mobileTokenWithoutTravelcardOnboarded: boolean;
      notificationPermissionOnboarded: boolean;
    }
  | {type: 'COMPLETE_ONBOARDING'}
  | {type: 'RESTART_ONBOARDING'}
  | {type: 'ACCEPT_TICKETING'}
  | {type: 'RESET_TICKETING'}
  | {type: 'COMPLETE_MOBILE_TOKEN_ONBOARDING'}
  | {type: 'RESTART_MOBILE_TOKEN_ONBOARDING'}
  | {type: 'COMPLETE_MOBILE_TOKEN_WITHOUT_TRAVELCARD_ONBOARDING'}
  | {type: 'RESTART_MOBILE_TOKEN_WITHOUT_TRAVELCARD_ONBOARDING'}
  | {type: 'COMPLETE_NOTIFICATION_PERMISSION_ONBOARDING'}
  | {type: 'RESTART_NOTIFICATION_PERMISSION_ONBOARDING'};

type AppContextState = AppState & {
  completeOnboarding: () => void;
  restartOnboarding: () => void;
  acceptTicketing: () => void;
  resetTicketing: () => void;
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
        ticketingAccepted: action.ticketingAccepted,
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
    case 'ACCEPT_TICKETING':
      return {
        ...prevState,
        ticketingAccepted: true,
      };
    case 'RESET_TICKETING':
      return {
        ...prevState,
        ticketingAccepted: false,
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
  ticketingAccepted: false,
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

      const savedTicketingAccepted = await storage.get(storeKey.ticketing);
      const ticketingAccepted = !savedTicketingAccepted
        ? false
        : JSON.parse(savedTicketingAccepted);

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

      console.log('saved', savedNotificationPermissionOnboarded);
      const notificationPermissionOnboarded =
        !savedNotificationPermissionOnboarded
          ? false
          : JSON.parse(savedNotificationPermissionOnboarded);

      console.log('should be the same', notificationPermissionOnboarded);

      if (onboarded) {
        registerChatUser();
      }

      dispatch({
        type: 'LOAD_APP_SETTINGS',
        onboarded,
        ticketingAccepted,
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
    acceptTicketing,
    resetTicketing,
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
      acceptTicketing: async () => {
        await storage.set(storeKey.ticketing, JSON.stringify(true));
        dispatch({type: 'ACCEPT_TICKETING'});
      },
      resetTicketing: async () => {
        dispatch({type: 'RESET_TICKETING'});
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
        acceptTicketing,
        resetTicketing,
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
