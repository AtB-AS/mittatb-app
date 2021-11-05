import { getConfigFromInitialConfig, InitialConfig } from './config';
import { startTokenStateMachine } from './token';
import { createFetcher } from './fetcher';
import { createAbtTokensService } from './token/abt-tokens-service';
import type { StoredState, TokenStatus, VisualState } from './token/types';
import { getSecureToken } from './native';
import { PayloadAction } from './native/types';

export type { Token } from './native/types';
export { RequestError } from './fetcher';
export type { Fetch, ApiResponse, ApiRequest } from './config';

export type ClientState = {
  accountId: string;
};

export type ClientStateRetriever = () => ClientState;

export default function createClient(
  setStatus: (status: TokenStatus) => void,
  initialState: ClientState,
  initialConfig?: InitialConfig
) {
  const config = getConfigFromInitialConfig(initialConfig);
  const fetcher = createFetcher(config);
  const abtTokensService = createAbtTokensService(fetcher, config.hosts);

  const toVisualState = (storedState: StoredState): VisualState => {
    if (storedState.error) {
      return 'Error';
    } else if (['Valid', 'Validating'].includes(storedState.state)) {
      return 'Token';
    } else {
      return 'Loading';
    }
  };

  const setStatusWrapper = (storedState: StoredState) => {
    setStatus({
      state: storedState.state,
      error: storedState.error,
      visualState: toVisualState(storedState),
    });
  };

  let clientState = { ...initialState };

  function clientStateRetriever() {
    return clientState;
  }

  startTokenStateMachine(
    abtTokensService,
    setStatusWrapper,
    clientStateRetriever
  );

  return {
    switch(accountId: string) {
      clientState = { ...clientState, accountId };
      startTokenStateMachine(
        abtTokensService,
        setStatusWrapper,
        clientStateRetriever,
        false
      );
    },
    retry: (forceRestart: boolean) => {
      startTokenStateMachine(
        abtTokensService,
        setStatusWrapper,
        clientStateRetriever,
        forceRestart
      ); // Todo: Not start if already running
    },
    generateQrCode: () => {
      const { accountId } = clientState;
      return getSecureToken(accountId, [PayloadAction.ticketInspection]);
    },
  };
}
