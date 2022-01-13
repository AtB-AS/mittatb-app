"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addTokenHandler;

var _native = require("../../../native");

var _HandlerFactory = require("../HandlerFactory");

function addTokenHandler() {
  return (0, _HandlerFactory.stateHandlerFactory)(['AddToken'], async s => {
    const {
      certificate,
      tokenId,
      tokenValidityEnd,
      tokenValidityStart
    } = s.activatedData;
    await (0, _native.addToken)(s.accountId, tokenId, certificate, tokenValidityStart, tokenValidityEnd);
    return {
      accountId: s.accountId,
      state: 'Valid',
      isInspectable: true
    };
  });
}
//# sourceMappingURL=AddTokenHandler.js.map