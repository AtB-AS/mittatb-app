import {
  getConfigFromInitialConfig,
  Fetch,
  InitialConfig,
  Hosts,
} from './config';
import { getToken, deleteToken, getSecureToken } from './native';
import { createInitToken, createRenewToken, isTokenValid } from './token';
import { createFetcher } from './fetcher';
import { PayloadAction } from './native/types';

export type { Token } from './native/types';
export { isTokenValid } from './token';
export { RequestError } from './fetcher';
export type { Fetch, ApiResponse, ApiRequest } from './config';

async function onStartup(fetcher: Fetch, hosts: Hosts) {
  const token = await getToken();

  if (token && !isTokenValid(token)) {
    createRenewToken(fetcher, hosts)(token);
  }
}

export default function createClient(initialConfig?: InitialConfig) {
  const config = getConfigFromInitialConfig(initialConfig);
  const fetcher = createFetcher(config);

  onStartup(fetcher, config.hosts);

  return {
    initToken: createInitToken(fetcher, config.hosts),
    getToken,
    deleteToken,
    generateQrCode: () => getSecureToken([PayloadAction.ticketInspection]),
  };
}
