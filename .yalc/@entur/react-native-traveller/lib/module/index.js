import { getConfigFromInitialConfig } from './config';
import { getToken, deleteToken, getSecureToken } from './native';
import { createInitToken, createRenewToken, isTokenValid } from './token';
import { createFetcher } from './fetcher';
import { PayloadAction } from './native/types';
export { isTokenValid } from './token';
export { RequestError } from './fetcher';

async function onStartup(fetcher, hosts) {
  const token = await getToken();

  if (token && !isTokenValid(token)) {
    createRenewToken(fetcher, hosts)(token);
  }
}

export default function createClient(initialConfig) {
  const config = getConfigFromInitialConfig(initialConfig);
  const fetcher = createFetcher(config);
  onStartup(fetcher, config.hosts);
  return {
    initToken: createInitToken(fetcher, config.hosts),
    getToken,
    deleteToken,
    generateQrCode: () => getSecureToken([PayloadAction.ticketInspection])
  };
}
//# sourceMappingURL=index.js.map