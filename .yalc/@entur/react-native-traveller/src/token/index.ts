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
import type { ClientState, ClientStateRetriever } from '..';
import startingHandler from './state-machine/handlers/StartingHandler';
import { getStoreKey } from './state-machine/utils';

export const startTokenStateMachine = async (
  abtTokensService: AbtTokensService,
  setStatus: (s?: StoredState) => void,
  getClientState: ClientStateRetriever,
  safetyNetApiKey: string,
  forceRestart: boolean = false
) => {
  const { accountId } = getClientState();

  if (!accountId) {
    setStatus(undefined);
  } else {
    const getClientStateRequired = getClientState as () => Required<ClientState>;
    const storeKey = getStoreKey(accountId!);
    let currentState: StoredState = { state: 'Starting' };
    setStatus(currentState);
    try {
      while (shouldContinue(currentState)) {
        const handler = getStateHandler(
          abtTokensService,
          currentState,
          getClientStateRequired,
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
  getClientState: () => Required<ClientState>,
  safetyNetApiKey: string,
  forceRestart: boolean
): StateHandler => {
  switch (storedState.state) {
    case 'Starting':
      return startingHandler(getClientState, safetyNetApiKey, forceRestart);
    case 'Valid':
    case 'Loading':
      return loadingHandler(getClientState);
    case 'Validating':
      return validatingHandler(abtTokensService);
    case 'DeleteLocal':
      return deleteLocalHandler(getClientState);
    case 'InitiateNew':
      return initiateNewHandler(abtTokensService);
    case 'InitiateRenewal':
      return initiateRenewHandler(abtTokensService, getClientState);
    case 'GettingTokenCertificate':
      return getTokenCertificateHandler(abtTokensService, getClientState);
    case 'AttestNew':
    case 'AttestRenewal':
      return attestHandler(getClientState);
    case 'ActivateNew':
      return activateNewHandler(abtTokensService);
    case 'ActivateRenewal':
      return activateRenewalHandler(abtTokensService, getClientState);
    case 'AddToken':
      return addTokenHandler(getClientState);
  }
};
