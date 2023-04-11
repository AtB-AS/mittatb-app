import {useCallback, useMemo} from 'react';
import {
  encodeAsSecureContainer,
  TokenAction,
  Token,
  ActivatedToken,
  createClient,
} from '@entur-private/abt-mobile-client-sdk';

export function useMobileTokenClient(
  abtClient: ReturnType<typeof createClient>,
  contextId: string,
) {
  const get = useCallback(async (traceId: string) => {
    return await abtClient.getToken(contextId, traceId);
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
