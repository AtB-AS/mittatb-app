"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addTokenHandler;

var _native = require("../../../native");

var _HandlerFactory = require("../HandlerFactory");

function addTokenHandler(accountId) {
  return (0, _HandlerFactory.stateHandlerFactory)(['AddToken'], async s => {
    const {
      certificate,
      tokenId,
      tokenValidityEnd,
      tokenValidityStart
    } = s.activatedData;
    await (0, _native.addToken)(accountId, tokenId, certificate, tokenValidityStart, tokenValidityEnd);
    return {
      state: 'Valid'
    };
  });
}
//# sourceMappingURL=AddTokenHandler.js.map