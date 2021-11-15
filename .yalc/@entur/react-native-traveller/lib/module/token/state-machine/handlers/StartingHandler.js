import { stateHandlerFactory } from '../HandlerFactory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoreKey } from '../utils';
import { start as startNative } from '../../../native';
export default function startingHandler(accountId, safetyNetApiKey, forceRestart) {
  return stateHandlerFactory(['Starting'], async _ => {
    const storeKey = getStoreKey(accountId);
    await startNative(safetyNetApiKey);

    if (forceRestart) {
      return {
        state: 'Loading'
      };
    }

    const savedStateString = await AsyncStorage.getItem(storeKey);

    if (!savedStateString) {
      return {
        state: 'Loading'
      };
    }

    const savedState = JSON.parse(savedStateString);

    if (savedState.state === 'Valid') {
      return {
        state: 'Loading'
      };
    }

    return savedState;
  });
}
//# sourceMappingURL=StartingHandler.js.map