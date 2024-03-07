import {useQuery} from '@tanstack/react-query';
import {mobileTokenClient} from '@atb/mobile-token/mobileTokenClient';
import {useMobileTokenContextState} from '@atb/mobile-token';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

const TEN_SECONDS_MS = 1000 * 10;

/**
 * Retrieve the signed representation of the native token. This signed token
 * can be encoded into QR/Aztec, or used as an authentication header in
 * requests to Entur.
 */
export const useGetSignedTokenQuery = () => {
  const {nativeToken} = useMobileTokenContextState();
  return useQuery({
    queryKey: ['getSignedToken', nativeToken],
    queryFn: async () => {
      if (!nativeToken) return undefined;
      try {
        return await mobileTokenClient.encode(nativeToken);
      } catch (err: any) {
        notifyBugsnag(err, {
          tokenId: nativeToken.tokenId,
          description: 'Error encoding signed token',
        });
        return undefined;
      }
    },
    refetchInterval: TEN_SECONDS_MS,
  });
};
