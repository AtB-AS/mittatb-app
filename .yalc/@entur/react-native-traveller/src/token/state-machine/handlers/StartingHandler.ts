import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoreKey } from '../utils';
import { start as startNative } from '../../../native';

export default function startingHandler(
  safetyNetApiKey: string,
  forceRestart: boolean
): StateHandler {
  return stateHandlerFactory(['Starting'], async (s) => {
    const storeKey = getStoreKey(s.accountId);
    await startNative(safetyNetApiKey);

    if (forceRestart) {
      return {
        accountId: s.accountId,
        state: 'Loading',
      };
    }

    const savedStateString = await AsyncStorage.getItem(storeKey);

    if (!savedStateString) {
      return {
        accountId: s.accountId,
        state: 'Loading',
      };
    }

    const savedState = JSON.parse(savedStateString);

    return {
      ...savedState,
      error: undefined,
    };
  });
}
