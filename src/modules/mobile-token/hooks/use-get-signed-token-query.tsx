import {useQuery} from '@tanstack/react-query';
import {mobileTokenClient} from '../mobileTokenClient';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';
import {MOBILE_TOKEN_QUERY_KEY} from '../utils';

const TEN_SECONDS_MS = 1000 * 10;

const GET_SIGNED_TOKEN_QUERY_KEY = 'getSignedToken';

/**
 * Retrieve the signed representation of the native token. This signed token
 * can be encoded into QR/Aztec, or used as an authentication header in
 * requests to Entur.
 */
export const useGetSignedTokenQuery = () => {
  const {nativeToken} = useMobileTokenContext();
  return useQuery({
    queryKey: [MOBILE_TOKEN_QUERY_KEY, GET_SIGNED_TOKEN_QUERY_KEY, nativeToken],
    queryFn: async () => {
      if (!nativeToken) return null;
      try {
        return await mobileTokenClient.encode(nativeToken);
      } catch (err: any) {
        notifyBugsnag(err, {
          errorGroupHash: 'GetSignedTokenError',
          metadata: {
            tokenId: nativeToken.tokenId,
            description: 'Error encoding signed token',
          },
        });
        return null;
      }
    },
    refetchInterval: TEN_SECONDS_MS,
    refetchOnWindowFocus: 'always',
  });
};
