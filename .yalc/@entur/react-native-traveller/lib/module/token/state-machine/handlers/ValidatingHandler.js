import { stateHandlerFactory } from '../HandlerFactory';
import { getSecureToken } from '../../../native';
import { PayloadAction } from '../../../native/types';
import { logger } from '../../../logger';
export default function validatingHandler(abtTokensService) {
  return stateHandlerFactory(['Validating'], async s => {
    const {
      accountId,
      tokenId,
      state
    } = s;
    logger.info('mobiletoken_status_change', undefined, {
      accountId,
      tokenId,
      state
    });
    const signedToken = await getSecureToken(accountId, tokenId, true, [PayloadAction.getFarecontracts]);
    const {
      state: validationState
    } = await abtTokensService.validateToken(tokenId, signedToken);
    logger.info('mobiletoken_validation_state', undefined, {
      validationState
    });

    switch (validationState) {
      case 'Valid':
        return {
          accountId,
          state: 'Valid',
          tokenId
        };

      case 'NotFound':
      case 'NeedsReplacement':
        return {
          accountId,
          state: 'DeleteLocal'
        };

      case 'NeedsRenewal':
        return {
          accountId,
          tokenId,
          state: 'InitiateRenewal'
        };
    }
  });
}
//# sourceMappingURL=ValidatingHandler.js.map