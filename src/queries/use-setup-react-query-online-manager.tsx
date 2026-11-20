import NetInfo from '@react-native-community/netinfo';
import {onlineManager} from '@tanstack/react-query';
import {useEffect} from 'react';

/**
 * https://tanstack.com/query/v5/docs/framework/react/react-native#online-status-management
 */
export const useSetupReactQueryOnlineManager = () => {
  useEffect(() => {
    onlineManager.setEventListener((setOnline) =>
      NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
      }),
    );
    return () => onlineManager.setEventListener(() => undefined);
  }, []);
};
