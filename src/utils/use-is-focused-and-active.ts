import {useIsFocused} from '@react-navigation/native';
import {useAppStateStatus} from './use-app-state-status';

export const useIsFocusedAndActive = (): boolean => {
  const isFocused = useIsFocused();
  const appStateStatus = useAppStateStatus();
  return isFocused && appStateStatus === 'active';
};
