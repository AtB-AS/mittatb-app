import { stateHandlerFactory } from '../HandlerFactory';
import { getSecureToken } from '../../../native';
import { PayloadAction } from '../../../native/types';
import { logger } from '../../../logger';
export default function validatingHandler(abtTokensService) {
  return stateHandlerFactory(['Validating'], async s => {
    const {
      accountId,
      tokenId
    } = s;
    logger.info('validating', undefined, {
      accountId,
      tokenId
    });
    const signedToken = await getSecureToken(accountId, tokenId, true, [PayloadAction.getFarecontracts]);
    const {
      state: validationState
    } = await abtTokensService.validateToken(tokenId, signedToken);
    logger.info('validation_state', undefined, {
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