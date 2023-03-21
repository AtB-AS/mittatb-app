import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {
  check,
  request,
  PERMISSIONS,
  PermissionStatus,
} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

type PushNotificationsState = {
  status: PermissionStatus | null;
};

type PushNotificationsReducerAction = {
  status: PermissionStatus | null;
  type: 'PERMISSION_CHANGED';
};

type PushNotificationsReducer = (
  prevState: PushNotificationsState,
  action: PushNotificationsReducerAction,
) => PushNotificationsState;

const pushNotificationsReducer: PushNotificationsReducer = (
  prevState,
  action,
) => {
  switch (action.type) {
    case 'PERMISSION_CHANGED':
      return {
        ...prevState,
        status: action.status,
      };
  }
};

type RequestPermissionFn = () => Promise<PermissionStatus | undefined>;

type PushNotificationsContextState = PushNotificationsState & {
  requestPermission: RequestPermissionFn;
};

const PushNotificationsContext = createContext<
  PushNotificationsContextState | undefined
>(undefined);

const defaultState: PushNotificationsState = {
  status: null,
};

const PushNotificationsContextProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer<PushNotificationsReducer>(
    pushNotificationsReducer,
    defaultState,
  );

  async function requestPermission() {
    const status = await requestPushNotificationPermission();
    dispatch({type: 'PERMISSION_CHANGED', status});
    return status;
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      console.log('Message received: ', remoteMessage);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    async function checkPermission() {
      const status = await checkPushNotificationPermission();
      if (state.status !== status) {
        dispatch({type: 'PERMISSION_CHANGED', status});
      }
    }
    checkPermission();
  }, []);

  return (
    <PushNotificationsContext.Provider value={{...state, requestPermission}}>
      {children}
    </PushNotificationsContext.Provider>
  );
};

export default PushNotificationsContextProvider;

export function usePushNotificationsState() {
  const context = useContext(PushNotificationsContext);
  if (context === undefined) {
    throw new Error(
      'usePushNotificationsState must be used within a PushNotificationsContextProvider',
    );
  }
  return context;
}

async function checkPushNotificationPermission(): Promise<PermissionStatus> {
  if (Platform.OS === 'ios') {
    return await check(PERMISSIONS.IOS.);
  } else {
    return await check(PERMISSIONS.ANDROID.N);
  }
}

async function requestPushNotificationPermission(): Promise<PermissionStatus> {
  const rationale = {
    title: 'Push Notifications Permission',
    message: 'We need your permission to send push notifications',
    buttonPositive: 'Allow',
    buttonNegative: 'Deny',
  };
  return await request(PERMISSIONS.ANDROID., rationale);
}
