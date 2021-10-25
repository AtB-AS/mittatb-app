import { addToken } from '../../../native';
import { stateHandlerFactory } from '../HandlerFactory';
export default function addTokenHandler(_) {
  return stateHandlerFactory(['AddToken'], async s => {
    const {
      certificate,
      tokenId,
      tokenValidityEnd,
      tokenValidityStart
    } = s.activatedData;
    await addToken(tokenId, certificate, tokenValidityStart, tokenValidityEnd);
    return {
      state: 'Valid'
    };
  });
}
//# sourceMappingURL=AddTokenHandler.js.map