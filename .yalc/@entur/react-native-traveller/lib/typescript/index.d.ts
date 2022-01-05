import { InitialConfig } from './config';
import type { TokenStatus } from './token/types';
import type { PayloadAction } from './native/types';
export type { Token } from './native/types';
export { RequestError } from './fetcher';
export type { Fetch, ApiResponse, ApiRequest } from './config';
export { PayloadAction } from './native/types';
export default function createClient(setStatus: (status?: TokenStatus) => void, initialConfig: InitialConfig): {
    setAccount(accountId: string | undefined): void;
    retry: (forceRestart: boolean) => void;
    /**
     * Get a secure token for the current active token on the current account.
     *
     * If no account set, or if the current token visual state is not 'Token',
     * undefined will be returned.
     *
     * You must specify the actions the secure token should be used for. For
     * example creating a qr code for inspection needs the 'ticketInspection'
     * action, and to retrieve fare contracts the 'getFarecontracts' is
     * necessary.
     *
     * @param action the action the created token may be used for
     * @return {Promise} a Promise for getting the secure token for the given
     * action
     */
    getSecureToken: (actions: PayloadAction[]) => Promise<string | undefined>;
};
