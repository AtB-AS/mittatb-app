import { stateHandlerFactory } from '../HandlerFactory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoreKey } from '../utils';
import { getAttestationSupport, start as startNative } from '../../../native';
import { logger } from '../../../logger';
export default function startingHandler(safetyNetApiKey, forceRestart) {
  return stateHandlerFactory(['Starting'], async s => {
    const {
      accountId,
      state
    } = s;
    const {
      result
    } = await getAttestationSupport();
    logger.info('mobiletoken_status_change', undefined, {
      accountId,
      attestationSupport: result,
      state
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
      logger.info('mobiletoken_forced_restart', undefined, {
        accountId
      });
      return {
        accountId,
        state: 'Loading'
      };
    }

    const savedStateString = await AsyncStorage.getItem(storeKey);

    if (!savedStateString) {
      logger.info('mobiletoken_no_existing_state', undefined, {
        accountId
      });
      return {
        accountId,
        state: 'Loading'
      };
    }

    const savedState = JSON.parse(savedStateString);
    logger.info('mobiletoken_loaded_state', undefined, {
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