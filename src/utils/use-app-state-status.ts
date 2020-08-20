import {useEffect, useState} from 'react';
import {AppState, AppStateStatus, Settings} from 'react-native';

export function useAppStateStatus() {
  const currentState = AppState.currentState;
  const [appState, setAppState] = useState(currentState);

  function onChange(newState: AppStateStatus) {
    if (appState !== newState) {
      setAppState(newState);
    }
  }

  useEffect(() => {
    AppState.addEventListener('change', onChange);

    return () => {
      AppState.removeEventListener('change', onChange);
    };
  }, []);

  return appState;
}
