"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validatingHandler;

var _native = require("../../native");

async function validatingHandler(abtTokensService) {
  try {
    const token = await (0, _native.getToken)();

    if (!token) {
      return {
        state: 'Initiating'
      };
    }

    const tokens = await abtTokensService.listTokens();
    const tokenFound = tokens.some(t => t.id === token.tokenId);
    return {
      state: tokenFound ? 'Valid' : 'Initiating'
    };
  } catch (err) {
    return {
      state: 'Validating',
      error: {
        type: 'Unknown',
        message: 'Error validating token backend status',
        err
      }
    };
  }
}
//# sourceMappingURL=ValidatingHandler.js.map