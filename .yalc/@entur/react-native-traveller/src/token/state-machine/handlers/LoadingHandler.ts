import { getToken } from '../../../native';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';
import type { Token } from '@entur/react-native-traveller';

const secondsIn48Hours = 48 * 60 * 60;

export default function loadingHandler(): StateHandler {
  return stateHandlerFactory(['Loading'], async (_) => {
    const token = await getToken();
    if (!token) {
      return { state: 'InitiateNew' };
    } else {
      return tokenNeedsRenewal(token)
        ? { state: 'InitiateRenewal' }
        : { state: 'Validating', token };
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
