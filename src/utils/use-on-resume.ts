import {useRef, useEffect} from 'react';
import {AppState} from 'react-native';

export function useOnResume(runOnResumeFunc: () => void) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        runOnResumeFunc();
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [runOnResumeFunc]);
}
