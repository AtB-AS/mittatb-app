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

export default function createClient(
  setStatus: (status?: TokenStatus) => void,
  initialConfig: InitialConfig
) {
  const { safetyNetApiKey } = initialConfig;
  const config = getConfigFromInitialConfig(initialConfig);
  const fetcher = createFetcher(config);
  const abtTokensService = createAbtTokensService(fetcher, config.hosts);

  let currentStatus: TokenStatus | undefined;
  let currentAccountId: string | undefined;

  const toVisualState = (storedState: StoredState): VisualState => {
    if (storedState.error?.missingNetConnection) {
      return 'MissingNetConnection';
    } else if (storedState.error) {
      return 'Error';
    } else if (['Valid', 'Validating'].includes(storedState.state)) {
      return 'Token';
    } else {
      return 'Loading';
    }
  };

  const setStatusWrapper = (storedState?: StoredState) => {
    // Do not give status callbacks for other accounts ids than the one
    // currently set
    if (storedState?.accountId && storedState.accountId !== currentAccountId) {
      return;
    }

    const status = storedState && {
      state: storedState.state,
      error: storedState.error,
      visualState: toVisualState(storedState),
    };
    currentStatus = status;
    setStatus(status);
  };

  return {
    setAccount(accountId: string | undefined) {
      if (currentAccountId !== accountId) {
        currentAccountId = accountId;
        startTokenStateMachine(
          abtTokensService,
          setStatusWrapper,
          safetyNetApiKey,
          false,
          accountId
        );
      }
    },
    retry: (forceRestart: boolean) => {
      if (!currentAccountId) {
        return;
      }

      if (!forceRestart && currentStatus?.visualState === 'Loading') {
        return;
      }

      startTokenStateMachine(
        abtTokensService,
        setStatusWrapper,
        safetyNetApiKey,
        forceRestart,
        currentAccountId
      );
    },
    generateQrCode: (): Promise<string | undefined> => {
      if (!currentAccountId || currentStatus?.visualState !== 'Token') {
        return Promise.resolve(undefined);
      }

      return getSecureToken(currentAccountId, [PayloadAction.ticketInspection]);
    },
  };
}
