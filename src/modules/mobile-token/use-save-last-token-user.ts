import {useCallback, useEffect, useRef} from 'react';
import {storage} from '@atb/modules/storage';

type PendingLogin = {userId: string; tokenIdBefore: string | undefined};

/**
 * Saves which user the mobile token belongs to, once a login has given the
 * device a new token. The SDK reports a failed login through `errorDetails`
 * without rejecting, so the user can't be saved right after `login` resolves.
 * If it isn't saved, the next launch calls `login` again instead of `start`.
 *
 * @returns Call it when a login has finished, with the token id from before
 *   the login
 */
export const useSaveLastTokenUser = (tokenId: string | undefined) => {
  const currentTokenId = useRef(tokenId);
  currentTokenId.current = tokenId;
  const pendingLogin = useRef<PendingLogin | undefined>(undefined);

  const saveIfNewToken = useCallback(() => {
    const pending = pendingLogin.current;
    const id = currentTokenId.current;
    if (!pending || !id || id === pending.tokenIdBefore) return;
    pendingLogin.current = undefined;
    storage.set('@ATB_last_mobile_token_user', pending.userId);
  }, []);

  useEffect(saveIfNewToken, [tokenId, saveIfNewToken]);

  return useCallback(
    (userId: string, tokenIdBefore: string | undefined) => {
      pendingLogin.current = {userId, tokenIdBefore};
      // The new token may have appeared before the login finished
      saveIfNewToken();
    },
    [saveIfNewToken],
  );
};
