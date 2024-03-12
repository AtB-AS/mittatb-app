import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import {useAuthState} from '@atb/auth';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {
  BarcodeStatus,
  DeviceInspectionStatus,
  MobileTokenStatus,
  RemoteToken,
  Token,
  TokenLimitResponse,
} from './types';

import {
  TokenEncodingInvalidRemoteTokenStateError,
  TokenMustBeRenewedRemoteTokenStateError,
  TokenMustBeReplacedRemoteTokenStateError,
  TokenNotFoundRemoteTokenStateError,
} from '@entur-private/abt-token-server-javascript-interface';
import {v4 as uuid} from 'uuid';
import {storage} from '@atb/storage';
import Bugsnag from '@bugsnag/react-native';
import {mobileTokenClient} from './mobileTokenClient';
import {
  ActivatedToken,
  TokenAction,
} from '@entur-private/abt-mobile-client-sdk';
import {isInspectable} from './utils';

import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import {updateMetadata} from '@atb/chat/metadata';
import {tokenService} from './tokenService';
import {tokenReducer} from '@atb/mobile-token/tokenReducer';
import {useQueryClient} from '@tanstack/react-query';
import {GET_TOKEN_TOGGLE_DETAILS_QUERY_KEY} from '@atb/mobile-token/use-token-toggle-details';
import {useInterval} from '@atb/utils/use-interval';
import {
  LIST_REMOTE_TOKENS_QUERY_KEY,
  useListRemoteTokensQuery,
} from '@atb/mobile-token/hooks/useListRemoteTokensQuery';
import {usePreemptiveRenewTokenMutation} from '@atb/mobile-token/hooks/usePreemptiveRenewTokenMutation';

const SIX_HOURS_MS = 1000 * 60 * 60 * 6;

type MobileTokenContextState = {
  tokens: Token[];
  /**
   * The technical status of the mobile token process. Note that 'success' means
   * that a token was created for this mobile, but not necessarily that it is
   * inspectable.
   */
  mobileTokenStatus: MobileTokenStatus;
  /**
   * A status which represents which type of barcode to show. This also takes into
   * account the fallback settings for error and loading.
   */
  barcodeStatus: BarcodeStatus;
  /**
   * A simplified status representing whether this device is inspectable or not.
   * The status 'inspectable' includes both working mobile token and static
   * barcode because of fallbacks. The status 'not-inspectable' includes both
   * situations where the current mobile token is not inspectable, or an error
   * has occurred (without fallback).
   */
  deviceInspectionStatus: DeviceInspectionStatus;
  toggleToken: (
    tokenId: string,
    bypassRestrictions: boolean,
  ) => Promise<boolean>;
  retry: () => void;
  wipeToken: () => Promise<void>;
  getTokenToggleDetails: () => Promise<TokenLimitResponse | undefined>;
  nativeToken?: ActivatedToken;
  /**
   * Low level debug details and functions of the mobile token process, for the
   * debug screen
   */
  debug: {
    validateToken: () => void;
    removeRemoteToken: (tokenId: string) => void;
    renewToken: () => void;
  };
};

const MobileTokenContext = createContext<MobileTokenContextState | undefined>(
  undefined,
);

export const MobileTokenContextProvider: React.FC = ({children}) => {
  const {userId, authStatus} = useAuthState();
  const [state, dispatch] = useReducer(tokenReducer, {status: 'none'});
  const queryClient = useQueryClient();

  const {token_timeout_in_seconds} = useRemoteConfig();
  const mobileTokenEnabled = hasEnabledMobileToken();

  const enabled =
    mobileTokenEnabled && !!userId && authStatus === 'authenticated';
  const {data: remoteTokens} = useListRemoteTokensQuery(
    enabled,
    state.nativeToken,
  );
  const {mutate: checkRenewMutate} = usePreemptiveRenewTokenMutation(dispatch);

  const load = useCallback(async () => {
    if (enabled) {
      const traceId = uuid();

      const cancelTimeoutHandler = timeoutHandler(() => {
        // When timeout has occured, we notify errors in Bugsnag
        // and set state that indicates timeout.
        dispatch({type: 'TIMEOUT'});

        Bugsnag.notify(
          new Error(
            `Token loading timed out after ${token_timeout_in_seconds} seconds`,
          ),
          (event) => {
            event.addMetadata('token', {
              userId,
              traceId,
              description: 'Native and remote tokens took too long to load.',
            });
          },
        );
      }, token_timeout_in_seconds);

      dispatch({type: 'LOADING'});
      let nativeToken: ActivatedToken;

      // This still happens even on timeout, but we mark the state as timedout.
      // If it works in the background after a while the timeout will be reversed.
      try {
        // Retry loading native token and remote tokens twice for improved stability
        try {
          nativeToken = await loadNativeToken(userId, traceId);
        } catch (_) {
          nativeToken = await loadNativeToken(userId, traceId);
        }

        updateMetadata({
          'AtB-Mobile-Token-Id': nativeToken.tokenId,
          'AtB-Mobile-Token-Status': 'success',
          'AtB-Mobile-Token-Error-Correlation-Id': undefined,
        });

        dispatch({type: 'SUCCESS', nativeToken});
      } catch (err: any) {
        dispatch({type: 'ERROR'});
        /*
         Errors that needs a certain action should already be handled. Just log
         to Bugsnag here.
         */
        logError(err, traceId, userId);
      } finally {
        // We've finished with remote tokens. Cancel timeout notification.
        cancelTimeoutHandler();
      }
    }
  }, [enabled, userId, token_timeout_in_seconds]);

  useEffect(() => {
    load();
  }, [load]);

  useInterval(
    () => checkRenewMutate(state.nativeToken),
    [checkRenewMutate, state.nativeToken],
    SIX_HOURS_MS,
    false,
    true,
  );

  const barcodeStatus = useBarcodeStatus(
    state.status,
    state.nativeToken,
    remoteTokens,
  );
  const deviceInspectionStatus = getDeviceInspectionStatus(barcodeStatus);

  const toggleToken = useCallback(
    async (tokenId: string, bypassRestrictions: boolean) => {
      try {
        const updatedTokens = await tokenService.toggle(
          tokenId,
          uuid(),
          bypassRestrictions,
        );
        queryClient.invalidateQueries([GET_TOKEN_TOGGLE_DETAILS_QUERY_KEY]);
        queryClient.setQueryData([LIST_REMOTE_TOKENS_QUERY_KEY], updatedTokens);
        return true;
      } catch (err) {
        return false;
      }
    },
    [queryClient],
  );

  return (
    <MobileTokenContext.Provider
      value={{
        tokens: remoteTokens || [],
        mobileTokenStatus: state.status,
        deviceInspectionStatus,
        barcodeStatus,
        toggleToken,
        retry: () => {
          Bugsnag.leaveBreadcrumb('Retrying mobile token load');
          load();
        },
        wipeToken: useCallback(
          () =>
            wipeToken(state.nativeToken, uuid()).then(() =>
              dispatch({type: 'CLEAR_TOKENS'}),
            ),
          [state.nativeToken],
        ),
        getTokenToggleDetails,
        nativeToken: state.nativeToken,
        debug: {
          validateToken: () =>
            mobileTokenClient
              .encode(state.nativeToken!, [
                TokenAction.TOKEN_ACTION_GET_FARECONTRACTS,
              ])
              .then((signed) =>
                tokenService.validate(state.nativeToken!, signed, uuid()),
              ),
          removeRemoteToken: async (tokenId) => {
            const removed = await tokenService.removeToken(tokenId, uuid());
            if (removed) {
              queryClient.setQueryData(
                [LIST_REMOTE_TOKENS_QUERY_KEY],
                remoteTokens?.filter(({id}) => id !== tokenId),
              );
            }
          },
          renewToken: () => mobileTokenClient.renew(state.nativeToken!, uuid()),
        },
      }}
    >
      {children}
    </MobileTokenContext.Provider>
  );
};

/** Not enabled on mobile token simulator */
const hasEnabledMobileToken = () =>
  Platform.OS === 'android' || !DeviceInfo.isEmulatorSync();

export function useMobileTokenContextState() {
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

const getDeviceInspectionStatus = (
  barcodeStatus: BarcodeStatus,
): DeviceInspectionStatus => {
  switch (barcodeStatus) {
    case 'loading':
      return 'loading';
    case 'staticQr':
    case 'static':
    case 'mobiletoken':
      return 'inspectable';
    case 'error':
    case 'other':
      return 'not-inspectable';
  }
};

const useBarcodeStatus = (
  status: MobileTokenStatus,
  nativeToken?: ActivatedToken,
  remoteTokens?: RemoteToken[],
): BarcodeStatus => {
  const {
    enable_token_fallback,
    enable_token_fallback_on_timeout,
    use_trygg_overgang_qr_code,
  } = useRemoteConfig();

  if (use_trygg_overgang_qr_code) return 'staticQr';

  switch (status) {
    case 'none': // Handle as loading, as 'none' should only be temporary before starting the process
    case 'loading':
      return 'loading';
    case 'timeout':
      return enable_token_fallback_on_timeout ? 'static' : 'loading';
    case 'error':
      return enable_token_fallback ? 'static' : 'error';
    case 'success':
      if (!remoteTokens) return 'loading';
      return deviceInspectable(nativeToken, remoteTokens)
        ? 'mobiletoken'
        : 'other';
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

/**
 * Load/create native token and handle the situations that can arise.
 *
 * - First check if there has been a user change. If there has, then a new
 *   token should always be created (skip to last step).
 * - If no user change retrieve the token from the client-sdk. If necessary,
 *   the token will be renewed while getting it.
 * - If a token already exists it will be validated, and any exceptions thrown
 *   will be handled accordingly.
 * - A new token will be created if necessary.
 *
 * Note: This useEffect is large and complex. I tried simplifying it, but I
 * found that breaking it up into smaller parts made it even more hard to
 * follow what is happening.
 */
const loadNativeToken = async (userId: string, traceId: string) => {
  Bugsnag.leaveBreadcrumb(`Loading mobile token state for user ${userId}`);

  /*
  Check if there has been a user change.
   */
  const lastUserId = await storage.get('@ATB_last_mobile_token_user');
  const noUserChange = lastUserId === userId;

  let token: ActivatedToken | undefined;
  if (noUserChange) {
    /*
    Retrieve the token from the native layer
     */
    token = await mobileTokenClient.get(traceId);

    if (token) {
      /*
      If native token exists then validate it. The validation request will
      throw an error if validation fails, and these errors will be handled
      as best possible.
       */
      try {
        Bugsnag.leaveBreadcrumb(`Validating token ${token.getTokenId()}`);
        const signedToken = await mobileTokenClient.encode(token, [
          TokenAction.TOKEN_ACTION_GET_FARECONTRACTS,
        ]);
        await tokenService.validate(token, signedToken, traceId);
      } catch (err) {
        if (
          err instanceof TokenMustBeReplacedRemoteTokenStateError ||
          err instanceof TokenNotFoundRemoteTokenStateError
        ) {
          token = undefined;
        } else if (err instanceof TokenEncodingInvalidRemoteTokenStateError) {
          await wipeToken(token, traceId);
          token = undefined;
        } else if (err instanceof TokenMustBeRenewedRemoteTokenStateError) {
          token = await mobileTokenClient.renew(token, traceId);
        } else {
          throw err;
        }
      }
    }
  }

  if (!token) {
    /*
    If token is undefined, then create a new one. We can end up here if:
    - No token previously created on this device.
    - There has been a user change and the existing token has been wiped.
    - There was a validation error which signaled that a new token should
      be created.
     */
    Bugsnag.leaveBreadcrumb(`Creating new mobile token`);
    token = await mobileTokenClient.create(traceId);
  }
  await storage.set('@ATB_last_mobile_token_user', userId!);
  return token;
};

const wipeToken = async (
  token: ActivatedToken | undefined,
  traceId: string,
) => {
  if (!token) return;
  Bugsnag.leaveBreadcrumb('Wiping token with id ' + token.tokenId);
  await tokenService.removeToken(token.getTokenId(), traceId);
  await mobileTokenClient.clear();
};

const getTokenToggleDetails = async () => {
  try {
    return await tokenService.getTokenToggleDetails();
  } catch (err) {
    return undefined;
  }
};

const logError = (err: Error, traceId: string, userId?: string) => {
  updateMetadata({
    'AtB-Mobile-Token-Id': undefined,
    'AtB-Mobile-Token-Status': 'error',
    'AtB-Mobile-Token-Error-Correlation-Id': traceId,
  });
  Bugsnag.notify(err, (event) => {
    event.addMetadata('token', {
      userId,
      traceId,
      description: 'Error loading native and remote tokens',
    });
  });
};
