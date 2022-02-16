import { stateHandlerFactory } from '../HandlerFactory';
import { isTokenInspectable } from '../utils';
export default function verifyInspectionActionHandler(abtTokensService) {
  return stateHandlerFactory(['VerifyInspectionAction'], async ({
    accountId,
    tokenId
  }) => {
    const {
      tokens
    } = await abtTokensService.toggleToken(tokenId, {
      overrideExisting: false
    });
    return {
      accountId,
      state: 'Valid',
      isInspectable: isTokenInspectable(tokens, tokenId)
    };
  });
}
//# sourceMappingURL=VerifyInspectionActionHandler.js.map