import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoreKey } from '../utils';
import { getAttestationSupport, start as startNative } from '../../../native';
import type { StoredState } from 'src/token/types';

export default function startingHandler(
  safetyNetApiKey: string,
  forceRestart: boolean
): StateHandler {
  return stateHandlerFactory(['Starting'], async (s) => {
    const { result } = await getAttestationSupport();
    if (result !== 'SUPPORTED') {
      return { accountId: s.accountId, state: 'NotSupported' };
    }

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

    const savedState: StoredState = JSON.parse(savedStateString);

    if (savedState.state === 'Valid') {
      return {
        accountId: s.accountId,
        state: 'Loading',
      };
    }

    return {
      ...savedState,
      error: undefined,
    };
  });
}
