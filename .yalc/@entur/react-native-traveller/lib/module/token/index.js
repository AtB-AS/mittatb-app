import loadingHandler from './state-machine/handlers/LoadingHandler';
import validatingHandler from './state-machine/handlers/ValidatingHandler';
import initiateNewHandler from './state-machine/handlers/InitiateNewHandler';
import initiateRenewHandler from './state-machine/handlers/InitiateRenewalHandler';
import getTokenCertificateHandler from './state-machine/handlers/GetTokenCertificateHandler';
import attestHandler from './state-machine/handlers/AttestHandler';
import activateRenewalHandler from './state-machine/handlers/ActivateRenewalHandler';
import addTokenHandler from './state-machine/handlers/AddTokenHandler';
import activateNewHandler from './state-machine/handlers/ActivateNewHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import deleteLocalHandler from './state-machine/handlers/DeleteLocalHandler';
import startingHandler from './state-machine/handlers/StartingHandler';
import notSupportedHandler from './state-machine/handlers/NotSupportedHandler';
import { getStoreKey } from './state-machine/utils';
import verifyInspectionActionHandler from './state-machine/handlers/VerifyInspectionActionHandler';
import { logger } from '../logger';
export const startTokenStateMachine = async (abtTokensService, setStatus, safetyNetApiKey, forceRestart = false, accountId) => {
  if (!accountId) {
    setStatus(undefined);
  } else {
    const storeKey = getStoreKey(accountId);
    let currentState = {
      accountId,
      state: 'Starting'
    };
    setStatus(currentState);

    try {
      while (shouldContinue(currentState)) {
        const handler = getStateHandler(abtTokensService, currentState, safetyNetApiKey, forceRestart);
        currentState = await handler(currentState);
        await AsyncStorage.setItem(storeKey, JSON.stringify(currentState));
        setStatus(currentState);
      }
    } catch (err) {
      logger.error(undefined, err, undefined);
      console.warn('Unexpected error', err);
      setStatus({ ...currentState,
        error: {
          missingNetConnection: false,
          message: 'Unexpected error',
          err
        }
      });
    }
  }
};

const shouldContinue = s => s.state !== 'Valid' && s.state !== 'NotSupported' && !s.error;

const getStateHandler = (abtTokensService, storedState, safetyNetApiKey, forceRestart) => {
  switch (storedState.state) {
    case 'Starting':
      return startingHandler(safetyNetApiKey, forceRestart);

    case 'Valid':
    case 'Loading':
      return loadingHandler();

    case 'Validating':
      return validatingHandler(abtTokensService);

    case 'DeleteLocal':
      return deleteLocalHandler();

    case 'InitiateNew':
      return initiateNewHandler(abtTokensService);

    case 'InitiateRenewal':
      return initiateRenewHandler(abtTokensService);

    case 'GettingTokenCertificate':
      return getTokenCertificateHandler(abtTokensService);

    case 'AttestNew':
    case 'AttestRenewal':
      return attestHandler();

    case 'ActivateNew':
      return activateNewHandler(abtTokensService);

    case 'ActivateRenewal':
      return activateRenewalHandler(abtTokensService);

    case 'AddToken':
      return addTokenHandler();

    case 'VerifyInspectionAction':
      return verifyInspectionActionHandler(abtTokensService);

    case 'NotSupported':
      return notSupportedHandler();
  }
};
//# sourceMappingURL=index.js.map