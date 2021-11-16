"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validatingHandler;

var _HandlerFactory = require("../HandlerFactory");

function validatingHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['Validating'], async s => {
    const tokens = await abtTokensService.listTokens();
    const tokenFound = tokens.some(t => t.id === s.token.tokenId);
    return {
      accountId: s.accountId,
      state: tokenFound ? 'Valid' : 'DeleteLocal'
    };
  });
}
//# sourceMappingURL=ValidatingHandler.js.map