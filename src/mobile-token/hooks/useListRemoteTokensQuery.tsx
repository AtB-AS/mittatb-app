import {useQuery} from '@tanstack/react-query';
import {tokenService} from '@atb/mobile-token/tokenService';
import {ActivatedToken} from '@entur-private/abt-mobile-client-sdk';
import {
  getTravelCardId,
  isInspectable,
  isTravelCardToken,
} from '@atb/mobile-token/utils';
import {Token} from '@atb/mobile-token/types';

import {v4 as uuid} from 'uuid';

export const LIST_REMOTE_TOKENS_QUERY_KEY = 'listRemoteTokens';

export const useListRemoteTokensQuery = (
  enabled: boolean,
  nativeToken?: ActivatedToken,
) =>
  useQuery({
    queryKey: [LIST_REMOTE_TOKENS_QUERY_KEY, nativeToken?.tokenId],
    queryFn: async () => tokenService.listTokens(uuid()),
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
