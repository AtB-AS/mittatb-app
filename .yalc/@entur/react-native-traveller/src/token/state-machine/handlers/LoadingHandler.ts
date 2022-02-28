import { getToken } from '../../../native';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';
import type { Token } from '@entur/react-native-traveller';

const secondsIn48Hours = 48 * 60 * 60;

export default function loadingHandler(): StateHandler {
  return stateHandlerFactory(['Loading', 'Valid'], async (s) => {
    const token = await getToken(s.accountId);
    if (!token) {
      return {
        accountId: s.accountId,
        state: 'InitiateNew',
      };
    } else {
      return tokenNeedsRenewal(token)
        ? {
            accountId: s.accountId,
            tokenId: token.tokenId,
            state: 'InitiateRenewal',
          }
        : {
            accountId: s.accountId,
            state: 'Validating',
            tokenId: token.tokenId,
          };
    }
  });
}

/**
 * Whether the token needs renewal or not. The token needs renewal if the
 * remaining validity period is less than 48 hours and less than 20% of the
 * total validity time.
 */
const tokenNeedsRenewal = (token: Token) => {
  const twentyPercentOfValidityPeriod =
    (token.tokenValidityEnd - token.tokenValidityStart) * 0.2;
  const timeLeftWhenRenewalNecessary = Math.min(
    secondsIn48Hours,
    twentyPercentOfValidityPeriod
  );
  const renewalCutoffTime =
    token.tokenValidityEnd - timeLeftWhenRenewalNecessary;
  const nowSeconds = Date.now() / 1000;
  return nowSeconds > renewalCutoffTime;
};
