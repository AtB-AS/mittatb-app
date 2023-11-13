import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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
import {clock, start} from '@entur-private/abt-time-react-native-lib';
import {v4 as uuid} from 'uuid';
import {storage} from '@atb/storage';
import Bugsnag from '@bugsnag/react-native';
import {mobileTokenClient} from './mobileTokenClient';
import {
  ActivatedToken,
  TokenAction,
} from '@entur-private/abt-mobile-client-sdk';
import {getTravelCardId, isInspectable, isTravelCardToken} from './utils';

import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import {updateMetadata} from '@atb/chat/metadata';
import {tokenService} from './tokenService';
import {useInterval} from '@atb/utils/use-interval';

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
  getSignedToken: () => Promise<string | undefined>;
  toggleToken: (
    tokenId: string,
    bypassRestrictions: boolean,
  ) => Promise<boolean>;
  retry: () => void;
  wipeToken: () => Promise<void>;
  getTokenToggleDetails: () => Promise<TokenLimitResponse | undefined>;
  /**
   * Low level debug details and functions of the mobile token process, for the
   * debug screen
   */
  debug: {
    token?: ActivatedToken;
    createToken: () => void;
    validateToken: () => void;
    removeRemoteToken: (tokenId: string) => void;
    renewToken: () => void;
  };
  /**
   * The current time in milliseconds, updated every 2.5 seconds. This is based
   * on server time when possible, and can be safely used for checking the
   * validity of fare contracts.
   */
  now: number;
};

const MobileTokenContext = createContext<MobileTokenContextState | undefined>(
  undefined,
);

export const MobileTokenContextProvider: React.FC = ({children}) => {
  const {userId, authStatus} = useAuthState();

  const {token_timeout_in_seconds} = useRemoteConfig();
  const mobileTokenEnabled = hasEnabledMobileToken();

  const [token, setToken] = useState<ActivatedToken>();
  const [remoteTokens, setRemoteTokens] = useState<RemoteToken[]>();
  const [mobileTokenStatus, setMobileTokenStatus] =
    useState<MobileTokenStatus>('disabled');

  const enabled =
    mobileTokenEnabled && userId && authStatus === 'authenticated';

  const load = useCallback(async () => {
    if (enabled) {
      const traceId = uuid();

      const cancelTimeoutHandler = timeoutHandler(() => {
        // When timeout has occured, we notify errors in Bugsnag
        // and set state that indicates timeout.
        setMobileTokenStatus('timeout');

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

      setMobileTokenStatus('loading');
      setToken(undefined);
      setRemoteTokens(undefined);
      let nativeToken: ActivatedToken;
      let remoteTokens: RemoteToken[];

      // This still happens even on timeout, but we mark the state as timedout.
      // If it works in the background after a while the timeout will be reversed.
      try {
        // Retry loading native token and remote tokens twice for improved stability
        try {
          nativeToken = await loadNativeToken(userId, traceId);
        } catch (_) {
          nativeToken = await loadNativeToken(userId, traceId);
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

        setMobileTokenStatus('success');
      } catch (err: any) {
        setMobileTokenStatus('error');
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
      }
    }
  }, [enabled, userId, token_timeout_in_seconds]);

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
  }, [token, userId]);

  const barcodeStatus = useBarcodeStatus(
    mobileTokenStatus,
    token,
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
        setRemoteTokens(updatedTokens);
        return true;
      } catch (err) {
        return false;
      }
    },
    [],
  );

  const tokens = useMemo(
    () =>
      remoteTokens?.map((rt): Token => {
        return {
          ...rt,
          isThisDevice: rt.id === token?.tokenId,
          isInspectable: isInspectable(rt),
          type: isTravelCardToken(rt) ? 'travel-card' : 'mobile',
          travelCardId: getTravelCardId(rt),
        };
      }) || [],
    [remoteTokens, token],
  );

  const [time, setTime] = useState(Date.now());
  useInterval(() => clock.currentTimeMillis().then(setTime), 2500);
  useEffect(() => {
    start({
      autoStart: true,
      maxDelayInMilliSeconds: 1000,
      parallelizationCount: 3,
      host: 'time.google.com',
    });
  }, [start]);

  return (
    <MobileTokenContext.Provider
      value={{
        tokens,
        getSignedToken,
        mobileTokenStatus,
        deviceInspectionStatus,
        barcodeStatus,
        toggleToken,
        retry: () => {
          Bugsnag.leaveBreadcrumb('Retrying mobile token load');
          load();
        },
        wipeToken: useCallback(
          () => wipeToken(token, uuid()).then(() => setToken(undefined)),
          [token],
        ),
        getTokenToggleDetails,
        debug: {
          token,
          createToken: () => mobileTokenClient.create(uuid()).then(setToken),
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
        },
        now: time,
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
  token?: ActivatedToken,
  remoteTokens?: RemoteToken[],
): BarcodeStatus => {
  const {
    enable_token_fallback,
    enable_token_fallback_on_timeout,
    use_trygg_overgang_qr_code,
  } = useRemoteConfig();

  if (use_trygg_overgang_qr_code) return 'staticQr';

  switch (status) {
    case 'disabled': // As of now, handle disabled as loading, as mobile token should never be disabled
    case 'loading':
      return 'loading';
    case 'timeout':
      return enable_token_fallback_on_timeout ? 'static' : 'loading';
    case 'error':
      return enable_token_fallback ? 'static' : 'error';
    case 'success':
      return deviceInspectable(token, remoteTokens) ? 'mobiletoken' : 'other';
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

const loadRemoteTokens = async (traceId: string) => {
  const tokens = await tokenService.listTokens(traceId);
  if (!tokens?.length) {
    throw new Error(
      'Empty remote tokens list. Should not happen as mobile token should already be initialized for this phone.',
    );
  }
  return tokens;
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
