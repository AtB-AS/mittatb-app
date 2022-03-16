import { getConfigFromInitialConfig, InitialConfig } from './config';
import { startTokenStateMachine } from './token';
import { createFetcher } from './fetcher';
import { createAbtTokensService } from './token/abt-tokens-service';
import type {
  ActivateTokenRequest,
  StoredState,
  StoredToken,
  TokenError,
  TokenStatus,
  VisualState,
} from './token/types';
import { getSecureToken, getToken } from './native';
import type { PayloadAction } from './native/types';
import { getActivateTokenRequestBody } from './token/attest';
import { setupLogger, logger } from './logger';

export type { StoredToken } from './token/types';
export type { Token } from './native/types';
export { RequestError } from './fetcher';
export type { Fetch, ApiResponse, ApiRequest } from './config';
export { PayloadAction } from './native/types';

const INITIAL_RETRY_INTERVAL = 5000;
const MAXIMUM_RETRY_INTERVAL = 1000 * 60 * 60; // 1 hour

export default function createClient(
  setStatus: (status?: TokenStatus) => void,
  initialConfig: InitialConfig
) {
  const { safetyNetApiKey } = initialConfig;
  let currentStatus: TokenStatus | undefined;
  let currentAccountId: string | undefined;
  setupLogger({
    infoLogger: initialConfig.infoLogger,
    errorLogger: initialConfig.errorLogger,
  });

  async function reattest(
    tokenId: string,
    nonce: string,
    attestationEncryptionPublicKey: string
  ): Promise<ActivateTokenRequest> {
    if (!currentAccountId) {
      const error = new Error(
        `Tried to reattest ${tokenId}, but no account id set.`
      );
      logger.error(undefined, error, undefined);
      throw error;
    }

    return getActivateTokenRequestBody(
      currentAccountId,
      tokenId,
      nonce,
      attestationEncryptionPublicKey
    );
  }

  const config = getConfigFromInitialConfig(initialConfig);
  const fetcher = createFetcher(config, reattest);
  const abtTokensService = createAbtTokensService(fetcher, config.hosts);

  const toVisualState = (storedState: StoredState): VisualState => {
    if (storedState.error?.missingNetConnection) {
      return 'MissingNetConnection';
    } else if (storedState.error) {
      return 'Error';
    } else if (
      storedState.state === 'Validating' ||
      storedState.state === 'Valid'
    ) {
      return 'Token';
    } else {
      return 'Loading';
    }
  };
  let currentRetryInterval = INITIAL_RETRY_INTERVAL;
  let scheduledRetry: NodeJS.Timeout | undefined;

  const scheduleRetry = () => {
    scheduledRetry = setTimeout(
      () =>
        startTokenStateMachine(
          abtTokensService,
          setStatusWrapper,
          safetyNetApiKey,
          false,
          currentAccountId
        ),
      currentRetryInterval
    );
    // Exponential backoff for timeout interval capped to maximum of one hour
    currentRetryInterval = Math.min(
      currentRetryInterval * 2,
      MAXIMUM_RETRY_INTERVAL
    );
  };

  const unscheduleRetry = () => {
    if (scheduledRetry) {
      clearTimeout(scheduledRetry);
    }
    currentRetryInterval = INITIAL_RETRY_INTERVAL;
  };

  const setStatusWrapper = (storedState?: StoredState) => {
    // Do not give status callbacks for other accounts ids than the one
    // currently set
    if (storedState?.accountId && storedState.accountId !== currentAccountId) {
      return;
    }

    const status = storedState && {
      tokenId: 'tokenId' in storedState ? storedState.tokenId : undefined,
      state: storedState.state,
      error: sanitizeError(storedState.error),
      visualState: toVisualState(storedState),
    };
    currentStatus = status;
    setStatus(status);

    if (status?.error) {
      scheduleRetry();
    } else if (storedState?.state === 'Valid') {
      unscheduleRetry();
    }
  };

  return {
    setAccount(accountId: string | undefined) {
      if (currentAccountId !== accountId) {
        currentAccountId = accountId;
        unscheduleRetry();
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

      unscheduleRetry();
      startTokenStateMachine(
        abtTokensService,
        setStatusWrapper,
        safetyNetApiKey,
        forceRestart,
        currentAccountId
      );
    },
    toggleToken: async (tokenId: string): Promise<StoredToken[]> => {
      if (!currentAccountId) {
        const error = new Error(
          'Only able to toggle valid tokens on active account'
        );
        logger.error(undefined, error, undefined);
        return Promise.reject(error);
      }

      const { tokens } = await abtTokensService.toggleToken(tokenId, {
        overrideExisting: true,
      });

      return tokens;
    },
    listTokens: async (): Promise<StoredToken[] | undefined> => {
      if (!currentAccountId) {
        const error = new Error('No active account');
        logger.error(undefined, error, undefined);
        return Promise.reject(error);
      }

      return await abtTokensService.listTokens();
    },

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
     * @param actions the actions the created token may be used for
     * @return {Promise} a Promise for getting the secure token for the given
     * action
     */
    getSecureToken: async (
      actions: PayloadAction[]
    ): Promise<string | undefined> => {
      if (!currentAccountId || currentStatus?.visualState !== 'Token') {
        return Promise.resolve(undefined);
      }

      const token = await getToken(currentAccountId);

      if (!token) {
        const error = new Error(
          `Token not found for account '${currentAccountId}'`
        );
        logger.error(undefined, error, undefined);
        return Promise.reject(error);
      }

      return getSecureToken(currentAccountId, token.tokenId, true, actions);
    },
  };
}

const sanitizeError = (error?: TokenError) => {
  if (!error) return undefined;

  const newErr = new Error(
    typeof error.err === 'string' ? error.err : error.err?.message
  );

  newErr.name = error.err?.name;
  newErr.stack = error.err?.stack;

  return {
    ...error,
    err: newErr,
  };
};
