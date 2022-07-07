import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useAuthState} from '@atb/auth';
import {useTicketState} from '@atb/tickets';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

import {v4 as uuid} from 'uuid';
import storage from '@atb/storage';
import Bugsnag from '@bugsnag/react-native';
import useMobileTokenClient from '@atb/mobile-token/mobileTokenClient';
import {RemoteToken} from './types';
import {
  TokenAction,
  TokenMustBeReplacedRemoteTokenStateError,
  ActivatedToken,
  TokenEncodingInvalidRemoteTokenStateError,
  TokenMustBeRenewedRemoteTokenStateError,
  TokenNotFoundRemoteTokenStateError,
  createClient,
} from '@entur/abt-mobile-client-sdk';
import createTokenService from '@atb/mobile-token/tokenService';
import {SAFETY_NET_API_KEY} from '@env';
import logger from '@atb/mobile-token/abtClientLogger';
import {isInspectable} from '@atb/mobile-token/utils';

import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import {updateMetadata} from '@atb/chat/metadata';

const CONTEXT_ID = 'main';

type MobileTokenContextState = {
  token?: ActivatedToken;
  remoteTokens?: RemoteToken[];
  deviceIsInspectable: boolean;
  isLoading: boolean;
  isError: boolean;
  getSignedToken: () => Promise<string | undefined>;
  toggleToken: (tokenId: string) => Promise<boolean>;
  retry: () => void;
  wipeToken: () => Promise<void>;
  fallbackEnabled: boolean;
  // For debugging
  createToken: () => void;
  validateToken: () => void;
  removeRemoteToken: (tokenId: string) => void;
  renewToken: () => void;
};

const MobileTokenContext = createContext<MobileTokenContextState | undefined>(
  undefined,
);

const tokenService = createTokenService();
const abtClient = createClient({
  tokenContextIds: [CONTEXT_ID],
  googleSafetyNetApiKey: SAFETY_NET_API_KEY,
  remoteTokenService: tokenService,
  logger,
});

const MobileTokenContextProvider: React.FC = ({children}) => {
  const {abtCustomerId, userCreationFinished} = useAuthState();

  const hasEnabledMobileToken = useHasEnabledMobileToken();

  const client = useMobileTokenClient(abtClient, CONTEXT_ID);

  const {enable_token_fallback: fallbackEnabled} = useRemoteConfig();

  const wipeToken = useCallback(
    async (token: ActivatedToken | undefined, traceId: string) => {
      if (!token) return;
      Bugsnag.leaveBreadcrumb('Wiping token with id ' + token.tokenId);
      await tokenService.removeToken(token.getTokenId(), traceId);
      await client.clear();
    },
    [tokenService, client],
  );

  const [token, setToken] = useState<ActivatedToken>();
  const [remoteTokens, setRemoteTokens] = useState<RemoteToken[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const enabled =
    hasEnabledMobileToken && abtCustomerId && userCreationFinished;

  /**
   * Load/create native token and handle the situations that can arise.
   *
   * - First check if there has been a user change. If there has, then a new
   *   token should always be created (skip to last step)
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
      Bugsnag.leaveBreadcrumb(
        `Loading mobile token state for user ${abtCustomerId}`,
      );

      /*
       Check if there has been a user change.
       */
      const lastUser = await storage.get('@ATB_last_mobile_token_user');
      const noUserChange = lastUser === abtCustomerId;

      let token: ActivatedToken | undefined;
      if (noUserChange) {
        /*
         Retrieve the token from the native layer
         */
        token = await client.get(traceId);

        if (token) {
          /*
           If native token exists then validate it. The validation request will
           throw an error if validation fails, and these errors will be handled
           as best possible.
           */
          try {
            Bugsnag.leaveBreadcrumb(`Validating token ${token.getTokenId()}`);
            const signedToken = await client.encode(token, [
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
              token = await client.renew(token, traceId);
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
        token = await client.create(traceId);
      }
      await storage.set('@ATB_last_mobile_token_user', abtCustomerId!);
      return token;
    },
    [client, tokenService, abtCustomerId],
  );

  const loadRemoteTokens = useCallback(
    async (traceId: string) => {
      const tokens = await tokenService.listTokens(traceId);
      if (!tokens?.length) {
        throw new Error(
          'Empty remote tokens list. Should not happen as mobile token should already be initialized for this phone.',
        );
      }
      return tokens;
    },
    [tokenService],
  );

  const load = useCallback(async () => {
    if (enabled) {
      const traceId = uuid();
      setIsLoading(true);
      setIsError(false);
      setToken(undefined);
      setRemoteTokens(undefined);
      let nativeToken: ActivatedToken;
      let remoteTokens: RemoteToken[];
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
            abtCustomerId,
            traceId,
            description: 'Error loading native and remote tokens',
          });
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [enabled, loadNativeToken, loadRemoteTokens]);

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
        return await client.encode(token);
      } catch (err: any) {
        Bugsnag.notify(err, (event) => {
          event.addMetadata('token', {
            abtCustomerId,
            tokenId: token.tokenId,
            description: 'Error encoding signed token',
          });
        });
        return undefined;
      }
    }
    return undefined;
  }, [client, token]);

  /**
   * Whether this device is inspectable or not. It is inspectable if:
   * - A native token is found
   * - A remote token is found matching the token id of the native token
   * - The found remote token has the inspectable action
   */
  const deviceInspectable: boolean = useMemo(() => {
    if (!token) return false;
    if (!remoteTokens) return false;
    const matchingRemoteToken = remoteTokens.find(
      (r) => r.id === token.getTokenId(),
    );
    if (!matchingRemoteToken) return false;
    return isInspectable(matchingRemoteToken);
  }, [token, remoteTokens]);

  const toggleToken = useCallback(
    async (tokenId: string) => {
      try {
        const updatedTokens = await tokenService.toggle(tokenId, uuid());
        setRemoteTokens(updatedTokens);
        return true;
      } catch (err) {
        return false;
      }
    },
    [tokenService],
  );

  return (
    <MobileTokenContext.Provider
      value={{
        token,
        getSignedToken,
        deviceIsInspectable: deviceInspectable,
        remoteTokens,
        toggleToken,
        isLoading,
        isError,
        retry: () => {
          Bugsnag.leaveBreadcrumb('Retrying mobile token load');
          load();
        },
        createToken: () => client.create(uuid()).then(setToken),
        wipeToken: () =>
          wipeToken(token, uuid()).then(() => setToken(undefined)),
        fallbackEnabled,
        validateToken: () =>
          client
            .encode(token!, [TokenAction.TOKEN_ACTION_GET_FARECONTRACTS])
            .then((signed) => tokenService.validate(token!, signed, uuid())),
        removeRemoteToken: async (tokenId) => {
          const removed = await tokenService.removeToken(tokenId, uuid());
          if (removed) {
            setRemoteTokens(remoteTokens?.filter(({id}) => id !== tokenId));
          }
        },
        renewToken: () => client.renew(token!, uuid()),
      }}
    >
      {children}
    </MobileTokenContext.Provider>
  );
};

export function useHasEnabledMobileToken() {
  const {customerProfile} = useTicketState();
  const {enable_period_tickets} = useRemoteConfig();

  if (Platform.OS !== 'android' && DeviceInfo.isEmulatorSync()) {
    return false;
  }

  return customerProfile?.enableMobileToken || enable_period_tickets;
}

export function useMobileTokenContextState() {
  const context = useContext(MobileTokenContext);
  if (context === undefined) {
    throw new Error(
      'useMobileTokenContextState must be used within a MobileTokenContextProvider',
    );
  }
  return context;
}

export default MobileTokenContextProvider;
