import type { AbtTokensService } from './abt-tokens-service';
import type { StoredState, TokenStatus } from './types';
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

const STORAGE_KEY = '@mobiletokensdk-state';

export const startTokenStateMachine = async (
  abtTokensService: AbtTokensService,
  setStatus: (s: StoredState) => void
) => {
  const savedStateString = await AsyncStorage.getItem(STORAGE_KEY);
  const savedState = savedStateString
    ? JSON.parse(savedStateString)
    : undefined;
  let currentState = savedState || { state: 'Loading' };
  try {
    const shouldContinue = (s: TokenStatus) => s.state !== 'Valid' && !s.error;
    do {
      const handler = getStateHandler(abtTokensService, currentState);
      currentState = await handler(currentState);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
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

const getStateHandler = (
  abtTokensService: AbtTokensService,
  storedState: StoredState
): StateHandler => {
  switch (storedState.state) {
    case 'Valid':
    case 'Loading':
      return loadingHandler();
    case 'Validating':
      return validatingHandler(abtTokensService);
    case 'InitiateNew':
      return initiateNewHandler(abtTokensService);
    case 'InitiateRenewal':
      return initiateRenewHandler(abtTokensService);
    case 'GettingTokenCertificate':
      return getTokenCertificateHandler(abtTokensService);
    case 'AttestNew':
    case 'AttestRenewal':
      return attestHandler(abtTokensService);
    case 'ActivateNew':
      return activateNewHandler(abtTokensService);
    case 'ActivateRenewal':
      return activateRenewalHandler(abtTokensService);
    case 'AddToken':
      return addTokenHandler(abtTokensService);
  }
};
