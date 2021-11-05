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
import type { ClientStateRetriever } from '..';

const STORAGE_KEY_PREFIX = '@mobiletokensdk-state';
const getStoreKey = (accountId: string) => `${STORAGE_KEY_PREFIX}#${accountId}`;

export const startTokenStateMachine = async (
  abtTokensService: AbtTokensService,
  setStatus: (s: StoredState) => void,
  getClientState: ClientStateRetriever,
  forceRestart: boolean = false
) => {
  const { accountId } = getClientState();
  const storeKey = getStoreKey(accountId);
  let currentState = await getInitialState(forceRestart, storeKey);
  try {
    const shouldContinue = (s: StoredState) => s.state !== 'Valid' && !s.error;
    do {
      const handler = getStateHandler(
        abtTokensService,
        currentState,
        getClientState
      );
      currentState = await handler(currentState);
      await AsyncStorage.setItem(storeKey, JSON.stringify(currentState));
      setStatus(currentState);
    } while (shouldContinue(currentState));
  } catch (err) {
    console.warn('Unexpected error', err);
    setStatus({
      ...currentState,
      error: { type: 'Unknown', message: 'Unexpected error', err },
    });
  }
};

const getInitialState = async (
  forceRestart: boolean,
  storeKey: string
): Promise<StoredState> => {
  if (forceRestart) {
    return { state: 'Loading' };
  }
  const savedStateString = await AsyncStorage.getItem(storeKey);
  return savedStateString ? JSON.parse(savedStateString) : { state: 'Loading' };
};

const getStateHandler = (
  abtTokensService: AbtTokensService,
  storedState: StoredState,
  getClientState: ClientStateRetriever
): StateHandler => {
  switch (storedState.state) {
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
      return attestHandler(abtTokensService, getClientState);
    case 'ActivateNew':
      return activateNewHandler(abtTokensService);
    case 'ActivateRenewal':
      return activateRenewalHandler(abtTokensService, getClientState);
    case 'AddToken':
      return addTokenHandler(abtTokensService, getClientState);
  }
};
