import {AppState, AppStateStatus} from 'react-native';
import {focusManager} from '@tanstack/react-query';
import {useCallback, useEffect} from 'react';

/**
 * https://tanstack.com/query/v4/docs/framework/react/guides/window-focus-refetching#managing-focus-in-react-native
 */
export const useSetupReactQueryWindowFocus = () => {
  const onAppStateChange = useCallback((status: AppStateStatus) => {
    focusManager.setFocused(status === 'active');
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, [onAppStateChange]);
};
