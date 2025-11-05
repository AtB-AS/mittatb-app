import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useAuthContext} from '@atb/modules/auth';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {
  MobileTokenStatus,
  RemoteToken,
  Token,
  TokenLimitResponse,
} from './types';

import {v4 as uuid} from 'uuid';
import Bugsnag from '@bugsnag/react-native';
import {mobileTokenClient} from './mobileTokenClient';
import {
  ActivatedToken,
  AttestationSabotage,
} from '@entur-private/abt-mobile-client-sdk';
import {isInspectable, MOBILE_TOKEN_QUERY_KEY, wipeToken} from './utils';
import {tokenService} from './tokenService';
import {QueryStatus, useQueryClient} from '@tanstack/react-query';
import {useInterval} from '@atb/utils/use-interval';
import {
  LIST_REMOTE_TOKENS_QUERY_KEY,
  useListRemoteTokensQuery,
} from './hooks/use-list-remote-tokens-query';
import {usePreemptiveRenewTokenMutation} from './hooks/use-preemptive-renew-token-mutation';
import {
  LOAD_NATIVE_TOKEN_QUERY_KEY,
  useLoadNativeTokenQuery,
} from './hooks/use-load-native-token-query';
import {logToBugsnag, notifyBugsnag} from '@atb/utils/bugsnag-utils';
import {ONE_HOUR_MS} from '@atb/utils/durations';
import {useIntercomMetadata} from '@atb/modules/chat';
import {useValidateToken} from './hooks/use-validate-token';

const SIX_HOURS_MS = ONE_HOUR_MS * 6;

let cancelTimeoutHandler: (() => void) | undefined = undefined;

type MobileTokenContextState = {
  tokens: Token[];
  /**
   * The status of the whole mobile token process.
   */
  mobileTokenStatus: MobileTokenStatus;
  /**
   * Will return true if the phone is inspectable, whether it is with mobile token
   * or static barcode.
   */
  isInspectable: boolean;
  retry: () => void;
  clearTokenAtLogout: () => Promise<void>;
  getTokenToggleDetails: () => Promise<TokenLimitResponse | undefined>;
  nativeToken?: ActivatedToken;
  secureContainer?: string;
  /**
   * Low level debug details and functions of the mobile token process, for the
   * debug screen
   */
  debug: {
    nativeTokenStatus: QueryStatus;
    remoteTokensStatus: QueryStatus;
    createToken: () => void;
    removeRemoteToken: (tokenId: string) => void;
    renewToken: () => void;
    wipeToken: () => void;
    nativeTokenError: any;
    remoteTokenError: any;
    setSabotage: (attestationSabotage?: AttestationSabotage) => void;
    sabotage: AttestationSabotage | undefined;
    setAllTokenInspectable: (inspectable?: boolean) => void;
    allTokenInspectable: boolean | undefined;
  };
};

const MobileTokenContext = createContext<MobileTokenContextState | undefined>(
  undefined,
);

type Props = {
  children: React.ReactNode;
};

export const MobileTokenContextProvider = ({children}: Props) => {
  const {userId, authStatus} = useAuthContext();
  const queryClient = useQueryClient();
  const {updateMetadata} = useIntercomMetadata();

  const {token_timeout_in_seconds} = useRemoteConfigContext();

  const [isTimeout, setIsTimeout] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sabotage, setSabotage] = useState<AttestationSabotage | undefined>();
  const [allTokenInspectable, setAllTokenInspectable] = useState<
    boolean | undefined
  >();
  const [secureContainer, setSecureContainer] = useState<string>();

  const traceId = useRef<string>(uuid());

  useEffect(() => setIsLoggingOut(false), [userId]);

  const enabled = !!userId && authStatus === 'authenticated' && !isLoggingOut;

  /**
   * Fetch the local token (if available), if there are no local token,
   * we request a new token from remote in here as well.
   */
  const {
    data: nativeToken,
    status: nativeTokenStatus,
    error: nativeTokenError,
  } = useLoadNativeTokenQuery(enabled, userId, traceId.current);

  /**
   * Send the token statistics (success/error) to backend to update
   * also process the secure container so we can fetch the token list.
   */
  useEffect(() => {
    setSecureContainer(undefined);

    const loadSecureContainer = async () => {
      if (nativeToken) {
        await mobileTokenClient.encode(nativeToken).then((secureContainer) => {
          setSecureContainer(secureContainer);
        });
      }
    };

    loadSecureContainer();

    if (nativeTokenStatus === 'success') {
      const tokenStatus = nativeToken.isAttested()
        ? 'attested'
        : 'non-attested';

      updateMetadata({
        'AtB-Mobile-Token-Id': nativeToken.tokenId,
        'AtB-Mobile-Token-Status': tokenStatus,
        'AtB-Mobile-Token-Error-Correlation-Id': undefined,
      });
      tokenService.postTokenStatus(nativeToken.tokenId, tokenStatus, undefined);
    } else if (nativeTokenStatus === 'error') {
      updateMetadata({
        'AtB-Mobile-Token-Id': undefined,
        'AtB-Mobile-Token-Status': 'error',
        'AtB-Mobile-Token-Error-Correlation-Id': traceId.current,
      });
      tokenService.postTokenStatus(undefined, 'error', traceId.current);
    }
  }, [nativeToken, nativeTokenStatus, updateMetadata]);

  /**
   * fetch the list of remote token, this is the list of tokens you see
   * in the token toggle screen.
   */
  const {
    data: remoteTokens,
    status: remoteTokensStatus,
    error: remoteTokenError,
  } = useListRemoteTokensQuery(
    enabled && nativeToken !== undefined && secureContainer !== undefined,
    nativeToken?.tokenId,
    secureContainer,
    allTokenInspectable,
  );

  /**
   * Try to pre-emptively renew the token if it is about to expire
   */
  const {mutate: checkRenewMutate} = usePreemptiveRenewTokenMutation(userId);

  /**
   * Invalidates the list of mobile tokens in the query cache whenever relevant dependencies change.
   *
   * - Logs a breadcrumb to Bugsnag for traceability.
   * - Calls `invalidateQueries` on the query client to refresh the token list.
   * - Ensures that the UI and data remain in sync after changes to the native token, user, or secure container.
   *
   * Dependencies:
   * - `queryClient`: The React Query client instance.
   * - `userId`: The current user's ID.
   * - `nativeToken?.tokenId`: The ID of the loaded native token.
   * - `secureContainer`: The encoded secure container string.
   */
  useEffect(() => {
    logToBugsnag('Invalidating list tokens query after token change', {
      tokenId: nativeToken?.tokenId,
    });
    queryClient.invalidateQueries({
      queryKey: [
        MOBILE_TOKEN_QUERY_KEY,
        LIST_REMOTE_TOKENS_QUERY_KEY,
        userId,
        nativeToken?.tokenId,
        secureContainer,
      ],
    });
  }, [queryClient, userId, nativeToken?.tokenId, secureContainer]);

  /**
   * Handles timeout logic for loading the native token.
   *
   * - When the native token status is 'loading', starts a timeout using `timeoutHandler`.
   *   If the timeout elapses before the token loads, sets the `isTimeout` state to true
   *   and reports the timeout error to Bugsnag.
   * - If the native token status changes to anything other than 'loading', cancels any
   *   existing timeout and resets the `isTimeout` state to false.
   *
   * Dependencies:
   * - `nativeTokenStatus`: Triggers effect when the loading status changes.
   * - `token_timeout_in_seconds`: Timeout duration from remote config.
   */
  useEffect(() => {
    if (nativeTokenStatus === 'pending') {
      cancelTimeoutHandler = timeoutHandler(() => {
        // When timeout has occured, we notify errors in Bugsnag
        // and set state that indicates timeout.
        setIsTimeout(true);

        notifyBugsnag(
          new Error(
            `Token loading timed out after ${token_timeout_in_seconds} seconds`,
          ),
          {
            errorGroupHash: 'TokenLoadingTimeoutError',
            metadata: {
              description: 'Native and remote tokens took too long to load.',
            },
          },
        );
      }, token_timeout_in_seconds);
    } else {
      // We've finished with remote tokens. Cancel timeout notification.
      cancelTimeoutHandler?.();
      setIsTimeout(false);
    }
  }, [nativeTokenStatus, token_timeout_in_seconds]);

  /**
   * `isRenewingOrResetting` to show/hide the loading status
   * checks token to see if we need to renew/reset, returns
   * for the users
   */
  const {isRenewingOrResetting, isRenewOrResetError} = useValidateToken(
    nativeToken,
    remoteTokens,
    traceId.current,
  );

  /**
   * Periodically checks if the native token should be preemptively renewed.
   * Ensures that the token remains valid and up-to-date without user intervention.
   *
   */
  useInterval(
    () => checkRenewMutate({token: nativeToken, traceId: uuid()}),
    [checkRenewMutate, nativeToken],
    SIX_HOURS_MS,
    false,
    true,
  );

  const mobileTokenStatus = useMobileTokenStatus(
    nativeTokenStatus,
    remoteTokensStatus,
    nativeToken,
    remoteTokens,
    isRenewingOrResetting,
    isRenewOrResetError,
    isTimeout,
  );

  const isInspectable = getIsInspectableFromStatus(mobileTokenStatus);

  return (
    <MobileTokenContext.Provider
      value={{
        tokens: remoteTokens || [],
        mobileTokenStatus,
        isInspectable,
        retry: useCallback(() => {
          Bugsnag.leaveBreadcrumb('Retrying mobile token load');
          queryClient.resetQueries({queryKey: [MOBILE_TOKEN_QUERY_KEY]});
        }, [queryClient]),
        clearTokenAtLogout: useCallback(() => {
          setIsLoggingOut(true);
          return wipeToken(
            nativeToken ? [nativeToken.tokenId] : [],
            uuid(),
          ).then(() =>
            queryClient.resetQueries({queryKey: [MOBILE_TOKEN_QUERY_KEY]}),
          );
        }, [queryClient, nativeToken]),
        getTokenToggleDetails,
        nativeToken,
        secureContainer,
        debug: {
          nativeTokenStatus,
          remoteTokensStatus,
          createToken: () => mobileTokenClient.create(uuid()),
          removeRemoteToken: async (tokenId) => {
            const removed = await tokenService.removeToken(tokenId, uuid());
            if (removed) {
              queryClient.setQueryData(
                [MOBILE_TOKEN_QUERY_KEY, LIST_REMOTE_TOKENS_QUERY_KEY],
                remoteTokens?.filter(({id}) => id !== tokenId),
              );
            }
          },
          renewToken: () =>
            mobileTokenClient
              .renew(nativeToken!, uuid())
              .then((renewedToken) => {
                queryClient.setQueryData(
                  [MOBILE_TOKEN_QUERY_KEY, LOAD_NATIVE_TOKEN_QUERY_KEY, userId],
                  renewedToken,
                );
              }),
          wipeToken: useCallback(
            () =>
              wipeToken(nativeToken ? [nativeToken.tokenId] : [], uuid()).then(
                () =>
                  queryClient.resetQueries({
                    queryKey: [MOBILE_TOKEN_QUERY_KEY],
                  }),
              ),
            [queryClient, nativeToken],
          ),
          nativeTokenError: nativeTokenError,
          remoteTokenError: remoteTokenError,
          setSabotage: (attestationSabotage?: AttestationSabotage) => {
            setSabotage(attestationSabotage);
            if (attestationSabotage) {
              mobileTokenClient.setDebugSabotage(attestationSabotage);
            } else {
              mobileTokenClient.clearDebugSabotage();
            }
          },
          sabotage: sabotage,
          setAllTokenInspectable: (inspectable?: boolean) => {
            setAllTokenInspectable(inspectable);
          },
          allTokenInspectable: allTokenInspectable,
        },
      }}
    >
      {children}
    </MobileTokenContext.Provider>
  );
};

export function useMobileTokenContext() {
  const context = useContext(MobileTokenContext);
  if (context === undefined) {
    throw new Error(
      'useMobileTokenContextState must be used within a MobileTokenContextProvider',
    );
  }
  return context;
}

/**
 * Call and cancel an action with a specific timeout.
 * If timeoutInSeconds is 0 the timeout is deactivated.
 *
 * @param fn handle to call on time
 * @param timeoutInSeconds timeout in seconds
 * @returns cancellable timeout
 */
function timeoutHandler<T>(fn: () => T, timeoutInSeconds: number): () => void {
  if (timeoutInSeconds <= 0) {
    // Do nothing, as timeout is deactivated
    return () => {};
  }

  const timeoutId = setTimeout(fn, timeoutInSeconds * 1000);

  return () => {
    clearTimeout(timeoutId);
  };
}

/**
 * Determines the overall status of the mobile token process based on various factors.
 *
 * Considers the loading and error status of both the native token and remote tokens.
 * Takes into account whether the token is currently being renewed or reset, or if a timeout has occurred.
 * Supports fallback modes based on remote config flags, including static QR code fallback.
 *
 * Logic:
 * - If a timeout has occurred, returns a fallback status or 'loading' based on config.
 * - If a renewal or reset is in progress, returns 'loading'.
 * - If the native token is loading or has errored, returns 'loading' or a fallback/error status.
 * - If the native token is loaded successfully, checks the remote tokens status:
 *   - If remote tokens are loading or errored, returns 'loading' or a fallback/error status.
 *   - If both are successful, determines if the device is inspectable and returns the appropriate status.
 *
 * @param loadNativeTokenStatus Status of loading the native token (React Query).
 * @param remoteTokensStatus Status of loading the remote tokens (React Query).
 * @param nativeToken The loaded native token, if available.
 * @param remoteTokens The list of remote tokens, if available.
 * @param isRenewingOrResetting Whether a renewal or reset operation is in progress. (from `useValidateToken`)
 * @param isTimeout Whether a timeout has occurred while loading tokens.
 * @returns The computed MobileTokenStatus string.
 */
const useMobileTokenStatus = (
  loadNativeTokenStatus: QueryStatus,
  remoteTokensStatus: QueryStatus,
  nativeToken: ActivatedToken | undefined,
  remoteTokens: RemoteToken[] | undefined,
  isRenewingOrResetting: boolean,
  shouldFallback: boolean,
  isTimeout: boolean,
): MobileTokenStatus => {
  const {
    enable_token_fallback,
    enable_token_fallback_on_timeout,
    use_trygg_overgang_qr_code,
  } = useRemoteConfigContext();

  const fallbackStatus = use_trygg_overgang_qr_code ? 'staticQr' : 'fallback';

  if (isTimeout || shouldFallback)
    return enable_token_fallback_on_timeout ? fallbackStatus : 'loading';

  if (isRenewingOrResetting) return 'loading';

  switch (loadNativeTokenStatus) {
    case 'pending':
      return 'loading';
    case 'error':
      return enable_token_fallback ? fallbackStatus : 'error';
    case 'success':
      switch (remoteTokensStatus) {
        case 'pending':
          return 'loading';
        case 'error':
          return enable_token_fallback ? fallbackStatus : 'error';
        case 'success':
          return deviceInspectable(nativeToken, remoteTokens)
            ? use_trygg_overgang_qr_code
              ? 'staticQr'
              : 'success-and-inspectable'
            : 'success-not-inspectable';
      }
  }
};

/**
 * Whether this device is inspectable or not. It is inspectable if:
 * - A mobile token for this device exists
 * - A remote token is found matching the id of the mobile token for this device
 * - The found remote token has the inspectable action
 */
const deviceInspectable = (
  token?: ActivatedToken,
  remoteTokens?: RemoteToken[],
  debugInspectable?: boolean,
): boolean => {
  if (!token || !remoteTokens) return false;
  const matchingRemoteToken = remoteTokens.find((r) => r.id === token.tokenId);
  if (!matchingRemoteToken) return false;
  return debugInspectable ?? isInspectable(matchingRemoteToken);
};

/**
 * Determines if a mobile token status is inspectable.
 *
 * Inspectable means that the token has the `TICKET_INSPECTION` right on the backoffice.
 *
 * @param mobileTokenStatus - The current status of the mobile token.
 *   - `'success-and-inspectable'`: The token is successfully generated and can be inspected.
 *   - `'fallback'`: The token is in a fallback state and can be inspected.
 *   - `'staticQr'`: The token is represented as a static QR and can be inspected.
 *   - `'error'`: The token generation failed and is not inspectable.
 *   - `'success-not-inspectable'`: The token is generated but cannot be inspected.
 *   - `'loading'`: The token is in the process of being generated and is not inspectable.
 * @returns `true` if the status is inspectable, otherwise `false`.
 */
export const getIsInspectableFromStatus = (
  mobileTokenStatus: MobileTokenStatus,
): boolean => {
  switch (mobileTokenStatus) {
    case 'success-and-inspectable':
    case 'fallback':
    case 'staticQr':
      return true;
    case 'error':
    case 'success-not-inspectable':
    case 'loading':
      return false;
  }
};

const getTokenToggleDetails = async () => {
  try {
    return await tokenService.getTokenToggleDetails();
  } catch {
    return undefined;
  }
};
