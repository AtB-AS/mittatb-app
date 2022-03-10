import { getToken } from '../../../native';
import { stateHandlerFactory } from '../HandlerFactory';
import { logger } from '../../../logger';
const secondsIn48Hours = 48 * 60 * 60;
export default function loadingHandler() {
  return stateHandlerFactory(['Loading', 'Valid'], async s => {
    const {
      accountId,
      state
    } = s;
    logger.info('loading', undefined, {
      accountId,
      state
    });
    const token = await getToken(accountId);

    if (!token) {
      logger.info('no_token_found', undefined);
      return {
        accountId,
        state: 'InitiateNew'
      };
    } else {
      logger.info('token_found', undefined, {
        tokenId: token.tokenId
      });
      return tokenNeedsRenewal(token) ? {
        accountId,
        tokenId: token.tokenId,
        state: 'InitiateRenewal'
      } : {
        accountId,
        state: 'Validating',
        tokenId: token.tokenId
      };
    }
  });
}
/**
 * Whether the token needs renewal or not. The token needs renewal if the
 * remaining validity period is less than 48 hours and less than 20% of the
 * total validity time.
 */

const tokenNeedsRenewal = token => {
  const twentyPercentOfValidityPeriod = (token.tokenValidityEnd - token.tokenValidityStart) * 0.2;
  const timeLeftWhenRenewalNecessary = Math.min(secondsIn48Hours, twentyPercentOfValidityPeriod);
  const renewalCutoffTime = token.tokenValidityEnd - timeLeftWhenRenewalNecessary;
  const nowSeconds = Date.now() / 1000;
  return nowSeconds > renewalCutoffTime;
};
//# sourceMappingURL=LoadingHandler.js.map