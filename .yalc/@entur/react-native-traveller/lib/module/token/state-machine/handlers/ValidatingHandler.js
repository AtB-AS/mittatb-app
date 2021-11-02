import { stateHandlerFactory } from '../HandlerFactory';
export default function validatingHandler(abtTokensService) {
  return stateHandlerFactory(['Validating'], async s => {
    const tokens = await abtTokensService.listTokens();
    const tokenFound = tokens.some(t => t.id === s.token.tokenId);
    return {
      state: tokenFound ? 'Valid' : 'DeleteLocal'
    };
  });
}
//# sourceMappingURL=ValidatingHandler.js.map