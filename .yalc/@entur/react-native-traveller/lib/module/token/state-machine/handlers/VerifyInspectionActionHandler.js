import { logger } from '../../../logger';
import { stateHandlerFactory } from '../HandlerFactory';
export default function verifyInspectionActionHandler(abtTokensService) {
  return stateHandlerFactory(['VerifyInspectionAction'], async ({
    accountId,
    tokenId,
    state
  }) => {
    logger.info('mobiletoken_status_change', undefined, {
      accountId,
      tokenId,
      state
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