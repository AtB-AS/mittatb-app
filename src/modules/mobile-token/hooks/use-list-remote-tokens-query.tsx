import {useQuery} from '@tanstack/react-query';
import {tokenService} from '../tokenService';
import {
  getTravelCardId,
  isInspectable,
  isTravelCardToken,
  MOBILE_TOKEN_QUERY_KEY,
} from '../utils';
import {Token} from '../types';

import {v4 as uuid} from 'uuid';
import {useAuthContext} from '@atb/modules/auth';
import {logToBugsnag} from '@atb/utils/bugsnag-utils';

export const LIST_REMOTE_TOKENS_QUERY_KEY = 'listRemoteTokens';

export const useListRemoteTokensQuery = (
  enabled: boolean,
  tokenId?: string,
  secureContainer?: string,
  allTokenInspectable?: boolean,
) => {
  const {userId} = useAuthContext();
  return useQuery({
    queryKey: [
      MOBILE_TOKEN_QUERY_KEY,
      LIST_REMOTE_TOKENS_QUERY_KEY,
      userId,
      tokenId,
      secureContainer,
    ],
    queryFn: async () => {
      logToBugsnag('Listing tokens for user ' + userId);
      return await tokenService.listTokens(secureContainer, uuid());
    },
    enabled,
    select: (tokens) =>
      tokens.map(
        (t): Token => ({
          ...t,
          isThisDevice: t.id === tokenId,
          isInspectable: allTokenInspectable ?? isInspectable(t),
          type: isTravelCardToken(t) ? 'travel-card' : 'mobile',
          travelCardId: getTravelCardId(t),
        }),
      ),
  });
};
