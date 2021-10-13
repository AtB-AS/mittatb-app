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
  let lastSeenStatus;

  const setStatusWrapper = status => {
    lastSeenStatus = status;
    setStatus(status);
  };

  const startStateMachine = () => {
    startTokenStateMachine(abtTokensService, setStatusWrapper, lastSeenStatus).catch(err => {
      var _lastSeenStatus;

      console.warn('Unexpected error', err);
      setStatusWrapper({
        state: ((_lastSeenStatus = lastSeenStatus) === null || _lastSeenStatus === void 0 ? void 0 : _lastSeenStatus.state) || 'Loading',
        error: {
          type: 'Unknown',
          message: 'Unexpected error',
          err
        }
      });
    });
  };

  startStateMachine();
  return {
    restart: () => {
      startStateMachine();
    },
    generateQrCode: () => getSecureToken([PayloadAction.ticketInspection])
  };
}
//# sourceMappingURL=index.js.map