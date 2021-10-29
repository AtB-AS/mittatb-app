import { getConfigFromInitialConfig } from './config';
import { startTokenStateMachine } from './token';
import { createFetcher } from './fetcher';
import { createAbtTokensService } from './token/abt-tokens-service';
import { getSecureToken } from './native';
import { PayloadAction } from './native/types';
export { RequestError } from './fetcher';
export default function createClient(setStatus, initialConfig) {
  const config = getConfigFromInitialConfig(initialConfig);
  const fetcher = createFetcher(config);
  const abtTokensService = createAbtTokensService(fetcher, config.hosts);

  const setStatusWrapper = storedState => {
    setStatus({
      state: storedState.state,
      error: storedState.error
    });
  };

  startTokenStateMachine(abtTokensService, setStatusWrapper);
  return {
    retry: forceRestart => {
      startTokenStateMachine(abtTokensService, setStatusWrapper, forceRestart); // Todo: Not start if already running
    },
    generateQrCode: () => getSecureToken([PayloadAction.ticketInspection])
  };
}
//# sourceMappingURL=index.js.map