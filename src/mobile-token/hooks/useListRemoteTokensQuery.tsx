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

export const LIST_REMOTE_TOKENS_QUERY_KEY = 'listRemoteTokens';

export const useListRemoteTokensQuery = (
  enabled: boolean,
  nativeToken?: ActivatedToken,
) =>
  useQuery({
    queryKey: [MOBILE_TOKEN_QUERY_KEY, LIST_REMOTE_TOKENS_QUERY_KEY],
    queryFn: () => tokenService.listTokens(uuid()),
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
