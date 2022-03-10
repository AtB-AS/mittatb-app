import { logger } from '../../../logger';
import { addToken } from '../../../native';
import { stateHandlerFactory } from '../HandlerFactory';
export default function addTokenHandler() {
  return stateHandlerFactory(['AddToken'], async s => {
    const {
      activatedData: {
        certificate,
        tokenId,
        tokenValidityEnd,
        tokenValidityStart
      },
      accountId
    } = s;
    logger.info('add_token', undefined, {
      accountId,
      tokenId
    });
    await addToken(accountId, tokenId, certificate, tokenValidityStart, tokenValidityEnd);
    return {
      accountId,
      state: 'VerifyInspectionAction',
      tokenId
    };
  });
}
//# sourceMappingURL=AddTokenHandler.js.map