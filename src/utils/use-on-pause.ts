import {useRef, useEffect} from 'react';
import {AppState} from 'react-native';

export function useOnPause(runOnPauseFunc: () => void) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/active/) && nextAppState === 'background') {
        runOnPauseFunc();
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [runOnPauseFunc]);
}
