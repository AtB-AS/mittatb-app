import { getConfigFromInitialConfig, InitialConfig } from './config';
import { startTokenStateMachine } from './token';
import { createFetcher } from './fetcher';
import { createAbtTokensService } from './token/abt-tokens-service';
import type { TokenStatus } from './token/types';
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

  let lastSeenStatus: TokenStatus | undefined;
  const setStatusWrapper = (status: TokenStatus) => {
    lastSeenStatus = status;
    setStatus(status);
  };

  const startStateMachine = () => {
    startTokenStateMachine(
      abtTokensService,
      setStatusWrapper,
      lastSeenStatus
    ).catch((err) => {
      console.warn('Unexpected error', err);
      setStatusWrapper({
        state: lastSeenStatus?.state || 'Loading',
        error: { type: 'Unknown', message: 'Unexpected error', err },
      });
    });
  };

  startStateMachine();

  return {
    restart: () => {
      startStateMachine();
    },
    generateQrCode: () => getSecureToken([PayloadAction.ticketInspection]),
  };
}
