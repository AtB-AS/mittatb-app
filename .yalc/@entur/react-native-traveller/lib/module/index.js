import { getConfigFromInitialConfig } from './config';
import { startTokenStateMachine } from './token';
import { createFetcher } from './fetcher';
import { createAbtTokensService } from './token/abt-tokens-service';
import { getSecureToken } from './native';
import { PayloadAction } from './native/types';
export { RequestError } from './fetcher';
export default function createClient(setStatus, initialState, initialConfig) {
  const config = getConfigFromInitialConfig(initialConfig);
  const fetcher = createFetcher(config);
  const abtTokensService = createAbtTokensService(fetcher, config.hosts);

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
    setStatus({
      state: storedState.state,
      error: storedState.error,
      visualState: toVisualState(storedState)
    });
  };

  let clientState = { ...initialState
  };

  function clientStateRetriever() {
    return clientState;
  }

  startTokenStateMachine(abtTokensService, setStatusWrapper, clientStateRetriever);
  return {
    switch(accountId) {
      clientState = { ...clientState,
        accountId
      };
      startTokenStateMachine(abtTokensService, setStatusWrapper, clientStateRetriever, false);
    },

    retry: forceRestart => {
      startTokenStateMachine(abtTokensService, setStatusWrapper, clientStateRetriever, forceRestart); // Todo: Not start if already running
    },
    generateQrCode: () => {
      const {
        accountId
      } = clientState;
      return getSecureToken(accountId, [PayloadAction.ticketInspection]);
    }
  };
}
//# sourceMappingURL=index.js.map