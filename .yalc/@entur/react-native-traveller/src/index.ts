import { getConfigFromInitialConfig, InitialConfig } from './config';
import { startTokenStateMachine } from './token';
import { createFetcher } from './fetcher';
import { createAbtTokensService } from './token/abt-tokens-service';
import type { StoredState, TokenStatus } from './token/types';
import { getSecureToken } from './native';
import { PayloadAction } from './native/types';

export type { Token } from './native/types';
export { RequestError } from './fetcher';
export type { Fetch, ApiResponse, ApiRequest } from './config';

export default function createClient(
  setStatus: (status: TokenStatus) => void,
  initialConfig?: InitialConfig
) {
  const config = getConfigFromInitialConfig(initialConfig);
  const fetcher = createFetcher(config);
  const abtTokensService = createAbtTokensService(fetcher, config.hosts);

  const setStatusWrapper = (storedState: StoredState) => {
    setStatus({
      state: storedState.state,
      error: storedState.error,
    });
  };

  startTokenStateMachine(abtTokensService, setStatusWrapper);

  return {
    restart: () => {
      startTokenStateMachine(abtTokensService, setStatusWrapper); // Todo: Not start if already running
    },
    generateQrCode: () => getSecureToken([PayloadAction.ticketInspection]),
  };
}
