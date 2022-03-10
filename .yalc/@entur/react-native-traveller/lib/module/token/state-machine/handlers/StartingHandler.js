import { stateHandlerFactory } from '../HandlerFactory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoreKey } from '../utils';
import { getAttestationSupport, start as startNative } from '../../../native';
import { logger } from '../../../logger';
export default function startingHandler(safetyNetApiKey, forceRestart) {
  return stateHandlerFactory(['Starting'], async s => {
    const {
      accountId
    } = s;
    const {
      result
    } = await getAttestationSupport();
    logger.info('starting', undefined, {
      accountId,
      attestationSupport: result
    });

    if (result !== 'SUPPORTED') {
      return {
        accountId,
        state: 'NotSupported'
      };
    }

    const storeKey = getStoreKey(accountId);
    await startNative(safetyNetApiKey);

    if (forceRestart) {
      logger.info('force_restart', undefined, {
        accountId
      });
      return {
        accountId,
        state: 'Loading'
      };
    }

    const savedStateString = await AsyncStorage.getItem(storeKey);

    if (!savedStateString) {
      logger.info('no_saved_state', undefined);
      return {
        accountId,
        state: 'Loading'
      };
    }

    const savedState = JSON.parse(savedStateString);
    logger.info('saved_state', undefined, {
      state: savedState.state,
      accountId: savedState.accountId
    });

    if (savedState.state === 'Valid') {
      return {
        accountId,
        state: 'Loading'
      };
    }

    return { ...savedState,
      error: undefined
    };
  });
}
//# sourceMappingURL=StartingHandler.js.map