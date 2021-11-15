import { addToken } from '../../../native';
import { stateHandlerFactory } from '../HandlerFactory';
export default function addTokenHandler(accountId) {
  return stateHandlerFactory(['AddToken'], async s => {
    const {
      certificate,
      tokenId,
      tokenValidityEnd,
      tokenValidityStart
    } = s.activatedData;
    await addToken(accountId, tokenId, certificate, tokenValidityStart, tokenValidityEnd);
    return {
      state: 'Valid'
    };
  });
}
//# sourceMappingURL=AddTokenHandler.js.map