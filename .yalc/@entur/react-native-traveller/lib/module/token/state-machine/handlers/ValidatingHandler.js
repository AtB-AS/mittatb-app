import { stateHandlerFactory } from '../HandlerFactory';
export default function validatingHandler(abtTokensService) {
  return stateHandlerFactory(['Validating'], async s => {
    const tokens = await abtTokensService.listTokens();
    const tokenFound = tokens.some(t => t.id === s.token.tokenId);
    return {
      accountId: s.accountId,
      state: tokenFound ? 'Valid' : 'DeleteLocal'
    };
  });
}
//# sourceMappingURL=ValidatingHandler.js.map