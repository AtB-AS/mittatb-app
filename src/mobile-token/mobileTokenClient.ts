import {useCallback, useEffect, useMemo} from 'react';
import {NoTokenError} from '@entur/atb-mobile-client-sdk/token/token-state-react-native-lib/src/native/errors';
import {Token} from '@entur/atb-mobile-client-sdk/token/token-core-javascript-lib';
import {
  AbtTokenClient,
  encodeAsSecureContainer,
  TokenAction,
} from '../../.yalc/@entur/atb-mobile-client-sdk/token/token-state-react-native-lib/src';
import Bugsnag from '@bugsnag/react-native';

export default function useMobileTokenClient(
  abtClient: AbtTokenClient,
  contextId: string,
) {
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

  return useMemo(
    () => ({
      get,
      create,
      encode,
      clear,
    }),
    [get, create, encode, clear],
  );
}
