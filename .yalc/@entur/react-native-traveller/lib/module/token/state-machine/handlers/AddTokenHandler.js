import { addToken } from '../../../native';
import { stateHandlerFactory } from '../HandlerFactory';
export default function addTokenHandler(_, getClientState) {
  return stateHandlerFactory(['AddToken'], async s => {
    const {
      certificate,
      tokenId,
      tokenValidityEnd,
      tokenValidityStart
    } = s.activatedData;
    const {
      accountId
    } = getClientState();
    await addToken(accountId, tokenId, certificate, tokenValidityStart, tokenValidityEnd);
    return {
      state: 'Valid'
    };
  });
}
//# sourceMappingURL=AddTokenHandler.js.map