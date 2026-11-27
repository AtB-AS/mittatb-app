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
import {MobileTokenStatus, Token, TokenLimitResponse} from './types';

import {v4 as uuid} from 'uuid';
import Bugsnag from '@bugsnag/react-native';
import {
  AbtErrorDetails,
  AbtTokenDetails,
  useAbtMobileClient,
} from '@entur-private/react-native-abt';
import {AbtMobileClient, CONTEXT_ID} from './mobileTokenClient';
import {MOBILE_TOKEN_QUERY_KEY} from './utils';
import {tokenService} from './tokenService';
import {QueryStatus, useQueryClient} from '@tanstack/react-query';
import {
  LIST_REMOTE_TOKENS_QUERY_KEY,
  useListRemoteTokensQuery,
} from './hooks/use-list-remote-tokens-query';
import {
  errorToMetadata,
  logToBugsnag,
  notifyBugsnag,
} from '@atb/utils/bugsnag-utils';
import {useIntercomMetadata} from '@atb/modules/chat';
import {removeTokenAndLogout} from './remove-token-and-logout';
import {setAttestationRequirementReporter} from './attestation-requirement';
import {LifecycleStatus, useTokenLifecycle} from './use-token-lifecycle';
import {isTokenLoading} from './is-token-loading';
import {useSaveLastTokenUser} from './use-save-last-token-user';

let cancelTimeoutHandler: (() => void) | undefined = undefined;

type MobileTokenContextState = {
  tokens: Token[];
  mobileTokenStatus: MobileTokenStatus;
  isInspectable: boolean;
  retry: () => void;
  clearTokenAtLogout: () => Promise<void>;
  getTokenToggleDetails: () => Promise<TokenLimitResponse | undefined>;
  refreshTokenDetails: () => Promise<void>;
  tokenDetails: AbtTokenDetails | null;
  debug: {
    errorDetails: AbtErrorDetails | null;
    remoteTokensStatus: QueryStatus;
    remoteTokenError: any;
    removeRemoteToken: (tokenId: string) => void;
    createToken: () => Promise<void>;
    wipeToken: () => Promise<void>;
    setAlwaysFallback: (alwaysFallback: boolean) => void;
    alwaysFallback: boolean;
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
  const {tokenDetails, errorDetails} = useAbtMobileClient(CONTEXT_ID);

  const {token_timeout_in_seconds} = useRemoteConfigContext();

  const [isTimeout, setIsTimeout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [alwaysFallback, setAlwaysFallback] = useState<boolean>(false);
  const [allTokenInspectable, setAllTokenInspectable] = useState<
    boolean | undefined
  >();

  const traceId = useRef<string>(uuid());

  useEffect(() => setIsLoggingOut(false), [userId]);

  const enabled = !!userId && authStatus === 'authenticated' && !isLoggingOut;

  const tokenId = tokenDetails?.tokenId;

  /**
   * The latest token id, kept after the SDK clears its token details at
   * logout. Used to remove a token created while logging out, and to tell
   * whether a login gave the device a new token.
   */
  const latestTokenId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (tokenId) latestTokenId.current = tokenId;
  }, [tokenId]);

  const saveLastTokenUser = useSaveLastTokenUser(tokenId);

  const {lifecycleStatus, isStartFailed, resetRun} = useTokenLifecycle({
    enabled,
    userId,
    retryCount,
    latestTokenId,
    onLogin: saveLastTokenUser,
  });

  /**
   * Fetch the list of remote tokens, this is the list of tokens you see in the
   * token toggle screen. It can also give this device's token the inspection
   * right.
   */
  const {
    data: remoteTokens,
    status: remoteTokensStatus,
    error: remoteTokenError,
  } = useListRemoteTokensQuery(
    enabled && lifecycleStatus === 'done' && !!tokenDetails,
    tokenDetails?.tokenId,
    allTokenInspectable,
  );

  /**
   * Only signed calls through the token list can report Entur's reattestation
   * requirement to the SDK, so fetch the list again when a details call got
   * one.
   */
  useEffect(() => {
    setAttestationRequirementReporter(() =>
      queryClient.invalidateQueries({
        queryKey: [MOBILE_TOKEN_QUERY_KEY, LIST_REMOTE_TOKENS_QUERY_KEY],
      }),
    );
    return () => setAttestationRequirementReporter(undefined);
  }, [queryClient]);

  const isAttested = tokenDetails?.attested;
  const hasError = !!errorDetails;

  /**
   * Send the token statistics (success/error) to backend and Intercom.
   */
  useEffect(() => {
    if (lifecycleStatus !== 'done') return;
    if (tokenId) {
      const tokenStatus = isAttested ? 'attested' : 'non-attested';
      updateMetadata({
        'AtB-Mobile-Token-Id': tokenId,
        'AtB-Mobile-Token-Status': tokenStatus,
        'AtB-Mobile-Token-Error-Correlation-Id': undefined,
      });
      tokenService.postTokenStatus(tokenId, tokenStatus, undefined);
    } else if (hasError || isStartFailed) {
      updateMetadata({
        'AtB-Mobile-Token-Id': undefined,
        'AtB-Mobile-Token-Status': 'error',
        'AtB-Mobile-Token-Error-Correlation-Id': traceId.current,
      });
      tokenService.postTokenStatus(undefined, 'error', traceId.current);
    }
  }, [
    lifecycleStatus,
    tokenId,
    isAttested,
    hasError,
    isStartFailed,
    updateMetadata,
  ]);

  /**
   * Leave a breadcrumb for SDK errors. The error itself is already reported to
   * Bugsnag by the SDK logger (see abtClientLogger).
   */
  useEffect(() => {
    if (!errorDetails) return;
    logToBugsnag(`Mobile token SDK error: ${errorDetails.message}`, {
      type: errorDetails.type,
      resolution: errorDetails.resolution,
      stack: errorDetails.stack?.join(' <- '),
      traceId: traceId.current,
    });
  }, [errorDetails]);

  const isWaitingForTokenList =
    !!tokenDetails &&
    !tokenDetails.hasInspectionRight &&
    allTokenInspectable === undefined &&
    remoteTokensStatus === 'pending';

  /**
   * The list failed while the local token doesn't have the inspection right.
   * The list could have given it, so we don't know if this device is
   * inspectable.
   */
  const isTokenListFailed =
    !!tokenDetails &&
    !tokenDetails.hasInspectionRight &&
    allTokenInspectable === undefined &&
    remoteTokensStatus === 'error';

  const isLoading = isTokenLoading({
    lifecycleStatus,
    hasTokenDetails: !!tokenDetails,
    hasError,
    isStartFailed,
    isWaitingForTokenList,
  });

  useEffect(() => {
    if (isLoading) {
      cancelTimeoutHandler = timeoutHandler(() => {
        setIsTimeout(true);

        notifyBugsnag(
          new Error(
            `Token loading timed out after ${token_timeout_in_seconds} seconds`,
          ),
          {
            errorGroupHash: 'TokenLoadingTimeoutError',
            metadata: {
              description: 'Mobile token took too long to load.',
            },
          },
        );
      }, token_timeout_in_seconds);
    } else {
      cancelTimeoutHandler?.();
      setIsTimeout(false);
    }
  }, [isLoading, token_timeout_in_seconds]);

  /**
   * The remote list can grant or show a moved inspection right before the SDK's local token details know about it, so
   * prefer it when deciding whether this device has the inspection right.
   */
  const thisDeviceRemoteToken = remoteTokens?.find((t) => t.isThisDevice);

  /**
   * The list doesn't have this device's token, so it was probably removed on
   * the server. Don't trust the local inspection right then.
   */
  const isMissingFromTokenList =
    remoteTokensStatus === 'success' && !thisDeviceRemoteToken;

  const deviceInspectable = thisDeviceRemoteToken
    ? thisDeviceRemoteToken.isInspectable
    : (allTokenInspectable ??
      (!isMissingFromTokenList && !!tokenDetails?.hasInspectionRight));

  /**
   * Refresh the token details when the token is missing from the list. If the
   * token was removed on the server, the SDK finds out and creates a new one.
   */
  useEffect(() => {
    if (isMissingFromTokenList) refreshTokenDetails();
  }, [isMissingFromTokenList, tokenId]);

  const remoteInspectable = thisDeviceRemoteToken?.isInspectable;
  const localInspectable = tokenDetails?.hasInspectionRight;
  useEffect(() => {
    if (allTokenInspectable !== undefined) return;
    if (remoteInspectable === undefined || localInspectable === undefined)
      return;
    if (remoteInspectable !== localInspectable) refreshTokenDetails();
  }, [remoteInspectable, localInspectable, allTokenInspectable]);

  const mobileTokenStatus = useMobileTokenStatus(
    lifecycleStatus,
    isWaitingForTokenList,
    isTokenListFailed,
    tokenDetails,
    hasError || isStartFailed,
    deviceInspectable,
    alwaysFallback,
    isTimeout,
  );

  const isInspectable = getIsInspectableFromStatus(mobileTokenStatus);

  /**
   * Remove the token from the account, log out of the SDK and reset the token
   * state. Used at logout and by the debug wipe.
   */
  const tearDownToken = useCallback(
    async (description: string) => {
      await removeTokenAndLogout({tokenId, latestTokenId, description});
      resetRun();
      await queryClient.resetQueries({queryKey: [MOBILE_TOKEN_QUERY_KEY]});
    },
    [queryClient, tokenId, resetRun],
  );

  return (
    <MobileTokenContext.Provider
      value={{
        tokens: remoteTokens || [],
        mobileTokenStatus,
        isInspectable,
        retry: useCallback(() => {
          Bugsnag.leaveBreadcrumb('Retrying mobile token load');
          queryClient.resetQueries({queryKey: [MOBILE_TOKEN_QUERY_KEY]});
          setRetryCount((count) => count + 1);
        }, [queryClient]),
        clearTokenAtLogout: useCallback(async () => {
          setIsLoggingOut(true);
          await tearDownToken('Error removing token at logout');
        }, [tearDownToken]),
        getTokenToggleDetails,
        refreshTokenDetails,
        tokenDetails,
        debug: {
          errorDetails,
          remoteTokensStatus,
          remoteTokenError,
          removeRemoteToken: async (tokenId) => {
            // token-service answers with an empty body, so `removed` is never
            // set. The call throws if the removal fails.
            await tokenService.removeToken(tokenId, uuid());
            queryClient.invalidateQueries({
              queryKey: [MOBILE_TOKEN_QUERY_KEY, LIST_REMOTE_TOKENS_QUERY_KEY],
            });
          },
          createToken: async () => {
            try {
              await AbtMobileClient.login(CONTEXT_ID);
            } catch (err: any) {
              logToBugsnag(
                'Error creating token from debug',
                errorToMetadata(err),
              );
            }
          },
          wipeToken: () => tearDownToken('Error removing token from debug'),
          setAlwaysFallback,
          alwaysFallback,
          setAllTokenInspectable,
          allTokenInspectable,
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
 * Determines the overall status of the mobile token process.
 *
 * Logic:
 * - If a timeout has occurred (or fallback is forced), returns a fallback
 *   status or 'loading' based on config.
 * - While the SDK is starting, or a token without the inspection right waits
 *   for the token list, returns 'loading'.
 * - If the SDK has no token after starting and reports an error, returns a
 *   fallback/error status.
 * - If the token list failed for a token without the inspection right,
 *   returns a fallback/error status.
 * - Otherwise determines if the device is inspectable and returns the
 *   appropriate status.
 */
const useMobileTokenStatus = (
  lifecycleStatus: LifecycleStatus,
  isWaitingForTokenList: boolean,
  isTokenListFailed: boolean,
  tokenDetails: AbtTokenDetails | null,
  hasError: boolean,
  deviceInspectable: boolean,
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

  if (lifecycleStatus !== 'done' || isWaitingForTokenList) return 'loading';

  if (!tokenDetails) {
    // The token details may arrive shortly after `start` resolves
    if (!hasError) return 'loading';
    return enable_token_fallback ? fallbackStatus : 'error';
  }

  if (isTokenListFailed)
    return enable_token_fallback ? fallbackStatus : 'error';

  return deviceInspectable
    ? use_trygg_overgang_qr_code
      ? 'staticQr'
      : 'success-and-inspectable'
    : 'success-not-inspectable';
};

/**
 * Determines if a mobile token status is inspectable.
 *
 * Inspectable means that the token has the `TICKET_INSPECTION` right on the backoffice.
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

const refreshTokenDetails = async () => {
  try {
    await AbtMobileClient.updateLocalTokenFromRemote(CONTEXT_ID);
  } catch (err: any) {
    // Only a breadcrumb: the SDK logger already sends the error to Bugsnag
    logToBugsnag('Error refreshing token details', errorToMetadata(err));
  }
};
