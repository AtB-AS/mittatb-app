import { logger } from '../../../logger';
import { stateHandlerFactory } from '../HandlerFactory';
export default function verifyInspectionActionHandler(abtTokensService) {
  return stateHandlerFactory(['VerifyInspectionAction'], async ({
    accountId,
    tokenId
  }) => {
    logger.info('verify_inspection_action', undefined, {
      accountId,
      tokenId
    });
    await abtTokensService.toggleToken(tokenId, {
      overrideExisting: false
    });
    return {
      accountId,
      state: 'Valid',
      tokenId
    };
  });
}
//# sourceMappingURL=VerifyInspectionActionHandler.js.map