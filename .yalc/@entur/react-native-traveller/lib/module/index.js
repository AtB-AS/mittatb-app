import { getConfigFromInitialConfig } from './config';
import { startTokenStateMachine } from './token';
import { createFetcher } from './fetcher';
import { createAbtTokensService } from './token/abt-tokens-service';
import { getSecureToken } from './native';
import { PayloadAction } from './native/types';
export { RequestError } from './fetcher';
export default function createClient(setStatus, initialConfig) {
  const {
    safetyNetApiKey
  } = initialConfig;
  const config = getConfigFromInitialConfig(initialConfig);
  const fetcher = createFetcher(config);
  const abtTokensService = createAbtTokensService(fetcher, config.hosts);
  let currentStatus;

  const toVisualState = storedState => {
    if (storedState.error) {
      return 'Error';
    } else if (['Valid', 'Validating'].includes(storedState.state)) {
      return 'Token';
    } else {
      return 'Loading';
    }
  };

  const setStatusWrapper = storedState => {
    const status = storedState && {
      state: storedState.state,
      error: storedState.error,
      visualState: toVisualState(storedState)
    };
    currentStatus = status;
    setStatus(status);
  };

  let clientState = {};

  function clientStateRetriever() {
    return clientState;
  }

  return {
    setAccount(accountId) {
      clientState = { ...clientState,
        accountId
      };

      if (clientState.accountId) {
        startTokenStateMachine(abtTokensService, setStatusWrapper, clientStateRetriever, safetyNetApiKey, false);
      }
    },

    retry: forceRestart => {
      var _currentStatus;

      const {
        accountId
      } = clientState;

      if (!accountId) {
        throw new Error('Account id must be set');
      }

      if (((_currentStatus = currentStatus) === null || _currentStatus === void 0 ? void 0 : _currentStatus.visualState) === 'Loading') {
        throw new Error('Can not retry while the sdk is already running');
      }

      startTokenStateMachine(abtTokensService, setStatusWrapper, clientStateRetriever, safetyNetApiKey, forceRestart); // Todo: Not start if already running
    },
    generateQrCode: () => {
      var _currentStatus2;

      const {
        accountId
      } = clientState;

      if (!accountId) {
        throw new Error('Account id must be set');
      }

      if (((_currentStatus2 = currentStatus) === null || _currentStatus2 === void 0 ? void 0 : _currentStatus2.visualState) !== 'Token') {
        throw new Error('The current state does not allow retrieval of qr code');
      }

      return getSecureToken(accountId, [PayloadAction.ticketInspection]);
    }
  };
}
//# sourceMappingURL=index.js.map