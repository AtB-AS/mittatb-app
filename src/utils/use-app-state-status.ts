import {useEffect, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';

export function useAppStateStatus() {
  const currentState = AppState.currentState;
  const [appState, setAppState] = useState(currentState);

  function onChange(newState: AppStateStatus) {
    setAppState(newState);
  }
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener('change', onChange);

    return () => {
      appStateSubscription.remove();
    };
  }, []);

  return appState;
}
