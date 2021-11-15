import type { AbtTokensService } from './abt-tokens-service';
import type { StoredState } from './types';
import loadingHandler from './state-machine/handlers/LoadingHandler';
import validatingHandler from './state-machine/handlers/ValidatingHandler';
import initiateNewHandler from './state-machine/handlers/InitiateNewHandler';
import initiateRenewHandler from './state-machine/handlers/InitiateRenewalHandler';
import getTokenCertificateHandler from './state-machine/handlers/GetTokenCertificateHandler';
import attestHandler from './state-machine/handlers/AttestHandler';
import activateRenewalHandler from './state-machine/handlers/ActivateRenewalHandler';
import addTokenHandler from './state-machine/handlers/AddTokenHandler';
import type { StateHandler } from './state-machine/HandlerFactory';
import activateNewHandler from './state-machine/handlers/ActivateNewHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import deleteLocalHandler from './state-machine/handlers/DeleteLocalHandler';
import startingHandler from './state-machine/handlers/StartingHandler';
import { getStoreKey } from './state-machine/utils';

export const startTokenStateMachine = async (
  abtTokensService: AbtTokensService,
  setStatus: (s?: StoredState) => void,
  safetyNetApiKey: string,
  forceRestart: boolean = false,
  accountId?: string
) => {
  if (!accountId) {
    setStatus(undefined);
  } else {
    const storeKey = getStoreKey(accountId!);
    let currentState: StoredState = { state: 'Starting' };
    setStatus(currentState);
    try {
      while (shouldContinue(currentState)) {
        const handler = getStateHandler(
          abtTokensService,
          currentState,
          accountId,
          safetyNetApiKey,
          forceRestart
        );
        currentState = await handler(currentState);
        await AsyncStorage.setItem(storeKey, JSON.stringify(currentState));
        setStatus(currentState);
      }
    } catch (err) {
      console.warn('Unexpected error', err);
      setStatus({
        ...currentState,
        error: {
          missingNetConnection: false,
          message: 'Unexpected error',
          err,
        },
      });
    }
  }
};

const shouldContinue = (s: StoredState) => s.state !== 'Valid' && !s.error;

const getStateHandler = (
  abtTokensService: AbtTokensService,
  storedState: StoredState,
  accountId: string,
  safetyNetApiKey: string,
  forceRestart: boolean
): StateHandler => {
  switch (storedState.state) {
    case 'Starting':
      return startingHandler(accountId, safetyNetApiKey, forceRestart);
    case 'Valid':
    case 'Loading':
      return loadingHandler(accountId);
    case 'Validating':
      return validatingHandler(abtTokensService);
    case 'DeleteLocal':
      return deleteLocalHandler(accountId);
    case 'InitiateNew':
      return initiateNewHandler(abtTokensService);
    case 'InitiateRenewal':
      return initiateRenewHandler(abtTokensService, accountId);
    case 'GettingTokenCertificate':
      return getTokenCertificateHandler(abtTokensService, accountId);
    case 'AttestNew':
    case 'AttestRenewal':
      return attestHandler(accountId);
    case 'ActivateNew':
      return activateNewHandler(abtTokensService);
    case 'ActivateRenewal':
      return activateRenewalHandler(abtTokensService, accountId);
    case 'AddToken':
      return addTokenHandler(accountId);
  }
};
