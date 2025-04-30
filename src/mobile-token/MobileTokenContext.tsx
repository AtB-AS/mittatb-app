import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useAuthContext} from '@atb/auth';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
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
} from '@atb/mobile-token/hooks/use-list-remote-tokens-query';
import {usePreemptiveRenewTokenMutation} from '@atb/mobile-token/hooks/use-preemptive-renew-token-mutation';
import {
  LOAD_NATIVE_TOKEN_QUERY_KEY,
  useLoadNativeTokenQuery,
} from './hooks/use-load-native-token-query';
import {logToBugsnag, notifyBugsnag} from '@atb/utils/bugsnag-utils';
import {ONE_HOUR_MS} from '@atb/utils/durations';
import {useIntercomMetadata} from '@atb/chat';
import {useValidateToken} from '@atb/mobile-token/hooks/use-validate-token';

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
  const [secureContainer, setSecureContainer] = useState<string>();

  const traceId = useRef<string>(uuid());

  useEffect(() => setIsLoggingOut(false), [userId]);

  const enabled = !!userId && authStatus === 'authenticated' && !isLoggingOut;

  const {
    data: nativeToken,
    status: nativeTokenStatus,
    error: nativeTokenError,
  } = useLoadNativeTokenQuery(enabled, userId, traceId.current);

  useEffect(() => {
    const loadSecureContainer = async () => {
      if (nativeToken) {
        setSecureContainer(undefined);
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

  const {
    data: remoteTokens,
    status: remoteTokensStatus,
    error: remoteTokenError,
  } = useListRemoteTokensQuery(
    enabled && nativeToken !== undefined && secureContainer !== undefined,
    nativeToken?.tokenId,
    secureContainer,
  );
  const {mutate: checkRenewMutate} = usePreemptiveRenewTokenMutation(userId);

  useEffect(() => {
    logToBugsnag('Invalidating list tokens query after token change', {
      tokenId: nativeToken?.tokenId,
    });
    queryClient.invalidateQueries([
      MOBILE_TOKEN_QUERY_KEY,
      LIST_REMOTE_TOKENS_QUERY_KEY,
      userId,
      nativeToken?.tokenId,
      secureContainer,
    ]);
  }, [queryClient, userId, nativeToken?.tokenId, secureContainer]);

  useEffect(() => {
    if (nativeTokenStatus === 'loading') {
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

  const {isRenewingOrResetting} = useValidateToken(
    nativeToken,
    remoteTokens,
    traceId.current,
  );

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
          queryClient.resetQueries([MOBILE_TOKEN_QUERY_KEY]);
        }, [queryClient]),
        clearTokenAtLogout: useCallback(() => {
          setIsLoggingOut(true);
          return wipeToken(
            nativeToken ? [nativeToken.tokenId] : [],
            uuid(),
          ).then(() => queryClient.resetQueries([MOBILE_TOKEN_QUERY_KEY]));
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
                () => queryClient.resetQueries([MOBILE_TOKEN_QUERY_KEY]),
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

const useMobileTokenStatus = (
  loadNativeTokenStatus: QueryStatus,
  remoteTokensStatus: QueryStatus,
  nativeToken: ActivatedToken | undefined,
  remoteTokens: RemoteToken[] | undefined,
  isRenewingOrResetting: boolean,
  isTimeout: boolean,
): MobileTokenStatus => {
  const {
    enable_token_fallback,
    enable_token_fallback_on_timeout,
    use_trygg_overgang_qr_code,
  } = useRemoteConfigContext();

  const fallbackStatus = use_trygg_overgang_qr_code ? 'staticQr' : 'fallback';

  if (isTimeout)
    return enable_token_fallback_on_timeout ? fallbackStatus : 'loading';

  if (isRenewingOrResetting) return 'loading';

  switch (loadNativeTokenStatus) {
    case 'loading':
      return 'loading';
    case 'error':
      return enable_token_fallback ? fallbackStatus : 'error';
    case 'success':
      switch (remoteTokensStatus) {
        case 'loading':
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
): boolean => {
  if (!token || !remoteTokens) return false;
  const matchingRemoteToken = remoteTokens.find((r) => r.id === token.tokenId);
  if (!matchingRemoteToken) return false;
  return isInspectable(matchingRemoteToken);
};

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
  } catch (err) {
    return undefined;
  }
};
