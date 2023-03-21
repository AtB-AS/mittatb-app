import React, {createContext, useContext, useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';

interface NotificationContextType {
  requestUserPermission: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  requestUserPermission: () => {},
});

export const useNotification = () => {
  return useContext(NotificationContext);
};

const NotificationProvider: React.FC = ({children}) => {
  const [authorizationStatus, setAuthorizationStatus] =
    useState<messaging.AuthorizationStatus.NOT_DETERMINED | null>(null);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      setAuthorizationStatus(authStatus);
    }
  };

  useEffect(() => {
    const checkPermission = async () => {
      const authStatus = await messaging().hasPermission();
      setAuthorizationStatus(authStatus);

      // Request permission if it has not been granted yet
      if (authStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
        requestUserPermission();
      }
    };

    checkPermission();
  }, []);

  return (
    <NotificationContext.Provider value={{requestUserPermission}}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
