import {useQuery} from '@tanstack/react-query';
import {TokenAction} from '@entur-private/react-native-abt';
import {tokenService} from '../tokenService';
import {takeAttestationRequirement} from '../attestation-requirement';
import {AbtMobileClient, CONTEXT_ID} from '../mobileTokenClient';
import {
  getTravelCardId,
  isInspectable,
  isTravelCardToken,
  MOBILE_TOKEN_QUERY_KEY,
} from '../utils';
import {Token} from '../types';

import {useAuthContext} from '@atb/modules/auth';
import {logToBugsnag} from '@atb/utils/bugsnag-utils';

export const LIST_REMOTE_TOKENS_QUERY_KEY = 'listRemoteTokens';

export const useListRemoteTokensQuery = (
  enabled: boolean,
  tokenId?: string,
  allTokenInspectable?: boolean,
) => {
  const {userId} = useAuthContext();
  return useQuery({
    // A new token id gives a new key, so the list is fetched again for a new
    // token
    queryKey: [
      MOBILE_TOKEN_QUERY_KEY,
      LIST_REMOTE_TOKENS_QUERY_KEY,
      userId,
      tokenId,
    ],
    queryFn: async () => {
      logToBugsnag('Listing tokens for user ' + userId, {tokenId});
      // The list needs this device's signed token
      return await AbtMobileClient.remoteClientCallHandler({
        tokenContextId: CONTEXT_ID,
        tokenEncodingRequest: {
          challenges: [],
          tokenActions: [
            TokenAction.TOKEN_ACTION_TICKET_INSPECTION,
            TokenAction.TOKEN_ACTION_IDENTIFICATION,
          ],
          includeCertificate: false,
        },
        fn: async ({secureContainerToken, correlationId, listener}) => {
          const tokens = await tokenService.listTokens(
            secureContainerToken,
            correlationId,
          );
          // Report a reattestation requirement from an earlier call
          const requirement = takeAttestationRequirement();
          if (requirement) listener.onReattestationRequirement(requirement);
          return tokens;
        },
      });
    },
    enabled: enabled && !!tokenId,
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
