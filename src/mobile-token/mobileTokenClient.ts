import {useCallback, useEffect, useMemo} from 'react';
import {
  AbtClient,
  encodeAsSecureContainer,
  TokenAction,
  NoTokenError,
  Token,
  ActivatedToken,
} from '@entur-private/abt-mobile-client-sdk';
import Bugsnag from '@bugsnag/react-native';

export function useMobileTokenClient(abtClient: AbtClient, contextId: string) {
  useEffect(() => {
    (async function () {
      await abtClient.start();
      return abtClient.close;
    })();
  }, []);

  const get = useCallback(async (traceId: string) => {
    try {
      return await abtClient.getToken(contextId, traceId);
    } catch (err) {
      if (err instanceof NoTokenError) {
        Bugsnag.leaveBreadcrumb('No native token found');
        return undefined;
      }
      throw err;
    }
  }, []);

  const create = useCallback(
    async (traceId) => abtClient.createToken(contextId, traceId),
    [],
  );

  const encode = useCallback(
    async (token: Token, tokenActions?: TokenAction[]) =>
      encodeAsSecureContainer(
        token,
        [],
        tokenActions ?? [TokenAction.TOKEN_ACTION_TICKET_INSPECTION],
        false,
      ),
    [],
  );
  const clear = useCallback(async () => abtClient.clearToken(contextId), []);
  const renew = useCallback(
    (token: ActivatedToken, traceId: string) =>
      abtClient.renewToken(token, traceId),
    [],
  );

  return useMemo(
    () => ({
      get,
      create,
      encode,
      clear,
      renew,
    }),
    [get, create, encode, clear],
  );
}
