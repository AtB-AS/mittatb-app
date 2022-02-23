import { addToken } from '../../../native';
import { stateHandlerFactory } from '../HandlerFactory';
export default function addTokenHandler() {
  return stateHandlerFactory(['AddToken'], async s => {
    const {
      certificate,
      tokenId,
      tokenValidityEnd,
      tokenValidityStart
    } = s.activatedData;
    await addToken(s.accountId, tokenId, certificate, tokenValidityStart, tokenValidityEnd);
    return {
      accountId: s.accountId,
      state: 'VerifyInspectionAction',
      tokenId
    };
  });
}
//# sourceMappingURL=AddTokenHandler.js.map