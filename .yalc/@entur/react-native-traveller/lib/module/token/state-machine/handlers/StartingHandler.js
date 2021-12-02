import { stateHandlerFactory } from '../HandlerFactory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoreKey } from '../utils';
import { getAttestationSupport, start as startNative } from '../../../native';
export default function startingHandler(safetyNetApiKey, forceRestart) {
  return stateHandlerFactory(['Starting'], async s => {
    const {
      result
    } = await getAttestationSupport();

    if (result !== 'SUPPORTED') {
      return {
        accountId: s.accountId,
        state: 'NotSupported'
      };
    }

    const storeKey = getStoreKey(s.accountId);
    await startNative(safetyNetApiKey);

    if (forceRestart) {
      return {
        accountId: s.accountId,
        state: 'Loading'
      };
    }

    const savedStateString = await AsyncStorage.getItem(storeKey);

    if (!savedStateString) {
      return {
        accountId: s.accountId,
        state: 'Loading'
      };
    }

    const savedState = JSON.parse(savedStateString);
    return { ...savedState,
      error: undefined
    };
  });
}
//# sourceMappingURL=StartingHandler.js.map