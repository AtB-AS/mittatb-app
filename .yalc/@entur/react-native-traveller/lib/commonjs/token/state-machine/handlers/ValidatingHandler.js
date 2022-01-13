"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validatingHandler;

var _HandlerFactory = require("../HandlerFactory");

function validatingHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['Validating'], async s => {
    const tokens = await abtTokensService.listTokens();
    const token = tokens.find(t => t.id === s.token.tokenId);

    if (!token) {
      return {
        accountId: s.accountId,
        state: 'DeleteLocal'
      };
    }

    const isInspectable = token.allowedActions.some(a => a === 'TOKEN_ACTION_TICKET_INSPECTION');
    return {
      accountId: s.accountId,
      state: 'Valid',
      isInspectable
    };
  });
}
//# sourceMappingURL=ValidatingHandler.js.map