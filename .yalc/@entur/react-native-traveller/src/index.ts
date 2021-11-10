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
  accountId?: string;
};

export type ClientStateRetriever = () => ClientState;

export default function createClient(
  setStatus: (status?: TokenStatus) => void,
  initialConfig: InitialConfig
) {
  const { safetyNetApiKey } = initialConfig;
  const config = getConfigFromInitialConfig(initialConfig);
  const fetcher = createFetcher(config);
  const abtTokensService = createAbtTokensService(fetcher, config.hosts);

  let currentStatus: TokenStatus | undefined;

  const toVisualState = (storedState: StoredState): VisualState => {
    if (storedState.error) {
      return 'Error';
    } else if (['Valid', 'Validating'].includes(storedState.state)) {
      return 'Token';
    } else {
      return 'Loading';
    }
  };

  const setStatusWrapper = (storedState?: StoredState) => {
    const status = storedState && {
      state: storedState.state,
      error: storedState.error,
      visualState: toVisualState(storedState),
    };
    currentStatus = status;
    setStatus(status);
  };

  let clientState: ClientState = {};

  function clientStateRetriever() {
    return clientState;
  }

  return {
    setAccount(accountId: string | undefined) {
      clientState = { ...clientState, accountId };
      if (clientState.accountId) {
        startTokenStateMachine(
          abtTokensService,
          setStatusWrapper,
          clientStateRetriever,
          safetyNetApiKey,
          false
        );
      }
    },
    retry: (forceRestart: boolean) => {
      const { accountId } = clientState;
      if (!accountId) {
        throw new Error('Account id must be set');
      }

      if (currentStatus?.visualState === 'Loading') {
        throw new Error('Can not retry while the sdk is already running');
      }

      startTokenStateMachine(
        abtTokensService,
        setStatusWrapper,
        clientStateRetriever,
        safetyNetApiKey,
        forceRestart
      ); // Todo: Not start if already running
    },
    generateQrCode: () => {
      const { accountId } = clientState;
      if (!accountId) {
        throw new Error('Account id must be set');
      }

      if (currentStatus?.visualState !== 'Token') {
        throw new Error(
          'The current state does not allow retrieval of qr code'
        );
      }

      return getSecureToken(accountId, [PayloadAction.ticketInspection]);
    },
  };
}
