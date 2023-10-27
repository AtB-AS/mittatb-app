import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useAuthState} from '@atb/auth';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

import {
  TokenEncodingInvalidRemoteTokenStateError,
  TokenMustBeRenewedRemoteTokenStateError,
  TokenMustBeReplacedRemoteTokenStateError,
  TokenNotFoundRemoteTokenStateError,
} from '@entur-private/abt-token-server-javascript-interface';
import {v4 as uuid} from 'uuid';
import {storage} from '@atb/storage';
import Bugsnag from '@bugsnag/react-native';
import {mobileTokenClient} from '@atb/mobile-token/mobileTokenClient';
import {RemoteToken, TokenLimitResponse} from './types';
import {
  ActivatedToken,
  TokenAction,
} from '@entur-private/abt-mobile-client-sdk';
import {isInspectable} from '@atb/mobile-token/utils';

import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import {updateMetadata} from '@atb/chat/metadata';
import {tokenService} from '@atb/mobile-token/tokenService';

type MobileTokenContextState = {
  token?: ActivatedToken;
  remoteTokens?: RemoteToken[];
  deviceInspectionStatus: DeviceInspectionStatus;
  isLoading: boolean;
  isTimedout: boolean;
  isError: boolean;
  getSignedToken: () => Promise<string | undefined>;
  toggleToken: (
    tokenId: string,
    bypassRestrictions: boolean,
  ) => Promise<boolean>;
  retry: () => void;
  wipeToken: () => Promise<void>;
  // For debugging
  createToken: () => void;
  validateToken: () => void;
  removeRemoteToken: (tokenId: string) => void;
  renewToken: () => void;
  getTokenToggleDetails: () => Promise<TokenLimitResponse | undefined>;
};

const MobileTokenContext = createContext<MobileTokenContextState | undefined>(
  undefined,
);

export const MobileTokenContextProvider: React.FC = ({children}) => {
  const {userId, authStatus} = useAuthState();

  const {token_timeout_in_seconds} = useRemoteConfig();
  const mobileTokenEnabled = hasEnabledMobileToken();

  const wipeToken = useCallback(
    async (token: ActivatedToken | undefined, traceId: string) => {
      if (!token) return;
      Bugsnag.leaveBreadcrumb('Wiping token with id ' + token.tokenId);
      await tokenService.removeToken(token.getTokenId(), traceId);
      await mobileTokenClient.clear();
    },
    [],
  );

  const [token, setToken] = useState<ActivatedToken>();
  const [remoteTokens, setRemoteTokens] = useState<RemoteToken[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [isTimedout, setTimeoutFlag] = useState(false);
  const [isError, setIsError] = useState(false);

  const enabled =
    mobileTokenEnabled && userId && authStatus === 'authenticated';

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
  const loadNativeToken = useCallback(
    async (traceId: string) => {
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
            } else if (
              err instanceof TokenEncodingInvalidRemoteTokenStateError
            ) {
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
    },
    [userId],
  );

  const loadRemoteTokens = useCallback(async (traceId: string) => {
    const tokens = await tokenService.listTokens(traceId);
    if (!tokens?.length) {
      throw new Error(
        'Empty remote tokens list. Should not happen as mobile token should already be initialized for this phone.',
      );
    }
    return tokens;
  }, []);

  const load = useCallback(async () => {
    if (enabled) {
      const traceId = uuid();

      const cancelTimeoutHandler = timeoutHandler(() => {
        // When timeout has occured, we notify errors in Bugsnag
        // and set state that indicates timeout.
        setTimeoutFlag(true);
        setIsLoading(false);

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

      setIsLoading(true);
      setIsError(false);
      setToken(undefined);
      setRemoteTokens(undefined);
      let nativeToken: ActivatedToken;
      let remoteTokens: RemoteToken[];

      // This still happens even on timeout, but we mark the state as timedout.
      // If it works in the background after a while the timeout will be reversed.
      try {
        // Retry loading native token and remote tokens twice for improved stability
        try {
          nativeToken = await loadNativeToken(traceId);
        } catch (_) {
          nativeToken = await loadNativeToken(traceId);
        }

        try {
          remoteTokens = await loadRemoteTokens(traceId);
        } catch (_) {
          remoteTokens = await loadRemoteTokens(traceId);
        }

        setToken(nativeToken);
        setRemoteTokens(remoteTokens);
        updateMetadata({
          'AtB-Mobile-Token-Id': nativeToken.tokenId,
          'AtB-Mobile-Token-Status': 'success',
          'AtB-Mobile-Token-Error-Correlation-Id': undefined,
        });
      } catch (err: any) {
        setIsError(true);
        /*
         Errors that needs a certain action should already be handled. Just log
         to Bugsnag here.
         */
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
      } finally {
        // We've finished with remote tokens. Cancel timeout notification.
        cancelTimeoutHandler();
        setTimeoutFlag(false);

        setIsLoading(false);
      }
    }
  }, [enabled, loadNativeToken, loadRemoteTokens, token_timeout_in_seconds]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Retrieve the signed representation of the native token. This signed token
   * can be encoded into QR/Aztec, or used as an authentication header in
   * requests to Entur.
   */
  const getSignedToken = useCallback(async () => {
    if (token) {
      try {
        return await mobileTokenClient.encode(token);
      } catch (err: any) {
        Bugsnag.notify(err, (event) => {
          event.addMetadata('token', {
            userId,
            tokenId: token.tokenId,
            description: 'Error encoding signed token',
          });
        });
        return undefined;
      }
    }
    return undefined;
  }, [token]);

  const deviceInspectionStatus = useDeviceInspectionStatus(
    isLoading,
    isError,
    isTimedout,
    token,
    remoteTokens,
  );

  const toggleToken = useCallback(
    async (tokenId: string, bypassRestrictions: boolean) => {
      try {
        const updatedTokens = await tokenService.toggle(
          tokenId,
          uuid(),
          bypassRestrictions,
        );
        setRemoteTokens(updatedTokens);
        return true;
      } catch (err) {
        return false;
      }
    },
    [],
  );

  const getTokenToggleDetails = useCallback(async () => {
    try {
      return await tokenService.getTokenToggleDetails();
    } catch (err) {
      return undefined;
    }
  }, []);

  return (
    <MobileTokenContext.Provider
      value={{
        token,
        getSignedToken,
        deviceInspectionStatus,
        remoteTokens,
        toggleToken,
        isLoading,
        isTimedout,
        isError,
        retry: () => {
          Bugsnag.leaveBreadcrumb('Retrying mobile token load');
          load();
        },
        createToken: () => mobileTokenClient.create(uuid()).then(setToken),
        wipeToken: () =>
          wipeToken(token, uuid()).then(() => setToken(undefined)),
        validateToken: () =>
          mobileTokenClient
            .encode(token!, [TokenAction.TOKEN_ACTION_GET_FARECONTRACTS])
            .then((signed) => tokenService.validate(token!, signed, uuid())),
        removeRemoteToken: async (tokenId) => {
          const removed = await tokenService.removeToken(tokenId, uuid());
          if (removed) {
            setRemoteTokens(remoteTokens?.filter(({id}) => id !== tokenId));
          }
        },
        renewToken: () => mobileTokenClient.renew(token!, uuid()),
        getTokenToggleDetails,
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

export type DeviceInspectionStatus =
  | 'loading'
  | 'inspectable'
  | 'not-inspectable';

const useDeviceInspectionStatus = (
  isLoading: boolean,
  isError: boolean,
  isTimedout: boolean,
  token?: ActivatedToken,
  remoteTokens?: RemoteToken[],
): DeviceInspectionStatus => {
  const {enable_token_fallback, enable_token_fallback_on_timeout} =
    useRemoteConfig();
  if (isTimedout) {
    return enable_token_fallback_on_timeout ? 'inspectable' : 'loading';
  } else if (isError) {
    return enable_token_fallback ? 'inspectable' : 'not-inspectable';
  } else if (isLoading) {
    return 'loading';
  } else {
    return deviceInspectable(token, remoteTokens)
      ? 'inspectable'
      : 'not-inspectable';
  }
};

/**
 * Whether this device is inspectable or not. It is inspectable if:
 * - A native token is found
 * - A remote token is found matching the token id of the native token
 * - The found remote token has the inspectable action
 */
const deviceInspectable = (
  token?: ActivatedToken,
  remoteTokens?: RemoteToken[],
): boolean => {
  if (!token) return false;
  if (!remoteTokens) return false;
  const matchingRemoteToken = remoteTokens.find(
    (r) => r.id === token.getTokenId(),
  );
  if (!matchingRemoteToken) return false;
  return isInspectable(matchingRemoteToken);
};
