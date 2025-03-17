import {useQuery} from '@tanstack/react-query';
import {tokenService} from '@atb/mobile-token/tokenService';
import {ActivatedToken} from '@entur-private/abt-mobile-client-sdk';
import {
  getTravelCardId,
  isInspectable,
  isTravelCardToken,
  MOBILE_TOKEN_QUERY_KEY,
} from '@atb/mobile-token/utils';
import {Token} from '@atb/mobile-token/types';

import {v4 as uuid} from 'uuid';
import {useAuthContext} from '@atb/auth';
import {logToBugsnag} from '@atb/utils/bugsnag-utils';
import {mobileTokenClient} from '../mobileTokenClient';

export const LIST_REMOTE_TOKENS_QUERY_KEY = 'listRemoteTokens';

export const useListRemoteTokensQuery = (
  enabled: boolean,
  nativeToken?: ActivatedToken,
) => {
  const {userId} = useAuthContext();
  return useQuery({
    queryKey: [
      MOBILE_TOKEN_QUERY_KEY,
      LIST_REMOTE_TOKENS_QUERY_KEY,
      userId,
      nativeToken,
    ],
    queryFn: async () => {
      logToBugsnag('Listing tokens for user ' + userId);
      const secureContainer =
        nativeToken && (await mobileTokenClient.encode(nativeToken));
      return tokenService.listTokens(secureContainer, uuid());
    },
    enabled,
    select: (tokens) =>
      tokens.map(
        (t): Token => ({
          ...t,
          isThisDevice: t.id === nativeToken?.tokenId,
          isInspectable: isInspectable(t),
          type: isTravelCardToken(t) ? 'travel-card' : 'mobile',
          travelCardId: getTravelCardId(t),
        }),
      ),
  });
};
